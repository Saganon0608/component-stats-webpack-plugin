import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    resolve(),
    commonjs()
  ],
  external: [] // 在这里添加外部依赖，例如：['lodash']
};