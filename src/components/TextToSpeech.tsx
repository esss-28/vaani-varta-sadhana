
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
import { Mic, Play, Pause, StopCircle, Download, Copy, ClipboardPaste, AudioLines } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToSpeech = () => {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [region, setRegion] = useState<string>('');
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);
  
  const { toast } = useToast();
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  const visualizerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<AudioVisualizer | null>(null);
  
  useEffect(() => {
    if (!speechHelper.current.isSupported()) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support speech synthesis. Please try Chrome, Edge or Safari.",
        variant: "destructive",
      });
      return;
    }
    
    const loadVoices = () => {
      const availableVoices = speechHelper.current.getVoices();
      
      if (availableVoices.length === 0) {
        console.log("No voices available yet, retrying in 100ms...");
        setTimeout(loadVoices, 100);
        return;
      }
      
      console.log(`Found ${availableVoices.length} voices`);
      setVoices(availableVoices);
      setVoicesLoaded(true);
      
      const hindiVoice = availableVoices.find(voice => voice.lang === 'hi-IN');
      const indianEnglishVoice = availableVoices.find(voice => voice.lang === 'en-IN');
      const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
      
      const defaultVoice = hindiVoice || indianEnglishVoice || englishVoice || availableVoices[0];
      if (defaultVoice) {
        console.log('Selected default voice:', defaultVoice.name, defaultVoice.lang);
        setSelectedVoice(defaultVoice);
      }
    };
    
    loadVoices();
    
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    if (visualizerRef.current) {
      audioVisualizerRef.current = new AudioVisualizer(visualizerRef.current, 15);
    }
    
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
      if (audioVisualizerRef.current) {
        audioVisualizerRef.current.stop();
      }
    };
  }, [toast]);
  
  const handleRegionChange = (selectedRegion: string) => {
    setRegion(selectedRegion);
    
    const regionData = REGIONS.find(r => r.name === selectedRegion);
    if (!regionData) return;
    
    setPitch(regionData.pitch);
    setRate(regionData.rate);
    
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
    
    console.log("Playing speech with voice:", selectedVoice?.name);
    
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
    toast({ 
      title: "Copied to clipboard",
      description: "Text has been copied to clipboard"
    });
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({ 
        title: "Text pasted",
        description: "Text has been pasted from clipboard"
      });
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast({ 
        title: "Paste failed",
        description: "Failed to read from clipboard. Please check browser permissions.",
        variant: "destructive"
      });
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
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] text-base"
          />
          
          <div className="relative overflow-hidden">
            <div ref={visualizerRef} className="visualizer-container">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="visualizer-bar" />
              ))}
            </div>
            {isPlaying && (
              <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                <AudioLines className="h-4 w-4 text-indiangreen animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium mb-2">
                Voice {!voicesLoaded && "(Loading voices...)"}
              </label>
              <Select 
                value={selectedVoice?.voiceURI || ""} 
                onValueChange={handleVoiceChange}
                disabled={voices.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={voicesLoaded ? "Select a voice" : "Loading voices..."} />
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
              <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
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
