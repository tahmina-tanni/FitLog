import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { fitlog: { bg: '#0c0d10', panel: '#15171d', accent: '#ccff00' } }, fontFamily: { display: ['Oswald', 'sans-serif'], body: ['Inter', 'sans-serif'] } } },
  plugins: [],
};
export default config;
