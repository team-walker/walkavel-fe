import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3001/docs/json',
    output: {
      mode: 'split',
      target: './types/api.ts',
      schemas: './types/model',
      client: 'axios',
      prettier: true,
      override: {
        mutator: {
          path: './lib/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
