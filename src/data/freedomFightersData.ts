
export interface FreedomFighter {
  id: string;
  name: string;
  quote: string;
  imageUrl?: string;
  language?: string;
}

export const freedomFightersData: FreedomFighter[] = [
  {
    id: 'ff1',
    name: 'Mahatma Gandhi',
    quote: 'In a gentle way, you can shake the world.',
    language: 'en',
  },
  {
    id: 'ff2',
    name: 'Subhas Chandra Bose',
    quote: 'तुम मुझे खून दो, मैं तुम्हें आज़ादी दूंगा। (Give me blood, and I shall give you freedom.)',
    language: 'hi',
  },
  {
    id: 'ff3',
    name: 'Bhagat Singh',
    quote: 'जिंदगी तो गुलामी में मौत ही है, असली जिंदगी आजादी में ही है। (Life in slavery is like death, real life only exists in freedom.)',
    language: 'hi',
  },
  {
    id: 'ff4',
    name: 'Sarojini Naidu',
    quote: 'We want deeper sincerity of motive, a greater courage in speech and earnestness in action.',
    language: 'en',
  },
  {
    id: 'ff5',
    name: 'Lal Bahadur Shastri',
    quote: 'जय जवान जय किसान। (Hail the soldier, Hail the farmer.)',
    language: 'hi',
  },
  {
    id: 'ff6',
    name: 'Dr. B.R. Ambedkar',
    quote: 'I measure the progress of a community by the degree of progress which women have achieved.',
    language: 'en',
  }
];
