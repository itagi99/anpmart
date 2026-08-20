import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#16a34a', dark: '#0c831f', light: '#dcfce7' },
        brand: { DEFAULT: '#16a34a', dark: '#0c831f', light: '#dcfce7' },
      },
    },
  },
  plugins: [],
};

export default config;
