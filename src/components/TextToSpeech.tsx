
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { SpeechHelper, AudioVisualizer } from '@/lib/speechUtils';
import { LANGUAGES, REGIONS, findVoiceByLang } from '@/data/languageData';
import { Mic, Play, Pause, StopCircle, Download, Copy, Paste } from 'lucide-react';

const TextToSpeech = () => {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [region, setRegion] = useState<string>('');
  
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  const visualizerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<AudioVisualizer | null>(null);
  
  // Load voices when component mounts
  useEffect(() => {
    if (!speechHelper.current.isSupported()) {
      alert("Speech synthesis is not supported in this browser. Please try Chrome, Edge or Safari.");
      return;
    }
    
    const loadVoices = () => {
      const availableVoices = speechHelper.current.getVoices();
      setVoices(availableVoices);
      
      // Try to set an Indian English voice as default
      const indianVoice = availableVoices.find(voice => voice.lang === 'en-IN');
      const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
      setSelectedVoice(indianVoice || englishVoice || (availableVoices.length > 0 ? availableVoices[0] : null));
    };
    
    // Chrome loads voices asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
    
    // Initialize audio visualizer
    if (visualizerRef.current) {
      audioVisualizerRef.current = new AudioVisualizer(visualizerRef.current, 15);
    }
    
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
    };
  }, []);
  
  const handleRegionChange = (selectedRegion: string) => {
    setRegion(selectedRegion);
    
    const regionData = REGIONS.find(r => r.name === selectedRegion);
    if (!regionData) return;
    
    // Set pitch and rate according to region
    setPitch(regionData.pitch);
    setRate(regionData.rate);
    
    // Find a suitable voice for the region
    for (const langCode of regionData.languages) {
      const voice = findVoiceByLang(voices, langCode);
      if (voice) {
        setSelectedVoice(voice);
        break;
      }
    }
  };
  
  const handleVoiceChange = (voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) setSelectedVoice(voice);
  };
  
  const handlePlay = () => {
    if (!text.trim()) return;
    
    speechHelper.current.speak({
      text,
      voice: selectedVoice || undefined,
      rate,
      pitch,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
        if (audioVisualizerRef.current) {
          audioVisualizerRef.current.start();
        }
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (audioVisualizerRef.current) {
          audioVisualizerRef.current.stop();
        }
      },
      onPause: () => {
        setIsPaused(true);
        if (audioVisualizerRef.current) {
          audioVisualizerRef.current.stop();
        }
      },
      onResume: () => {
        setIsPaused(false);
        if (audioVisualizerRef.current) {
          audioVisualizerRef.current.start();
        }
      }
    });
  };
  
  const handlePause = () => {
    speechHelper.current.pause();
    setIsPaused(true);
    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.stop();
    }
  };
  
  const handleResume = () => {
    speechHelper.current.resume();
    setIsPaused(false);
    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.start();
    }
  };
  
  const handleStop = () => {
    speechHelper.current.stop();
    setIsPlaying(false);
    setIsPaused(false);
    if (audioVisualizerRef.current) {
      audioVisualizerRef.current.stop();
    }
  };
  
  const handleDownload = () => {
    speechHelper.current.downloadSpeech(text, selectedVoice, rate, pitch);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };
  
  const handleClear = () => {
    setText('');
  };
  
  return (
    <section id="tts" className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Text to Speech</h2>
          <p className="text-muted-foreground mt-2">
            Convert your text into speech in various Indian languages
          </p>
        </div>
        
        <div className="india-card space-y-6">
          {/* Text input */}
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] text-base"
          />
          
          {/* Visualizer */}
          <div ref={visualizerRef} className="visualizer-container">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="visualizer-bar" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Selection */}
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium mb-2">
                Voice
              </label>
              <Select 
                value={selectedVoice?.voiceURI || ""} 
                onValueChange={handleVoiceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} {voice.lang.includes('-') ? `(${voice.lang.split('-')[0]})` : `(${voice.lang})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Region Selection */}
            <div>
              <label htmlFor="region-select" className="block text-sm font-medium mb-2">
                Regional Preset
              </label>
              <Select 
                value={region} 
                onValueChange={handleRegionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name} India
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Rate Slider */}
            <div>
              <label htmlFor="rate-slider" className="block text-sm font-medium mb-2">
                Rate: {rate.toFixed(1)}
              </label>
              <Slider
                id="rate-slider"
                min={0.1}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={(values) => setRate(values[0])}
              />
            </div>
            
            {/* Pitch Slider */}
            <div>
              <label htmlFor="pitch-slider" className="block text-sm font-medium mb-2">
                Pitch: {pitch.toFixed(1)}
              </label>
              <Slider
                id="pitch-slider"
                min={0.1}
                max={2}
                step={0.1}
                value={[pitch]}
                onValueChange={(values) => setPitch(values[0])}
              />
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!isPlaying ? (
              <Button 
                onClick={handlePlay} 
                className="bg-saffron hover:bg-saffron/90 text-white"
                disabled={!text.trim()}
              >
                <Play className="mr-2 h-4 w-4" /> Listen
              </Button>
            ) : isPaused ? (
              <Button 
                onClick={handleResume} 
                className="bg-saffron hover:bg-saffron/90 text-white"
              >
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
            ) : (
              <Button 
                onClick={handlePause} 
                className="bg-saffron hover:bg-saffron/90 text-white"
              >
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}
            
            <Button 
              onClick={handleStop} 
              className="bg-destructive hover:bg-destructive/90 text-white"
              disabled={!isPlaying}
            >
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
            
            <Button 
              onClick={handleDownload} 
              className="bg-indiangreen hover:bg-indiangreen/90 text-white"
              disabled={!text.trim()}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            
            <Button 
              onClick={handleCopy} 
              variant="outline"
              disabled={!text.trim()}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            
            <Button 
              onClick={handlePaste} 
              variant="outline"
            >
              <Paste className="mr-2 h-4 w-4" /> Paste
            </Button>
            
            <Button 
              onClick={handleClear}
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={!text.trim()}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextToSpeech;
