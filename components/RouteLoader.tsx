'use client';

import { useRouter } from 'next/router';   // ← funciona también en App Router
import { useEffect, useRef, useState } from 'react';
import LogoLoader from './LogoLoader';

type Props = { threshold?: number };       // ms antes de enseñar el spinner

export default function RouteLoader({ threshold = 350 }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const start = () => {
      timer.current = setTimeout(() => setVisible(true), threshold);
    };

    const end = () => {
      clearTimeout(timer.current as NodeJS.Timeout);
      setVisible(false);
    };

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, [router, threshold]);

  if (!visible) return null;

  return (
    <div className="page-loader">
      <LogoLoader />
    </div>
  );
}
