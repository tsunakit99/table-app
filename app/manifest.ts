import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '居食屋たーぶる',
    short_name: '居食屋たーぶる',
    description: 'A table management application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/appicon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/appicon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/appicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/appicon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/appicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
