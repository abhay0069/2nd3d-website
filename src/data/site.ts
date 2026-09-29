/**
 * OBSCURA — content model.
 * All copy is original fiction for this atelier experience.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Capability {
  index: string;
  title: string;
  description: string;
  image: string;
}

export interface Project {
  index: string;
  name: string;
  description: string;
  year: string;
  category: string;
  image: string;
  /** 'webgl' renders an interactive 3D preview instead of a still */
  preview?: 'webgl';
  tags: string[];
}

export interface Experiment {
  index: string;
  code: string;
  title: string;
  caption: string;
  kind: 'field' | 'type' | 'flux' | 'trace';
}

export const SITE = {
  name: 'OBSCURA',
  legalName: 'OBSCURA Studio',
  tagline: 'Digital Atelier',
  est: 'EST. 2019',
  email: 'hello@obscura.studio',
  location: 'BERLIN',
  coordinates: '52.52° N, 13.40° E',
  timezone: 'Europe/Berlin',
} as const;

export const NAV: NavItem[] = [
  { label: 'WORK', href: '#work' },
  { label: 'STUDIO', href: '#studio' },
  { label: 'LAB', href: '#lab' },
  { label: 'CONTACT', href: '#contact' },
];

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'DIGITAL EXPERIENCES',
    description: 'Sites, platforms and product narratives engineered as one continuous journey.',
    image: '/images/cap-experiences.jpg',
  },
  {
    index: '02',
    title: 'CREATIVE DEVELOPMENT',
    description: 'WebGL, shaders and interaction systems where engineering becomes expression.',
    image: '/images/cap-development.jpg',
  },
  {
    index: '03',
    title: '3D & MOTION',
    description: 'Generative worlds, kinetic type and cinematic motion languages.',
    image: '/images/cap-motion.jpg',
  },
  {
    index: '04',
    title: 'BRAND SYSTEMS',
    description: 'Identities built to move — typography, behaviour and voice as a single system.',
    image: '/images/cap-experiences.jpg',
  },
  {
    index: '05',
    title: 'INTERACTIVE INSTALLATIONS',
    description: 'Spatial and physical experiences that respond to presence.',
    image: '/images/cap-development.jpg',
  },
];

export const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'HALIDE',
    description: 'A living archive for a contemporary art foundation — forty years of exhibitions, resurfaced as light.',
    year: '2025',
    category: 'WEBGL · IDENTITY',
    image: '/images/work-halide.jpg',
    tags: ['WEBGL', 'ART DIRECTION', 'ARCHIVE'],
  },
  {
    index: '02',
    name: 'MONOLITH',
    description: 'An immersive product launch in pure spatial computing. No pages — one unbroken space.',
    year: '2025',
    category: '3D · EXPERIENCE',
    image: '/images/work-monolith.jpg',
    preview: 'webgl',
    tags: ['THREE.JS', 'SPATIAL', 'MOTION'],
  },
  {
    index: '03',
    name: 'TERRA NOVA',
    description: 'Cartography of a climate dataset, drawn in real time and rendered as a breathing landscape.',
    year: '2024',
    category: 'DATA · MOTION',
    image: '/images/work-terra.jpg',
    tags: ['DATA VIZ', 'GENERATIVE', 'SHADERS'],
  },
  {
    index: '04',
    name: 'AFTERGLOW',
    description: 'A generative identity for an electronic music label — every release gets its own afterimage.',
    year: '2024',
    category: 'IDENTITY · GENERATIVE',
    image: '/images/work-afterglow.jpg',
    tags: ['GENERATIVE', 'IDENTITY', 'TYPE'],
  },
];

export const EXPERIMENTS: Experiment[] = [
  {
    index: '01',
    code: 'FLD—256',
    title: 'FIELD',
    caption: 'Presence',
    kind: 'field',
  },
  {
    index: '02',
    code: 'TYP—091',
    title: 'TENSION',
    caption: 'Type as matter',
    kind: 'type',
  },
  {
    index: '03',
    code: 'FLX—128',
    title: 'FLUX',
    caption: 'Liquid geometry',
    kind: 'flux',
  },
  {
    index: '04',
    code: 'TRC—004',
    title: 'TRACE',
    caption: 'Memory of a gesture',
    kind: 'trace',
  },
];

export const SOCIALS: NavItem[] = [
  { label: 'INSTAGRAM', href: 'https://instagram.com' },
  { label: 'X / TWITTER', href: 'https://x.com' },
  { label: 'ARE.NA', href: 'https://are.na' },
  { label: 'LINKEDIN', href: 'https://linkedin.com' },
];
