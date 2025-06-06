// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        smoke: '#F7F4F3',
        wine: '#5B2333',
        'whitesmoke': '#F5F5F5',
        'brand-wine': '#7B1E3D',
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
      }
    },
  },
  plugins: [],
};
