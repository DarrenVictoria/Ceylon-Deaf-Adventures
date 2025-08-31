/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        // Ceylon Deaf Adventures custom colors
        background: 'oklch(0.99 0.005 85)',
        foreground: 'oklch(0.15 0.02 180)',
        card: 'oklch(0.97 0.01 85)',
        'card-foreground': 'oklch(0.15 0.02 180)',
        popover: 'oklch(0.99 0.005 85)',
        'popover-foreground': 'oklch(0.15 0.02 180)',
        primary: 'oklch(0.45 0.15 160)',
        'primary-foreground': 'oklch(0.99 0.005 85)',
        secondary: 'oklch(0.35 0.12 200)',
        'secondary-foreground': 'oklch(0.99 0.005 85)',
        muted: 'oklch(0.94 0.01 85)',
        'muted-foreground': 'oklch(0.45 0.05 180)',
        accent: 'oklch(0.65 0.18 35)',
        'accent-foreground': 'oklch(0.99 0.005 85)',
        destructive: 'oklch(0.55 0.2 25)',
        'destructive-foreground': 'oklch(0.99 0.005 85)',
        border: 'oklch(0.88 0.02 85)',
        input: 'oklch(0.97 0.01 85)',
        ring: 'oklch(0.45 0.15 160)',
      },
      borderRadius: {
        'DEFAULT': '0.75rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}