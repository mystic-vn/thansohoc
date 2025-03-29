'use client';

import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GenerateDataPage() {
  const [dataType, setDataType] = useState<string>('life-path');
  const [parameters, setParameters] = useState<any>({});
  const [saveToDb, setSaveToDb] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('raw');

  // Xử lý khi gửi form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResponse(null);

    try {
      console.log("Submit parameters:", parameters);
      
      // Xác thực tham số trước khi gửi
      if (dataType === 'life-path' && (!parameters.number || isNaN(parameters.number) || (parameters.number < 1 || parameters.number > 33))) {
        throw new Error('Số chủ đạo phải là một số từ 1-9 hoặc 11, 22, 33');
      } else if (dataType === 'zodiac' && !parameters.sign) {
        throw new Error('Cung hoàng đạo không được để trống');
      } else if (dataType === 'compatibility') {
        if (!parameters.compatibilityType) {
          throw new Error('Vui lòng chọn loại tương hợp');
        }
        
        // Đảm bảo có đủ các tham số cần thiết
        if (!parameters.factor1Type || !parameters.factor2Type) {
          // Tự động chọn loại yếu tố dựa vào loại tương hợp
          const compatType = parameters.compatibilityType;
          let factor1Type = parameters.factor1Type;
          let factor2Type = parameters.factor2Type;
          
          if (!factor1Type || !factor2Type) {
            switch(compatType) {
              case 'life-path-life-path':
                factor1Type = 'life-path';
                factor2Type = 'life-path';
                break;
              case 'life-path-zodiac':
                factor1Type = 'life-path';
                factor2Type = 'zodiac';
                break;
              case 'zodiac-zodiac':
                factor1Type = 'zodiac';
                factor2Type = 'zodiac';
                break;
              case 'expression-life-path':
                factor1Type = 'expression';
                factor2Type = 'life-path';
                break;
            }
            
            parameters.factor1Type = factor1Type;
            parameters.factor2Type = factor2Type;
          }
        }
        
        if (!parameters.factor1 || !parameters.factor2) {
          throw new Error('Thiếu thông tin cần thiết cho phân tích tương hợp. Vui lòng chọn giá trị cho cả hai yếu tố.');
        }
      } else if (dataType === 'year-analysis' && (!parameters.lifePathNumber || !parameters.year)) {
        throw new Error('Số chủ đạo và năm không được để trống');
      }

      // Xử lý parameters cho API
      let apiParameters = { ...parameters };
      
      // Nếu là compatibility, đảm bảo gửi loại dữ liệu tương hợp
      if (dataType === 'compatibility' && parameters.compatibilityType) {
        apiParameters.type = parameters.compatibilityType;
      }

      const response = await fetch('/api/numerology/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataType,
          parameters: apiParameters,
          saveToDb,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.rawResponse) {
          setRawResponse(data.rawResponse);
        }
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo dữ liệu');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    setParameters((prev: any) => ({ ...prev, [key]: value }));
  };

  // Thêm hàm mới để xử lý việc chọn loại dữ liệu
  const handleDataTypeChange = (value: string) => {
    setDataType(value);
    
    // Đặt lại tham số khi thay đổi loại dữ liệu
    setParameters({});
    
    // Nếu chọn loại dữ liệu là compatibility, tự động điền loại yếu tố dựa vào dataType
    if (value === 'compatibility') {
      setParameters({
        compatibilityType: 'life-path-life-path',
        factor1Type: 'life-path',
        factor2Type: 'life-path'
      });
    }
  };

  // Hiển thị form phù hợp với từng loại dữ liệu
  const renderParameterForm = () => {
    switch (dataType) {
      case 'life-path':
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="number">Số chủ đạo</Label>
              <Input
                id="number"
                type="number"
                min="1"
                max="33"
                onChange={(e) => handleParameterChange('number', e.target.value)}
                placeholder="Nhập số từ 1-9 hoặc 11, 22, 33"
              />
            </div>
          </div>
        );
      case 'zodiac':
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sign">Cung hoàng đạo</Label>
              <Select onValueChange={(value) => handleParameterChange('sign', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cung hoàng đạo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bạch Dương">Bạch Dương (Aries)</SelectItem>
                  <SelectItem value="Kim Ngưu">Kim Ngưu (Taurus)</SelectItem>
                  <SelectItem value="Song Tử">Song Tử (Gemini)</SelectItem>
                  <SelectItem value="Cự Giải">Cự Giải (Cancer)</SelectItem>
                  <SelectItem value="Sư Tử">Sư Tử (Leo)</SelectItem>
                  <SelectItem value="Xử Nữ">Xử Nữ (Virgo)</SelectItem>
                  <SelectItem value="Thiên Bình">Thiên Bình (Libra)</SelectItem>
                  <SelectItem value="Bọ Cạp">Bọ Cạp (Scorpio)</SelectItem>
                  <SelectItem value="Nhân Mã">Nhân Mã (Sagittarius)</SelectItem>
                  <SelectItem value="Ma Kết">Ma Kết (Capricorn)</SelectItem>
                  <SelectItem value="Bảo Bình">Bảo Bình (Aquarius)</SelectItem>
                  <SelectItem value="Song Ngư">Song Ngư (Pisces)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'compatibility':
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="compatibilityType">Loại tương hợp</Label>
              <Select 
                value={parameters.compatibilityType || 'life-path-life-path'} 
                onValueChange={(value) => {
                  // Cập nhật loại tương hợp
                  handleParameterChange('compatibilityType', value);
                  
                  // Tự động cập nhật loại yếu tố dựa vào loại tương hợp
                  switch(value) {
                    case 'life-path-life-path':
                      handleParameterChange('factor1Type', 'life-path');
                      handleParameterChange('factor2Type', 'life-path');
                      // Reset các giá trị đã chọn
                      handleParameterChange('factor1', '');
                      handleParameterChange('factor2', '');
                      break;
                    case 'life-path-zodiac':
                      handleParameterChange('factor1Type', 'life-path');
                      handleParameterChange('factor2Type', 'zodiac');
                      // Reset các giá trị đã chọn
                      handleParameterChange('factor1', '');
                      handleParameterChange('factor2', '');
                      break;
                    case 'zodiac-zodiac':
                      handleParameterChange('factor1Type', 'zodiac');
                      handleParameterChange('factor2Type', 'zodiac');
                      // Reset các giá trị đã chọn
                      handleParameterChange('factor1', '');
                      handleParameterChange('factor2', '');
                      break;
                    case 'expression-life-path':
                      handleParameterChange('factor1Type', 'expression');
                      handleParameterChange('factor2Type', 'life-path');
                      // Reset các giá trị đã chọn
                      handleParameterChange('factor1', '');
                      handleParameterChange('factor2', '');
                      break;
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tương hợp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="life-path-life-path">Số chủ đạo - Số chủ đạo</SelectItem>
                  <SelectItem value="life-path-zodiac">Số chủ đạo - Cung hoàng đạo</SelectItem>
                  <SelectItem value="zodiac-zodiac">Cung hoàng đạo - Cung hoàng đạo</SelectItem>
                  <SelectItem value="expression-life-path">Số biểu đạt - Số chủ đạo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="factor1">Giá trị yếu tố 1 ({parameters.factor1Type === 'life-path' ? 'Số chủ đạo' : parameters.factor1Type === 'zodiac' ? 'Cung hoàng đạo' : 'Số biểu đạt'})</Label>
              {parameters.factor1Type === 'zodiac' ? (
                <Select onValueChange={(value) => handleParameterChange('factor1', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cung hoàng đạo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bạch Dương">Bạch Dương</SelectItem>
                    <SelectItem value="Kim Ngưu">Kim Ngưu</SelectItem>
                    <SelectItem value="Song Tử">Song Tử</SelectItem>
                    <SelectItem value="Cự Giải">Cự Giải</SelectItem>
                    <SelectItem value="Sư Tử">Sư Tử</SelectItem>
                    <SelectItem value="Xử Nữ">Xử Nữ</SelectItem>
                    <SelectItem value="Thiên Bình">Thiên Bình</SelectItem>
                    <SelectItem value="Bọ Cạp">Bọ Cạp</SelectItem>
                    <SelectItem value="Nhân Mã">Nhân Mã</SelectItem>
                    <SelectItem value="Ma Kết">Ma Kết</SelectItem>
                    <SelectItem value="Bảo Bình">Bảo Bình</SelectItem>
                    <SelectItem value="Song Ngư">Song Ngư</SelectItem>
                  </SelectContent>
                </Select>
              ) : parameters.factor1Type === 'life-path' ? (
                <Select onValueChange={(value) => handleParameterChange('factor1', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số chủ đạo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="22">22</SelectItem>
                    <SelectItem value="33">33</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="factor1"
                  value={parameters.factor1 || ''}
                  onChange={(e) => handleParameterChange('factor1', e.target.value)}
                  placeholder={`Nhập giá trị ${parameters.factor1Type || 'yếu tố 1'}`}
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="factor2">Giá trị yếu tố 2 ({parameters.factor2Type === 'life-path' ? 'Số chủ đạo' : parameters.factor2Type === 'zodiac' ? 'Cung hoàng đạo' : 'Số biểu đạt'})</Label>
              {parameters.factor2Type === 'zodiac' ? (
                <Select onValueChange={(value) => handleParameterChange('factor2', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cung hoàng đạo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bạch Dương">Bạch Dương</SelectItem>
                    <SelectItem value="Kim Ngưu">Kim Ngưu</SelectItem>
                    <SelectItem value="Song Tử">Song Tử</SelectItem>
                    <SelectItem value="Cự Giải">Cự Giải</SelectItem>
                    <SelectItem value="Sư Tử">Sư Tử</SelectItem>
                    <SelectItem value="Xử Nữ">Xử Nữ</SelectItem>
                    <SelectItem value="Thiên Bình">Thiên Bình</SelectItem>
                    <SelectItem value="Bọ Cạp">Bọ Cạp</SelectItem>
                    <SelectItem value="Nhân Mã">Nhân Mã</SelectItem>
                    <SelectItem value="Ma Kết">Ma Kết</SelectItem>
                    <SelectItem value="Bảo Bình">Bảo Bình</SelectItem>
                    <SelectItem value="Song Ngư">Song Ngư</SelectItem>
                  </SelectContent>
                </Select>
              ) : parameters.factor2Type === 'life-path' ? (
                <Select onValueChange={(value) => handleParameterChange('factor2', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số chủ đạo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="22">22</SelectItem>
                    <SelectItem value="33">33</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="factor2"
                  value={parameters.factor2 || ''}
                  onChange={(e) => handleParameterChange('factor2', e.target.value)}
                  placeholder={`Nhập giá trị ${parameters.factor2Type || 'yếu tố 2'}`}
                />
              )}
            </div>
          </div>
        );
      case 'life-path-zodiac-combination':
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lifePathNumber">Số chủ đạo</Label>
              <Select onValueChange={(value) => handleParameterChange('lifePathNumber', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn số chủ đạo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="22">22</SelectItem>
                  <SelectItem value="33">33</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="zodiacSign">Cung hoàng đạo</Label>
              <Select onValueChange={(value) => handleParameterChange('zodiacSign', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cung hoàng đạo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bạch Dương">Bạch Dương (Aries)</SelectItem>
                  <SelectItem value="Kim Ngưu">Kim Ngưu (Taurus)</SelectItem>
                  <SelectItem value="Song Tử">Song Tử (Gemini)</SelectItem>
                  <SelectItem value="Cự Giải">Cự Giải (Cancer)</SelectItem>
                  <SelectItem value="Sư Tử">Sư Tử (Leo)</SelectItem>
                  <SelectItem value="Xử Nữ">Xử Nữ (Virgo)</SelectItem>
                  <SelectItem value="Thiên Bình">Thiên Bình (Libra)</SelectItem>
                  <SelectItem value="Bọ Cạp">Bọ Cạp (Scorpio)</SelectItem>
                  <SelectItem value="Nhân Mã">Nhân Mã (Sagittarius)</SelectItem>
                  <SelectItem value="Ma Kết">Ma Kết (Capricorn)</SelectItem>
                  <SelectItem value="Bảo Bình">Bảo Bình (Aquarius)</SelectItem>
                  <SelectItem value="Song Ngư">Song Ngư (Pisces)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'year-analysis':
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lifePathNumber">Số chủ đạo</Label>
              <Input
                id="lifePathNumber"
                type="number"
                min="1"
                max="33"
                onChange={(e) => handleParameterChange('lifePathNumber', e.target.value)}
                placeholder="Nhập số từ 1-9 hoặc 11, 22, 33"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="year">Năm</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2100"
                onChange={(e) => handleParameterChange('year', e.target.value)}
                placeholder="Nhập năm (ví dụ: 2023)"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render kết quả
  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="raw" className="flex-1">Dữ liệu thô</TabsTrigger>
            <TabsTrigger value="formatted" className="flex-1">Dữ liệu định dạng</TabsTrigger>
          </TabsList>
          <TabsContent value="raw" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dữ liệu JSON</CardTitle>
                <CardDescription>
                  {result.saved ? 'Dữ liệu đã được lưu vào cơ sở dữ liệu' : 'Dữ liệu chưa được lưu'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-auto max-h-[500px] p-4 bg-gray-50 rounded-md text-sm">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="formatted" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{result.data.title || 'Kết quả phân tích'}</CardTitle>
                {result.data.date_range && (
                  <CardDescription>{result.data.date_range}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="grid gap-4">
                {result.data.overview && (
                  <div>
                    <h3 className="font-semibold mb-1">Tổng quan</h3>
                    <p className="text-sm">{result.data.overview}</p>
                  </div>
                )}
                
                {result.data.traits && result.data.traits.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Đặc điểm</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {result.data.traits.map((trait: string, index: number) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.data.strengths && result.data.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Điểm mạnh</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {result.data.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.data.weaknesses && result.data.weaknesses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Điểm yếu</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {result.data.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.data.details && (
                  <div>
                    <h3 className="font-semibold mb-1">Chi tiết</h3>
                    <div className="grid gap-3 text-sm">
                      {Object.entries(result.data.details).map(([key, value]: [string, any]) => (
                        <div key={key}>
                          <h4 className="text-sm font-medium mb-1">
                            {key === 'career' && 'Sự nghiệp'}
                            {key === 'relationships' && 'Các mối quan hệ'}
                            {key === 'health' && 'Sức khỏe'}
                            {key === 'spiritual_growth' && 'Phát triển tâm linh'}
                            {key === 'spiritual_aspects' && 'Khía cạnh tâm linh'}
                            {key === 'financial_aspects' && 'Tài chính'}
                            {key === 'life_lessons' && 'Bài học cuộc sống'}
                            {key === 'challenges' && 'Thách thức'}
                            {key === 'advice' && 'Lời khuyên'}
                          </h4>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.data.compatibilityScore && (
                  <div>
                    <h3 className="font-semibold mb-1">Điểm tương hợp</h3>
                    <p className="text-sm">{result.data.compatibilityScore}/10</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-gray-500">
                  {result.saved ? (
                    <>
                      Dữ liệu đã được lưu vào collection: {
                        dataType === 'life-path' ? 'life_path_data' : 
                        dataType === 'zodiac' ? 'zodiac_data' : 
                        dataType === 'life-path-zodiac-combination' ? 'life_path_zodiac_combinations' :
                        dataType === 'compatibility' ? 
                          (parameters.factor1Type === 'life-path' && parameters.factor2Type === 'life-path' ? 'compatibility_life_path_life_path' : 
                          (parameters.factor1Type === 'zodiac' && parameters.factor2Type === 'zodiac' ? 'compatibility_zodiac_zodiac' : 
                          'numerology_compatibility')) : 
                        'numerology_time_analysis'
                      }
                    </>
                  ) : 'Dữ liệu chưa được lưu'}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Hiển thị lỗi
  const renderError = () => {
    if (!error) return null;

    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>
          <div className="grid gap-4">
            <p>{error}</p>
            {rawResponse && (
              <>
                <p className="text-sm font-semibold">Phản hồi thô từ ChatGPT:</p>
                <pre className="overflow-auto max-h-[200px] p-2 bg-gray-50 rounded-md text-xs">
                  {rawResponse}
                </pre>
                <p className="text-sm">
                  Gợi ý: Phản hồi không đúng định dạng JSON. Hãy thử lại lần nữa.
                </p>
              </>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tạo dữ liệu thần số học từ ChatGPT</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Form tạo dữ liệu */}
          <Card>
            <CardHeader>
              <CardTitle>Tạo dữ liệu mới</CardTitle>
              <CardDescription>
                Sử dụng ChatGPT để tạo dữ liệu thần số học
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {/* Chọn loại dữ liệu */}
                  <div className="grid gap-2">
                    <Label htmlFor="dataType">Loại dữ liệu</Label>
                    <Select
                      value={dataType}
                      onValueChange={handleDataTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại dữ liệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="life-path">Số chủ đạo (Life Path Number)</SelectItem>
                        <SelectItem value="zodiac">Cung hoàng đạo (Zodiac)</SelectItem>
                        <SelectItem value="compatibility">Tương hợp (Compatibility)</SelectItem>
                        <SelectItem value="life-path-zodiac-combination">Kết hợp số chủ đạo và cung hoàng đạo</SelectItem>
                        <SelectItem value="year-analysis">Phân tích năm (Year Analysis)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Form tham số */}
                  {renderParameterForm()}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveToDb"
                      checked={saveToDb}
                      onCheckedChange={(checked) => setSaveToDb(checked as boolean)}
                    />
                    <Label htmlFor="saveToDb" className="cursor-pointer">
                      Lưu vào cơ sở dữ liệu
                    </Label>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo dữ liệu...
                  </>
                ) : (
                  'Tạo dữ liệu'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Kết quả */}
          <div>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                <p className="text-sm text-gray-500">Đang tạo dữ liệu, vui lòng đợi...</p>
                <p className="text-xs text-gray-400 mt-2">Quá trình này có thể mất vài phút.</p>
              </div>
            )}
            
            {error && renderError()}
            {!loading && result && renderResult()}
          </div>
        </div>
      </div>
    </div>
  );
} 