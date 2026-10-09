import type { NextConfig } from 'next';
const nextConfig: NextConfig = { images: { remotePatterns: [{ protocol: 'https', hostname: 'img.magnific.com' }, { protocol: 'https', hostname: '**' }] } };
export default nextConfig;
