
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SpeechHelper } from '@/lib/speechUtils';
import { freedomFightersData } from '@/data/freedomFightersData';
import { findVoiceByLang } from '@/data/languageData';
import { Volume2, VolumeX } from 'lucide-react';

const VoicesOfFreedom = () => {
  const [speakingQuoteId, setSpeakingQuoteId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());

  const handleSpeak = (id: string, quote: string, language: string = 'en') => {
    if (speakingQuoteId === id) {
      // Stop if already speaking this quote
      speechHelper.current.stop();
      setSpeakingQuoteId(null);
      return;
    }

    // Stop any other speech first
    speechHelper.current.stop();

    // Find a suitable voice for the quote's language
    const voices = speechHelper.current.getVoices();
    const voice = findVoiceByLang(voices, language);

    // Speak the quote
    speechHelper.current.speak({
      text: quote,
      voice: voice || undefined,
      onStart: () => setSpeakingQuoteId(id),
      onEnd: () => setSpeakingQuoteId(null)
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === freedomFightersData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? freedomFightersData.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    // Clean up speech on component unmount
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
    };
  }, []);

  // Mobile swipe handler
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const diff = touchStartX - touchEndX;
      if (diff > 50) {
        nextSlide(); // Swipe left
      } else if (diff < -50) {
        prevSlide(); // Swipe right
      }
    };
    
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-softbeige to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Voices of Freedom</h2>
          <p className="text-muted-foreground mt-2">
            Listen to the inspiring words of India's freedom fighters
          </p>
        </div>
        
        <div className="relative" ref={carouselRef}>
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {freedomFightersData.map((fighter) => (
                <Card 
                  key={fighter.id} 
                  className="flex-shrink-0 w-full border shadow-md"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 flex items-center justify-center overflow-hidden">
                        <span className="text-4xl font-bold text-slate-500">
                          {fighter.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-center mb-2">{fighter.name}</h3>
                      <blockquote className="relative text-center">
                        <span className="block text-4xl text-gray-400 leading-none mb-1">"</span>
                        <p className={`text-lg ${fighter.language === 'hi' ? 'font-devanagari' : ''}`}>
                          {fighter.quote}
                        </p>
                        <span className="block text-4xl text-gray-400 leading-none mt-1 text-right">"</span>
                      </blockquote>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center pb-6">
                    <Button
                      onClick={() => handleSpeak(fighter.id, fighter.quote, fighter.language || 'en')}
                      variant={speakingQuoteId === fighter.id ? "default" : "outline"}
                      className={speakingQuoteId === fighter.id ? "bg-saffron hover:bg-saffron/90 text-white" : ""}
                    >
                      {speakingQuoteId === fighter.id ? (
                        <>
                          <VolumeX className="mr-2 h-4 w-4" /> Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" /> Listen
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {freedomFightersData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-saffron' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none md:-translate-x-6"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none md:translate-x-6"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VoicesOfFreedom;
