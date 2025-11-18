// Deprecated: In BFF mode, the SPA does not handle OAuth callbacks.
// This component is kept as a safety no-op. If navigated to, it immediately
// redirects users to the app root and does not process any tokens.
import { useEffect } from 'react'

export default function OAuthCallback() {
  useEffect(() => {
    // Just in case someone lands here, send them home.
    try {
      window.location.replace('/');
    } catch {
      // fallback
      window.location.href = '/';
    }
  }, []);

  return null;
}
