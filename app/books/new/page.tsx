'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('books')
      .insert([
        { 
          title, 
          author, 
          price: parseInt(price) 
        }
      ]);

    if (error) {
      alert('등록 중 에러가 발생했습니다: ' + error.message);
    } else {
      alert('전공책이 서재에 성공적으로 등록되었습니다!');
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12 font-sans text-amber-950">
      <div className="max-w-xl mx-auto">
        <Link 
          href="/" 
          className="text-amber-800 hover:text-amber-600 mb-8 inline-flex items-center gap-2 font-semibold transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          서재로 돌아가기
        </Link>
        
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(180,130,80,0.08)] border border-amber-100 relative overflow-hidden">
          {/* 장식용 패턴 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[5rem] -mr-16 -mt-16 opacity-50"></div>
          
          <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2 relative">전공책 등록하기</h1>
          <p className="text-amber-700/70 mb-10 font-medium">나누고 싶은 책의 정보를 정성껏 입력해주세요.</p>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-bold text-amber-900 ml-1">
                책 제목
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 text-amber-950 placeholder-amber-300"
                placeholder="어떤 전공책인가요?"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-bold text-amber-900 ml-1">
                저자
              </label>
              <input
                id="author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-5 py-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 text-amber-950 placeholder-amber-300"
                placeholder="저자 또는 출판사를 입력해주세요"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-bold text-amber-900 ml-1">
                한 학기 대여료 (원)
              </label>
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-5 py-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 text-amber-950 placeholder-amber-300 pr-12"
                  placeholder="예: 15000"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₩</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-amber-800 text-amber-50 py-5 rounded-2xl font-bold text-xl shadow-lg hover:bg-amber-900 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex justify-center items-center gap-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
                  서재에 넣는 중...
                </>
              ) : (
                '등록 완료하기'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
