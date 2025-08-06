const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 创建一个 Promise 包装的问题函数
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  // 获取前缀
  const jsPrefix = await question('请输入 JS 文件名前缀 (直接回车跳过): ');
  const cssPrefix = await question('请输入 CSS和IMAGES 文件名前缀 (直接回车跳过): ');

  // 关闭readline接口
  rl.close();

  // 设置环境变量并执行vite构建
  const env = {
    ...process.env,
    JS_PREFIX: jsPrefix,
    CSS_PREFIX: cssPrefix
  };

  // 执行vite构建
  const build = spawn('vite', ['build'], {
    stdio: 'inherit',
    env,
    shell: true
  });

  build.on('close', (code) => {
    if (code !== 0) {
      console.error('构建过程发生错误');
      process.exit(code);
    }
  });
}

main().catch(console.error);
