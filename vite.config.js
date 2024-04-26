import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';


export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
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