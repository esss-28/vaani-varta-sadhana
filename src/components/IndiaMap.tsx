
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SpeechHelper } from '@/lib/speechUtils';
import { indianStates, IndianState } from '@/data/indiaMapData';
import { findVoiceByLang } from '@/data/languageData';
import { Volume2 } from 'lucide-react';

const IndiaMap = () => {
  const [activeState, setActiveState] = useState<IndianState | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  
  const handleStateHover = (stateId: string, event: React.MouseEvent) => {
    const state = indianStates.find(s => s.id === stateId);
    if (!state) return;
    
    setActiveState(state);
    
    if (tooltipRef.current && mapContainerRef.current) {
      const mapRect = mapContainerRef.current.getBoundingClientRect();
      const x = event.clientX - mapRect.left;
      const y = event.clientY - mapRect.top;
      
      setTooltipPosition({ x, y });
      setTooltipVisible(true);
    }
  };
  
  const handleStateLeave = () => {
    if (!tooltipRef.current?.contains(document.activeElement)) {
      setTimeout(() => {
        if (!tooltipRef.current?.matches(':hover')) {
          setTooltipVisible(false);
        }
      }, 300);
    }
  };
  
  const handleTooltipMouseEnter = () => {
    setTooltipVisible(true);
  };
  
  const handleTooltipMouseLeave = () => {
    setTooltipVisible(false);
  };
  
  const handleSpeak = () => {
    if (!activeState) return;
    
    speechHelper.current.stop();
    
    const voices = speechHelper.current.getVoices();
    const voice = findVoiceByLang(voices, activeState.officialLanguageCode);
    
    speechHelper.current.speak({
      text: activeState.sampleText,
      voice: voice || undefined,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false)
    });
  };
  
  useEffect(() => {
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
    };
  }, []);
  
  return (
    <section id="map" className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Linguistic Map of India</h2>
          <p className="text-muted-foreground mt-2">
            Explore the diverse languages across Indian states
          </p>
        </div>
        
        <div className="relative india-card p-0 overflow-hidden" ref={mapContainerRef}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {indianStates.map((state) => (
              <button
                key={state.id}
                className="text-sm p-2 border rounded hover:bg-gray-200 focus:outline-none"
                onMouseEnter={(e) => handleStateHover(state.id, e)}
                onMouseLeave={handleStateLeave}
              >
                {state.name}
              </button>
            ))}
          </div>
          
          <div 
            ref={tooltipRef} 
            className={`map-tooltip ${tooltipVisible ? 'visible' : ''}`}
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            {activeState && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{activeState.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <span className="font-medium">Official Language:</span>
                  <span>{activeState.officialLanguage}</span>
                  
                  <span className="font-medium">Other Languages:</span>
                  <span>{activeState.otherLanguages.join(', ')}</span>
                </div>
                <p className="text-sm mt-2">{activeState.culturalNote}</p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="w-full bg-indiangreen hover:bg-indiangreen/90"
                  >
                    <Volume2 className="mr-1 h-4 w-4" />
                    {speaking ? 'Speaking...' : 'Hear Sample'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            India is home to 22 officially recognized languages and hundreds of dialects.
            <br />
            Hover over a state to learn about its linguistic heritage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndiaMap;
