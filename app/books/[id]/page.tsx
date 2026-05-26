'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  created_at: string;
  status: string;
}

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching book:', error);
      } else {
        setBook(data);
      }
      setLoading(false);
    }

    if (id) fetchBook();
  }, [id]);

  const handleRent = async () => {
    if (!book || book.status === 'rented') return;
    
    if (!confirm('이 책을 대여 신청하시겠습니까? ✨')) return;

    setRenting(true);
    const { error } = await supabase
      .from('books')
      .update({ status: 'rented' })
      .eq('id', book.id);

    if (error) {
      alert('대여 처리 중 에러가 발생했습니다: ' + error.message);
    } else {
      alert('대여 신청이 포근하게 완료되었습니다! 🍂');
      setBook({ ...book, status: 'rented' });
      router.refresh();
    }
    setRenting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin mb-4"></div>
        <p className="text-amber-800/60 font-medium italic">포근한 정보를 가져오고 있어요...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
        <p className="text-amber-900 text-xl font-bold mb-6">서재에서 책을 찾을 수 없어요 🍂</p>
        <Link href="/" className="bg-[#8B5E3C] text-white px-8 py-3 rounded-full font-bold">서재로 돌아가기</Link>
      </div>
    );
  }

  const isRented = book.status === 'rented';

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-amber-950 flex flex-col items-center pb-20">
      <nav className="w-full max-w-5xl px-8 py-10">
        <Link 
          href="/" 
          className="text-amber-800/70 hover:text-[#8B5E3C] inline-flex items-center gap-2 font-bold transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          포근한 서재로 돌아가기
        </Link>
      </nav>

      <main className="w-full max-w-5xl px-8">
        <div className="bg-white rounded-[3.5rem] shadow-[0_20px_60px_rgba(180,130,80,0.06)] border border-amber-100/50 overflow-hidden flex flex-col md:flex-row">
          {/* 책 비주얼 영역: 파스텔 톤 */}
          <div className="md:w-5/12 bg-[#F9F5F0] flex items-center justify-center p-12 md:p-16">
            <div className="w-full aspect-[3/4] max-w-[280px] bg-white rounded-2xl shadow-xl flex flex-col p-8 relative overflow-hidden ring-1 ring-amber-100/50">
              <div className="absolute top-0 left-0 w-4 h-full bg-amber-50/50"></div>
              {isRented && (
                <div className="absolute top-4 right-4 bg-gray-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                  RENTED ☕️
                </div>
              )}
              <div className="mt-auto">
                <div className="w-8 h-1 bg-amber-200 mb-4 rounded-full"></div>
                <h2 className="text-2xl font-extrabold text-amber-900 leading-tight mb-2 tracking-tight">
                  {book.title}
                </h2>
                <p className="text-amber-700/70 text-sm font-bold">{book.author}</p>
              </div>
            </div>
          </div>

          {/* 상세 정보 영역 */}
          <div className="md:w-7/12 p-10 md:p-16 flex flex-col">
            <div className="mb-auto">
              <div className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                ✨ 도서 상세 정보
              </div>
              <h1 className="text-4xl font-extrabold text-amber-950 mb-4 leading-tight tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg text-amber-800/60 mb-10 font-semibold italic">By {book.author}</p>
              
              <div className="space-y-6 border-t border-amber-50 pt-10">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700/80 font-bold text-lg">한 학기 사용료 ✨</span>
                  <span className="text-3xl font-extrabold text-amber-900">{book.price.toLocaleString()}원</span>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-amber-500 font-bold text-[10px] uppercase tracking-wider">대여 기간 🌿</span>
                    <span className="text-amber-900 font-bold">2026학년도 1학기</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-amber-500 font-bold text-[10px] uppercase tracking-wider">현재 상태 ☕️</span>
                    <span className={`font-bold ${isRented ? 'text-gray-400' : 'text-[#8B5E3C]'}`}>
                      {isRented ? '누군가 대여 중' : '지금 대여 가능'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRent}
              disabled={isRented || renting}
              className={`mt-12 w-full py-5 rounded-[2rem] font-bold text-xl transition-all duration-300 flex justify-center items-center gap-3 shadow-lg ${
                isRented 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-[#8B5E3C] text-white hover:bg-[#724D31] hover:-translate-y-1 active:scale-95'
              }`}
            >
              {renting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  신청 중...
                </>
              ) : isRented ? (
                '대여 완료된 도서'
              ) : (
                '지금 대여 신청하기 ✨'
              )}
            </button>
            <p className="text-center text-amber-600/40 text-[10px] font-bold mt-4 uppercase tracking-widest">
              {isRented ? 'Next semester is coming soon 🍂' : 'Warmth for your study time'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
