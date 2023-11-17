/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "standalone",
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        }
        return config;
    }
}

module.exports = nextConfig;
