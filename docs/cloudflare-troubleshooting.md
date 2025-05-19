# Cloudflare Pages Deployment Troubleshooting Checklist

Use this checklist to diagnose and fix common issues when deploying to Cloudflare Pages, especially with a domain that's already configured in Cloudflare.

## Quick Reference for Common Errors

| Error | Possible Cause | Solution |
|-------|---------------|----------|
| "DNS validation error" | Conflicting DNS records | Remove/update conflicting DNS records |
| "Domain already in use" | Domain used by another service | Choose a subdomain or remove conflicting service |
| Build fails | Environment variables or build configuration | Check build logs and project settings |
| SSL errors | Certificate issues | Verify SSL/TLS settings and wait for propagation |
| "Failed to resolve" | DNS propagation delay | Wait 5-15 minutes and try again |

## Step-by-Step Diagnosis

### 1. Verify Project Build Success

- [ ] Check if the Cloudflare Pages build completed successfully
- [ ] Verify the project's default URL (e.g., `dog-trainers-directory.pages.dev`) loads correctly
- [ ] Review build logs for any errors related to:
  - Missing dependencies
  - Build command issues
  - Environment variable problems

### 2. Check DNS Configuration

- [ ] Confirm correct DNS records are set:
  ```
  Type    Name       Target/Value                  Proxy Status
  CNAME   @          your-project.pages.dev        Proxied
  CNAME   www        your-project.pages.dev        Proxied
  ```
- [ ] Ensure no conflicting A or AAAA records exist for the same domain/subdomain
- [ ] Verify MX, TXT, and other specialized records remain intact
- [ ] Run a DNS lookup to confirm changes have propagated:
  ```
  dig dogtrainersdirectory.com.au +noall +answer
  dig www.dogtrainersdirectory.com.au +noall +answer
  ```

### 3. Verify Custom Domain Setup

- [ ] Check status in Pages dashboard under "Custom domains"
- [ ] Ensure domain shows as "Active" with a green checkmark
- [ ] Review any error messages shown in the custom domain section
- [ ] Try removing and re-adding the custom domain if status is "Pending" for too long

### 4. SSL/TLS Configuration

- [ ] Verify SSL/TLS is set to "Full" or "Full (Strict)" in Cloudflare dashboard
- [ ] Enable "Always Use HTTPS" option
- [ ] Check if "Automatic HTTPS Rewrites" is enabled
- [ ] Allow up to 24 hours for SSL certificate to fully provision

### 5. Common Conflicts with Existing Cloudflare Setup

- [ ] Check for conflicting Page Rules
- [ ] Look for overlapping Workers routes
- [ ] Verify no conflicting Cloudflare Access policies
- [ ] Check for any existing Cloudflare Pages projects using the same domain

## Common Solutions

### If Your Domain Shows "Pending" Status:

1. Go to **DNS** tab and verify CNAME records are correctly set
2. Ensure no Cloudflare features conflict with Pages:
   - Disable any Page Rules affecting the root domain temporarily
   - Check for Workers routes that might be intercepting requests
3. Try using a subdomain instead (e.g., `app.dogtrainersdirectory.com.au`)
4. Wait at least 15-30 minutes for changes to take effect

### If Build Succeeds But Website Doesn't Load:

1. Check browser console for errors
2. Verify all required environment variables are correctly set
3. Test with browser cache disabled or incognito window
4. Confirm proper routes are configured in your React application

### If Build Fails:

1. Check the error message in the build logs
2. Try building locally with `npm run build` to reproduce and fix issues
3. Verify Node.js version is correctly set in environment variables
4. Check that all required dependencies are in package.json

## Quick Fixes for Specific Scenarios

### For Already Active Domains:

If your domain is already actively used with Cloudflare:
1. Consider using a subdomain first to test functionality
2. Create DNS record for the subdomain pointing to your Pages project
3. Once verified working, consider migrating the main domain

### For Email Continuity:

If you use email with your domain:
1. Ensure all MX records remain unchanged
2. Verify SPF, DKIM, and DMARC records are preserved
3. Test email sending/receiving after DNS changes

### For Conflicting Services:

If you have other Cloudflare services (like Workers):
1. Determine priority (which service should handle requests first)
2. Configure Workers routes with proper patterns to avoid conflicts
3. Use Page Rules to control traffic flow if needed

## Getting Help

If you still encounter issues after going through this checklist:

1. Check [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
2. Review Cloudflare status at [status.cloudflare.com](https://www.cloudflarestatus.com/)
3. Use "Help" option in your Cloudflare dashboard
4. Contact your developer for assistance with code-specific issues