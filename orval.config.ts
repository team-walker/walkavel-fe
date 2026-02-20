import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'orval';

loadEnvConfig(process.cwd());

export default defineConfig({
  api: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/docs/json`,
    output: {
      mode: 'split',
      target: './types/api.ts',
      schemas: './types/model',
      client: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './lib/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
