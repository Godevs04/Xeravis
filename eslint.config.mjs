import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/payload/**', 'src/app/(payload)/**', 'src/components/ui/link.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message:
                "Import Link from '@/components/ui/link' so public pages don't load the Payload admin bundle.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/lib/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]

export default eslintConfig
