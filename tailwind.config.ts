import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Brand Colors from denizleventtulay.de
      colors: {
        // Base Brand Colors
        sand: "#DBD6CC",
        cream: "#EFEDE5",
        burgundy: "#652126",
        dark: "#0a0a0a",
        "dark-alt": "#151413",
        // Semantic mappings
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#652126",
          foreground: "#EFEDE5",
        },
        secondary: {
          DEFAULT: "#DBD6CC",
          foreground: "#0a0a0a",
        },
        destructive: {
          DEFAULT: "#652126",
          foreground: "#EFEDE5",
        },
        muted: {
          DEFAULT: "rgba(207, 187, 163, 0.5)",
          foreground: "rgba(10, 10, 10, 0.5)",
        },
        accent: {
          DEFAULT: "#652126",
          foreground: "#EFEDE5",
        },
        popover: {
          DEFAULT: "#EFEDE5",
          foreground: "#0a0a0a",
        },
        card: {
          DEFAULT: "#EFEDE5",
          foreground: "#0a0a0a",
        },
        // Status colors
        success: "#2D5A3D",
        warning: "#8B6914",
        danger: "#652126",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        section: "clamp(80px, 12vw, 140px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
