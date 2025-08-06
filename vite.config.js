import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 设置输出目录
    outDir: 'dist',
    // 禁用 public 目录的自动复制
    publicDir: false,
    // 配置打包后的文件目录
    rollupOptions: {
      output: {
        // 对 JS 文件的处理
        entryFileNames: 'zhuanti/js/' + (process.env.JS_PREFIX || '') + '[hash].js',
        // 对代码分割后的 chunk 的处理
        chunkFileNames: 'zhuanti/js/' + (process.env.JS_PREFIX || '') + '[hash].js',
        // 对静态资源的处理
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          // 根据不同的文件类型输出到不同的目录
          if (/\.(png|jpe?g|gif|svg|webp|ico|mp3|wav|ogg|m4a)$/i.test(assetInfo.name)) {
            extType = 'img';
            return `zhuanti/${extType}/${process.env.CSS_PREFIX || ''}[hash][extname]`;
          } 
          else if (/\.css$/i.test(assetInfo.name)) {
            extType = 'css';
            return `zhuanti/${extType}/${process.env.CSS_PREFIX || ''}[hash].css`;
          }
          return `zhuanti/assets/[name].[hash][extname]`;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
