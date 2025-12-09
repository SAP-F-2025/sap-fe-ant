import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		files: ['src/**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'prettier/prettier': 'error',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'no-case-declarations': 'off',
			'no-console': 'warn',
		},
	},
	{
		ignores: ['node_modules/', 'dist/', 'build/', '*.config.js', '*.config.ts'],
	}
);
