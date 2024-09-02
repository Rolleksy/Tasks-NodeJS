import { fileURLToPath } from 'url';
import { dirname } from 'path';
import globals from 'globals';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

// Calculate the directory name from the import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESLint configuration for TypeScript files
const tsConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: parser,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
    globals: {
      Buffer: 'readonly',
      process: 'readonly',
      jest: 'readonly',
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {
    '@typescript-eslint': pluginTs,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off', // Disable if using @typescript-eslint/no-unused-vars
    'prefer-const': ['warn', { destructuring: 'all' }],
  },
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/tests/**',
  ],
};


export default [tsConfig];
