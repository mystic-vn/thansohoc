import { NextRequest, NextResponse } from 'next/server';

// Tạo route handler cho /api/auth/login 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // API URL thật từ biến môi trường hoặc mặc định
    const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';
    
    console.log('Forwarding login request to:', `${API_URL}/auth/login`);
    
    // Gửi request đến backend thật
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    // Lấy dữ liệu từ response
    const data = await response.json();
    
    // Nếu đăng nhập thành công
    if (response.ok && data.token) {
      // Tạo response với cookie
      const res = NextResponse.json(data, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });

      // Set cookie với các options phù hợp cho mobile
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      
      return res;
    }
    
    // Nếu đăng nhập thất bại
    return NextResponse.json(
      { message: data.message || 'Đăng nhập thất bại' },
      { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Lỗi server, vui lòng thử lại sau' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// Thêm handler cho OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
} 