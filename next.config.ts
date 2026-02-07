import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
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
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config: Configuration) {
    const rules = ((config.module ??= {}).rules ??= []);

    const fileLoaderRule = (rules as RuleSetRule[]).find(
      (rule) => typeof rule !== 'string' && rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    if (fileLoaderRule) {
      const { issuer, resourceQuery } = fileLoaderRule;

      const existingNot =
        resourceQuery &&
        typeof resourceQuery === 'object' &&
        'not' in resourceQuery &&
        'not' in resourceQuery &&
        Array.isArray(resourceQuery.not)
          ? resourceQuery.not
          : [];

      rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer,
          resourceQuery: {
            not: [...(existingNot as (string | RegExp)[]), /url/],
          },
          use: ['@svgr/webpack'],
        },
      );

      fileLoaderRule.exclude = /\.svg$/i;
    } else {
      rules.push({
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      });
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zfwbmoemqiikijiidqis.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'tong.visitkorea.or.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
