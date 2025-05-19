# Fixing "Site Can't Be Reached" for dogtrainersdirectory.com.au

This guide specifically addresses the issue where your domain (dogtrainersdirectory.com.au) shows "This site can't be reached" error.

## Quick Diagnosis

This error typically means one of the following:

1. The DNS records are not properly configured
2. The Cloudflare Pages project is not correctly linked to your domain
3. DNS changes haven't propagated yet
4. There might be a Cloudflare service issue

## Step-by-Step Resolution

### 1. Verify Your Cloudflare Pages Deployment

First, check if your Cloudflare Pages project is properly deployed:

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** and find your project (likely named "dog-trainers-directory")
3. Check the deployment status - it should be "Success"
4. Note the default Pages URL (e.g., `dog-trainers-directory.pages.dev`)
5. **Try accessing this URL directly** - if it works, the issue is with your domain configuration

### 2. Check DNS Configuration

If your Pages project is working on its default URL, the issue is likely with DNS:

1. In your Cloudflare dashboard, select your domain `dogtrainersdirectory.com.au`
2. Go to **DNS** > **Records**
3. Check for the following records:

   For the root domain (@):
   ```
   Type: CNAME
   Name: @
   Target: dog-trainers-directory.pages.dev
   Proxy status: Proxied (orange cloud)
   ```

   For the www subdomain:
   ```
   Type: CNAME
   Name: www
   Target: dog-trainers-directory.pages.dev
   Proxy status: Proxied (orange cloud)
   ```

4. If these records are missing or incorrect, add or update them

### 3. Verify Custom Domain Setup in Pages

1. Go back to your Pages project
2. Click on **Custom domains**
3. Verify that `dogtrainersdirectory.com.au` and possibly `www.dogtrainersdirectory.com.au` are listed
4. Check their status - they should be "Active" with green checkmarks
5. If not added, click **Set up a custom domain** and add them

### 4. Check DNS Propagation

DNS changes can take time to propagate (sometimes up to 48 hours, but usually much faster):

1. Use a DNS lookup tool like [dnschecker.org](https://dnschecker.org/) to check your domain
2. Enter `dogtrainersdirectory.com.au` and check if the CNAME record is properly resolved
3. If not all servers show the correct records, you may need to wait longer

### 5. Check for Cloudflare Nameserver Issues

Ensure your domain is using Cloudflare's nameservers:

1. In your Cloudflare dashboard, go to **DNS** > **Records**
2. At the top, you should see Cloudflare nameservers listed
3. Verify these same nameservers are configured at your domain registrar (CrazyDomain)
4. The nameservers should look something like:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```

### 6. Verify SSL/TLS Settings

Improper SSL settings can sometimes cause connection issues:

1. Go to **SSL/TLS** > **Overview**
2. Ensure the encryption mode is set to **Full** or **Full (Strict)**
3. Go to **Edge Certificates**
4. Make sure **Always Use HTTPS** is enabled

### 7. Specific Fix for "Site Can't Be Reached"

If you've confirmed the above and still have issues, try this specific solution:

1. Temporarily create an A record alongside your CNAME record:
   ```
   Type: A
   Name: @
   Value: 192.0.2.1 (or any IP address provided by Cloudflare support)
   Proxy status: Proxied (orange cloud)
   ```

2. Wait 5-10 minutes and try accessing your domain again
3. If it works, you can then remove this A record, keeping only the CNAME

### 8. Check Page Rules

1. Go to **Rules** > **Page Rules**
2. Ensure there are no conflicting rules that might be affecting your domain
3. If there are rules, temporarily disable them to see if that resolves the issue

### 9. Try a Subdomain Instead

If you continue having issues with the root domain, try setting up a subdomain:

1. Add a new DNS record:
   ```
   Type: CNAME
   Name: app
   Target: dog-trainers-directory.pages.dev
   Proxy status: Proxied
   ```

2. Then add this as a custom domain in your Pages project
3. Try accessing `app.dogtrainersdirectory.com.au`

## Contact Cloudflare Support

If none of the above steps resolve your issue:

1. Check [Cloudflare System Status](https://www.cloudflarestatus.com/)
2. Contact Cloudflare support through your dashboard
3. Provide them with:
   - Your domain name
   - Your Pages project name
   - Screenshots of your current DNS configuration
   - Any error messages you're receiving

## Quick Commands for Diagnosis

You can run these commands from your terminal to help diagnose the issue:

```bash
# Check if domain resolves to Cloudflare
dig dogtrainersdirectory.com.au

# Check DNS propagation
host dogtrainersdirectory.com.au

# Check for common HTTP issues
curl -I https://dogtrainersdirectory.com.au
```

If you see error codes or unexpected results, include these in your communication with Cloudflare support.