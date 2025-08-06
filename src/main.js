// src/main.js
import App from './app.js';

// 全局样式
import './global.css';

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 显示启动加载界面
  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'global-loading';
  loadingScreen.innerHTML = `
    <div class="loading-content">
      <div class="chemistry-loader">
        <div class="flask"></div>
        <div class="bubbles">
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
        </div>
      </div>
      <p>正在准备化学实验室...</p>
    </div>
  `;
  document.body.appendChild(loadingScreen);
  
  // 创建应用实例
  const app = new App();
  
  // 监听应用准备完成事件
  document.addEventListener('appReady', () => {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 1000);
  });
  
  // 性能监控
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`页面加载时间: ${loadTime}ms`);
  });
});

// 微信适配
if (typeof WeixinJSBridge !== 'undefined') {
  document.addEventListener('WeixinJSBridgeReady', initWechatFeatures, false);
} else {
  document.addEventListener('DOMContentLoaded', initWechatFeatures);
}

function initWechatFeatures() {
  // 微信特殊功能初始化
  console.log('微信环境初始化');
}