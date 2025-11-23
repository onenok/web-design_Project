function initSignUpForm(password, confirmPassword) {
    [password, confirmPassword].forEach(input => {
        input.addEventListener('input', () => {
            if (password.value === confirmPassword.value) {
                confirmPassword.setCustomValidity('');
                confirmPassword.classList.remove('invalid');
            } else {
                confirmPassword.setCustomValidity('密碼和確認密碼不匹配');
                confirmPassword.classList.add('invalid');
            }
        });
    });

    // 增加顯示/隱藏密碼的功能
    const togglePasswordBtn = password.parentElement.querySelector('#togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = password.type === 'password';
            password.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.textContent = isPassword ? '👁️' : '🙈'; // 可選：改變按鈕圖示
        });
    }
}

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const password = node.querySelector('#password');
                const confirmPassword = node.querySelector('#confirm-password');
                if (password && confirmPassword) {
                    initSignUpForm(password, confirmPassword);
                }
            }
        });
    });
});

observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });