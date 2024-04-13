import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import zipPack from "vite-plugin-zip-pack";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      // dev specific config
      plugins: [
        createHtmlPlugin({
          minify: false,
          inject: {
            tags: [
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "./node_modules/eruda/eruda.js",
                },
              },
              {
                injectTo: "head-prepend",
                tag: "script",
                attrs: {
                  src: "./dev/start-eruda.js",
                },
              },
            ],
          },
        }),
      ],
    };
  } else {
    // command === 'build'
    return {
      // build specific config
      build: {
        assetsInlineLimit: 0,
        reportCompressedSize: false,
      },
      plugins: [
        createHtmlPlugin({
          minify: true,
        }),
        zipPack({
          outDir: "./dist",
          outFileName: "crypto-text.xdc",
        }),
      ],
    };
  }
});
