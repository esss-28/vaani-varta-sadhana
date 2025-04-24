
export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  sampleText: string;
  language: string;
  imageUrl?: string;
}

export const literatureData: CulturalItem[] = [
  {
    id: 'lit1',
    title: 'Ramayana',
    description: 'An ancient Indian epic poem which narrates the struggle of the divine prince Rama to rescue his wife Sita from the demon king Ravana.',
    sampleText: 'धर्मो रक्षति रक्षितः। (Dharmo rakshati rakshitah) - Righteousness protects those who protect it.',
    language: 'hi',
  },
  {
    id: 'lit2',
    title: 'Gitanjali',
    description: 'A collection of poems by Rabindranath Tagore, the first non-European to win the Nobel Prize in Literature.',
    sampleText: 'যেখানে থাকে সকলের মন ভয়শূন্য। (Where the mind is without fear)',
    language: 'bn',
  },
  {
    id: 'lit3',
    title: 'Thirukkural',
    description: 'A classic Tamil text consisting of 1,330 couplets dealing with the everyday virtues of an individual.',
    sampleText: 'அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு.',
    language: 'ta',
  },
  {
    id: 'lit4',
    title: 'Sahir Ludhianvi\'s Poetry',
    description: 'Known for his soulful and impactful lyrics in Hindi films, Sahir\'s work often reflected social issues.',
    sampleText: 'ये दुनिया अगर मिल भी जाए तो क्या है।',
    language: 'hi',
  }
];

export const scriptsData: CulturalItem[] = [
  {
    id: 'script1',
    title: 'Devanagari',
    description: 'Used to write Hindi, Marathi, and several other languages. It\'s a descendant of the Brahmi script.',
    sampleText: 'नमस्ते। मैं भारत से हूँ।',
    language: 'hi',
  },
  {
    id: 'script2',
    title: 'Bengali Script',
    description: 'Used to write Bengali and several other languages in eastern India. It has a distinctive horizontal line at the top.',
    sampleText: 'নমস্কার। আমি ভারত থেকে এসেছি।',
    language: 'bn',
  },
  {
    id: 'script3',
    title: 'Telugu Script',
    description: 'Known for its circular shapes, the Telugu script is used primarily for the Telugu language in Andhra Pradesh and Telangana.',
    sampleText: 'నమస్కారం. నేను భారతదేశం నుండి వచ్చాను.',
    language: 'te',
  },
  {
    id: 'script4',
    title: 'Tamil Script',
    description: 'One of the oldest scripts still in use, dating back to at least the 3rd century BCE.',
    sampleText: 'வணக்கம். நான் இந்தியாவிலிருந்து வந்துள்ளேன்.',
    language: 'ta',
  }
];

export const festivalsData: CulturalItem[] = [
  {
    id: 'fest1',
    title: 'Diwali',
    description: 'The festival of lights, celebrated by Hindus, Jains, and Sikhs. Symbolizes the victory of light over darkness.',
    sampleText: 'दीपावली की हार्दिक शुभकामनाएं!',
    language: 'hi',
  },
  {
    id: 'fest2',
    title: 'Durga Puja',
    description: 'A major festival in Bengal celebrating the goddess Durga\'s victory over the demon Mahishasura.',
    sampleText: 'শুভ দুর্গা পূজা!',
    language: 'bn',
  },
  {
    id: 'fest3',
    title: 'Pongal',
    description: 'A harvest festival celebrated in Tamil Nadu, dedicated to the Sun God.',
    sampleText: 'இனிய பொங்கல் நல்வாழ்த்துக்கள்!',
    language: 'ta',
  },
  {
    id: 'fest4',
    title: 'Onam',
    description: 'Annual Harvest festival in Kerala celebrating the homecoming of the mythical King Mahabali.',
    sampleText: 'ഹാർദ്ദിക ഓണാശംസകൾ!',
    language: 'ml',
  }
];

export const proverbsData: CulturalItem[] = [
  {
    id: 'proverb1',
    title: 'Hindi Proverb',
    description: 'Common saying that teaches a lesson about self-reliance.',
    sampleText: 'अपना हाथ जगन्नाथ। (Your own hands are your God)',
    language: 'hi',
  },
  {
    id: 'proverb2',
    title: 'Bengali Proverb',
    description: 'About the importance of patience and persistence.',
    sampleText: 'ধীরে চলো, দূর যাও। (Go slow, go far)',
    language: 'bn',
  },
  {
    id: 'proverb3',
    title: 'Tamil Proverb',
    description: 'Emphasizes the value of learning continuously.',
    sampleText: 'கற்றது கைமண் அளவு, கல்லாதது உலகளவு.',
    language: 'ta',
  },
  {
    id: 'proverb4',
    title: 'Gujarati Proverb',
    description: 'About the importance of maintaining peace in life.',
    sampleText: 'જ્યાં વાદ નહિ ત્યાં પ્રસાદ.',
    language: 'gu',
  }
];
