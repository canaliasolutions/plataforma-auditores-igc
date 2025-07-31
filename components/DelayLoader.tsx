'use client';

import { useEffect, useState } from 'react';
import LogoLoader from './LogoLoader';

type Props = { threshold?: number };   // tiempo en ms (por defecto 350 ms)

export default function DelayLoader({ threshold = 350 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), threshold);
    return () => clearTimeout(id);          // si la ruta acaba antes, no se muestra
  }, [threshold]);

  if (!visible) return null;

  return (
    <div className="page-loader">
      <LogoLoader />
    </div>
  );
}
