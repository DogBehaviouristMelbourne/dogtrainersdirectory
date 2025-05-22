const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Safer initialization with fallbacks
let stripeSecretKey;
let stripeWebhookSecret;

try {
  // Try to get from functions.config() first (production)
  stripeSecretKey = functions.config().stripe.secret_key;
  stripeWebhookSecret = functions.config().stripe.webhook_secret;
} catch (err) {
  console.log('Error loading config from functions.config():', err.message);
}

// Fallback to environment variables or .runtimeconfig.json
if (!stripeSecretKey) {
  console.log('Falling back to process.env or hardcoded key');
  stripeSecretKey = process.env.STRIPE_SECRET_KEY ||
    // Use value from .runtimeconfig.json if available
    (require('./.runtimeconfig.json')?.stripe?.secret_key);
}

if (!stripeWebhookSecret) {
  stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ||
    (require('./.runtimeconfig.json')?.stripe?.webhook_secret);
}

if (!stripeSecretKey) {
  console.error('No Stripe secret key found! Set up config properly');
}

const stripe = require('stripe')(stripeSecretKey);
const cors = require('cors');
const express = require('express');
const app = express();

// Allow multiple origins for CORS to work with both local and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dog-trainers-directory.web.app',
  'https://dog-trainers-directory.firebaseapp.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Important: do NOT use bodyParser for the webhook route
// We need the raw body for Stripe signature verification
app.use((req, res, next) => {
  if (req.path === '/stripeWebhook') {
    // For webhook, we need the raw body as a string
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    // For other routes, parse as JSON
    express.json()(req, res, next);
  }
});
admin.initializeApp();
const db = admin.firestore();

// 🔁 Create Stripe Checkout session (Express endpoint for emulator/local dev)
app.post('/createCheckoutSession', async (req, res) => {
  const { trainerId, priceId } = req.body;
  if (!trainerId || !priceId) {
    return res.status(400).json({ error: 'Missing trainerId or priceId' });
  }
  try {
    // You may want to fetch trainer data if needed
    // const trainerDoc = await db.collection('trainers').doc(trainerId).get();
    // if (!trainerDoc.exists) return res.status(404).json({ error: 'Trainer not found' });
    // const trainer = trainerDoc.data();

    // Determine if we're in dev or production for redirect URLs
    const isLocalDev = req.headers.origin && req.headers.origin.includes('localhost');
    const baseUrl = isLocalDev ?
      'http://localhost:5173' :
      'https://dog-trainers-directory.web.app';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
      client_reference_id: trainerId,
      metadata: { trainerId },
      subscription_data: {
        trial_period_days: 7,
        metadata: { trainerId },
      },
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🧩 Stripe webhook for subscription lifecycle
app.post('/stripeWebhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use the raw body (important for signature verification)
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      stripeWebhookSecret
    );
    console.log('Successfully verified webhook signature');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.error('Error handling webhook:', err);
    res.status(500).send({ error: 'Webhook handler failed' });
  }
});

// Export the Express app as the 'api' function
exports.api = functions.https.onRequest(app);

// Keep the old export for backward compatibility
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
  console.log('Request path:', req.path);
  console.log('Request URL:', req.url);
  
  // Rewrite the URL to match our Express route
  req.url = '/createCheckoutSession';
  
  // Forward to the Express app
  return app(req, res);
});

// 🎯 Event: Checkout Session Completed
async function handleCheckoutSessionCompleted(session) {
  const trainerId = session.metadata.trainerId;
  if (!trainerId) throw new Error('No trainerId in metadata');

  await db.collection('trainers').doc(trainerId).update({
    customerId: session.customer,
    checkoutSessionId: session.id,
    premiumSignupDate: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Checkout completed for trainer ${trainerId}`);
}

// 🎯 Event: Subscription Created or Updated
async function handleSubscriptionUpdated(subscription) {
  const trainerId = subscription.metadata.trainerId;
  if (!trainerId) throw new Error('No trainerId in metadata');

  const isActive = ['active', 'trialing'].includes(subscription.status);

  await db.collection('trainers').doc(trainerId).update({
    premium: isActive,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
    subscriptionUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  console.log(`Subscription ${isActive ? 'activated' : 'updated'} for trainer ${trainerId}`);
}

// 🎯 Event: Subscription Canceled
async function handleSubscriptionDeleted(subscription) {
  const trainerId = subscription.metadata.trainerId;
  if (!trainerId) throw new Error('No trainerId in metadata');

  await db.collection('trainers').doc(trainerId).update({
    premium: false,
    subscriptionStatus: 'canceled',
    premiumCanceledDate: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Subscription canceled for trainer ${trainerId}`);
}

// 🎯 Event: Payment Failed
async function handleInvoicePaymentFailed(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const trainerId = subscription.metadata.trainerId;
  if (!trainerId) throw new Error('No trainerId in metadata');

  await db.collection('trainers').doc(trainerId).update({
    paymentFailed: true,
    lastPaymentFailure: admin.firestore.FieldValue.serverTimestamp(),
    paymentFailureReason: invoice.last_payment_error?.message || 'Unknown failure',
  });

  console.log(`Payment failed for trainer ${trainerId}`);
}

// 🔻 Cancel Subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  try {
    const { trainerId } = data;
    const trainerDoc = await db.collection('trainers').doc(trainerId).get();

    if (!trainerDoc.exists || !trainerDoc.data().subscriptionId) {
      throw new functions.https.HttpsError('not-found', 'Trainer or subscription not found');
    }

    await stripe.subscriptions.update(trainerDoc.data().subscriptionId, {
      cancel_at_period_end: true,
    });

    await db.collection('trainers').doc(trainerId).update({
      cancelAtPeriodEnd: true,
      cancellationRequestDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, cancelAtPeriodEnd: true };
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
