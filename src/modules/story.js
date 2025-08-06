// src/modules/story.js
import { createElement } from '../utils/dom.js';

class StoryController extends EventTarget {
  constructor(container) {
    super(); 
    this.container = container;
    this._events = {};
    
    this.stages = [
      {
        bg: 'lab_intro.webp',
        dialogs: [
          { character: '博士', text: '元素们因单身不稳定，请帮它们配对！', position: 'left' },
          { character: '钠(Na)', text: '我易燃易爆炸，需要冷静的伴侣...', position: 'right' }
        ]
      },
      {
        bg: 'elements_meet.webp',
        dialogs: [
          { character: '氯(Cl)', text: '我能灭火，但独自有毒...', position: 'left' },
          { character: '氢(H)', text: '我轻盈自由，寻找能稳定我的伙伴', position: 'right' }
        ]
      },
      {
        bg: 'pairing_intro.webp',
        dialogs: [
          { character: '氧(O)', text: '滑动我们，创造奇妙的化学爱情！', position: 'center' }
        ]
      }
    ];
    this.currentStage = 0;
    this.init();
  }

  init() {
    this.container.innerHTML = '';
    
    // 创建背景
    this.bgElement = createElement('div', {
      className: 'story-bg',
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover'
      }
    });
    
    // 创建对话框容器
    this.dialogContainer = createElement('div', {
      className: 'dialog-container',
      style: {
        position: 'absolute',
        bottom: '20%',
        width: '100%',
        padding: '0 20px'
      }
    });
    
    this.container.appendChild(this.bgElement);
    this.container.appendChild(this.dialogContainer);
    
    // 下一步按钮
    this.nextButton = createElement('button', {
      className: 'next-btn',
      textContent: '下一步',
      style: {
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 30px',
        fontSize: '16px'
      }
    });
    
    this.container.appendChild(this.nextButton);
    this.nextButton.addEventListener('click', () => this.next());
  }

  start() {
    this.currentStage = 0;
    this.renderStage(this.currentStage);
  }

  renderStage(index) {
    const stage = this.stages[index];
    
    // 设置背景
    this.bgElement.style.backgroundImage = `url(public/images/${stage.bg})`;
    
    // 渲染对话
    this.dialogContainer.innerHTML = '';
    stage.dialogs.forEach(dialog => {
      const dialogElement = createElement('div', {
        className: `dialog ${dialog.position}`,
        html: `
          <div class="character">${dialog.character}</div>
          <div class="text">${dialog.text}</div>
        `,
        style: {
          marginBottom: '15px',
          animation: 'fadeIn 0.5s forwards'
        }
      });
      
      this.dialogContainer.appendChild(dialogElement);
    });
  }

  next() {
    this.currentStage++;
    
    if (this.currentStage < this.stages.length) {
      this.renderStage(this.currentStage);
    } else {
      // 剧情结束，触发事件
      const event = new CustomEvent('complete');
      this.dispatchEvent(event);
    }
  }

  // 事件监听方法
  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }
}

export default StoryController;