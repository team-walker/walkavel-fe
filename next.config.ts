import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const withPWA = withPWAInit({
  dest: 'public', // 서비스 워커(sw.js)와 관련 캐시 파일들이 생성될 경로, public으로 설정해야 브라우저에서 접근 가능
  cacheOnFrontEndNav: true, // 사용자가 페이지 이동(클라이언트 사이드 라우팅)을 할 때, 해당 페이지의 리소스를 즉시 캐싱하여 다음 방문 시 속도를 높임
  aggressiveFrontEndNavCaching: true, // 페이지 이동 시 필요한 리소스를 더욱 적극적으로(미리) 캐싱한다. 네트워크 연결이 불안정할 때 효과적
  reloadOnOnline: true, // 오프라인 상태였다가 다시 온라인이 되었을 때, 최신 데이터를 보여주기 위해 페이지를 자동으로 새로고침할지 여부
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서는 PWA 기능을 비활성화
  workboxOptions: {
    disableDevLogs: true, // 브라우저 콘솔창에 Workbox(PWA 도구)가 출력하는 로그를 숨깁니다. 콘솔을 깔끔하게 유지하고 싶을 때 사용
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
          },
        },
      },
      {
        urlPattern: /^\/_next\/(static|chunks|webpack)\/.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-js-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7일
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zfwbmoemqiikijiidqis.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config: Configuration) {
    // Initialize module and rules if they don't exist
    const rules = ((config.module ??= {}).rules ??= []);

    // Find the existing rule that handles SVG imports
    const fileLoaderRule = (rules as RuleSetRule[]).find(
      (rule) => typeof rule !== 'string' && rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    if (fileLoaderRule) {
      const { issuer, resourceQuery } = fileLoaderRule;

      // Extract existing 'not' conditions safely
      const existingNot =
        resourceQuery &&
        typeof resourceQuery === 'object' &&
        'not' in resourceQuery &&
        Array.isArray(resourceQuery.not)
          ? resourceQuery.not
          : [];

      rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer,
          resourceQuery: {
            not: [...(existingNot as (string | RegExp)[]), /url/],
          },
          use: ['@svgr/webpack'],
        },
      );

      // Modify the existing file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;
    } else {
      // Fallback: If no existing rule is found, just add the SVGR loader.
      rules.push({
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      });
    }

    return config;
  },
};

export default withPWA(nextConfig);
