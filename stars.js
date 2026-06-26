const stars = [];
const count = 40; // 低数量保证流畅度
const container = document.getElementById('stars');

// 初始化星星（用 transform 避免重排）
for (let i = 0; i < count; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.position = 'absolute';
  star.style.background = 'white';
  star.style.borderRadius = '50%';
  star.style.pointerEvents = 'none'; // 不阻挡页面交互

  // 存储原始位置（px 单位更稳定）
  star._x = Math.random() * window.innerWidth;
  star._y = Math.random() * window.innerHeight;
  star.style.width = Math.random() * 1.5 + 0.5 + 'px';
  star.style.height = star.style.width;
  star.style.transform = `translate(${star._x}px, ${star._y}px)`;

  // 随机漂移速度
  star.vx = (Math.random() - 0.5) * 0.3;
  star.vy = (Math.random() - 0.5) * 0.3;

  container.appendChild(star);
  stars.push(star);
}

// 星星自动漂移（核心修复：同步坐标到 DOM）
function drift() {
  stars.forEach(star => {
    star._x += star.vx;
    star._y += star.vy;

    // 边界反弹
    if (star._x < 0 || star._x > window.innerWidth) star.vx *= -1;
    if (star._y < 0 || star._y > window.innerHeight) star.vy *= -1;

    // ✅ 关键：将计算后的坐标实时渲染
    star.style.transform = `translate(${star._x}px, ${star._y}px)`;
  });
  requestAnimationFrame(drift);
}
drift();

// ✅ 统一躲避逻辑（立即更新位置）
function repelFrom(x, y) {
  stars.forEach(star => {
    const rect = star.getBoundingClientRect();
    const sx = rect.left + rect.width / 2;
    const sy = rect.top + rect.height / 2;

    const dx = sx - x;
    const dy = sy - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) { // 触摸点附近 100px 内触发躲避
      // 平方反比力度（自然不僵硬）
      const force = Math.pow((100 - dist) / 100, 2) * 0.2;
      star._x += dx * force;
      star._y += dy * force;
      
      // ✅ 立即更新 transform，避免延迟
      star.style.transform = `translate(${star._x}px, ${star._y}px)`;
    }
  });
}

// ✅ 合并事件监听（避免重复执行）
let lastTime = 0;
document.addEventListener('touchmove', (e) => {
  const now = performance.now();
  if (now - lastTime < 16) return; // 节流（匹配帧率）
  lastTime = now;
  
  const touch = e.touches[0];
  repelFrom(touch.clientX, touch.clientY);
}, { passive: true });

document.addEventListener('mousemove', (e) => {
  repelFrom(e.clientX, e.clientY);
});
/* ==================== 优化补充：窗口尺寸变化时校准星星边界（解决旋转/缩放后星星飘出露黑问题） ==================== */
window.addEventListener('resize', () => {
    stars.forEach(star => {
        // 强制限制星星在可视区域内
        if (star._x > window.innerWidth) star._x = window.innerWidth - 10;
        if (star._y > window.innerHeight) star._y = window.innerHeight - 10;
        if (star._x < 0) star._x = 10;
        if (star._y < 0) star._y = 10;
    });
});

/* ==================== 优化补充：多触摸点支持（解决多指触摸时星星不躲避问题） ==================== */
document.addEventListener('touchmove', (e) => {
    const now = performance.now();
    if (now - lastTime < 16) return;
    lastTime = now;
    // 遍历所有触摸点，每个点都触发躲避逻辑
    Array.from(e.touches).forEach(touch => {
        repelFrom(touch.clientX, touch.clientY);
    });
}, { passive: true });

/* ==================== 优化补充：页面隐藏时暂停动画（省电+避免后台计算异常） ==================== */
let animationId = requestAnimationFrame(drift); // 接管原有动画循环
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animationId = requestAnimationFrame(drift);
    }
});

/* ==================== 优化补充：极端情况星星复位（解决快速滑动后星星飘出边界露黑问题） ==================== */
setInterval(() => {
    stars.forEach(star => {
        // 超出屏幕50px外的星星自动复位到屏幕内
        if (star._x < -50 || star._x > window.innerWidth + 50 || 
            star._y < -50 || star._y > window.innerHeight + 50) {
            star._x = Math.random() * window.innerWidth;
            star._y = Math.random() * window.innerHeight;
        }
    });
}, 3000); // 每3秒检查一次
