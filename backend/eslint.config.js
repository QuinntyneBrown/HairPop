import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.next/**', '.next-test/**', 'node_modules/**', 'next-env.d.ts'] },
  ...tseslint.configs.recommended,
);
