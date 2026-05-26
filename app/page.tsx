'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  created_at: string;
  status: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-amber-950 flex flex-col items-center pb-20">
      {/* 🍂 헤더: 감성적인 다이어리 느낌 */}
      <header className="w-full max-w-5xl px-8 py-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 tracking-tight mb-4 flex items-center justify-center md:justify-start gap-3">
            📚 <span className="drop-shadow-sm">SSU 북패스</span> 📖
          </h1>
          <p className="text-amber-700/80 font-medium text-lg italic md:pl-2">
            "당신의 전공책, 누군가에겐 따뜻한 지혜가 됩니다 🍂"
          </p>
        </div>
        <Link 
          href="/books/new" 
          className="bg-[#8B5E3C] text-white px-8 py-4 rounded-[2rem] font-bold text-lg shadow-[0_10px_30px_rgba(139,94,60,0.2)] hover:bg-[#724D31] hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center gap-2"
        >
          ✨ 나의 책 등록하기
        </Link>
      </header>

      {/* 🏡 메인 콘텐츠: 아늑한 배치 */}
      <main className="w-full max-w-5xl px-8">
        <div className="flex items-center gap-3 mb-10 ml-1">
          <span className="text-2xl">🌿</span>
          <h2 className="text-2xl font-bold text-amber-900/90 tracking-tight">오늘의 대여 가능 도서</h2>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
            <p className="text-amber-800/60 font-medium italic animate-pulse">책장을 예쁘게 정리 중이에요...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-amber-200/50">
            <div className="text-6xl mb-6 opacity-80">📖</div>
            <p className="text-amber-900 text-xl font-bold">아직 서재가 비어있어요</p>
            <p className="text-amber-700/60 mt-2">첫 번째 지식 나눔의 주인공이 되어보세요 ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => {
              const isRented = book.status === 'rented';
              
              return (
                <Link 
                  key={book.id} 
                  href={`/books/${book.id}`}
                  className={`group bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(180,130,80,0.04)] border border-amber-100/50 transition-all duration-500 relative overflow-hidden block ${
                    isRented 
                      ? 'opacity-60 bg-amber-50/50' 
                      : 'hover:shadow-[0_20px_50px_rgba(180,130,80,0.12)] hover:-translate-y-2'
                  }`}
                >
                  {/* 다이어리 스티커 느낌의 장식 */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-amber-50/30 rounded-bl-full"></div>
                  
                  {isRented && (
                    <div className="absolute top-6 right-6 bg-[#6B7280] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 uppercase tracking-widest shadow-sm">
                      대여 중 ☕️
                    </div>
                  )}
                  
                  <h3 className="text-xl font-extrabold text-amber-950 mb-3 leading-tight group-hover:text-[#8B5E3C] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-amber-700/60 text-sm mb-8 font-semibold flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-amber-200"></span>
                    {book.author}
                  </p>
                  
                  <div className="flex justify-between items-end border-t border-amber-50 pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-amber-500 font-bold mb-1 uppercase tracking-widest">Rental Fee ✨</span>
                      <span className={`text-2xl font-bold ${isRented ? 'text-gray-400' : 'text-amber-900'}`}>
                        {book.price.toLocaleString()}원
                      </span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRented ? 'bg-gray-100 text-gray-300' : 'bg-amber-50 group-hover:bg-[#8B5E3C] group-hover:text-white'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto mt-20 pt-10 border-t border-amber-100/50 text-center w-full px-8">
        <p className="text-amber-800/40 text-sm font-medium italic mb-2">
          "지식은 나눌수록 포근해집니다 ☕️"
        </p>
        <p className="text-amber-700/30 text-[10px] font-bold tracking-[0.2em] uppercase">
          SSU Book Pass · Warmth and Knowledge
        </p>
      </footer>
    </div>
  );
}
