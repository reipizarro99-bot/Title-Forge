
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
  ROYALTY = 'Royalty',
  ELITE = 'Elite',
  EXOTIC = 'Exotic',
  SECRET = 'Secret',
  DIVINE = 'Divine',
  FABLED = 'Fabled',
  TRANSCENDENTAL = 'Transcendental',
  COSMIC = 'Cosmic',
  CHAOS = 'Chaos'
}

export enum MutationType {
  NONE = 'None',
  GLITCHED = 'Glitched',
  VOID_SCARRED = 'Void-Scarred',
  SOLAR_FLARE = 'Solar Flare',
  SPECTRAL = 'Spectral',
  ANCIENT_DUST = 'Ancient Dust',
  FROZEN_TIME = 'Frozen Time',
  CORRUPTED = 'Corrupted',
  BLOOD_MOON = 'Blood Moon',
  QUANTUM_STUTTER = 'Quantum Stutter',
  HOLLOW = 'Hollow',
  RADIANT = 'Radiant',
  SINGULARITY = 'Singularity',
  MOLTEN = 'Molten',
  VERDANT = 'Verdant',
  ECHOING = 'Echoing',
  KINETIC = 'Kinetic',
  ABYSSAL = 'Abyssal',
  PRISMATIC = 'Prismatic',
  CYBERNETIC = 'Cybernetic',
  NULL_POINTER = 'Null Pointer'
}

export interface Mutation {
  type: MutationType;
  color: string;
  effectClass: string;
  valueMultiplier: number;
}

export interface Word {
  text: string;
  rarity: Rarity;
  column: 0 | 1 | 2;
}

export interface Title {
  id: string;
  words: [Word, Word, Word];
  rarity: Rarity;
  isPurity: boolean;
  isSynergy: boolean; // New: Flag for lore-connected words
  value: number;
  history?: string;
  seed: string;
  timestamp: number;
  world: number;
  mutation?: Mutation;
}

export interface Weapon {
  id: string;
  name: string;
  rarity: Rarity;
  damage: number;
  attackSpeed: number;
  mutation?: Mutation;
}

export interface PlayerState {
  glyphs: number;
  astralShards: number;
  cosmicEssence: number;
  inventory: Title[];
  arsenal: Weapon[];
  equippedId: string | null;
  equippedWeaponId: string | null;
  baseHealth: number;
  maxBaseHealth: number;
  charms: {
    luck: number;
    purity: number;
    synergy: number;
  };
  materials: number;
  settings: {
    soundVolume: number;
    uiAnimations: boolean;
    username: string;
  };
  currentWorld: number;
  unlockedWorlds: number[];
}

export interface MarketTrend {
  rarity: Rarity;
  multiplier: number;
  direction: 'up' | 'down' | 'stable';
}
