import { NextRequest, NextResponse } from 'next/server';

// Tạo route handler cho /api/auth/login 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // API URL thật từ biến môi trường hoặc mặc định
    const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';
    
    console.log('Forwarding login request to:', `${API_URL}/auth/login`);
    
    // Gửi request đến backend thật
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Lấy dữ liệu từ response
    const data = await response.json();
    
    // Nếu đăng nhập thành công
    if (response.ok) {
      // Trả về dữ liệu với cookie đính kèm
      const res = NextResponse.json(data);
      
      // Thiết lập cookie nếu có token
      if (data.token) {
        res.cookies.set({
          name: 'token',
          value: data.token,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 ngày
          path: '/',
          sameSite: 'lax'
        });
      }
      
      return res;
    }
    
    // Nếu lỗi, trả về lỗi từ backend
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 