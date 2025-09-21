import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  darkMode: "class", 
  theme: {
    extend: {
       fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"]  
        // hoặc 'heading': ['Roboto', 'sans-serif'], etc
      },
      colors: {
        background: "hsl(0,0%,100%)",
        foreground: "hsl(0,0%,3.9%)",
        card: "hsl(0,0%,100%)",
        cardForeground: "hsl(0,0%,3.9%)",
        primary: "hsl(0,0%,9%)",
        primaryForeground: "hsl(0,0%,98%)",
        secondary: "hsl(0,0%,96.1%)",
        secondaryForeground: "hsl(0,0%,9%)",
        muted: "hsl(0,0%,96.1%)",
        mutedForeground: "hsl(0,0%,45.1%)",
        destructive: "hsl(0,84.2%,60.2%)",
        destructiveForeground: "hsl(0,0%,98%)",
        border: "hsl(0,0%,89.8%)",
        ring: "hsl(0,0%,3.9%)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
