import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, Volume2 } from 'lucide-react';

// Word data extracted from Karin's Diary
const wordPairs = [
  { english: "Around / About", korean: "-쯤", category: "Grammar" },
  { english: "Restaurant", korean: "식당", category: "Place" },
  { english: "In front of school", korean: "학교 앞", category: "Place" },
  { english: "Nearby / Near", korean: "근처", category: "Place" },
  { english: "Cafe", korean: "카페", category: "Place" },
  { english: "Home", korean: "집", category: "Place" },
  { english: "Today", korean: "오늘", category: "Time" },
  { english: "Next time", korean: "다음", category: "Time" },
  { english: "Especially", korean: "특히", category: "Adverb" },
  { english: "Not really", korean: "별로", category: "Adverb" },
  { english: "Together with", korean: "~하고 같이", category: "Expression" },
  { english: "To order", korean: "주문하다", category: "Verb" },
  { english: "To be delicious", korean: "맛있다", category: "Adjective" },
  { english: "To be expensive", korean: "비싸다", category: "Adjective" },
  { english: "To be cheap", korean: "싸다", category: "Adjective" },
  { english: "To be kind / friendly", korean: "친절하다", category: "Adjective" },
  { english: "To drink", korean: "마시다", category: "Verb" },
  { english: "To do homework", korean: "숙제를 하다", category: "Verb" },
  { english: "Gimbap", korean: "김밥", category: "Food" },
  { english: "Bibimbap", korean: "비빔밥", category: "Food" },
  { english: "Kimchi Udon", korean: "김치 우동", category: "Food" },
  { english: "Tteokbokki", korean: "떡볶이", category: "Food" },
  { english: "Americano", korean: "아메리카노", category: "Drink" },
  { english: "Cheesecake", korean: "치즈 케이크", category: "Food" }
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Initialize Speech Synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Function to speak Korean text
  const speakKorean = (text) => {
    if (!window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean text for better pronunciation (remove symbols used for grammar notes)
    const cleanText = text.replace('-', '').replace('~', '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85; // Natural but slightly slow for learners
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    
    // Play sound when flipping to the Korean side
    if (newFlippedState) {
      speakKorean(wordPairs[currentIndex].korean);
    }
  };

  const nextCard = (e) => {
    e?.stopPropagation();
    if (currentIndex < wordPairs.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    } else {
      setShowFinished(true);
    }
  };

  const prevCard = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowFinished(false);
  };

  const progress = ((currentIndex + 1) / wordPairs.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-indigo-100">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Karin's Diary Vocab</h1>
          <p className="text-slate-500 text-sm mt-1">Study Korean words with audio support</p>
        </header>

        {!showFinished ? (
          <>
            {/* Progress Visualization */}
            <div className="mb-6 px-1">
              <div className="flex justify-between items-end text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">
                <span>Card {currentIndex + 1} of {wordPairs.length}</span>
                <span className="text-indigo-500">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Main Flashcard Container */}
            <div 
              className="relative h-[400px] w-full perspective-1000 cursor-pointer group"
              onClick={handleFlip}
            >
              <div className={`relative w-full h-full transition-all duration-700 transform-style-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side: English (Question) */}
                <div className="absolute inset-0 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center p-8 backface-hidden">
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      {wordPairs[currentIndex].category}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Question</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-slate-800 text-center leading-tight">
                    {wordPairs[currentIndex].english}
                  </h2>
                  
                  <div className="absolute bottom-8 text-slate-300 animate-pulse">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Tap to flip</p>
                  </div>
                </div>

                {/* Back Side: Korean (Answer + Audio) */}
                <div className="absolute inset-0 bg-indigo-600 border border-indigo-500 rounded-3xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 shadow-inner">
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                      {wordPairs[currentIndex].category}
                    </span>
                    <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Answer</span>
                  </div>

                  <div className="flex flex-col items-center space-y-6">
                    <h2 className="text-5xl font-black text-white text-center drop-shadow-md">
                      {wordPairs[currentIndex].korean}
                    </h2>
                    
                    <button 
                      className="group/btn p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90 border border-white/20 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakKorean(wordPairs[currentIndex].korean);
                      }}
                      title="Listen again"
                    >
                      <Volume2 className="text-white group-hover/btn:scale-110 transition-transform" size={32} />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-8 text-indigo-200/60">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Korean Pronunciation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-10 px-2">
              <button 
                onClick={prevCard}
                disabled={currentIndex === 0}
                className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                  currentIndex === 0 
                  ? 'text-slate-200 bg-slate-100 cursor-not-allowed opacity-50' 
                  : 'text-slate-600 bg-white shadow-lg shadow-slate-200/50 hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 border border-slate-100'
                }`}
                aria-label="Previous card"
              >
                <ChevronLeft size={28} strokeWidth={2.5} />
              </button>
              
              <button 
                onClick={resetDeck}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-500 transition-all group"
              >
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all border border-slate-100">
                  <RotateCcw size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">Reset</span>
              </button>

              <button 
                onClick={nextCard}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95 transition-all"
                aria-label="Next card"
              >
                {currentIndex === wordPairs.length - 1 ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <ChevronRight size={28} strokeWidth={2.5} />}
              </button>
            </div>
          </>
        ) : (
          /* Completion Success Screen */
          <div className="bg-white rounded-[2rem] shadow-2xl p-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700 border border-slate-100">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-green-50/50">
              <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">수고하셨습니다!</h2>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              You've mastered all <span className="text-indigo-600 font-bold">{wordPairs.length} words</span> from Karin's Diary with audio pronunciation.
            </p>
            <button 
              onClick={resetDeck}
              className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer / Info */}
      <footer className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        Korean Learning Tool • v1.0
      </footer>

      {/* Global Card Flip Styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
