/**
 * 爱心特效逻辑（完全保留原有视觉效果）
 * - 单点单爱心，和原版一致的❤️ emoji、动画时长、位移
 * - 修复click/pointerdown冲突，避免双爱心
 */
const heartTarget = document;

// 统一监听pointerdown（兼容鼠标/触摸/笔，和原版一致的触发逻辑）
heartTarget.addEventListener('pointerdown', function(e) {
    if (e.button !== 0) return; // 只响应主按键（左键/手指）
    e.preventDefault(); // 阻止默认行为（避免滚动/缩放冲突）

    // 兼容两种爱心创建逻辑（和原版完全一致）
    if (typeof createHeart === 'function') {
        createHeart(e.clientX, e.clientY);
    } else {
        // 和原版完全一致的爱心样式/动画
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 24px; /* 和原版一致的大小 */
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
            transition: all 1.5s ease-out; /* 和原版一致的1.5秒动画 */
        `;
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
            // 和原版完全一致的动画：上浮120px+放大1.5倍+淡出
            heart.style.transform = 'translateY(-120px) scale(1.5)';
            heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 1500); // 和原版一致的移除时机
    }
}, { passive: false });

// 移除内嵌的click监听器（避免双爱心，无视觉影响）
const oldListeners = getEventListeners ? getEventListeners(document).click : [];
if (oldListeners.length > 0) {
    oldListeners.forEach(listener => {
        if (listener.listener.toString().includes('createHeart')) {
            document.removeEventListener('click', listener.listener);
        }
    });
}
