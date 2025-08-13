// app/loading.tsx
import React from 'react';
import LogoLoader from '@/components/LogoLoader';
import '@/components/loader.css';         // ← hoja global con las reglas del CSS

export default function Loading() {
  /* page-loader centra el SVG y cubre la pantalla */
  return (
    <main className="page-loader">
      <LogoLoader />
    </main>
  );
}
