# Content Security Policy (CSP) Implementation

This document explains the Content Security Policy implementation in the Nexus LARP site.

## Overview

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. The Nexus LARP site implements a comprehensive CSP to protect users from these types of attacks.

## Implementation Details

The CSP is implemented in the `nginx.conf` file, which adds the CSP header to all HTTP responses. This approach ensures that the policy is applied consistently across the entire application.

### CSP Directives

The following directives are included in our CSP:

- **default-src 'self'**: By default, only allow content from the same origin
- **script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com https://faro-collector-prod-us-east-0.grafana.net**: Allow scripts from:
  - Same origin
  - Inline scripts (needed for React)
  - Evaluated scripts (needed for React)
  - Auth0 CDN (for authentication)
  - Grafana Faro (for monitoring)
- **connect-src 'self' https://*.auth0.com https://faro-collector-prod-us-east-0.grafana.net https://api.emailjs.com https://*.decade.kylebrighton.com:* wss://*.decade.kylebrighton.com:* https://*.ingest.grafana.net**: Allow connections to:
  - Same origin
  - Auth0 APIs
  - Grafana Faro collector
  - EmailJS API
  - Application API endpoints
  - WebSocket connections to application endpoints
  - Grafana ingest endpoints
- **img-src 'self' data: https://*.decade.kylebrighton.com:* https://cdn.auth0.com**: Allow images from:
  - Same origin
  - Data URIs (for inline images)
  - S3 storage
  - Auth0 CDN
- **style-src 'self' 'unsafe-inline' https://cdn.auth0.com**: Allow styles from:
  - Same origin
  - Inline styles (needed for React)
  - Auth0 CDN
- **font-src 'self' data:**: Allow fonts from:
  - Same origin
  - Data URIs
- **object-src 'none'**: Block all plugins
- **frame-src https://*.auth0.com**: Allow frames only from Auth0
- **base-uri 'self'**: Restrict base URIs to same origin
- **form-action 'self'**: Restrict form submissions to same origin
- **frame-ancestors 'none'**: Prevent the page from being framed (prevents clickjacking)
- **upgrade-insecure-requests**: Force HTTPS for all requests

### Additional Security Headers

In addition to CSP, the following security headers are also implemented:

- **X-Content-Type-Options: nosniff**: Prevents MIME type sniffing
- **X-Frame-Options: DENY**: Prevents the page from being framed (prevents clickjacking)
- **X-XSS-Protection: 1; mode=block**: Enables browser's XSS protection
- **Referrer-Policy: strict-origin-when-cross-origin**: Limits referrer information
- **Permissions-Policy: camera=(), microphone=(), geolocation=()**: Restricts access to sensitive features

## Testing the CSP

To verify that the CSP is working correctly:

1. Open the browser's developer tools
2. Go to the Network tab
3. Reload the page
4. Select any response and check the headers
5. Verify that the Content-Security-Policy header is present with the expected values

You can also use online CSP validators like [CSP Evaluator](https://csp-evaluator.withgoogle.com/) to check the policy.

## Troubleshooting

If you encounter issues with the CSP blocking legitimate resources:

1. Check the browser's console for CSP violation messages
2. Identify the blocked resource and the directive that's blocking it
3. Update the CSP in `nginx.conf` to allow the resource if it's legitimate
4. Restart the nginx server to apply the changes

## References

- [MDN Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)