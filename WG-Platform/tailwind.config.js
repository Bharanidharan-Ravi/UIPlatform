export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wg: {
          surface: 'var(--wg-surface)',
          border: 'var(--wg-border)',
          text: 'var(--wg-text)',
          muted: 'var(--wg-muted)'
        }
      },
      borderRadius: {
        wg: 'var(--wg-radius)'
      }
    }
  },
  plugins: []
};
