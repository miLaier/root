// src/modules/pairing.js
import { createElement } from '../utils/dom.js';
import interact from 'interactjs';
import '../components/pairing-screen.css';

class PairingEngine extends EventTarget {
  constructor(container) {
    super();
    this.container = container;
    this.elements = [];
    this.stageElements = [];
    this.initialPositions = new Map();
    this.matchButton = null;
    this.successCard = null;
    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.setupUI();
    this.setupInteractions();
    this.setupMatchButton();
  }

  setupUI() {
    // 创建舞台
    this.stage = createElement('div', {
      className: '舞台'
    });
    
    // 创建舞台中的固定位置
    const positionA = createElement('div', {
      className: 'stage-position position-a'
    });
    const positionB = createElement('div', {
      className: 'stage-position position-b'
    });
    
    this.stage.appendChild(positionA);
    this.stage.appendChild(positionB);
    
    // 创建10个元素
    for (let i = 1; i <= 10; i++) {
      const element = createElement('div', {
        className: `_${i} element`,
        'data-id': i.toString()
      });
      this.elements.push(element);
      this.container.appendChild(element);
      
      // 保存初始位置
      this.initialPositions.set(element, {
        left: element.style.left,
        top: element.style.top
      });
    }
    
    this.container.appendChild(this.stage);
    
    // 创建匹配按钮
    this.matchButton = createElement('button', {
      className: 'match-button inactive',
      textContent: '匹配'
    });
    this.container.appendChild(this.matchButton);
    
    // 创建成功卡片
    this.successCard = createElement('div', {
      className: 'success-card'
    });
    this.container.appendChild(this.successCard);
  }

  isOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom);
  }

  addToStage(element) {
    // 如果元素已经在舞台中，不做处理
    if (this.stageElements.includes(element)) {
      return;
    }
    
    // 如果舞台已满，移除最近的元素
    if (this.stageElements.length >= 2) {
      const nearestElement = this.findNearestElement(element);
      if (nearestElement) {
        this.removeFromStage(nearestElement);
      }
    }
    
    // 添加新元素到舞台
    this.stageElements.push(element);
    
    // 移动到舞台中的固定位置
    const position = this.stageElements.length === 1 ? 'position-a' : 'position-b';
    const stagePosition = this.stage.querySelector(`.${position}`);
    const stageRect = stagePosition.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const x = stageRect.left - elementRect.left + (stageRect.width - elementRect.width) / 2;
    const y = stageRect.top - elementRect.top + (stageRect.height - elementRect.height) / 2;
    
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.setAttribute('data-x', x);
    element.setAttribute('data-y', y);
    
    this.updateMatchButton();
  }

  setupInteractions() {
    interact('.element').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      listeners: {
        start: this.dragStartHandler.bind(this),
        move: this.dragMoveHandler.bind(this),
        end: this.dragEndHandler.bind(this)
      }
    });
  }

  dragStartHandler(event) {
    event.target.classList.add('dragging');
  }

  dragMoveHandler(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  dragEndHandler(event) {
    const element = event.target;
    element.classList.remove('dragging');
    
    // 检查是否在舞台区域内
    const elementRect = element.getBoundingClientRect();
    const stageRect = this.stage.getBoundingClientRect();
    
    if (this.isOverlapping(elementRect, stageRect)) {
      this.addToStage(element);
    } else {
      this.removeFromStage(element);
    }
  }

  removeFromStage(element) {
    const index = this.stageElements.indexOf(element);
    if (index > -1) {
      this.stageElements.splice(index, 1);
      
      // 重置到初始位置
      const initialPos = this.initialPositions.get(element);
      element.style.transform = 'none';
      element.removeAttribute('data-x');
      element.removeAttribute('data-y');
      element.style.left = initialPos.left;
      element.style.top = initialPos.top;
    }
    
    this.updateMatchButton();
  }

  findNearestElement(targetElement) {
    if (this.stageElements.length === 0) return null;
    
    const targetRect = targetElement.getBoundingClientRect();
    let nearest = null;
    let minDistance = Infinity;
    
    for (const element of this.stageElements) {
      const elementRect = element.getBoundingClientRect();
      const distance = this.calculateDistance(targetRect, elementRect);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = element;
      }
    }
    
    return nearest;
  }

  calculateDistance(rect1, rect2) {
    const center1 = {
      x: rect1.left + rect1.width / 2,
      y: rect1.top + rect1.height / 2
    };
    const center2 = {
      x: rect2.left + rect2.width / 2,
      y: rect2.top + rect2.height / 2
    };
    
    return Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + 
      Math.pow(center1.y - center2.y, 2)
    );
  }

  updateMatchButton() {
    if (this.stageElements.length === 2) {
      this.matchButton.classList.remove('inactive');
      this.matchButton.classList.add('active');
    } else {
      this.matchButton.classList.remove('active');
      this.matchButton.classList.add('inactive');
    }
  }

  setupMatchButton() {
    this.matchButton.addEventListener('click', () => {
      if (this.stageElements.length !== 2) return;
      
      const element1 = parseInt(this.stageElements[0].dataset.id);
      const element2 = parseInt(this.stageElements[1].dataset.id);
      
      if (this.checkMatch(element1, element2)) {
        this.showSuccessCard(element1, element2);
        // 播放成功音效
        const audio = new Audio('/sounds/success.mp3');
        audio.play();
      }
    });
  }

  checkMatch(element1, element2) {
    // 这里实现匹配规则
    // 示例：相邻数字为匹配
    return Math.abs(element1 - element2) === 1;
  }

  showSuccessCard(element1, element2) {
    this.successCard.innerHTML = `
      <h3>匹配成功！</h3>
      <p>元素 ${element1} 和元素 ${element2} 形成了完美的组合！</p>
    `;
    this.successCard.classList.add('show');
    
    setTimeout(() => {
      this.successCard.classList.remove('show');
    }, 3000);
  }

  start() {
    // 初始化或重置配对游戏
    this.stageElements = [];
    this.updateMatchButton();
  }

  on(eventName, callback) {
    // 事件处理
    if (eventName === 'complete') {
      this.onComplete = callback;
    }
  }
}

export default PairingEngine;