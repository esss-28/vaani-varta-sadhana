
export interface IndianState {
  id: string;
  name: string;
  officialLanguage: string;
  officialLanguageCode: string;
  otherLanguages: string[];
  culturalNote: string;
  sampleText: string;
}

export const indianStates: IndianState[] = [
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    officialLanguage: "Telugu",
    officialLanguageCode: "te",
    otherLanguages: ["Urdu"],
    culturalNote: "Known for classical dance form Kuchipudi and temples of Tirupati",
    sampleText: "ఆంధ్రప్రదేశ్ నుండి శుభాకాంక్షలు!"
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    officialLanguage: "English",
    officialLanguageCode: "en",
    otherLanguages: ["Nyishi", "Adi", "Galo"],
    culturalNote: "Land of the dawn-lit mountains with over 26 major tribes",
    sampleText: "Greetings from the land of rising sun!"
  },
  {
    id: "assam",
    name: "Assam",
    officialLanguage: "Assamese",
    officialLanguageCode: "bn", // Using Bengali as proxy since Assamese may not be available
    otherLanguages: ["Bengali", "Bodo"],
    culturalNote: "Famous for Assam tea, one-horned rhinos and Bihu festival",
    sampleText: "অসম ৰ পৰা শুভেচ্ছা!"
  },
  {
    id: "bihar",
    name: "Bihar",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Urdu", "Maithili"],
    culturalNote: "Birthplace of Buddhism and home to ancient Nalanda University",
    sampleText: "बिहार से नमस्कार!"
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Chhattisgarhi"],
    culturalNote: "Known for tribal culture, dense forests and Bastar art",
    sampleText: "छत्तीसगढ़ से नमस्कार!"
  },
  {
    id: "goa",
    name: "Goa",
    officialLanguage: "Konkani",
    officialLanguageCode: "mr", // Using Marathi as proxy
    otherLanguages: ["Marathi", "Portuguese"],
    culturalNote: "Famous for beaches, Portuguese architecture and Carnival",
    sampleText: "गोंय वटेन यमया!"
  },
  {
    id: "gujarat",
    name: "Gujarat",
    officialLanguage: "Gujarati",
    officialLanguageCode: "gu",
    otherLanguages: ["Hindi"],
    culturalNote: "Known for Garba dance, textiles and business acumen",
    sampleText: "ગુજરાત તરફથી નમસ્તે!"
  },
  {
    id: "haryana",
    name: "Haryana",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Haryanvi", "Punjabi"],
    culturalNote: "Land of the Mahabharata and rich agricultural tradition",
    sampleText: "हरियाणा से राम राम!"
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Pahari", "Kangri"],
    culturalNote: "Known as 'Dev Bhoomi' or Land of Gods with beautiful Himalayan landscapes",
    sampleText: "हिमाचल प्रदेश से नमस्कार!"
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Santhali", "Bengali"],
    culturalNote: "Rich in minerals and tribal heritage with Sohrai and Khovar painting traditions",
    sampleText: "झारखंड से प्रणाम!"
  },
  {
    id: "karnataka",
    name: "Karnataka",
    officialLanguage: "Kannada",
    officialLanguageCode: "kn",
    otherLanguages: ["Tulu", "Konkani"],
    culturalNote: "Known for Carnatic music, silk sarees and IT industry",
    sampleText: "ಕರ್ನಾಟಕದಿಂದ ನಮಸ್ಕಾರ!"
  },
  {
    id: "kerala",
    name: "Kerala",
    officialLanguage: "Malayalam",
    officialLanguageCode: "ml",
    otherLanguages: ["Tamil"],
    culturalNote: "Known as God's Own Country with backwaters, Kathakali and Ayurveda",
    sampleText: "കേരളത്തിൽ നിന്ന് നമസ്കാരം!"
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Malvi", "Nimadi"],
    culturalNote: "Heart of India with Khajuraho temples and rich tribal heritage",
    sampleText: "मध्य प्रदेश से नमस्कार!"
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    officialLanguage: "Marathi",
    officialLanguageCode: "mr",
    otherLanguages: ["Hindi", "Urdu"],
    culturalNote: "Home to Bollywood, Warli art and lavani dance form",
    sampleText: "महाराष्ट्रातून नमस्कार!"
  },
  {
    id: "manipur",
    name: "Manipur",
    officialLanguage: "Meiteilon (Manipuri)",
    officialLanguageCode: "bn", // Using Bengali as proxy
    otherLanguages: ["English"],
    culturalNote: "Known for Manipuri classical dance and phumdis of Loktak Lake",
    sampleText: "মণিপুর থেকে নমস্কার"
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    officialLanguage: "English",
    officialLanguageCode: "en",
    otherLanguages: ["Khasi", "Garo"],
    culturalNote: "Known as the abode of clouds with living root bridges",
    sampleText: "Greetings from the abode of clouds!"
  },
  {
    id: "mizoram",
    name: "Mizoram",
    officialLanguage: "Mizo",
    officialLanguageCode: "en", // Using English as proxy
    otherLanguages: ["English"],
    culturalNote: "Known for bamboo dance Cheraw and vibrant Chapchar Kut festival",
    sampleText: "Greetings from the land of the Mizos!"
  },
  {
    id: "nagaland",
    name: "Nagaland",
    officialLanguage: "English",
    officialLanguageCode: "en",
    otherLanguages: ["Naga languages"],
    culturalNote: "Land of festivals with the famous Hornbill Festival",
    sampleText: "Greetings from the land of festivals!"
  },
  {
    id: "odisha",
    name: "Odisha",
    officialLanguage: "Odia",
    officialLanguageCode: "or",
    otherLanguages: ["Hindi", "Telugu"],
    culturalNote: "Known for Jagannath Temple, Odissi dance and appliqué work",
    sampleText: "ଓଡ଼ିଶାରୁ ନମସ୍କାର!"
  },
  {
    id: "punjab",
    name: "Punjab",
    officialLanguage: "Punjabi",
    officialLanguageCode: "pa",
    otherLanguages: ["Hindi"],
    culturalNote: "Land of five rivers, known for bhangra dance and Golden Temple",
    sampleText: "ਪੰਜਾਬ ਤੋਂ ਸਤ ਸ੍ਰੀ ਅਕਾਲ!"
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Rajasthani", "Marwari"],
    culturalNote: "Known for majestic forts, colorful attire and desert culture",
    sampleText: "राजस्थान से पधारो म्हारे देश!"
  },
  {
    id: "sikkim",
    name: "Sikkim",
    officialLanguage: "English",
    officialLanguageCode: "en",
    otherLanguages: ["Nepali", "Sikkimese"],
    culturalNote: "Small Himalayan state known for monasteries and Mount Kanchenjunga",
    sampleText: "Greetings from Sikkim!"
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    officialLanguage: "Tamil",
    officialLanguageCode: "ta",
    otherLanguages: ["English"],
    culturalNote: "Known for Dravidian temple architecture, classical Bharatanatyam and rich literature",
    sampleText: "தமிழ்நாட்டிலிருந்து வணக்கம்!"
  },
  {
    id: "telangana",
    name: "Telangana",
    officialLanguage: "Telugu",
    officialLanguageCode: "te",
    otherLanguages: ["Urdu"],
    culturalNote: "Known for Kakatiya architecture and Bathukamma festival",
    sampleText: "తెలంగాణ నుండి నమస్కారం!"
  },
  {
    id: "tripura",
    name: "Tripura",
    officialLanguage: "Bengali",
    officialLanguageCode: "bn",
    otherLanguages: ["Kokborok"],
    culturalNote: "Known for bamboo handicrafts and vibrant tribal culture",
    sampleText: "ত্রিপুরা থেকে নমস্কার!"
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Urdu", "Awadhi"],
    culturalNote: "Land of the Taj Mahal, holy city of Varanasi and rich cultural heritage",
    sampleText: "उत्तर प्रदेश से नमस्कार!"
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    officialLanguage: "Hindi",
    officialLanguageCode: "hi",
    otherLanguages: ["Garhwali", "Kumaoni"],
    culturalNote: "Known as Dev Bhoomi (Land of Gods) with Himalayan pilgrimage sites",
    sampleText: "उत्तराखंड से नमस्कार!"
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    officialLanguage: "Bengali",
    officialLanguageCode: "bn",
    otherLanguages: ["Hindi", "Nepali"],
    culturalNote: "Known for Rabindra Sangeet, sweets and Durga Puja festival",
    sampleText: "পশ্চিমবঙ্গ থেকে নমস্কার!"
  }
];
