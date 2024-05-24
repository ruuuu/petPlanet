import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { resolve } from 'path';  // path -билбиотека Node js, resolve() функция



export default defineConfig({
  root: './src',
  publicDir: '../public', // относительно src
  build: {
    outDir: '../dist',
    rollupOptions: {
        input: { // если в проекте больше одного html файла
            main: resolve(__dirname, './src/index.html'),
            store: resolve(__dirname, './src/store.html')
        }
    }
 },
 plugins: [
    ViteImageOptimizer({
        svg: {
            multipass: true,
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    cleanupNumericValues: false,
                    removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                  },
                  cleanupIDs: {
                    minify: false,
                    remove: false,
                  },
                  convertPathData: false,
                },
              },
              'sortAttrs',
              {
                name: 'addAttributesToSVGElement',
                params: {
                  attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                },
              },
            ],
          },
          png: {
            quality: 80,
          },
          jpeg: {
            quality: 80,
          },
          jpg: {
            quality: 80,
          },
          webp: {
            quality: 80,
          },
          avif: {
            quality: 70,
          },
    }),
  ],
});