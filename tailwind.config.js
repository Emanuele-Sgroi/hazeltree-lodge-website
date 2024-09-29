/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "!./.history/**/*",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      opacity: {
        8: "0.09", // Custom opacity value
      },
      colors: {
        "accent-green": "#367a35",
        "dark-blue": "#101838",
        "error-text": "#d32f2f",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "rotate-3d": {
          "0%": {
            transform: "rotate3d(0, 0, 0, 0rad)",
          },
          "100%": {
            transform: "rotate3d(0, 1, 0, 3.142rad)",
          },
        },
        "dissolve-start": {
          "0%": {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgb(255, 255, 255)",
          },
          "100%": {
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(255, 255, 255, 0)",
            visibility: "hidden",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.5s ease-out",
        "accordion-up": "accordion-up 0.5s ease-out",
        "rotate-3d": "rotate-3d 0.2s linear",
        "dissolve-start": "dissolve-start 1.5s forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
