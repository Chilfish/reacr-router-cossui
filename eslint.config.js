import antfu from '@antfu/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'

export default antfu({
  formatters: true,
  markdown: false,
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'no-console': 'off',
    'antfu/no-top-level-await': 'off',
    'node/prefer-global/buffer': 'off',
    'node/prefer-global/process': 'off',
    'accessor-pairs': 'off',
    'style/multiline-ternary': 'off',
    'ts/no-use-before-define': 'warn',
    'no-case-declarations': 'off',
  },
}, reactHooks.configs.flat.recommended)
