// next.config.mjs
// import path from 'path'; // path 모듈도 더 이상 필요 없습니다.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  /* sassOptions: {
    includePaths: [path.join(projectRoot, 'src', 'styles')],
  },
  */
};

export default nextConfig;
