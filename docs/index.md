# Dog Trainers Directory Documentation

Welcome to the Dog Trainers Directory documentation! This collection of guides and resources will help you deploy, manage, and maintain your website effectively.

## 📚 Available Guides

### For Non-Technical Users

- [**Maintenance Guide**](maintenance-guide.md) - Day-to-day operations and site management
- [**Launch Checklist**](launch-checklist.md) - Comprehensive checklist for site launch

### For Technical Setup

- [**Deployment Guide**](deployment-guide.md) - Setting up hosting with Cloudflare Pages
- [**Cloudflare Pages with Existing Domain**](cloudflare-pages-existing-domain.md) - Special instructions for domains already in Cloudflare
- [**Cloudflare Troubleshooting**](cloudflare-troubleshooting.md) - Solutions for common Cloudflare deployment issues
- [**DNS "Site Can't Be Reached" Fix**](dns-not-resolving-fix.md) - Specific solution for domain not resolving
- [**Stripe Setup Guide**](stripe-setup-guide.md) - Configuring payment processing

### For Developers

- [**Import Sample Data Script**](../scripts/import-sample-data.js) - Script for populating initial data
- [**Firebase Functions**](../functions/index.js) - Webhook handlers and backend functions

## 🚀 Getting Started

If you're just beginning with the Dog Trainers Directory, we recommend following these guides in order:

1. **First Steps:** Review the appropriate deployment guide:
   - If your domain is new: Use the standard [Deployment Guide](deployment-guide.md)
   - If your domain is already in Cloudflare: Use the [Cloudflare Pages with Existing Domain](cloudflare-pages-existing-domain.md) guide
2. **Data & Payments:** Follow the [Stripe Setup Guide](stripe-setup-guide.md) to configure payment processing.
3. **Launch Preparation:** Work through the [Launch Checklist](launch-checklist.md) to ensure nothing is missed.
4. **Ongoing Operations:** Refer to the [Maintenance Guide](maintenance-guide.md) for day-to-day management.

## 📊 Site Architecture

The Dog Trainers Directory is built with:

- **Frontend:** React, Vite
- **Database:** Firebase Firestore
- **Hosting:** Cloudflare Pages
- **Authentication:** Firebase Authentication
- **File Storage:** Firebase Storage
- **Payment Processing:** Stripe

## 🔄 Workflow

The typical workflow for the site involves:

1. **User Browsing:** Dog owners search the directory by suburb or specialty
2. **Trainer Submissions:** Trainers submit their details via the submission form
3. **Admin Approval:** You approve submissions through the admin dashboard
4. **Subscription Management:** Premium trainers manage their subscription through Stripe
5. **Ongoing Updates:** You maintain trainer listings and site content

## 🆘 Getting Help

If you encounter issues not covered in these guides:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
3. Contact your developer for technical assistance

---

*Last Updated: May 18, 2025*