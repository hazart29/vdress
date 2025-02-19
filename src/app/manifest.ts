import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Virtual Dressing',
    short_name: 'V-Dress',
    description: 'Your Virtual Dressing Girl',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/ui/iconVD-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/ui/iconVD-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}