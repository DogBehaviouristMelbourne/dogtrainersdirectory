# Stripe Integration Guide for Dog Trainers Directory

This guide walks you through setting up Stripe for processing subscription payments for trainer listings.

## Prerequisites

- Stripe account (create one at [stripe.com](https://stripe.com) if you don't have one)
- Your Dog Trainers Directory already deployed
- Firebase project set up

## Step 1: Create Subscription Products in Stripe

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** > **Add Product**
3. Create the following subscription products:

### Basic Premium Listing
- **Name**: Premium Trainer Listing
- **Description**: Enhanced directory profile with photo and priority placement
- **Pricing**:
  - Monthly: $20/month
  - Annual: $200/year (save ~17%)
- **Settings**:
  - Add a 7-day free trial
  - Set up email receipts

### Featured Premium Listing
- **Name**: Featured Trainer Listing
- **Description**: Premium listing with featured placement and additional promotion
- **Pricing**:
  - Monthly: $30/month
  - Annual: $300/year (save ~17%)
- **Settings**:
  - Add a 7-day free trial
  - Set up email receipts

4. Note down the **Price IDs** for each option (you'll need these later)

## Step 2: Set Up Webhook Endpoint

1. Go to **Developers** > **Webhooks** in your Stripe Dashboard
2. Click **Add Endpoint**
3. For the endpoint URL, use one of:
   - Development: `http://localhost:5001/dog-trainers-directory/us-central1/stripeWebhook`
   - Production: `https://us-central1-dog-trainers-directory.cloudfunctions.net/stripeWebhook`
4. For events to send, select:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

5. After creating, note down the **Webhook Secret**

## Step 3: Configure Firebase Functions

1. Set up Stripe environment variables in Firebase:

```bash
firebase functions:config:set \
  stripe.secret_key= \
  stripe.webhook_secret=
```

2. Deploy the Firebase functions:

```bash
firebase deploy --only functions
```

## Step 4: Update Frontend Configuration

1. Add Stripe price IDs to the `.env` file:

```
VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxx
VITE_STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_xxxxx
VITE_STRIPE_FEATURED_MONTHLY_PRICE_ID=price_xxxxx
VITE_STRIPE_FEATURED_ANNUAL_PRICE_ID=price_xxxxx
```

2. Add Stripe public key to the `.env` file:

```
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxx
```

3. Rebuild and deploy the frontend:

```bash
npm run build
# Deploy to Cloudflare Pages automatically via GitHub
```

## Step 5: Test the Integration

1. Create a test trainer submission on the site
2. Attempt to upgrade to premium (use Stripe test card 4242 4242 4242 4242)
3. Verify the webhook is triggered and Firestore is updated
4. Check that the trainer now appears with premium status

## Troubleshooting

### Webhook Errors

If webhooks aren't being received:

1. Check the Firebase functions logs for errors
2. Verify the webhook URL is correct in Stripe
3. Confirm the webhook secret is correctly set in Firebase config

### Payment Issues

If payments can't be processed:

1. Check the Stripe Dashboard for any errors
2. Verify you're in the correct mode (test/live)
3. Confirm the price IDs are correct in the frontend

## Going Live Checklist

- [ ] Switch from test to live mode in Stripe
- [ ] Update webhook URL to production endpoint
- [ ] Update all environment variables to production values
- [ ] Test a real subscription with a small amount
- [ ] Set up email notifications for failed payments
- [ ] Document refund process
