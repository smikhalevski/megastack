import { defineConfig } from 'vite';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import htmlMinifier from 'html-minifier-terser';

export default defineConfig(env => {
  return {
    root: './src/main',
    publicDir: env.isSsrBuild ? false : 'public',
    build: {
      minify: env.isSsrBuild ? false : 'esbuild',
      cssMinify: 'lightningcss',
      sourcemap: env.isSsrBuild ? 'hidden' : false,
      assetsDir: '.',
      ssrEmitAssets: false,
      outDir: env.isSsrBuild ? '../../build' : '../../build/public',
      emptyOutDir: false,
      manifest: env.isSsrBuild ? undefined : 'manifest.json',
      rollupOptions: {
        input: env.isSsrBuild ? './src/main/server.ts' : './src/main/index.html',
        output: {
          entryFileNames: env.isSsrBuild ? 'server.js' : '[name]-[hash].js',
          chunkFileNames: env.isSsrBuild ? '[name].js' : '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]',
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
        writeBundle() {
          if (env.isSsrBuild) {
            return;
          }
          return this.fs.rename('build/public/manifest.json', 'build/manifest.json');
        },
      },
      {
        name: 'minify-html',
        transformIndexHtml: {
          order: 'post',
          handler(html) {
            if (env.mode === 'development') {
              return;
            }
            return htmlMinifier.minify(html, {
              minifyCSS: true,
              minifyJS: true,
              collapseWhitespace: true,
            });
          },
        },
      },
    ],
    // define: {
    //   'process.env.NODE_ENV': '"development"',
    // },
  };
});
