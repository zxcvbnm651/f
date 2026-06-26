/* ==================== 邮箱发送频率限制（5秒一次） ==================== */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (!form) return;

    let lastSubmitTime = 0;
    const throttleTime = 5000; // 5秒（单位：毫秒）

    // 在捕获阶段拦截提交事件
    form.addEventListener('submit', function(e) {
        const now = Date.now();
        
        // 检查距离上次提交是否不足5秒
        if (now - lastSubmitTime < throttleTime) {
            e.preventDefault();        // 阻止表单提交
            e.stopImmediatePropagation(); // 阻止其他监听器执行
            
            // 显示提示信息
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.innerHTML = '<b>好茶需慢爻，心急则味散❌ 请等待5秒后再发送。</b>';
                
                // 3秒后清除提示
                setTimeout(() => {
                    resultDiv.innerHTML = '';
                }, 3000);
            }
            return;
        }
        
        // 记录本次提交时间
        lastSubmitTime = now;
    }, true); // 使用捕获阶段，确保在原文件监听器之前执行
});
