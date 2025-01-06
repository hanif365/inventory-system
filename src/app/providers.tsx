 'use client';

import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-background">{children}</div>;
}