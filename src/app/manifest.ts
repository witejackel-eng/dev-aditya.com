import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aditya Singh — Web Designer & Developer',
    short_name: 'Aditya',
    description:
      'Aditya Singh designs and develops fast, premium websites for service businesses, startups and independent brands in Delhi, across India and worldwide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#7A1F2B',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
