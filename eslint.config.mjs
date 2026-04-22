import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Note: eslint-config-next/core-web-vitals already bundles jsx-a11y rules,
// so we rely on those instead of registering the plugin again (which breaks
// ESLint flat config with a "Cannot redefine plugin" error).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
])

export default eslintConfig
