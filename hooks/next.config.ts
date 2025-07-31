import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/auditorias',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
