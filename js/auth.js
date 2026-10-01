/**
 * IT MART - AUTH CONTROLLER (auth.js)
 * Tách riêng hoàn toàn từ Log_in.html
 * Quản lý: Chuyển tab Đăng nhập/Đăng ký, Ẩn/Hiện mật khẩu, Validation, LocalStorage session
 */

function switchAuthTab(tab) {
    const loginForm = document.getElementById("loginForm");
    const regForm = document.getElementById("registerForm");
    const tabLogin = document.getElementById("tabLogin");
    const tabReg = document.getElementById("tabRegister");
    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");

    if (tab === "login") {
        if (loginForm) loginForm.style.display = "block";
        if (regForm) regForm.style.display = "none";
        if (tabLogin) tabLogin.classList.add("active");
        if (tabReg) tabReg.classList.remove("active");
        if (title) title.textContent = "Chào Mừng Trở Lại!";
        if (subtitle) subtitle.textContent = "Đăng nhập để nhận ưu đãi tích điểm và mã giảm giá";
    } else {
        if (loginForm) loginForm.style.display = "none";
        if (regForm) regForm.style.display = "block";
        if (tabReg) tabReg.classList.add("active");
        if (tabLogin) tabLogin.classList.remove("active");
        if (title) title.textContent = "Tạo Tài Khoản Mới";
        if (subtitle) subtitle.textContent = "Đăng ký thành viên IT Mart để nhận ngay voucher 20.000đ";
    }
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input || !icon) return;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function getRedirectTarget() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
        try {
            return decodeURIComponent(redirect);
        } catch (e) {
            return redirect;
        }
    }
    return "index.html";
}

function handleLogin(e) {
    e.preventDefault();
    const phoneInput = document.getElementById("loginPhone");
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    if (!phone) {
        alert("Vui lòng nhập số điện thoại!");
        return;
    }

    const user = { phone: phone, name: "Khách hàng " + phone.slice(-4), isLoggedIn: true };
    localStorage.setItem("itmart_user", JSON.stringify(user));

    // Khôi phục giỏ hàng và đơn hàng đã lưu của tài khoản này
    const savedCart = localStorage.getItem(`itmart_cart_${phone}`);
    if (savedCart) localStorage.setItem("itmart_cart", savedCart);
    const savedOrders = localStorage.getItem(`itmart_orders_${phone}`);
    if (savedOrders) localStorage.setItem("itmart_orders", savedOrders);

    alert("Đăng nhập thành công! Chào mừng " + user.name);
    window.location.href = getRedirectTarget();
}

function handleRegister(e) {
    e.preventDefault();
    const nameInput = document.getElementById("regName");
    const phoneInput = document.getElementById("regPhone");
    const pwdInput = document.getElementById("regPassword");
    const confirmPwdInput = document.getElementById("regConfirmPassword");

    if (!nameInput || !phoneInput || !pwdInput || !confirmPwdInput) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const pwd = pwdInput.value;
    const confirmPwd = confirmPwdInput.value;

    if (pwd !== confirmPwd) {
        alert("Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
        return;
    }

    if (pwd.length < 6) {
        alert("Mật khẩu phải có tối thiểu 6 ký tự!");
        return;
    }

    const user = { phone: phone, name: name, isLoggedIn: true };
    localStorage.setItem("itmart_user", JSON.stringify(user));

    // Khôi phục giỏ hàng và đơn hàng nếu số điện thoại này đã có dữ liệu trước đó
    const savedCart = localStorage.getItem(`itmart_cart_${phone}`);
    if (savedCart) localStorage.setItem("itmart_cart", savedCart);
    const savedOrders = localStorage.getItem(`itmart_orders_${phone}`);
    if (savedOrders) localStorage.setItem("itmart_orders", savedOrders);

    alert("Đăng ký tài khoản thành công! Tặng bạn mã giảm giá CHAOBANMOI (20.000đ).");
    window.location.href = getRedirectTarget();
}

// Khởi tạo tab từ URL query (?action=register)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "register") {
        switchAuthTab("register");
    }
});
