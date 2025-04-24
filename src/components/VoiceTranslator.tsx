
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpeechHelper, SpeechRecognitionHelper, translateText } from '@/lib/speechUtils';
import { TRANSLATION_LANGUAGES, findVoiceByLang } from '@/data/languageData';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceTranslator = () => {
  const [fromLanguage, setFromLanguage] = useState<string>('en');
  const [toLanguage, setToLanguage] = useState<string>('hi');
  const [originalText, setOriginalText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const speechHelper = useRef<SpeechHelper>(new SpeechHelper());
  const recognitionHelper = useRef<SpeechRecognitionHelper>(new SpeechRecognitionHelper());
  
  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechHelper.current.getVoices();
      setVoices(availableVoices);
    };
    
    // Chrome loads voices asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
    
    return () => {
      if (speechHelper.current) {
        speechHelper.current.stop();
      }
      if (recognitionHelper.current) {
        recognitionHelper.current.stopListening();
      }
    };
  }, []);
  
  // Handle speech recognition
  const handleStartListening = () => {
    if (!recognitionHelper.current.isSupported()) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    
    setIsListening(true);
    setOriginalText('');
    setTranslatedText('');
    
    const languageCode = fromLanguage;
    recognitionHelper.current.startListening(
      languageCode,
      (text, isFinal) => {
        setOriginalText(text);
        
        if (isFinal) {
          handleTranslate(text);
        }
      },
      () => {
        setIsListening(false);
      }
    );
  };
  
  const handleStopListening = () => {
    recognitionHelper.current.stopListening();
    setIsListening(false);
  };
  
  // Handle translation
  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(text, fromLanguage, toLanguage);
      setTranslatedText(translated);
      speakTranslation(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation error occurred. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Speak translated text
  const speakTranslation = (text: string) => {
    const targetVoice = findVoiceByLang(voices, toLanguage);
    
    speechHelper.current.speak({
      text,
      voice: targetVoice || undefined,
      rate: 1,
      pitch: 1,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };
  
  const handleStopSpeaking = () => {
    speechHelper.current.stop();
    setIsSpeaking(false);
  };
  
  return (
    <section id="translator" className="py-16 px-4 md:px-6 bg-gradient-to-b from-white to-softbeige">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Voice Translator</h2>
          <p className="text-muted-foreground mt-2">
            Speak in one language, hear it in another
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* From Language */}
          <div>
            <label htmlFor="from-language" className="block text-sm font-medium mb-2">
              From Language
            </label>
            <Select 
              value={fromLanguage} 
              onValueChange={setFromLanguage}
              disabled={isListening}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* To Language */}
          <div>
            <label htmlFor="to-language" className="block text-sm font-medium mb-2">
              To Language
            </label>
            <Select 
              value={toLanguage} 
              onValueChange={setToLanguage}
              disabled={isListening}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Speak Button */}
        <div className="flex justify-center mb-8">
          {!isListening ? (
            <Button 
              onClick={handleStartListening}
              className="purple-button"
              size="lg"
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
            </Button>
          ) : (
            <Button 
              onClick={handleStopListening}
              variant="destructive"
              size="lg"
            >
              <MicOff className="mr-2 h-5 w-5" />
              Stop Speaking
            </Button>
          )}
        </div>
        
        {/* Text Display Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                Original Text 
                {isListening && (
                  <span className="ml-2 inline-flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[100px]">
                {originalText || (isListening ? "Listening..." : "Your speech will appear here...")}
              </div>
            </CardContent>
          </Card>
          
          {/* Translated Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Translated Text</span>
                {isSpeaking && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleStopSpeaking}
                    className="h-8 px-2"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[100px] relative">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="spinner"></div>
                    <span className="ml-2">Translating...</span>
                  </div>
                ) : translatedText ? (
                  <>
                    <p>{translatedText}</p>
                    {!isSpeaking && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => speakTranslation(translatedText)}
                        className="mt-2"
                      >
                        <Volume2 className="mr-1 h-4 w-4" /> Listen
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">Translation will appear here...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Note: Voice recognition works best in Chrome or Edge browsers. 
            For optimal translation results, speak clearly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VoiceTranslator;
