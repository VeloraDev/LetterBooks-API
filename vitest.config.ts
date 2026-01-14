import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,

    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'prisma'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules',
        'dist',
        'prisma',
        '**/*.config.ts',
        '**/*.routes.ts',
        '**/main.ts',
        '**/app.ts',
      ],
      reportsDirectory: './coverage',

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
});
