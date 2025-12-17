
import React from 'react';
import { Rarity, MutationType, Mutation } from './types';

export const RARITY_CONFIG: Record<Rarity, { 
  color: string; 
  bg: string; 
  shadow: string; 
  weight: number; 
  multiplier: number;
  label: string;
}> = {
  [Rarity.COMMON]: { color: '#9ca3af', bg: 'bg-gray-400', shadow: 'shadow-gray-500/50', weight: 1000, multiplier: 1, label: 'Common' },
  [Rarity.UNCOMMON]: { color: '#4ade80', bg: 'bg-green-400', shadow: 'shadow-green-500/50', weight: 400, multiplier: 3, label: 'Uncommon' },
  [Rarity.RARE]: { color: '#60a5fa', bg: 'bg-blue-400', shadow: 'shadow-blue-500/50', weight: 150, multiplier: 10, label: 'Rare' },
  [Rarity.EPIC]: { color: '#c084fc', bg: 'bg-purple-400', shadow: 'shadow-purple-500/50', weight: 60, multiplier: 25, label: 'Epic' },
  [Rarity.LEGENDARY]: { color: '#facc15', bg: 'bg-yellow-400', shadow: 'shadow-yellow-500/50', weight: 25, multiplier: 100, label: 'Legendary' },
  [Rarity.MYTHIC]: { color: '#fb923c', bg: 'bg-orange-400', shadow: 'shadow-orange-500/50', weight: 10, multiplier: 250, label: 'Mythic' },
  [Rarity.ROYALTY]: { color: '#f87171', bg: 'bg-red-400', shadow: 'shadow-red-500/50', weight: 5, multiplier: 750, label: 'Royalty' },
  [Rarity.ELITE]: { color: '#e2e8f0', bg: 'bg-slate-200', shadow: 'shadow-slate-300/50', weight: 2, multiplier: 2000, label: 'Elite' },
  [Rarity.EXOTIC]: { color: '#2dd4bf', bg: 'bg-teal-400', shadow: 'shadow-teal-500/50', weight: 1, multiplier: 5000, label: 'Exotic' },
  [Rarity.SECRET]: { color: '#171717', bg: 'bg-black', shadow: 'shadow-white/20', weight: 0.5, multiplier: 15000, label: 'Secret' },
  [Rarity.DIVINE]: { color: '#ffffff', bg: 'bg-white', shadow: 'shadow-white/80', weight: 0.2, multiplier: 50000, label: 'Divine' },
  [Rarity.FABLED]: { color: '#8b5cf6', bg: 'bg-violet-500', shadow: 'shadow-violet-600/50', weight: 0.1, multiplier: 150000, label: 'Fabled' },
  [Rarity.TRANSCENDENTAL]: { color: '#ec4899', bg: 'bg-pink-500', shadow: 'shadow-pink-400/50', weight: 0.05, multiplier: 500000, label: 'Transcendental' },
  [Rarity.COSMIC]: { color: '#0ea5e9', bg: 'bg-sky-500', shadow: 'shadow-sky-400/50', weight: 0.01, multiplier: 2000000, label: 'Cosmic' },
  [Rarity.CHAOS]: { color: '#ff00ff', bg: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-500/80', weight: 0, multiplier: 10000000, label: 'Chaos' },
};

export const SYNERGY_PAIRS: Record<string, string[]> = {
  'Phoenix': ['Flame', 'Stars', 'Sun'],
  'Void': ['Oblivion', 'Abyss', 'Infinity'],
  'Gods': ['Celestial', 'Heaven', 'Thrones'],
  'Shadow': ['Night', 'Silence', 'Void'],
  'Storm': ['Thunder', 'Sky', 'Rain'],
  'Blood': ['Reaper', 'Blade', 'Oath']
};

export const WEAPON_TEMPLATES = {
  names: ['Slayer', 'Bane', 'Reaver', 'Will', 'Spire', 'Whisper', 'Howl', 'Edge', 'Calamity', 'Verdict'],
  suffixes: ['of Time', 'of the Void', 'of Stars', 'of Blood', 'of Frost', 'of Ember']
};

export const MUTATION_CONFIG: Record<MutationType, Mutation | null> = {
  [MutationType.NONE]: null,
  [MutationType.GLITCHED]: { type: MutationType.GLITCHED, color: '#ff00ff', effectClass: 'animate-[glitch_0.2s_infinite]', valueMultiplier: 3 },
  [MutationType.VOID_SCARRED]: { type: MutationType.VOID_SCARRED, color: '#000000', effectClass: 'shadow-[0_0_20px_rgba(0,0,0,1)] grayscale opacity-80', valueMultiplier: 2.5 },
  [MutationType.SOLAR_FLARE]: { type: MutationType.SOLAR_FLARE, color: '#f59e0b', effectClass: 'animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]', valueMultiplier: 2.2 },
  [MutationType.SPECTRAL]: { type: MutationType.SPECTRAL, color: '#a5f3fc', effectClass: 'opacity-40 blur-[0.5px]', valueMultiplier: 2 },
  [MutationType.ANCIENT_DUST]: { type: MutationType.ANCIENT_DUST, color: '#78350f', effectClass: 'sepia contrast-75', valueMultiplier: 1.8 },
  [MutationType.FROZEN_TIME]: { type: MutationType.FROZEN_TIME, color: '#38bdf8', effectClass: 'shadow-[inset_0_0_10px_rgba(56,189,248,0.5)]', valueMultiplier: 2.4 },
  [MutationType.CORRUPTED]: { type: MutationType.CORRUPTED, color: '#10b981', effectClass: 'skew-x-12 brightness-150', valueMultiplier: 2.6 },
  [MutationType.BLOOD_MOON]: { type: MutationType.BLOOD_MOON, color: '#991b1b', effectClass: 'animate-pulse text-red-600 shadow-red-900 shadow-xl', valueMultiplier: 2.8 },
  [MutationType.QUANTUM_STUTTER]: { type: MutationType.QUANTUM_STUTTER, color: '#8b5cf6', effectClass: 'animate-bounce blur-sm scale-110', valueMultiplier: 3.5 },
  [MutationType.HOLLOW]: { type: MutationType.HOLLOW, color: 'transparent', effectClass: 'border-2 border-white/20 bg-transparent text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent', valueMultiplier: 3.2 },
  [MutationType.RADIANT]: { type: MutationType.RADIANT, color: '#fff7ed', effectClass: 'shadow-[0_0_30px_rgba(255,255,255,0.8)] brightness-150', valueMultiplier: 2.5 },
  [MutationType.SINGULARITY]: { type: MutationType.SINGULARITY, color: '#000', effectClass: 'scale-90 rotate-180 hover:scale-100 transition-all duration-1000', valueMultiplier: 4 },
  [MutationType.MOLTEN]: { type: MutationType.MOLTEN, color: '#ea580c', effectClass: 'drop-shadow-[0_0_10px_rgba(234,88,12,0.6)] animate-pulse', valueMultiplier: 2.1 },
  [MutationType.VERDANT]: { type: MutationType.VERDANT, color: '#22c55e', effectClass: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]', valueMultiplier: 1.9 },
  [MutationType.ECHOING]: { type: MutationType.ECHOING, color: '#64748b', effectClass: 'opacity-70 scale-95 translate-x-1 translate-y-1', valueMultiplier: 2.2 },
  [MutationType.KINETIC]: { type: MutationType.KINETIC, color: '#3b82f6', effectClass: 'skew-y-3 blur-[1px]', valueMultiplier: 2.3 },
  [MutationType.ABYSSAL]: { type: MutationType.ABYSSAL, color: '#312e81', effectClass: 'brightness-50 saturate-200', valueMultiplier: 3.1 },
  [MutationType.PRISMATIC]: { type: MutationType.PRISMATIC, color: 'rainbow', effectClass: 'animate-[hue_5s_linear_infinite]', valueMultiplier: 5 },
  [MutationType.CYBERNETIC]: { type: MutationType.CYBERNETIC, color: '#06b6d4', effectClass: 'font-mono tracking-tighter shadow-[0_0_10px_rgba(6,182,212,0.5)]', valueMultiplier: 2.7 },
  [MutationType.NULL_POINTER]: { type: MutationType.NULL_POINTER, color: '#ef4444', effectClass: 'invisible hover:visible', valueMultiplier: 10 },
};

export const WORD_TEMPLATES: Record<Rarity, { first: string[], middle: string[], end: string[] }> = {
  [Rarity.COMMON]: {
    first: ['The', 'Swift', 'Dull', 'Old', 'Small', 'Pale', 'Grim', 'Basic', 'Wild', 'Deep'],
    middle: ['of the', 'who', 'from', 'in', 'near', 'with', 'by', 'and', 'the', 'at'],
    end: ['Forest', 'Stream', 'House', 'Valley', 'Hill', 'Tree', 'Cave', 'Road', 'Stone', 'Path']
  },
  [Rarity.UNCOMMON]: {
    first: ['Sturdy', 'Sharp', 'Fierce', 'Cold', 'Bright', 'Iron', 'Bronze', 'Shadowed', 'Quiet', 'Trained'],
    middle: ['Striking', 'Watching', 'Guarding', 'Walking', 'Breaking', 'Seeking', 'Bearing', 'Holding', 'Lifting', 'Leading'],
    end: ['Forge', 'Bridge', 'Garrison', 'Watch', 'Blade', 'Shield', 'Spire', 'Tome', 'Keep', 'Gate']
  },
  [Rarity.RARE]: {
    first: ['Vanguard', 'Slayer', 'Whispering', 'Shattered', 'Golden', 'Silver', 'Bloody', 'Cursed', 'Blessed', 'Hidden'],
    middle: ['Heart of', 'Soul of', 'Will of', 'Breath of', 'Bane of', 'Gift of', 'Fury of', 'Voice of', 'Eye of', 'Hand of'],
    end: ['Kingdom', 'Shadow', 'Winter', 'Flame', 'Storm', 'Spirit', 'Legend', 'Blood', 'Oath', 'Empire']
  },
  [Rarity.EPIC]: {
    first: ['Unyielding', 'Immortal', 'Draconic', 'Eternal', 'Celestial', 'Abyssal', 'Sovereign', 'Void-Born', 'Ghostly', 'Primal'],
    middle: ['Who Shatters', 'Who Devours', 'Who Reclaims', 'Who Defies', 'Who Commands', 'Who Forges', 'Who Banishes', 'Who Weaves', 'Who Rends', 'Who Ascends'],
    end: ['Titans', 'Gods', 'Dragons', 'Realms', 'Destiny', 'Aeons', 'Existence', 'Infinity', 'Oblivion', 'Creation']
  },
  [Rarity.LEGENDARY]: {
    first: ['Myth-Forged', 'Star-Touched', 'Age-Old', 'Sacred', 'Ancestral', 'Hallowed', 'Doomed', 'Radiant', 'Obsidian', 'Luminescent'],
    middle: ['of Infinite', 'of the Sacred', 'of Lost', 'of Ancient', 'of the Great', 'of Eternal', 'of Silent', 'of Dying', 'of Born', 'of Unseen'],
    end: ['Paragons', 'Prophecies', 'Monuments', 'Cathedrals', 'Graveyards', 'Thrones', 'Crowns', 'Altars', 'Visions', 'Nightmares']
  },
  [Rarity.MYTHIC]: {
    first: ['Phoenix', 'Leviathan', 'Chimera', 'Dragon', 'Seraph', 'Reaper', 'Oracle', 'Colossus', 'Titan', 'Apex'],
    middle: ['of the Burning', 'of the Frozen', 'of the Endless', 'of the Shifting', 'of the Primal', 'of the Chaotic', 'of the Void', 'of the Dream', 'of the Abyss', 'of the Zenith'],
    end: ['Sun', 'Moon', 'Sky', 'Earth', 'Stars', 'Void', 'Soul', 'Mind', 'Flesh', 'Time']
  },
  [Rarity.ROYALTY]: {
    first: ['King\'s', 'Queen\'s', 'Emperor\'s', 'Majestic', 'Regal', 'Noble', 'Dynastic', 'High', 'Grand', 'Imperial'],
    middle: ['Who Rules', 'Who Sits Upon', 'Who Wields', 'Who Commands', 'Who Inherits', 'Who Ascends', 'Who Judges', 'Who Conquers', 'Who Unites', 'Who Destroys'],
    end: ['Atlantis', 'Avalon', 'Olympus', 'Valhalla', 'Asgard', 'Eden', 'Nirvana', 'Tartarus', 'Camelot', 'Elysium']
  },
  [Rarity.ELITE]: {
    first: ['Zenith', 'Pinnacle', 'Apex', 'Ultimate', 'Supreme', 'Master', 'Grandmaster', 'Exalted', 'Superior', 'Prime'],
    middle: ['at the', 'beyond the', 'above the', 'within the', 'master of', 'conqueror of', 'protector of', 'judge of', 'scholar of', 'guardian of'],
    end: ['Order', 'Circle', 'Council', 'Hegemony', 'Syndicate', 'Foundation', 'Conclave', 'Ascendancy', 'Zenith', 'Horizon']
  },
  [Rarity.EXOTIC]: {
    first: ['Xeno', 'Alien', 'Otherworldly', 'Unfathomable', 'Inscrutable', 'Bizarre', 'Eldritch', 'Phase', 'Quantum', 'Nebulous'],
    middle: ['from the', 'outside the', 'through the', 'beyond the', 'warping the', 'shredding the', 'bleeding the', 'twisting the', 'erasing the', 'mirroring the'],
    end: ['Dimension', 'Singularity', 'Wormhole', 'Matrix', 'Nexus', 'Void', 'Ether', 'Plasma', 'Flux', 'Rift']
  },
  [Rarity.SECRET]: {
    first: ['Hidden', 'Forgotten', 'Forbidden', 'Masked', 'Veiled', 'Shadowed', 'Occult', 'Cipher', 'Whispered', 'Lost'],
    middle: ['of the Dark', 'of the Deep', 'of the Night', 'of the Silent', 'of the Unspoken', 'of the Unknown', 'of the Hidden', 'of the Sealed', 'of the Arcane', 'of the Esoteric'],
    end: ['Knowledge', 'Truth', 'Power', 'Legacy', 'Pact', 'Rune', 'Script', 'Covenant', 'Omen', 'Prophecy']
  },
  [Rarity.DIVINE]: {
    first: ['Holy', 'Saintly', 'Angelic', 'Godly', 'Deific', 'Celestial', 'Seraphic', 'Cherubic', 'Sacrosanct', 'Empyrean'],
    middle: ['Bearer of', 'Avatar of', 'Vessel of', 'Herald of', 'Incarnation of', 'Servant of', 'Will of', 'Grace of', 'Mercy of', 'Judgment of'],
    end: ['Heaven', 'Paradise', 'Light', 'Purity', 'Creation', 'Miracles', 'Grace', 'Salvation', 'Eternity', 'Omnipotence']
  },
  [Rarity.FABLED]: {
    first: ['Once-Upon-a', 'Dream-Woven', 'Story-Bound', 'Mythical', 'Legendary', 'Illusionary', 'Narrative', 'Epic', 'Poetic', 'Fable-Born'],
    middle: ['Who Walked', 'Who Spoke', 'Who Lived', 'Who Died', 'Who Became', 'Who Wrote', 'Who Painted', 'Who Dreamed', 'Who Sang', 'Who Told'],
    end: ['Tales', 'Stories', 'Verses', 'Chapters', 'Scrolls', 'Myths', 'Lies', 'Truths', 'Worlds', 'Dreams']
  },
  [Rarity.TRANSCENDENTAL]: {
    first: ['Absolute', 'Infinite', 'Formless', 'Limitless', 'Unbound', 'Transcendent', 'Beyond', 'Ultimate', 'Pure', 'Perfect'],
    middle: ['Becoming the', 'Surpassing the', 'Dissolving the', 'Unifying the', 'Ascending the', 'Embodying the', 'Merging with', 'Rising above', 'Leaving the', 'Reaching the'],
    end: ['Concept', 'Idea', 'Thought', 'Will', 'Energy', 'One', 'All', 'None', 'Nothing', 'Everything']
  },
  [Rarity.COSMIC]: {
    first: ['Omniversal', 'Galactic', 'Universal', 'Cosmic', 'Stellar', 'Interstellar', 'Nebular', 'Astro', 'Void', 'Infinite'],
    middle: ['That Dreams', 'That Rules', 'That Creates', 'That Destroys', 'That Breathes', 'That Holds', 'That Weaves', 'That Spawns', 'That Observes', 'That IS'],
    end: ['Reality', 'Space', 'Time', 'Matter', 'Multiverse', 'Omniverse', 'Chaos', 'Order', 'Life', 'Existence']
  },
  [Rarity.CHAOS]: {
    first: ['Glitched', 'Recursive', 'Fragmented', 'Hyper', 'Meta', 'Paradoxical', 'Singular', 'Entropic', 'Fluid', 'Null'],
    middle: ['[ERROR]', '404', 'UNDEFINED', 'NULL_POINTER', 'OVERFLOW', 'STACK', 'HEAP', 'SEGMENT', 'VOLATILE', 'ASYNC'],
    end: ['Void', 'Source', 'Output', 'Kernel', 'Logic', 'String', 'Buffer', 'Array', 'Object', 'Function']
  }
};
