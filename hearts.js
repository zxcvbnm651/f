/* ==================== 终极修复：单点单爱心（跨端统一方案）====================
 * 原理：使用 Pointer Events API。
 * 它能自动合并 Mouse、Touch 和 Pen 事件，浏览器不会再搞出两套坐标。
 * 这是微软提出、现在所有现代浏览器都支持的官方标准。
 */

// 1. 找到你要绑定爱心的容器（通常是 body 或 document）
//    如果你的爱心是点哪里冒哪里，用 document。
const heartTarget = document;

// 2. 监听 pointerdown (手指按下/鼠标按下)
heartTarget.addEventListener('pointerdown', function(e) {
    // 只响应主按键（鼠标左键 / 手指触摸）
    if (e.button !== 0) return;

    // 3. 关键：阻止浏览器默认行为（防止滚动、缩放、复制粘贴菜单）
    //    同时也阻止了浏览器将 Touch 事件转换成 Mouse 事件的冲动
    e.preventDefault();

    // 4. 创建爱心
    //    请确保这里调用的就是你原来的创建函数。
    //    假设你的函数叫 createHeart(x, y)，或者你在代码里直接操作 DOM。
    //    这里我用 createHeart 举例，如果你的函数名不一样，请改掉。
    
    // --- 如果你的代码里有 createHeart 函数 ---
    if (typeof createHeart === 'function') {
        createHeart(e.clientX, e.clientY);
    } 
    // --- 如果你的代码是直接写死的 DOM 操作（比如 appendChild）---
    // 请把你原来在 'click' 或 'touchstart' 里的创建逻辑复制到这里：
    else {
        const heart = document.createElement('div');
        heart.className = 'heart'; // 确保你有 .heart 的 CSS
        heart.innerHTML = '❤️'; // 或者你用的其他符号
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.zIndex = '9999';
        heart.style.fontSize = '30px';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        
        document.body.appendChild(heart);
        
        // 动画
        requestAnimationFrame(() => {
            heart.style.transform = `translateY(-50px) scale(1.5)`;
            heart.style.opacity = '0';
        });
        
        // 移除
        setTimeout(() => heart.remove(), 1000);
    }

}, { passive: false }); // 必须设为 false，这样 e.preventDefault() 才会生效


// 5. 辅助优化：禁止双击缩放（这经常是导致坐标错乱的元凶之一）
//    在你的 index.html 里，确保 viewport 是这样的：
//    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no">
