document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');

    if (password !== confirmPassword) {
        messageDiv.textContent = '两次输入的密码不一致！';
        messageDiv.style.color = '#d8000c';
        return;
    }
    if (password.length < 6) {
        messageDiv.textContent = '密码长度不能少于6位！';
        messageDiv.style.color = '#d8000c';
        return;
    }
    // 简单邮箱格式校验
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        messageDiv.textContent = '邮箱格式不正确！';
        messageDiv.style.color = '#d8000c';
        return;
    }
    messageDiv.textContent = '注册成功！';
    messageDiv.style.color = '#008000';
    // 这里可以添加后续注册逻辑
});
