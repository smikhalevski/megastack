import { defineConfig } from 'vite';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

export default defineConfig(env => {
  return {
    root: './src/main',
    publicDir: env.isSsrBuild ? false : 'public',
    build: {
      minify: env.isSsrBuild ? false : 'esbuild',
      cssMinify: 'lightningcss',
      sourcemap: 'hidden',
      assetsDir: '.',
      ssrEmitAssets: false,
      outDir: env.isSsrBuild ? '../../build' : '../../build/public',
      emptyOutDir: false,
      modulePreload: {
        polyfill: false,
      },
      manifest: env.isSsrBuild ? undefined : 'manifest.json',
      rollupOptions: {
        input: env.isSsrBuild ? './src/main/server.ts' : './src/main/index.html',
        output: {
          entryFileNames: env.isSsrBuild ? 'server.js' : '[hash].js',
          chunkFileNames: '[hash].js',
          assetFileNames: '[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [postcssNested(), autoprefixer()],
      },
    },
    plugins: [
      {
        name: 'rename-manifest',
        async writeBundle() {
          if (env.isSsrBuild) {
            return;
          }
          await this.fs.rename('build/public/manifest.json', 'build/manifest.json');
        },
      },
    ],
  };
});
