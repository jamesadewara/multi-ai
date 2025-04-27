
import { useEffect, useState } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  triggerOnce = false,
}: UseIntersectionOptions = {}) {
  const [ref, setRef] = useState<Element | null>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setEntry(entry);
        
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(ref);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, root, rootMargin, triggerOnce]);

  return { ref: setRef, inView, entry };
}
