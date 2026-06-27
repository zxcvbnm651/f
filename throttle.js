/**
 * 邮箱限流逻辑（完全保留原有视觉效果）
 * - 5秒限流，提示文字/样式和原版完全一致
 * - 仅拦截重复提交，不干扰原有邮件发送逻辑
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (!form) return;

    let lastSubmitTime = 0;
    const throttleTime = 5000; // 和原版一致的5秒限流

    // 捕获阶段拦截提交（优先级高于内嵌监听器）
    form.addEventListener('submit', function(e) {
        const now = Date.now();
        
        // 未到5秒，拦截提交并提示
        if (now - lastSubmitTime < throttleTime) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // 和原版完全一致的提示样式/文字
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.innerHTML = '<b>好茶需慢爻，心急则味散❌ 请等待5秒后再发送。</b>';
                setTimeout(() => resultDiv.innerHTML = '', 3000); // 和原版一致的3秒消失
            }
            return;
        }
        
        // 到时间后放行，让内嵌的fetch逻辑正常执行
        lastSubmitTime = now;
    }, true);
});
