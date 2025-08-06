// src/App.js
// 导入工具函数和各个模块
import { createElement } from './utils/dom.js'; // 用于创建 DOM 元素的工具函数
import StoryController from './modules/story.js'; // 剧情控制器模块
import PairingEngine from './modules/pairing.js'; // 配对引擎模块
import PosterGenerator from './modules/poster.js'; // 海报生成器模块

// App 主类，负责页面的初始化和各模块的调度
class App {
  constructor() {
    // 保存各个屏幕的 DOM 元素引用
    this.screens = {
      loading: null, // 加载中界面
      story: null,   // 剧情界面
      pairing: null, // 配对界面
      poster: null   // 海报界面
    };
    
    this.currentScreen = null; // 当前显示的屏幕
    this.init(); // 初始化应用
  }

  // 应用初始化流程（异步）
  async init() {
    // 1. 创建所有屏幕的 DOM 容器
    this.createScreens();
    
    // 2. 先显示加载界面，优化用户体验
    this.showScreen('loading');
    
    // 3. 关键等待点：预加载资源（如图片、音频等）
    await this.preloadAssets();
    
    // 4. 初始化各功能模块，并传入对应的屏幕 DOM
    this.storyController = new StoryController(this.screens.story);
    this.pairingEngine = new PairingEngine(this.screens.pairing);
    this.posterGenerator = new PosterGenerator(this.screens.poster);
    
    // 5. 绑定各类事件（如模块间切换、按钮点击等）
    this.setupEventListeners();
    
    // 6. 切换到剧情界面并启动剧情
    this.showScreen('story');
    this.storyController.start();
  }

  // 创建所有屏幕的 DOM 元素，并添加到页面
  createScreens() {
    const app = document.getElementById('app'); // 获取主容器
    
    // 创建加载界面
    this.screens.loading = createElement('div', {
      id: 'loading-screen',
      className: 'screen',
      html: '<div class="loader">加载中...</div>'
    });
    
    // 创建剧情界面
    this.screens.story = createElement('div', {
      id: 'story-screen',
      className: 'screen'
    });
    
    // 创建配对界面
    this.screens.pairing = createElement('div', {
      id: 'pairing-screen',
      className: 'screen'
    });
    
    // 创建海报界面（包含画布和保存按钮）
    this.screens.poster = createElement('div', {
      id: 'poster-screen',
      className: 'screen',
      html: '<canvas id="poster-canvas"></canvas><button id="save-btn">保存海报</button>'
    });
    
    // 将所有屏幕添加到主容器
    Object.values(this.screens).forEach(screen => {
      app.appendChild(screen);
    });
  }

  // 切换显示指定名称的屏幕
  showScreen(name) {
    if (this.currentScreen) {
      this.currentScreen.classList.remove('active'); // 隐藏当前屏幕
    }
    
    this.currentScreen = this.screens[name]; // 更新当前屏幕
    this.currentScreen.classList.add('active'); // 显示新屏幕
  }

  // 预加载资源（如图片、音频等）
  async preloadAssets() {
    // 这里可以添加实际的资源预加载逻辑
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1500); // 用 setTimeout 模拟加载过程
    });
  }

  // 绑定各类事件（模块间切换、按钮点击等）
  setupEventListeners() {
    // 监听剧情模块的完成事件，切换到配对界面并启动配对
    this.storyController.on('complete', () => {
      this.showScreen('pairing');
      this.pairingEngine.start();
    });
    
    // 监听配对模块的完成事件，切换到海报界面并生成海报
    this.pairingEngine.on('complete', (cpData) => {
      this.showScreen('poster');
      this.posterGenerator.generate(cpData);
    });
    
    // 监听保存海报按钮的点击事件，执行保存操作
    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.posterGenerator.save();
    });
  }
}

// 导出 App 类，供外部使用
export default App;