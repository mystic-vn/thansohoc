import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  showTips?: boolean;
}

const tips = [
  "Thần số học nghiên cứu mối quan hệ giữa con số và sự kiện trong cuộc sống.",
  "Mỗi cung hoàng đạo có những đặc điểm tính cách riêng biệt.",
  "Bạn biết không? Số chủ đạo 7 thường được coi là số của trí tuệ và sự khám phá.",
  "Bạch Dương là cung đầu tiên trong vòng hoàng đạo, đại diện cho sự khởi đầu.",
  "Mỗi hành tinh trong hệ mặt trời có ảnh hưởng khác nhau đến các cung hoàng đạo.",
  "Các con số đều mang những rung động năng lượng khác nhau trong thần số học.",
  "Tương hợp giữa các cung hoàng đạo dựa trên nguyên tố: Lửa, Đất, Khí và Nước.",
  "Ngày sinh của bạn tiết lộ nhiều thông tin về đường đời và tính cách.",
  "Số chủ đạo 9 được coi là số cao nhất, đại diện cho sự hoàn thiện và lòng nhân ái.",
  "Bạn có thể tìm thấy số chủ đạo bằng cách cộng tất cả chữ số trong ngày sinh.",
];

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = true, 
  message = "Đang tải dữ liệu...", 
  showTips = true 
}) => {
  const [currentTip, setCurrentTip] = useState<string>("");
  
  useEffect(() => {
    if (showTips) {
      // Hiển thị tip đầu tiên ngay lập tức
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      
      // Thay đổi tip mỗi 5 giây
      const interval = setInterval(() => {
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [showTips]);
  
  const spinnerClasses = fullScreen 
    ? "h-16 w-16 border-4" 
    : "h-10 w-10 border-3";
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900/95 via-purple-800/95 to-pink-800/95 text-white">
        <div className="flex flex-col items-center max-w-md text-center p-6">
          <div className={`animate-spin rounded-full ${spinnerClasses} border-t-transparent border-indigo-400 mb-6`}></div>
          
          <h3 className="text-xl font-bold mb-3">{message}</h3>
          
          {showTips && currentTip && (
            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm animate-pulse">
              <p className="text-sm text-blue-200 mb-2">Bạn có biết?</p>
              <p className="text-base">{currentTip}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`animate-spin rounded-full ${spinnerClasses} border-t-transparent border-indigo-400 mb-4`}></div>
      <p className="text-center text-gray-700 font-medium">{message}</p>
      
      {showTips && currentTip && (
        <div className="mt-4 max-w-xs text-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-indigo-600 mb-1">Bạn có biết?</p>
          <p className="text-sm text-gray-600">{currentTip}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 