import localFont from 'next/font/local';

export const fontNexa = localFont({
  src: [
    {
      path: '../fonts/nexa/thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/thin-italic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/extra-light.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/extra-light-italic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/light-italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/regular-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/bold-italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/extra-bold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/extra-bold-italic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../fonts/nexa/heavy.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/nexa/heavy-italic.woff2',
      weight: '900',
      style: 'italic',
    }
  ],
  variable: '--font-nexa'
});