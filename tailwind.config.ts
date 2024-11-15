import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ft-primary': '#000814',
        'ft-secondary': '#001D3D',
        'ft-tertiary': '#003566',
        'ft-platinum': '#E5E5E5',
        'ft-gray': '#CBC5EA'
      },
    },
  },
  plugins: [],
} satisfies Config;
