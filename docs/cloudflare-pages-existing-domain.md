# Cloudflare Pages Setup with Existing Domain

This guide is specifically for setting up Cloudflare Pages when your domain (`dogtrainersdirectory.com.au`) is already registered through CrazyDomain and configured in Cloudflare for hosting.

## Prerequisites

- Existing Cloudflare account with domain already added
- GitHub repository with your Dog Trainers Directory code
- Access to modify DNS settings in Cloudflare

## Step 1: Check Current Cloudflare Configuration

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain `dogtrainersdirectory.com.au`
3. Document your current setup:
   - Note any existing DNS records (especially A, AAAA, or CNAME records for @ and www)
   - Check if you're using any other Cloudflare services (like Workers or existing Pages)
   - Verify your SSL/TLS mode (Full, Full (Strict), etc.)

## Step 2: Create Cloudflare Pages Project

1. In your Cloudflare Dashboard, go to **Pages** > **Create a project**
2. Select **Connect to Git**
3. Authenticate with GitHub if prompted
4. Find and select your Dog Trainers Directory repository
5. Configure your build settings:
   - **Project name**: `dog-trainers-directory` (use this exact name rather than your domain)
   - **Production branch**: `main` (or your preferred branch)
   - **Framework preset**: Select `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**:

```
NODE_VERSION=16
VITE_FIREBASE_API_KEY=AIzaSyDZCW7J24zrQCe3OCpelOnXe_bGnVn9Atk
VITE_FIREBASE_AUTH_DOMAIN=dog-trainers-directory.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dog-trainers-directory
VITE_FIREBASE_STORAGE_BUCKET=dog-trainers-directory.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=175653426025
VITE_FIREBASE_APP_ID=1:175653426025:web:39e5733c04698db58e63f8
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDeUlwYc62p6hRTXmnEqb-d7P-o1iWCaQc
```

6. Click **Save and Deploy** (don't set up custom domains yet)
7. Wait for the build and deployment to complete

## Step 3: Decide on Domain Approach

You have two main options for using your existing domain with Cloudflare Pages:

### Option A: Use a Subdomain (Recommended for Minimal Disruption)

This approach lets you keep any existing website or configuration while adding your Dog Trainers Directory under a subdomain:

1. Go to **Pages** > **dog-trainers-directory** > **Custom domains**
2. Click **Set up a custom domain**
3. Enter a subdomain like `app.dogtrainersdirectory.com.au` or `directory.dogtrainersdirectory.com.au`
4. Follow the verification steps

Then add the necessary DNS record:
1. Go to **DNS** > **Records**
2. Add a new CNAME record:
   - **Type**: CNAME
   - **Name**: app (or your chosen subdomain)
   - **Target**: dog-trainers-directory.pages.dev
   - **Proxy status**: Proxied

### Option B: Replace Existing Site with Pages

If you want to use the main domain for your Dog Trainers Directory:

1. First, make note of your existing DNS setup and any services that rely on it
2. Go to **Pages** > **dog-trainers-directory** > **Custom domains**
3. Click **Set up a custom domain**
4. Enter your root domain: `dogtrainersdirectory.com.au`
5. Also add `www.dogtrainersdirectory.com.au` as an additional custom domain

Then update your DNS records:
1. Go to **DNS** > **Records**
2. Find any existing A, AAAA, or CNAME records for @ (root domain) and www
3. Replace or update them with:
   - **Type**: CNAME
   - **Name**: @ (for root domain)
   - **Target**: dog-trainers-directory.pages.dev
   - **Proxy status**: Proxied

   And:
   - **Type**: CNAME
   - **Name**: www
   - **Target**: dog-trainers-directory.pages.dev
   - **Proxy status**: Proxied

## Step 4: Handle Existing Email Records

If you're using email with your domain:

1. Ensure all MX records remain unchanged
2. Keep any existing TXT records for SPF, DKIM, and DMARC
3. Double-check that your email services continue to work after making DNS changes

## Step 5: Verify SSL Configuration

1. Go to **SSL/TLS** > **Overview**
2. Set the encryption mode to **Full (strict)** if not already set
3. Under **Edge Certificates**:
   - Enable **Always Use HTTPS**
   - Enable **Automatic HTTPS Rewrites**

## Step 6: Test the Deployment

1. After making DNS changes, wait 5-10 minutes for propagation
2. Visit your domain or subdomain (based on chosen approach)
3. Verify that:
   - The site loads properly
   - HTTPS works correctly (green lock in browser)
   - All pages and functionality work as expected

## Troubleshooting Common Issues

### DNS Validation Errors

If you see DNS validation errors when setting up the custom domain:

1. Verify no conflicting DNS records exist
2. Try temporarily disabling any proxies or services using the same domain/subdomain
3. If using root domain with Option B, check that you've properly removed or updated any existing A/AAAA records

### Certificate/SSL Issues

If the site loads but has SSL warnings:

1. Ensure SSL/TLS is set to "Full" or "Full (Strict)"
2. Check that "Always Use HTTPS" is enabled
3. Wait up to 24 hours for SSL certificate to fully provision

### Build Failures

If deployments fail:

1. Check the build logs in Cloudflare Pages
2. Verify all environment variables are correctly set
3. Test the build locally with `npm run build` to identify any issues

### Custom Domain Status Stuck on "Pending"

If your custom domain remains in "Pending" status:

1. Go to DNS settings and verify CNAME records are correct
2. Try removing and re-adding the custom domain
3. Contact Cloudflare support if the issue persists for more than 24 hours

## Next Steps After Successful Setup

Once your Cloudflare Pages deployment is working:

1. Set up automatic deployments by connecting your GitHub repository
2. Configure any additional environment variables needed
3. Consider setting up preview deployments for development branches
4. Update your project documentation with the live URL