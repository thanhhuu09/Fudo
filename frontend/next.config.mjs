/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fudo-image-bucket.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**", // Adjust as needed to specify more specific paths
      },
    ],
  },
};

export default nextConfig;
// domains: ['fudo-image-bucket.s3.ap-southeast-1.amazonaws.com'],
