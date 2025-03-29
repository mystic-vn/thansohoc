'use client';

import MainLayout from '../MainLayout';

export default function AstrologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 