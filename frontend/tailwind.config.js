/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: '#9E2A2B',      // Đỏ điều
          yellow: '#E9C46A',   // Vàng hoa mướp
          indigo: '#264653',   // Xanh chàm / thủy ba
          teal: '#2A9D8F',     // Xanh cổ vịt
          purple: '#5A189A',   // Tía ngọc
          cream: '#F4F1DE',    // Trắng ngà
          black: '#1D1E2C',    // Đen mun
          brown: '#6F4E37',    // Nâu sồng
        },
        studio: {
          bg: '#0F1016',
          panel: 'rgba(29, 30, 44, 0.75)',
          border: 'rgba(244, 241, 222, 0.12)',
          accent: '#E9C46A',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
