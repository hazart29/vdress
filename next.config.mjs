/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, "bcrypt"];
        return config;
    },
    nextScriptWorkers: true,
};

export default nextConfig;
