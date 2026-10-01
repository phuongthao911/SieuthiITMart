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
    const pwdInput = document.getElementById("loginPassword");
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    const password = pwdInput ? pwdInput.value : "";

    if (!phone) {
        ITMForm.showError("loginPhone", "Vui lòng nhập số điện thoại của bạn!");
        return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone) && phone.length < 9) {
        ITMForm.showError("loginPhone", "Số điện thoại không đúng định dạng (Ví dụ: 098122445)!");
        return;
    }

    if (!password) {
        ITMForm.showError("loginPassword", "Vui lòng nhập mật khẩu tài khoản!");
        return;
    }

    ITMForm.clearAll();

    const user = { phone: phone, name: "Khách hàng " + phone.slice(-4), isLoggedIn: true };
    localStorage.setItem("itmart_user", JSON.stringify(user));

    // Khôi phục giỏ hàng và đơn hàng đã lưu của tài khoản này
    const savedCart = localStorage.getItem(`itmart_cart_${phone}`);
    if (savedCart) localStorage.setItem("itmart_cart", savedCart);
    const savedOrders = localStorage.getItem(`itmart_orders_${phone}`);
    if (savedOrders) localStorage.setItem("itmart_orders", savedOrders);

    ITMToast.success("Chào mừng " + user.name + " đã trở lại mua sắm!", "Đăng nhập thành công");
    setTimeout(() => {
        window.location.href = getRedirectTarget();
    }, 800);
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

    if (!name) {
        ITMForm.showError("regName", "Vui lòng nhập họ và tên của bạn!");
        return;
    }

    if (!phone) {
        ITMForm.showError("regPhone", "Vui lòng nhập số điện thoại!");
        return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone) && phone.length < 9) {
        ITMForm.showError("regPhone", "Số điện thoại không đúng định dạng (Ví dụ: 098122445)!");
        return;
    }

    if (!pwd) {
        ITMForm.showError("regPassword", "Vui lòng thiết lập mật khẩu!");
        return;
    }

    if (pwd.length < 6) {
        ITMForm.showError("regPassword", "Mật khẩu phải có tối thiểu 6 ký tự!");
        return;
    }

    if (pwd !== confirmPwd) {
        ITMForm.showError("regConfirmPassword", "Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
        return;
    }

    ITMForm.clearAll();

    const user = { phone: phone, name: name, isLoggedIn: true };
    localStorage.setItem("itmart_user", JSON.stringify(user));

    // Khôi phục giỏ hàng và đơn hàng nếu số điện thoại này đã có dữ liệu trước đó
    const savedCart = localStorage.getItem(`itmart_cart_${phone}`);
    if (savedCart) localStorage.setItem("itmart_cart", savedCart);
    const savedOrders = localStorage.getItem(`itmart_orders_${phone}`);
    if (savedOrders) localStorage.setItem("itmart_orders", savedOrders);

    ITMToast.success("Chúc mừng bạn được tặng voucher CHAOBANMOI (20.000đ)!", "Đăng ký thành công");
    setTimeout(() => {
        window.location.href = getRedirectTarget();
    }, 1000);
}

// Khởi tạo tab từ URL query (?action=register)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "register") {
        switchAuthTab("register");
    }
});
