/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode based on the 'dark' class
  theme: {
    extend: {
      colors: {
        'dark-background': '#1a202c', // A dark background color
        'dark-surface': '#2d3748',    // A slightly lighter dark surface for cards/panels
        'dark-text': '#e2e8f0',       // Light text for dark mode
        'dark-text-secondary': '#a0aec0', // Secondary text for inactive elements, icons
        'dark-input-bg': '#4a5568',   // Background for text inputs
        'dark-input-border': '#6b7280', // Border for text inputs
        'dark-button-inactive-bg': '#4a5568', // Inactive button background
        'dark-button-inactive-text': '#a0aec0', // Inactive button text
        'dark-scroll-thumb': '#6b7280', // Scrollbar thumb color
        'dark-scroll-track': '#2d3748', // Scrollbar track color
      },
    },
  },
  plugins: [],
};
