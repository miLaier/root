// src/modules/poster.js
class PosterGenerator {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector('#poster-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.init();
  }

  init() {
    // 设置Canvas尺寸（适应设备）
    this.canvas.width = Math.min(window.innerWidth * 0.9, 750);
    this.canvas.height = this.canvas.width * 1.5; // 1.5:1 比例
    
    // 设置Canvas样式
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '20px auto';
    this.canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }

  generate(cpData) {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制背景
    this.drawBackground();
    
    // 绘制标题
    this.drawTitle('你们的化学CP诞生了！');
    
    // 绘制配对元素
    this.drawElements(cpData.elements);
    
    // 绘制反应式
    this.drawReaction(cpData.reaction);
    
    // 绘制用途描述
    this.drawUsage(cpData.usage);
    
    // 绘制二维码（用于分享）
    this.drawQRCode();
  }

  drawBackground() {
    // 渐变背景
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#ffecd2');
    gradient.addColorStop(1, '#fcb69f');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 装饰元素
    this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const r = Math.random() * 5 + 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawTitle(text) {
    this.ctx.font = 'bold 24px "PingFang SC"';
    this.ctx.fillStyle = '#d23669';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, 50);
  }

  drawElements(elements) {
    const centerX = this.canvas.width / 2;
    const startY = 100;
    
    elements.forEach((element, index) => {
      const x = centerX - 80 + index * 80;
      const y = startY;
      
      // 绘制圆形背景
      this.ctx.fillStyle = index === 0 ? '#ff9a9e' : '#a6c1ee';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 30, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制元素符号
      this.ctx.font = 'bold 24px "PingFang SC"';
      this.ctx.fillStyle = '#fff';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(element, x, y);
      
      // 绘制加号（在元素之间）
      if (index < elements.length - 1) {
        this.ctx.font = 'bold 20px "PingFang SC"';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('+', x + 40, y);
      }
    });
  }

  drawReaction(reaction) {
    this.ctx.font = '20px "PingFang SC"';
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(reaction, this.canvas.width / 2, 180);
    
    // 绘制箭头
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2 - 30, 170);
    this.ctx.lineTo(this.canvas.width / 2 + 30, 170);
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawUsage(usage) {
    this.ctx.font = 'bold 20px "PingFang SC"';
    this.ctx.fillStyle = '#d23669';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('甜蜜用途', this.canvas.width / 2, 230);
    
    this.ctx.font = '16px "PingFang SC"';
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'left';
    
    // 分段显示用途
    const maxWidth = this.canvas.width - 40;
    let y = 260;
    
    usage.forEach(item => {
      const lines = this.wrapText(item, maxWidth);
      lines.forEach(line => {
        this.ctx.fillText(line, 20, y);
        y += 25;
      });
      y += 10; // 段间距
    });
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    return lines;
  }

  drawQRCode() {
    // 这里简化处理，实际项目应生成真实二维码
    const qrSize = 80;
    const qrX = this.canvas.width - qrSize - 20;
    const qrY = this.canvas.height - qrSize - 20;
    
    // 绘制二维码背景
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(qrX, qrY, qrSize, qrSize);
    
    // 绘制二维码占位符
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px "PingFang SC"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('扫码分享', qrX + qrSize / 2, qrY + qrSize + 15);
  }

  save() {
    // 生成图片数据
    const dataUrl = this.canvas.toDataURL('image/jpeg', 0.9);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = '化学CP海报.jpg';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 在微信环境中需要特殊处理（这里简化）
    alert('海报已保存到相册！');
  }
}

export default PosterGenerator;