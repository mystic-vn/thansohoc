'use client';

import HomePage from '@/components/home/HomePage';
import MainLayout from './MainLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Page() {
  const isLoading = false; // Replace with actual loading logic

  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Đang khởi tạo hành trình thần số học của bạn..." 
        showTips={true}
      />
    );
  }

  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}
