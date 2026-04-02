export type Category = 'pollutes' | 'cleans' | 'neutral';

export interface AirQualityItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: Category;
  funFact?: string;
  wrongReason?: string;
}

export const ZONES: Record<Category, { name: string; colorClass: string; icon: string }> = {
  pollutes: { name: 'Pollutes Air', colorClass: 'bg-[var(--color-zone-pollutes)] text-white', icon: '🏭' },
  cleans: { name: 'Cleans Air', colorClass: 'bg-[var(--color-zone-cleans)] text-white', icon: '🌿' },
  neutral: { name: 'Neutral / Indoors', colorClass: 'bg-[var(--color-zone-neutral)] text-foreground', icon: '🏠' }
};

export const AIR_ITEMS: AirQualityItem[] = [
  // POLLUTES
  {
    id: 'p1', name: 'Car Exhaust', emoji: '🚗', category: 'pollutes',
    description: 'Emissions from gas-powered vehicles.',
    funFact: 'Vehicle exhaust is a major source of nitrogen oxides (NOx) and particulate matter.',
    wrongReason: 'Gas cars release harmful emissions into the atmosphere.'
  },
  {
    id: 'p2', name: 'Factory Smoke', emoji: '🏭', category: 'pollutes',
    description: 'Industrial emissions from manufacturing.',
    funFact: 'Industrial facilities often release sulfur dioxide, leading to acid rain.',
    wrongReason: 'Factories without scrubbers release massive amounts of air pollution.'
  },
  {
    id: 'p3', name: 'Burning Plastic', emoji: '🔥', category: 'pollutes',
    description: 'Disposing of synthetic waste by fire.',
    funFact: 'Burning plastic releases highly toxic chemicals like dioxins into the air.',
    wrongReason: 'Never burn plastic! It releases severe toxic pollutants.'
  },
  {
    id: 'p4', name: 'Coal Power Plant', emoji: '⚡', category: 'pollutes',
    description: 'Generating electricity by burning coal.',
    funFact: 'Coal plants are the top source of carbon dioxide (CO2) emissions globally.',
    wrongReason: 'Coal is one of the dirtiest energy sources for air quality.'
  },
  {
    id: 'p5', name: 'Open Trash Burning', emoji: '🗑️', category: 'pollutes',
    description: 'Burning municipal waste outdoors.',
    funFact: 'Open trash burning is one of the top sources of black carbon (soot) globally!',
    wrongReason: 'Burning trash releases untreated smoke and toxic particulates.'
  },
  {
    id: 'p6', name: 'Cigarette Smoke', emoji: '🚬', category: 'pollutes',
    description: 'Second-hand tobacco smoke.',
    funFact: 'Cigarette smoke contains over 7,000 chemicals, 70 of which cause cancer!',
    wrongReason: 'Smoking severely pollutes immediate air spaces with toxins.'
  },
  {
    id: 'p7', name: 'Diesel Truck', emoji: '🚛', category: 'pollutes',
    description: 'Heavy duty transport vehicles.',
    funFact: 'Older diesel engines emit large amounts of dangerous microscopic soot (PM2.5).',
    wrongReason: 'Diesel engines are heavy polluters of particulate matter.'
  },
  {
    id: 'p8', name: 'Crop Burning', emoji: '🌾', category: 'pollutes',
    description: 'Clearing agricultural fields with fire.',
    funFact: 'Crop burning releases toxic particulates that can travel hundreds of miles!',
    wrongReason: 'Large-scale burning creates massive smoke clouds affecting entire regions.'
  },

  // CLEANS
  {
    id: 'c1', name: 'Planting Trees', emoji: '🌳', category: 'cleans',
    description: 'Adding greenery to environments.',
    funFact: 'Trees absorb CO2 and release oxygen — one tree absorbs ~21kg of CO2 per year!',
    wrongReason: 'Trees are nature\'s air purifiers, they do not pollute!'
  },
  {
    id: 'c2', name: 'Solar Panels', emoji: '☀️', category: 'cleans',
    description: 'Harvesting energy from the sun.',
    funFact: 'Solar panels on 1 house can offset 1-4 tonnes of CO2 per year compared to grid power!',
    wrongReason: 'Solar power produces zero emissions while operating.'
  },
  {
    id: 'c3', name: 'Wind Turbines', emoji: '💨', category: 'cleans',
    description: 'Generating power from wind.',
    funFact: 'Wind turbines generate clean energy with zero operational emissions!',
    wrongReason: 'Wind power replaces dirty fossil fuels, cleaning the air.'
  },
  {
    id: 'c4', name: 'Electric Car', emoji: '🔋', category: 'cleans',
    description: 'Driving a zero-tailpipe-emission vehicle.',
    funFact: 'Switching to an electric car can reduce your transport emissions by up to 70%!',
    wrongReason: 'EVs have no exhaust, actively reducing street-level pollution.'
  },
  {
    id: 'c5', name: 'Cycling', emoji: '🚴', category: 'cleans',
    description: 'Using human-powered transport.',
    funFact: 'Cycling for 10km instead of driving prevents ~2.6kg of CO2 emissions!',
    wrongReason: 'Bikes produce zero emissions and reduce traffic smog.'
  },
  {
    id: 'c6', name: 'Public Bus', emoji: '🚌', category: 'cleans',
    description: 'Taking mass transit instead of driving.',
    funFact: 'One full bus can take 40 cars off the road, drastically reducing local smog.',
    wrongReason: 'Mass transit lowers the overall pollution per person.'
  },
  {
    id: 'c7', name: 'Rooftop Garden', emoji: '🌻', category: 'cleans',
    description: 'Growing plants on city buildings.',
    funFact: 'Rooftop plants filter city air and reduce the urban heat island effect!',
    wrongReason: 'Plants capture airborne dust and absorb CO2.'
  },
  {
    id: 'c8', name: 'Mangrove Forests', emoji: '🌴', category: 'cleans',
    description: 'Coastal wetland ecosystems.',
    funFact: 'Mangroves store up to 4x more carbon per hectare than tropical rainforests!',
    wrongReason: 'Mangroves are incredible carbon sinks that clean the atmosphere.'
  },

  // NEUTRAL
  {
    id: 'n1', name: 'Reading a Book', emoji: '📚', category: 'neutral',
    description: 'Enjoying literature at home.',
    funFact: 'Reading is great for your brain, but has no direct effect on outdoor air quality.',
    wrongReason: 'This activity doesn\'t release or capture outdoor emissions.'
  },
  {
    id: 'n2', name: 'Drinking Water', emoji: '💧', category: 'neutral',
    description: 'Staying hydrated.',
    funFact: 'Essential for life, but neutral for the atmosphere!',
    wrongReason: 'Drinking water doesn\'t change the air quality.'
  },
  {
    id: 'n3', name: 'Sleeping', emoji: '😴', category: 'neutral',
    description: 'Getting a good night\'s rest.',
    funFact: 'While sleeping, you exhale trace amounts of CO2, but it\'s part of the natural carbon cycle.',
    wrongReason: 'Sleeping is a natural biological process, not an air polluter.'
  },
  {
    id: 'n4', name: 'Eating Vegetables', emoji: '🥦', category: 'neutral',
    description: 'Consuming plant-based food.',
    funFact: 'Eating veggies has a lower carbon footprint than meat, but the act of eating is neutral.',
    wrongReason: 'Eating itself doesn\'t alter outdoor air composition.'
  },
  {
    id: 'n5', name: 'Indoor Plant', emoji: '🪴', category: 'neutral',
    description: 'Keeping a pothos or snake plant.',
    funFact: 'Indoor plants improve indoor air quality slightly, but don\'t affect outdoor smog.',
    wrongReason: 'Its impact is localized to your living room, not the city air.'
  },
  {
    id: 'n6', name: 'Writing', emoji: '📝', category: 'neutral',
    description: 'Jotting down notes.',
    funFact: 'Using a pencil and paper is completely neutral to the atmosphere.',
    wrongReason: 'Writing doesn\'t generate emissions or clean the air.'
  },
  {
    id: 'n7', name: 'Yoga', emoji: '🧘', category: 'neutral',
    description: 'Stretching and breathing exercises.',
    funFact: 'Deep breathing is great if the air is clean, but yoga itself doesn\'t clean the air!',
    wrongReason: 'Exercise doesn\'t change the atmospheric composition.'
  },
  {
    id: 'n8', name: 'Listening to Music', emoji: '🎵', category: 'neutral',
    description: 'Enjoying tunes on headphones.',
    funFact: 'Sound waves travel through air, but they don\'t pollute or clean it.',
    wrongReason: 'Music has no chemical effect on the air.'
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
