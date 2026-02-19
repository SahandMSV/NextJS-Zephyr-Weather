import localFont from 'next/font/local';

export const headingFont = localFont({
  src: '../../public/fonts/Outfit-VariableFont_wght.ttf',
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const bodyFont = localFont({
  src: '../../public/fonts/ReadexPro-VariableFont_wght.ttf',
  variable: '--font-body',
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Arial',
    'sans-serif',
  ],
});
