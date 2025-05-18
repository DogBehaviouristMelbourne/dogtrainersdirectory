# Deployment Guide for Dog Trainers Directory

This guide walks you through deploying the Dog Trainers Directory application to Cloudflare Pages with proper DNS configuration and email setup.

## Prerequisites

- GitHub account with repository access
- Cloudflare account
- Domain name registered (dogtrainersdirectory.com.au)
- Zoho Mail account for info@dogtrainersdirectory.com.au

## Step 1: GitHub Repository Setup

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DogBehaviouristMelbourne/dogtrainersdirectory.git
git push -u origin main
```

2. Make sure your GitHub repository is public or that you've connected Cloudflare to your GitHub account with appropriate permissions.

## Step 2: Cloudflare Pages Setup

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **Create a project** > **Connect to Git**
3. Select the GitHub repository

4. Configure build settings:
   - **Project name**: dogtrainersdirectory
   - **Production branch**: main
   - **Framework preset**: Vite
   - **Build command**: npm run build
   - **Build output directory**: dist
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

5. Click **Save and Deploy**

## Step 3: Domain Configuration

1. In the Cloudflare dashboard, go to **Pages** > **dogtrainersdirectory** > **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `dogtrainersdirectory.com.au`
4. Follow the verification steps (if your domain is already on Cloudflare, this will be automatic)

### DNS Setup

1. Go to the **DNS** tab in your Cloudflare dashboard
2. Add the following records:

```
Type    Name       Value                         TTL     Proxy status
CNAME   @          dogtrainersdirectory.pages.dev   Auto    Proxied
CNAME   www        dogtrainersdirectory.com.au      Auto    Proxied
```

## Step 4: Email Configuration with Zoho Mail

### Add MX Records

1. Go to the **DNS** tab in your Cloudflare dashboard
2. Add the following MX records for Zoho Mail:

```
Type    Name    Value                       Priority    TTL
MX      @       mx.zoho.com                10          Auto
MX      @       mx2.zoho.com               20          Auto
MX      @       mx3.zoho.com               30          Auto
```

### Add SPF, DKIM, and DMARC Records

1. Add SPF record:

```
Type    Name    Value                                                                        TTL
TXT     @       v=spf1 include:zoho.com include:_spf.google.com ~all                         Auto
```

2. Add DKIM record (get the actual values from your Zoho admin panel):

```
Type    Name                         Value                                      TTL
TXT     zoho._domainkey              v=DKIM1; k=rsa; p=YOUR_DKIM_KEY           Auto
```

3. Add DMARC record:

```
Type    Name                   Value                                                              TTL
TXT     _dmarc                 v=DMARC1; p=none; rua=mailto:info@dogtrainersdirectory.com.au      Auto
```

## Step 5: SSL/TLS Configuration

1. Go to **SSL/TLS** > **Overview** in your Cloudflare dashboard
2. Ensure the encryption mode is set to **Full (strict)**
3. Go to **SSL/TLS** > **Edge Certificates**
4. Enable **Always Use HTTPS**
5. Enable **Automatic HTTPS Rewrites**

## Step 6: Performance and Security Settings

### Performance

1. Go to **Speed** > **Optimization**
2. Enable:
   - Auto Minify (HTML, CSS, JavaScript)
   - Brotli Compression
   - Early Hints
   - Rocket Loader

### Security

1. Go to **Security** > **Settings**
2. Set Security Level to **Medium**
3. Enable **Browser Integrity Check**
4. Enable **Email Obfuscation**
5. Enable **Hotlink Protection**

## Step 7: Verify Deployment

1. Visit your domain: `https://dogtrainersdirectory.com.au`
2. Check that:
   - The website loads correctly
   - SSL is working (green lock icon)
   - All pages function properly
   - Firebase connections are working

## Step 8: Set Up Continuous Deployment

Continuous deployment should be automatically configured. When you push changes to the main branch, Cloudflare Pages will automatically build and deploy your site.

To verify this is working:
1. Make a small change to your code
2. Push to GitHub
3. Go to **Cloudflare Dashboard** > **Pages** > **dogtrainersdirectory**
4. Watch for the new deployment to appear

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs in the Cloudflare dashboard
2. Verify your dependencies are correctly installed
3. Ensure your environment variables are set correctly

### DNS Issues

If your domain isn't working:

1. Check your DNS records in Cloudflare
2. Verify that your nameservers are correctly set at your domain registrar
3. Use [dnschecker.org](https://dnschecker.org) to verify DNS propagation

### Firebase Connection Issues

If Firebase connections fail:

1. Check that your Firebase project is correctly set up
2. Verify that your Firebase API keys are correctly set in environment variables
3. Ensure your Firebase security rules allow the necessary access

## Maintenance Tasks

### Weekly

- Check Firebase console for any errors
- Review Cloudflare analytics for traffic patterns
- Respond to any user submissions

### Monthly

- Review Firebase usage to ensure you stay within free tier
- Check for any security alerts from GitHub or Cloudflare
- Test the site in various browsers and devices

### Quarterly

- Review and update trainer listings as needed
- Consider updating featured content
- Review and optimize SEO settings