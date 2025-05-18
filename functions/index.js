const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

// Stripe webhook handler for subscription events
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    
    // Verify the webhook signature
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody, 
        sig, 
        functions.config().stripe.webhook_secret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event based on its type
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
    } 
    else if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
    }
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
    }
    else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      await handleInvoicePaymentFailed(invoice);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send({ error: 'Webhook handler failed' });
  }
});

// Handle successful checkout session completion
async function handleCheckoutSessionCompleted(session) {
  try {
    // Get the customer and subscription from Stripe
    const customer = await stripe.customers.retrieve(session.customer);
    
    // Get the trainer ID from the session metadata
    const trainerId = session.metadata.trainerId;
    
    if (!trainerId) {
      console.error('No trainer ID in session metadata');
      return;
    }
    
    // Update the trainer document in Firestore
    await admin.firestore().collection('trainers').doc(trainerId).update({
      customerId: session.customer,
      premiumSignupDate: admin.firestore.FieldValue.serverTimestamp(),
      checkoutSessionId: session.id
    });
    
    console.log(`Checkout completed for trainer ${trainerId}`);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}

// Handle subscription created or updated events
async function handleSubscriptionUpdated(subscription) {
  try {
    // Get the trainer ID from the subscription metadata
    const trainerId = subscription.metadata.trainerId;
    
    if (!trainerId) {
      console.error('No trainer ID in subscription metadata');
      return;
    }
    
    // Get the subscription status
    const status = subscription.status;
    const isActive = status === 'active' || status === 'trialing';
    
    // Reference to the trainer document
    const trainerRef = admin.firestore().collection('trainers').doc(trainerId);
    
    // Get the current trainer data
    const trainerDoc = await trainerRef.get();
    
    if (!trainerDoc.exists) {
      console.error(`Trainer ${trainerId} not found`);
      return;
    }
    
    // Update the trainer document
    await trainerRef.update({
      premium: isActive,
      subscriptionId: subscription.id,
      subscriptionStatus: status,
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      subscriptionUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
    
    console.log(`Subscription ${isActive ? 'activated' : 'updated'} for trainer ${trainerId}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

// Handle subscription deleted events
async function handleSubscriptionDeleted(subscription) {
  try {
    // Get the trainer ID from the subscription metadata
    const trainerId = subscription.metadata.trainerId;
    
    if (!trainerId) {
      console.error('No trainer ID in subscription metadata');
      return;
    }
    
    // Update the trainer document
    await admin.firestore().collection('trainers').doc(trainerId).update({
      premium: false,
      subscriptionStatus: 'canceled',
      premiumCanceledDate: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Subscription canceled for trainer ${trainerId}`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice) {
  try {
    // Get the subscription ID
    const subscriptionId = invoice.subscription;
    
    if (!subscriptionId) {
      console.error('No subscription ID in invoice');
      return;
    }
    
    // Get the subscription to find the trainer ID
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const trainerId = subscription.metadata.trainerId;
    
    if (!trainerId) {
      console.error('No trainer ID in subscription metadata');
      return;
    }
    
    // Update the trainer document
    await admin.firestore().collection('trainers').doc(trainerId).update({
      paymentFailed: true,
      lastPaymentFailure: admin.firestore.FieldValue.serverTimestamp(),
      paymentFailureReason: invoice.last_payment_error?.message || 'Unknown payment failure'
    });
    
    // Optional: Send an email notification about the payment failure
    
    console.log(`Payment failed for trainer ${trainerId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Additional Cloud Functions

// Function to create a checkout session for a trainer
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    const { trainerId, planId, successUrl, cancelUrl } = data;
    
    // Verify the trainer exists
    const trainerDoc = await admin.firestore().collection('trainers').doc(trainerId).get();
    
    if (!trainerDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Trainer not found');
    }
    
    const trainer = trainerDoc.data();
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId, // The Stripe Price ID for the subscription plan
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: trainer.email,
      metadata: {
        trainerId: trainerId
      },
      subscription_data: {
        metadata: {
          trainerId: trainerId
        }
      }
    });
    
    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Function to cancel a trainer's subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  try {
    const { trainerId } = data;
    
    // Verify the trainer exists and has a subscription
    const trainerDoc = await admin.firestore().collection('trainers').doc(trainerId).get();
    
    if (!trainerDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Trainer not found');
    }
    
    const trainer = trainerDoc.data();
    
    if (!trainer.subscriptionId) {
      throw new functions.https.HttpsError('failed-precondition', 'No active subscription found');
    }
    
    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(trainer.subscriptionId, {
      cancel_at_period_end: true
    });
    
    await admin.firestore().collection('trainers').doc(trainerId).update({
      cancelAtPeriodEnd: true,
      cancellationRequestDate: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, cancelAtPeriodEnd: true };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});