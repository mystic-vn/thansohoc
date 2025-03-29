'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CompatibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Phân Tích Tương Hợp Thần Số Học</h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Chức năng đang được phát triển</h2>
            
            <p className="text-lg mb-6">
              Chúng tôi đang hoàn thiện tính năng phân tích tương hợp giữa các số chủ đạo và cung hoàng đạo. 
              Vui lòng quay lại sau để trải nghiệm tính năng này.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full text-lg font-medium shadow-lg transition-all"
              >
                Quay lại trang chủ
              </Link>
              <Link 
                href="/numerology"
                className="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full text-lg font-medium shadow-lg transition-all"
              >
                Xem thần số học cá nhân
              </Link>
            </div>
          </div>
          
          <p className="text-white/70">
            Chúng tôi sẽ sớm mang đến công cụ phân tích tương hợp chính xác và chi tiết giữa các yếu tố thần số học.
          </p>
        </div>
      </div>
    </main>
  );
} 