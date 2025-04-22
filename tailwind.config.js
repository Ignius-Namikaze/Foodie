 /** @type {import('tailwindcss').Config} */
 module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
          colors: {
            'brand-primary': '#YOUR_PRIMARY_HEX_CODE', // e.g., '#6B46C1' for a purple
            'brand-secondary': '#YOUR_SECONDARY_HEX_CODE', // e.g., '#38B2AC' for a teal
          }
        },
      },
    plugins: [
      require('@tailwindcss/typography'), // Make sure this line is present
    ],
  }