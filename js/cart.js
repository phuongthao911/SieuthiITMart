/**
 * IT MART - HỆ THỐNG GIỎ HÀNG & THANH TOÁN CHUẨN THƯƠNG MẠI ĐIỆN TỬ
 * Tính năng như web chạy thật:
 * 1. Cart Drawer trượt mượt mà, đồng bộ LocalStorage
 * 2. Kho Voucher có sẵn (FREESHIP, ITMART10, CHAOBANMOI) áp dụng 1-click
 * 3. Tự động điền thông tin người dùng đã đăng nhập khi checkout
 * 4. Tích hợp thanh toán Chuyển khoản QR Ngân hàng (VietQR MBBank)
 * 5. Quản lý Lịch sử đơn hàng: Hủy đơn hàng, Mua lại đơn cũ (Re-order)
 * 6. Tính phí ship thông minh, miễn phí ship từ 300.000đ
 */

const CartSystem = {
    items: [],
    appliedCoupon: JSON.parse(localStorage.getItem("itmart_coupon")) || null,
    
    // Danh sách mã giảm giá hợp lệ
    coupons: {
        "ITMART10": { code: "ITMART10", discountPercent: 10, desc: "Giảm 10% tổng đơn hàng" },
        "FREESHIP": { code: "FREESHIP", freeShip: true, desc: "Miễn phí vận chuyển toàn quốc (đơn từ 300k)" },
        "CHAOBANMOI": { code: "CHAOBANMOI", discountAmount: 20000, desc: "Giảm 20.000đ cho khách hàng mới" }
    },

    getUser() {
        try {
            const user = JSON.parse(localStorage.getItem("itmart_user"));
            return (user && user.isLoggedIn) ? user : null;
        } catch (e) {
            return null;
        }
    },

    isLoggedIn() {
        return !!this.getUser();
    },

    loadCart() {
        const user = this.getUser();
        if (user) {
            // ĐÃ ĐĂNG NHẬP / ĐĂNG KÝ: Giữ lại giỏ hàng vĩnh viễn theo tài khoản, không bị mất khi reload
            const key = `itmart_cart_${user.phone}`;
            const saved = localStorage.getItem(key) || localStorage.getItem("itmart_cart");
            this.items = saved ? JSON.parse(saved) : [];
        } else {
            // CHƯA ĐĂNG NHẬP: Khi reload lại web là giỏ hàng bị mất hoàn toàn
            this.items = [];
            localStorage.removeItem("itmart_cart");
        }
    },

    getOrders() {
        const user = this.getUser();
        if (!user) {
            // Chưa đăng nhập: Không lưu lịch sử đơn hàng / reload là mất
            return [];
        }
        const key = `itmart_orders_${user.phone}`;
        const orders = localStorage.getItem(key) || localStorage.getItem("itmart_orders");
        return orders ? JSON.parse(orders) : [];
    },

    saveOrders(orders) {
        const user = this.getUser();
        if (user) {
            const key = `itmart_orders_${user.phone}`;
            localStorage.setItem(key, JSON.stringify(orders));
            localStorage.setItem("itmart_orders", JSON.stringify(orders));
        }
    },

    init() {
        this.loadCart();
        this.renderDrawer();
        this.bindEvents();
        this.updateBadge();
    },

    bindEvents() {
        // Mở drawer giỏ hàng khi click nút trên header
        const cartBtn = document.getElementById("cartHeaderBtn");
        if (cartBtn) {
            cartBtn.addEventListener("click", () => this.openDrawer());
        }

        // Đóng drawer khi click nút đóng hoặc backdrop
        const closeBtn = document.getElementById("cartCloseBtn");
        const backdrop = document.getElementById("cartBackdrop");
        if (closeBtn) closeBtn.addEventListener("click", () => this.closeDrawer());
        if (backdrop) backdrop.addEventListener("click", () => this.closeDrawer());

        // Đóng modal khi bấm vào vùng ngoài (backdrop)
        ["checkoutModal", "orderSuccessModal", "orderHistoryModal"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("click", (e) => {
                    if (e.target === el) {
                        el.classList.remove("active");
                        document.body.style.overflow = "";
                    }
                });
            }
        });

        // Phím ESC để đóng
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeDrawer();
                this.closeCheckoutModal();
                this.closeOrderHistoryModal();
                this.closeSuccessModal();
                this.closeAuthRequiredModal();
            }
        });
    },

    openDrawer() {
        const drawer = document.getElementById("cartDrawer");
        const backdrop = document.getElementById("cartBackdrop");
        if (drawer && backdrop) {
            this.renderDrawer();
            drawer.classList.add("active");
            backdrop.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    },

    closeDrawer() {
        const drawer = document.getElementById("cartDrawer");
        const backdrop = document.getElementById("cartBackdrop");
        if (drawer && backdrop) {
            drawer.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    save() {
        const user = this.getUser();
        if (user) {
            // ĐÃ ĐĂNG NHẬP / ĐĂNG KÝ: Lưu vĩnh viễn vào tài khoản người dùng
            const key = `itmart_cart_${user.phone}`;
            localStorage.setItem(key, JSON.stringify(this.items));
            localStorage.setItem("itmart_cart", JSON.stringify(this.items));
        } else {
            // Chưa đăng nhập: không lưu persistent, reload sẽ mất
            this.items = [];
            localStorage.removeItem("itmart_cart");
        }

        if (this.appliedCoupon) {
            localStorage.setItem("itmart_coupon", JSON.stringify(this.appliedCoupon));
        } else {
            localStorage.removeItem("itmart_coupon");
        }
        this.updateBadge();
    },

    addItem(productId, quantity = 1) {
        // Kiểm tra bắt buộc đăng nhập để mua hàng
        if (!this.isLoggedIn()) {
            this.showAuthRequiredModal("thêm sản phẩm vào giỏ hàng");
            return;
        }

        const product = typeof PRODUCTS !== "undefined" ? PRODUCTS.find(p => p.id === productId) : null;
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.salePrice,
                originalPrice: product.originalPrice,
                image: product.image,
                unit: product.unit,
                quantity: quantity
            });
        }

        this.save();
        this.renderDrawer();

        if (typeof showToast === "function") {
            showToast(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
        }
    },

    updateQuantity(productId, delta) {
        const item = this.items.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        this.save();
        this.renderDrawer();
    },

    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        const name = item ? item.name : "Sản phẩm";
        this.items = this.items.filter(i => i.id !== productId);
        this.save();
        this.renderDrawer();

        if (typeof showToast === "function") {
            showToast(`Đã xóa "${name}" khỏi giỏ hàng`, "info");
        }
    },

    async clearCart() {
        if (this.items.length === 0) return;
        const confirmed = await ITMDialog.confirm({
            title: "Làm trống giỏ hàng",
            message: "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?",
            type: "danger",
            confirmText: "Xóa toàn bộ",
            cancelText: "Giữ lại",
            icon: "fa-solid fa-trash-can"
        });
        if (!confirmed) return;

        this.items = [];
        this.appliedCoupon = null;
        this.save();
        this.renderDrawer();
        ITMToast.info("Đã làm trống giỏ hàng!");
    },

    applyCoupon(code) {
        const cleanCode = (code || "").trim().toUpperCase();
        if (!cleanCode) {
            ITMForm.showError("couponInput", "Vui lòng nhập mã giảm giá trước khi áp dụng!");
            return;
        }

        let coupon = this.coupons[cleanCode];
        if (!coupon) {
            try {
                const storedCoupons = JSON.parse(localStorage.getItem("itmart_coupons")) || [];
                const found = storedCoupons.find(c => c.code.toUpperCase() === cleanCode);
                if (found) {
                    coupon = {
                        code: found.code,
                        freeShip: found.type === "freeship",
                        discountPercent: found.type === "percent" ? found.value : 0,
                        discountAmount: found.type === "amount" ? found.value : 0,
                        minOrder: found.minOrder || 0,
                        desc: found.desc
                    };
                }
            } catch (e) {}
        }

        if (!coupon) {
            ITMForm.showError("couponInput", `Mã giảm giá "${cleanCode}" không hợp lệ hoặc đã hết hạn! Thử mã: ITMART10 hoặc FREESHIP`);
            return;
        }

        // Kiểm tra điều kiện đơn tối thiểu
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (coupon.minOrder && subtotal < coupon.minOrder) {
            ITMForm.showError("couponInput", `Mã "${cleanCode}" chỉ áp dụng cho đơn từ ${(coupon.minOrder).toLocaleString("vi-VN")} đ trở lên!`);
            return;
        }

        ITMForm.clearError("couponInput");
        this.appliedCoupon = coupon;
        this.save();
        this.renderDrawer();
        ITMToast.success(`Đã áp dụng mã "${cleanCode}": ${coupon.desc}`, "Áp dụng voucher");
    },

    removeCoupon() {
        this.appliedCoupon = null;
        this.save();
        this.renderDrawer();
        if (typeof showToast === "function") {
            showToast("Đã hủy áp dụng mã giảm giá", "info");
        }
    },

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 30000;
        let discount = 0;

        if (this.appliedCoupon) {
            if (this.appliedCoupon.freeShip) {
                shippingFee = 0;
            }
            if (this.appliedCoupon.discountPercent) {
                discount = Math.round((subtotal * this.appliedCoupon.discountPercent) / 100);
            }
            if (this.appliedCoupon.discountAmount) {
                discount = Math.min(this.appliedCoupon.discountAmount, subtotal);
            }
        }

        const total = Math.max(0, subtotal - discount + shippingFee);

        return { subtotal, shippingFee, discount, total };
    },

    updateBadge() {
        const badge = document.getElementById("cartBadgeCount");
        if (!badge) return;

        const totalQty = this.items.reduce((sum, i) => sum + i.quantity, 0);
        badge.textContent = totalQty;
        badge.style.display = totalQty > 0 ? "flex" : "none";
    },

    renderDrawer() {
        const container = document.getElementById("cartDrawerBody");
        const footer = document.getElementById("cartDrawerFooter");
        const countSpan = document.getElementById("cartDrawerCount");
        if (!container || !footer) return;

        const totalQty = this.items.reduce((sum, i) => sum + i.quantity, 0);
        if (countSpan) countSpan.textContent = `(${totalQty} món)`;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h4>Giỏ hàng của bạn đang trống</h4>
                    <p>Hãy thêm các sản phẩm sữa tươi ngon vào giỏ để nhận ưu đãi vận chuyển nhé!</p>
                    <button class="btn-continue-shopping" onclick="CartSystem.closeDrawer()">
                        Tiếp tục mua sắm
                    </button>
                </div>
            `;
            footer.style.display = "none";
            return;
        }

        footer.style.display = "block";

        // Render danh sách sản phẩm
        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='./images/photo.jpg';">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-unit">ĐVT: ${item.unit}</div>
                    <div class="cart-item-price">${formatVND(item.price)}</div>
                    <div class="cart-item-actions">
                        <div class="cart-qty-control">
                            <button onclick="CartSystem.updateQuantity('${item.id}', -1)" title="Giảm"><i class="fa-solid fa-minus"></i></button>
                            <span>${item.quantity}</span>
                            <button onclick="CartSystem.updateQuantity('${item.id}', 1)" title="Tăng"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <button class="cart-item-remove" onclick="CartSystem.removeItem('${item.id}')" title="Xóa món này">
                            <i class="fa-regular fa-trash-can"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `).join("");

        // Render tổng tiền, kho voucher có sẵn và form voucher
        const { subtotal, shippingFee, discount, total } = this.calculateTotals();

        footer.innerHTML = `
            <!-- KHO VOUCHER CÓ SẴN (1-CLICK ÁP DỤNG) -->
            <div class="cart-voucher-wallet">
                <div class="wallet-title"><i class="fa-solid fa-gift"></i> Voucher dành cho bạn (Bấm để dùng):</div>
                <div class="voucher-wallet-chips">
                    <button type="button" class="wallet-chip ${this.appliedCoupon && this.appliedCoupon.code === 'FREESHIP' ? 'applied' : ''}" 
                            onclick="CartSystem.applyCoupon('FREESHIP')">
                        <strong>FREESHIP</strong>
                        <span>Freeship 300k</span>
                    </button>
                    <button type="button" class="wallet-chip ${this.appliedCoupon && this.appliedCoupon.code === 'ITMART10' ? 'applied' : ''}" 
                            onclick="CartSystem.applyCoupon('ITMART10')">
                        <strong>ITMART10</strong>
                        <span>Giảm 10%</span>
                    </button>
                    <button type="button" class="wallet-chip ${this.appliedCoupon && this.appliedCoupon.code === 'CHAOBANMOI' ? 'applied' : ''}" 
                            onclick="CartSystem.applyCoupon('CHAOBANMOI')">
                        <strong>CHAOBANMOI</strong>
                        <span>Giảm 20.000đ</span>
                    </button>
                </div>
            </div>

            <!-- Ô nhập mã voucher thủ công -->
            <div class="cart-coupon-box">
                ${this.appliedCoupon ? `
                    <div class="applied-coupon">
                        <div>
                            <strong><i class="fa-solid fa-ticket"></i> ${this.appliedCoupon.code}</strong>
                            <p style="font-size: 12px; color: var(--secondary);">${this.appliedCoupon.desc}</p>
                        </div>
                        <button class="btn-remove-coupon" onclick="CartSystem.removeCoupon()">Hủy</button>
                    </div>
                ` : `
                    <div class="coupon-form">
                        <input type="text" id="couponInput" placeholder="Hoặc nhập mã ưu đãi khác..." maxlength="15">
                        <button type="button" onclick="CartSystem.applyCoupon(document.getElementById('couponInput').value)">Áp dụng</button>
                    </div>
                `}
            </div>

            <!-- Price Breakdown -->
            <div class="cart-summary-rows">
                <div class="summary-row">
                    <span>Tạm tính:</span>
                    <span>${formatVND(subtotal)}</span>
                </div>
                ${discount > 0 ? `
                    <div class="summary-row" style="color: var(--secondary); font-weight: 600;">
                        <span>Giảm giá (Voucher):</span>
                        <span>-${formatVND(discount)}</span>
                    </div>
                ` : ''}
                <div class="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>${shippingFee === 0 ? '<strong style="color: var(--secondary);">Miễn phí</strong>' : formatVND(shippingFee)}</span>
                </div>
                ${subtotal < 300000 ? `
                    <div class="free-shipping-progress">
                        <i class="fa-solid fa-circle-info"></i>
                        <span>Mua thêm <strong>${formatVND(300000 - subtotal)}</strong> để được <strong>FREESHIP</strong>!</span>
                    </div>
                ` : `
                    <div class="free-shipping-success">
                        <i class="fa-solid fa-circle-check"></i> Đơn hàng đủ điều kiện <strong>Miễn phí vận chuyển</strong>!
                    </div>
                `}
                <div class="summary-row total-row">
                    <span>Tổng thanh toán:</span>
                    <span class="total-price">${formatVND(total)}</span>
                </div>
            </div>

            <!-- Cart Buttons -->
            <div class="cart-footer-buttons">
                <button class="btn-checkout" onclick="CartSystem.openCheckoutModal()">
                    <i class="fa-solid fa-lock"></i> Tiến hành Đặt Hàng
                </button>
                <button class="btn-clear-cart" onclick="CartSystem.clearCart()">
                    <i class="fa-solid fa-trash-can"></i> Xóa tất cả
                </button>
            </div>
        `;
    },

    openCheckoutModal() {
        if (!this.isLoggedIn()) {
            this.showAuthRequiredModal("tiến hành thanh toán");
            return;
        }

        if (this.items.length === 0) return;
        this.closeDrawer();

        const modal = document.getElementById("checkoutModal");
        if (!modal) return;

        const { subtotal, shippingFee, discount, total } = this.calculateTotals();
        
        // Tự động điền thông tin người dùng nếu đã đăng nhập
        const savedUser = JSON.parse(localStorage.getItem("itmart_user"));
        if (savedUser && savedUser.isLoggedIn) {
            const nameEl = document.getElementById("orderName");
            const phoneEl = document.getElementById("orderPhone");
            const addrEl = document.getElementById("orderAddress");
            if (nameEl && !nameEl.value) nameEl.value = savedUser.name || "";
            if (phoneEl && !phoneEl.value) phoneEl.value = savedUser.phone || "";
            if (addrEl && !addrEl.value) addrEl.value = savedUser.address || "";
        }

        // Điền tóm tắt đơn hàng
        const summaryEl = document.getElementById("checkoutOrderSummary");
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div style="max-height: 180px; overflow-y: auto; margin-bottom: 12px; border-bottom: 1px solid var(--gray-200); padding-bottom: 8px;">
                    ${this.items.map(i => `
                        <div style="display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 6px;">
                            <span>${i.name} (x${i.quantity})</span>
                            <strong>${formatVND(i.price * i.quantity)}</strong>
                        </div>
                    `).join("")}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 4px;">
                    <span>Tạm tính:</span>
                    <span>${formatVND(subtotal)}</span>
                </div>
                ${discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 4px; color: var(--secondary);">
                        <span>Giảm giá:</span>
                        <span>-${formatVND(discount)}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 13.5px; margin-bottom: 8px;">
                    <span>Phí vận chuyển:</span>
                    <span>${shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: var(--primary); border-top: 1px dashed var(--gray-300); padding-top: 8px;">
                    <span>Tổng cộng:</span>
                    <span>${formatVND(total)}</span>
                </div>
            `;
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    closeCheckoutModal() {
        const modal = document.getElementById("checkoutModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    confirmOrder(e) {
        e.preventDefault();
        const name = document.getElementById("orderName").value.trim();
        const phone = document.getElementById("orderPhone").value.trim();
        const address = document.getElementById("orderAddress").value.trim();
        const note = document.getElementById("orderNote").value.trim();
        const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentMethod = paymentRadio ? paymentRadio.value : "cod";

        let hasError = false;
        if (!name) {
            ITMForm.showError("orderName", "Vui lòng nhập họ và tên người nhận hàng!");
            hasError = true;
        }
        if (!phone) {
            ITMForm.showError("orderPhone", "Vui lòng nhập số điện thoại nhận hàng!");
            hasError = true;
        } else {
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(phone) && phone.length < 9) {
                ITMForm.showError("orderPhone", "Số điện thoại không đúng định dạng (Ví dụ: 098122445)!");
                hasError = true;
            }
        }
        if (!address) {
            ITMForm.showError("orderAddress", "Vui lòng nhập địa chỉ giao hàng chi tiết!");
            hasError = true;
        }

        if (hasError) {
            ITMToast.error("Vui lòng kiểm tra lại các thông tin giao hàng còn thiếu!");
            return;
        }

        ITMForm.clearAll();

        const orderId = "ITM-" + Math.floor(100000 + Math.random() * 900000);
        const { total } = this.calculateTotals();

        // Lưu đơn hàng vào lịch sử localStorage
        const newOrder = {
            id: orderId,
            date: new Date().toLocaleString("vi-VN"),
            name: name,
            phone: phone,
            address: address,
            note: note,
            items: [...this.items],
            total: total,
            paymentMethod: paymentMethod === "cod" ? "Tiền mặt khi nhận hàng (COD)" : "Chuyển khoản QR ngân hàng",
            status: "Đang giao hàng (Dự kiến trong 2 giờ)"
        };
        let orders = this.getOrders();
        orders.unshift(newOrder);
        this.saveOrders(orders);

        // Đồng bộ vào CSDL Admin Portal để quản trị viên theo dõi & in hóa đơn
        try {
            let allOrders = JSON.parse(localStorage.getItem("itmart_all_orders")) || [];
            allOrders.unshift(newOrder);
            localStorage.setItem("itmart_all_orders", JSON.stringify(allOrders));
        } catch (e) {}

        // Tích điểm thưởng VIP Loyalty (10.000đ = 1 điểm)
        if (typeof LoyaltySystem !== "undefined") {
            LoyaltySystem.addPoints(total);
        }

        // Lưu địa chỉ vào tài khoản nếu chưa có
        const savedUser = this.getUser();
        if (savedUser && !savedUser.address) {
            savedUser.address = address;
            localStorage.setItem("itmart_user", JSON.stringify(savedUser));
        }

        // Đóng checkout modal và mở modal xác nhận thành công
        this.closeCheckoutModal();

        const successModal = document.getElementById("orderSuccessModal");
        if (successModal) {
            document.getElementById("successOrderId").textContent = orderId;
            document.getElementById("successCustomerName").textContent = name;
            document.getElementById("successCustomerPhone").textContent = phone;
            document.getElementById("successCustomerAddress").textContent = address;
            document.getElementById("successOrderTotal").textContent = formatVND(total);
            document.getElementById("successPaymentMethod").textContent = newOrder.paymentMethod;

            // Nếu thanh toán QR, hiển thị khung Chuyển khoản QR ngân hàng như web thật
            const qrBox = document.getElementById("vietQrPaymentBox");
            if (paymentMethod === "qr") {
                if (!qrBox) {
                    const box = document.createElement("div");
                    box.id = "vietQrPaymentBox";
                    box.className = "vietqr-payment-box";
                    document.querySelector(".success-summary-card").after(box);
                }
                const activeQrBox = document.getElementById("vietQrPaymentBox");
                activeQrBox.style.display = "block";
                activeQrBox.innerHTML = `
                    <div class="qr-card">
                        <div class="qr-badge"><i class="fa-solid fa-qrcode"></i> Quét mã VietQR để thanh toán</div>
                        <div class="qr-body">
                            <img src="https://api.vietqr.io/image/970422-098122445-print.jpg?amount=${total}&addInfo=${orderId}&accountName=CONG%20TY%20CP%20IT%20MART" 
                                 alt="VietQR Mã Thanh Toán" class="vietqr-img" onerror="this.src='./images/Logo.png';">
                            <div class="qr-details">
                                <p><strong>Ngân hàng:</strong> MBBank (Quân Đội)</p>
                                <p>
                                    <strong>Số tài khoản:</strong> <span id="bankAccNum">098122445</span> 
                                    <button type="button" class="btn-copy-code" onclick="CartSystem.copyText('098122445', 'Đã sao chép STK!')"><i class="fa-regular fa-copy"></i> Chép</button>
                                </p>
                                <p><strong>Chủ tài khoản:</strong> CONG TY CP IT MART</p>
                                <p><strong>Số tiền:</strong> <span style="color: var(--primary); font-weight: 800;">${formatVND(total)}</span></p>
                                <p>
                                    <strong>Nội dung CK:</strong> <span id="transferMemo" style="color: #ea580c; font-weight: 800;">${orderId}</span>
                                    <button type="button" class="btn-copy-code" onclick="CartSystem.copyText('${orderId}', 'Đã sao chép mã đơn!')"><i class="fa-regular fa-copy"></i> Chép</button>
                                </p>
                            </div>
                        </div>
                        <div class="qr-notice">
                            <i class="fa-solid fa-circle-check"></i> Hệ thống tự động xác nhận đơn hàng sau 1-2 phút nhận được chuyển khoản!
                        </div>
                    </div>
                `;
            } else {
                const existingQrBox = document.getElementById("vietQrPaymentBox");
                if (existingQrBox) existingQrBox.style.display = "none";
            }

            successModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        // Xóa giỏ hàng sau khi đặt thành công
        this.items = [];
        this.appliedCoupon = null;
        this.save();
    },

    copyText(text, successMsg = "Đã sao chép!") {
        navigator.clipboard.writeText(text).then(() => {
            if (window.ITMToast) {
                window.ITMToast.success(successMsg);
            } else if (typeof showToast === "function") {
                showToast(successMsg, "success");
            }
        });
    },

    openOrderHistoryModal() {
        const modal = document.getElementById("orderHistoryModal");
        const listEl = document.getElementById("orderHistoryList");
        if (!modal || !listEl) return;

        const orders = this.getOrders();

        if (orders.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; color: var(--gray-500);">
                    <i class="fa-solid fa-box-archive" style="font-size: 42px; color: var(--gray-300); margin-bottom: 12px;"></i>
                    <p style="font-weight: 600; font-size: 15px; color: var(--dark); margin-bottom: 4px;">Chưa có đơn hàng nào</p>
                    <p style="font-size: 13px;">Hãy đặt mua sữa để theo dõi tiến trình giao hàng tại đây nhé!</p>
                </div>
            `;
        } else {
            listEl.innerHTML = orders.map(ord => {
                const isCancelled = ord.status.includes("Đã hủy");
                return `
                    <div class="order-history-card">
                        <div class="order-history-head">
                            <div>
                                <strong style="color: var(--primary); font-size: 14.5px;">Mã đơn: ${ord.id}</strong>
                                <p style="font-size: 12px; color: var(--gray-500); margin: 0;"><i class="fa-regular fa-clock"></i> ${ord.date}</p>
                            </div>
                            <span class="order-status-badge ${isCancelled ? 'cancelled' : 'delivering'}">
                                ${ord.status}
                            </span>
                        </div>
                        <div class="order-history-items">
                            ${ord.items.map(i => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                    <span>• ${i.name} (x${i.quantity})</span>
                                    <strong>${formatVND(i.price * i.quantity)}</strong>
                                </div>
                            `).join("")}
                        </div>
                        <div class="order-history-footer">
                            <span style="color: var(--gray-500); font-size: 12.5px;">Giao đến: ${ord.address}</span>
                            <div>Tổng: <strong style="color: var(--primary); font-size: 15px;">${formatVND(ord.total)}</strong></div>
                        </div>
                        <div class="order-history-actions">
                            ${!isCancelled ? `
                                <button type="button" class="btn-cancel-order" onclick="CartSystem.cancelOrder('${ord.id}')">
                                    <i class="fa-solid fa-ban"></i> Hủy đơn
                                </button>
                            ` : ''}
                            <button type="button" class="btn-reorder" onclick="CartSystem.reorder('${ord.id}')">
                                <i class="fa-solid fa-rotate-right"></i> Mua lại đơn này
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    async cancelOrder(orderId) {
        const confirmed = await ITMDialog.confirm({
            title: "Hủy đơn hàng",
            message: `Bạn có chắc chắn muốn hủy đơn hàng "${orderId}" không? Trạng thái đơn sẽ được cập nhật thành Đã hủy.`,
            type: "danger",
            confirmText: "Xác nhận hủy",
            cancelText: "Không hủy",
            icon: "fa-solid fa-ban"
        });
        if (!confirmed) return;

        let orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = "Đã hủy bởi khách hàng";
            this.saveOrders(orders);
            this.openOrderHistoryModal();
            ITMToast.info(`Đã hủy đơn hàng "${orderId}" thành công`);
        }
    },

    reorder(orderId) {
        if (!this.isLoggedIn()) {
            this.showAuthRequiredModal("mua lại đơn hàng");
            return;
        }

        let orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        order.items.forEach(i => {
            this.addItem(i.id, i.quantity);
        });

        this.closeOrderHistoryModal();
        this.openDrawer();
        if (typeof showToast === "function") {
            showToast("Đã thêm toàn bộ sản phẩm của đơn cũ vào giỏ!");
        }
    },

    closeOrderHistoryModal() {
        const modal = document.getElementById("orderHistoryModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    closeSuccessModal() {
        const modal = document.getElementById("orderSuccessModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    isLoggedIn() {
        try {
            const user = JSON.parse(localStorage.getItem("itmart_user"));
            return !!(user && user.isLoggedIn);
        } catch (e) {
            return false;
        }
    },

    showAuthRequiredModal(actionName = "mua hàng") {
        let modal = document.getElementById("authRequiredModal");
        let backdrop = document.getElementById("authRequiredBackdrop");

        if (!modal || !backdrop) {
            this.createAuthModalDOM();
            modal = document.getElementById("authRequiredModal");
            backdrop = document.getElementById("authRequiredBackdrop");
        }

        const actionTextEl = document.getElementById("authReqActionText");
        if (actionTextEl) {
            actionTextEl.textContent = actionName;
        }

        const currentUrl = encodeURIComponent(window.location.href);
        const loginLink = document.getElementById("authReqLoginLink");
        const regLink = document.getElementById("authReqRegisterLink");

        if (loginLink) loginLink.href = `Log_in.html?action=login&redirect=${currentUrl}`;
        if (regLink) regLink.href = `Log_in.html?action=register&redirect=${currentUrl}`;

        if (backdrop) backdrop.classList.add("active");
        if (modal) modal.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    closeAuthRequiredModal() {
        const modal = document.getElementById("authRequiredModal");
        const backdrop = document.getElementById("authRequiredBackdrop");
        if (modal) modal.classList.remove("active");
        if (backdrop) backdrop.classList.remove("active");
        document.body.style.overflow = "";
    },

    createAuthModalDOM() {
        const backdrop = document.createElement("div");
        backdrop.id = "authRequiredBackdrop";
        backdrop.className = "modal-backdrop";
        backdrop.onclick = (e) => {
            if (e.target === backdrop) this.closeAuthRequiredModal();
        };

        const modal = document.createElement("div");
        modal.id = "authRequiredModal";
        modal.className = "modal-box auth-required-modal-box";
        modal.innerHTML = `
            <div class="modal-header-row">
                <span style="font-weight: 700; color: var(--gray-700);"><i class="fa-solid fa-shield-halved" style="color: var(--primary);"></i> Yêu Cầu Đăng Nhập</span>
                <button type="button" class="modal-close-icon" onclick="CartSystem.closeAuthRequiredModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="auth-req-icon-wrap">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h3 class="auth-req-title">Bạn cần đăng nhập để <span id="authReqActionText">mua hàng</span></h3>
            <p class="auth-req-desc">
                Quý khách chưa đăng nhập. Để đảm bảo quyền lợi tích điểm, áp dụng mã giảm giá và bảo hành đơn hàng, vui lòng đăng nhập hoặc tạo tài khoản mới.
            </p>
            <div class="auth-req-perks">
                <div class="auth-req-perk-item">
                    <i class="fa-solid fa-gift" style="color: #ea580c;"></i>
                    <span>Tặng ngay voucher <strong>CHAOBANMOI (20.000đ)</strong> khi đăng ký</span>
                </div>
                <div class="auth-req-perk-item">
                    <i class="fa-solid fa-truck-fast" style="color: #16a34a;"></i>
                    <span>Miễn phí vận chuyển toàn quốc cho đơn từ 300.000đ</span>
                </div>
                <div class="auth-req-perk-item">
                    <i class="fa-solid fa-clock-rotate-left" style="color: #2563eb;"></i>
                    <span>Lưu lịch sử đơn hàng và mua lại chỉ với 1-click</span>
                </div>
            </div>
            <div class="auth-req-actions">
                <a id="authReqLoginLink" href="Log_in.html?action=login" class="btn-auth-req-login">
                    <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập Ngay
                </a>
                <a id="authReqRegisterLink" href="Log_in.html?action=register" class="btn-auth-req-register">
                    <i class="fa-solid fa-user-plus"></i> Đăng Ký Tài Khoản Mới
                </a>
                <button type="button" class="btn-auth-req-cancel" onclick="CartSystem.closeAuthRequiredModal()">
                    <i class="fa-regular fa-eye"></i> Để sau, tôi muốn tiếp tục xem sản phẩm
                </button>
            </div>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }
};

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    CartSystem.init();
});

// Cho phép gọi toàn cục
window.CartSystem = CartSystem;
window.addToCart = function(productId, quantity = 1) {
    CartSystem.addItem(productId, quantity);
};
