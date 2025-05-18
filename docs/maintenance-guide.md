# Dog Trainers Directory Maintenance Guide
> For non-technical site owners

This guide provides step-by-step instructions for managing the Dog Trainers Directory website, designed specifically for non-technical users. It covers common day-to-day tasks and operations.

## 📋 Table of Contents

1. [Accessing Admin Dashboard](#accessing-admin-dashboard)
2. [Managing Trainer Listings](#managing-trainer-listings)
3. [Handling Subscription Management](#handling-subscription-management)
4. [Email Management](#email-management)
5. [SEO and Marketing](#seo-and-marketing)
6. [Monitoring Site Performance](#monitoring-site-performance)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Accessing Admin Dashboard

The admin dashboard is where you'll manage most aspects of the website.

### Step-by-Step Login:

1. Go to `https://dogtrainersdirectory.com.au/admin`
2. Enter your admin email and password
3. If you forget your password, click "Forgot Password" to reset it

> 🔐 **Security Tip:** Never share your admin credentials. Use a password manager like LastPass or 1Password to generate and store strong passwords.

---

## Managing Trainer Listings

### Approving New Submissions:

1. Log in to the admin dashboard
2. Go to the "Pending Submissions" tab
3. Review each submission for:
   - Completeness of information
   - Professional bio
   - Appropriate qualifications
   - Valid contact information
4. Click "Approve" to publish the listing or "Reject" if unsuitable

### Editing Existing Listings:

1. Go to the "Approved Trainers" tab
2. Find the trainer you want to edit
3. Click the "Edit" button
4. Make necessary changes
5. Click "Save Changes"

### Managing Premium Status:

1. Go to the "Approved Trainers" tab
2. Find the trainer
3. Use the toggle switch under "Premium Status" to change their status
   
> ⚠️ Only manually change premium status if there's a payment issue or special arrangement. Normal premium status should be managed through Stripe subscriptions.

---

## Handling Subscription Management

### Viewing Subscriptions:

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to "Customers" to see all subscribers
3. Click on a customer to see their subscription details

### Managing Failed Payments:

1. Look for red indicators in the Stripe Dashboard
2. Contact the trainer using the email template below:

```
Subject: Action Required: Dog Trainers Directory Payment Issue

Dear [Trainer Name],

We noticed an issue processing your recent payment for your premium listing on Dog Trainers Directory.

To keep your premium listing active, please:
1. Log in to your account
2. Update your payment information
3. Or contact us for assistance

If no action is taken, your listing will revert to the basic plan on [Date].

Need help? Reply to this email or call us.

Regards,
Dog Trainers Directory Team
```

### Cancelling Subscriptions:

If a trainer requests cancellation:

1. Log in to Stripe Dashboard
2. Find the customer
3. Click on their subscription
4. Click "Cancel subscription"
5. Select "Cancel at period end" to allow them to use the remaining paid period

---

## Email Management

### Checking Your Business Email:

1. Go to [Zoho Mail](https://mail.zoho.com/)
2. Log in with your credentials (info@dogtrainersdirectory.com.au)
3. Check Inbox and Spam folders daily

### Email Response Templates:

#### For New Inquiries:
```
Subject: Welcome to Dog Trainers Directory

Hello [Name],

Thank you for your interest in Dog Trainers Directory!

[Personalized response to their specific question]

Let me know if you have any other questions.

Best regards,
[Your Name]
Dog Trainers Directory
```

#### For Technical Issues:
```
Subject: Re: Technical Issue Report

Hello [Name],

Thank you for reporting this issue. I've noted the details and have forwarded them to our technical team.

We aim to resolve this within 48 hours, and I'll update you when it's fixed.

Best regards,
[Your Name]
Dog Trainers Directory
```

---

## SEO and Marketing

### Updating Meta Descriptions:

For major pages, you may want to update meta descriptions seasonally:

1. Contact your developer with the specific text changes
2. Provide the page URL and new description (keep it under 155 characters)

### Social Media Schedule:

| Day | Content Type | Example |
|-----|-------------|---------|
| Monday | Training Tip | "Teaching a reliable recall with anxious dogs" |
| Wednesday | Trainer Spotlight | "Meet [Trainer Name] from [Suburb]" |
| Friday | Dog Success Story | "How [Dog Name] overcame leash reactivity" |

### Content Creation Tips:

- Use real stories from your trainers (with permission)
- Include high-quality images of dogs and trainers
- Keep posts short and actionable
- Always include your website link

---

## Monitoring Site Performance

### Weekly Check-in Process:

1. Log in to [Google Analytics](https://analytics.google.com/)
2. Review:
   - Total visitors compared to previous week
   - Most popular pages
   - Traffic sources
   - Mobile vs. desktop usage

### Monitoring Firebase Usage:

1. Log in to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Usage and billing"
4. Check that you're within free tier limits

> 📊 **Tip:** Set up a monthly calendar reminder to check analytics and usage.

---

## Troubleshooting Common Issues

### Site Loads Slowly:

1. Check your internet connection first
2. Try from a different device
3. If the issue persists, contact your developer

### Image Not Displaying:

1. Ensure the image is under 1MB in size
2. Convert to JPG or WebP format using [Squoosh.app](https://squoosh.app/)
3. Re-upload the image

### Form Submission Errors:

If users report they cannot submit forms:

1. Try submitting a test form yourself
2. Check the Firebase console for error messages
3. Contact your developer with specific details

### Contact for Technical Support:

For issues you cannot resolve:

1. Email: [developer-email@example.com]
2. Include:
   - Clear description of the problem
   - Screenshots if possible
   - Steps to reproduce the issue
   - When the issue started

---

## Monthly Maintenance Checklist

Use this checklist to keep your site running smoothly:

- [ ] Check and respond to all pending trainer submissions
- [ ] Review analytics for traffic patterns
- [ ] Verify all Firebase services are running (check console)
- [ ] Test the submission form works correctly
- [ ] Update any seasonal content
- [ ] Create and schedule next month's social media posts
- [ ] Back up important emails and contacts

---

## Quarterly Review Checklist

Every three months:

- [ ] Review and update trainer listings as needed
- [ ] Check all external links are working
- [ ] Consider updating featured content
- [ ] Review site performance and user feedback
- [ ] Update SEO keywords if needed
- [ ] Review pricing strategy

---

If you need additional help beyond this guide, contact your developer or refer to the more detailed technical documentation.

**Contact Information:**
- Technical Support: [developer-email@example.com]
- Hosting Support: Cloudflare [account-email@example.com]
- Payment Support: Stripe [account-email@example.com]