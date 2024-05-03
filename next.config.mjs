// next.config.mjs
import withPWAInit from 'next-pwa';

export default withPWAInit({
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    register: true,
    sw: 'service-worker.js',
    // Menambahkan properti fallback
    fallback: [
        {
            // URL fallback
            url: '/offline',
            // Konfigurasi halaman fallback
            page: '/offline',
        },
    ],
});
