import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    // The integration specs talk to the real (remote) Supabase database, so each query costs a network round trip.
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
