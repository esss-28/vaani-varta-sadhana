
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpeechHelper } from '@/lib/speechUtils';
import { literatureData, scriptsData, festivalsData, proverbsData, CulturalItem } from '@/data/culturalData';
import { findVoiceByLang } from '@/data/languageData';
import { Volume2 } from 'lucide-react';

const CulturalTabs = () => {
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);
  const speechHelper = new SpeechHelper();
  
  const handleSpeak = (item: CulturalItem) => {
    if (!speechHelper.isSupported()) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    
    // If already speaking this item, stop it
    if (speakingItemId === item.id) {
      speechHelper.stop();
      setSpeakingItemId(null);
      return;
    }
    
    // Stop any other speech first
    speechHelper.stop();
    
    // Find a suitable voice for the item's language
    const voices = speechHelper.getVoices();
    const voice = findVoiceByLang(voices, item.language);
    
    // Speak the sample text
    speechHelper.speak({
      text: item.sampleText,
      voice: voice || undefined,
      onStart: () => setSpeakingItemId(item.id),
      onEnd: () => setSpeakingItemId(null)
    });
  };
  
  const renderCards = (items: CulturalItem[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-lg ${item.language === 'hi' ? 'font-devanagari' : item.language === 'bn' ? 'font-bangla' : item.language === 'ta' ? 'font-tamil' : item.language === 'te' ? 'font-telugu' : ''}`}>
                {item.sampleText}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSpeak(item)}
                variant={speakingItemId === item.id ? "default" : "outline"}
                className={speakingItemId === item.id ? "bg-deeppurple hover:bg-deeppurple/90" : ""}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                {speakingItemId === item.id ? "Stop" : "Listen to Sample"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <section id="cultural" className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Cultural Heritage</h2>
          <p className="text-muted-foreground mt-2">
            Explore the rich cultural diversity of India through its languages
          </p>
        </div>
        
        <Tabs defaultValue="literature" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
            <TabsTrigger value="literature">Literature</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="proverbs">Proverbs</TabsTrigger>
          </TabsList>
          <TabsContent value="literature">
            {renderCards(literatureData)}
          </TabsContent>
          <TabsContent value="scripts">
            {renderCards(scriptsData)}
          </TabsContent>
          <TabsContent value="festivals">
            {renderCards(festivalsData)}
          </TabsContent>
          <TabsContent value="proverbs">
            {renderCards(proverbsData)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default CulturalTabs;
