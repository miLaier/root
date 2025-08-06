// src/utils/dom.js
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  // 设置属性
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  // 设置样式
  if (options.style) {
    Object.entries(options.style).forEach(([key, value]) => {
      element.style[key] = value;
    });
  }
  
  // 设置类名
  if (options.className) {
    element.className = options.className;
  }
  
  // 设置文本内容
  if (options.textContent) {
    element.textContent = options.textContent;
  }
  
  // 设置HTML内容
  if (options.html) {
    element.innerHTML = options.html;
  }
  
  // 设置数据属性
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }
  
  // 添加事件监听器
  if (options.on) {
    Object.entries(options.on).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  }
  
  return element;
}