/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/:path*",
  //       destination:
  //         "https://enviteyoubackend.onrender.com/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
