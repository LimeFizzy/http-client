const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**']
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 2020,
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            'quotes': ['error', 'single'],
            'max-len': ['error', { 'code': 100 }],
            'object-curly-spacing': ['error', 'never'],
            'array-bracket-spacing': ['error', 'never'],
            ...tseslint.configs.recommended.rules
        }
    }
];
