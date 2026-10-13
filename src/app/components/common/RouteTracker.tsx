import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '@/app/lib/analytics';

const MAX_WAIT_MS = 1500;

export default function RouteTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const path = pathname + search;
    const before = document.title;
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      observer.disconnect();
      window.clearTimeout(timer);
      trackPageView(path);
    };
    const observer = new MutationObserver(() => {
      if (document.title !== before) send();
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    const timer = window.setTimeout(send, MAX_WAIT_MS);
    return () => {
      if (!sent) send();
    };
  }, [pathname, search]);

  return null;
}
