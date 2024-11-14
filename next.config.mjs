/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    { source: "/", destination: "/auth/login", permanent: false }
  ],
};

export default nextConfig;
