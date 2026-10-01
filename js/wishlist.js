/**
 * IT MART - WISHLIST SYSTEM (wishlist.js)
 * Quản lý danh sách sản phẩm yêu thích (Favorites)
 * Tách riêng biệt, lưu trữ LocalStorage, cập nhật huy hiệu và modal xem danh sách
 */

const WishlistSystem = {
    items: [],

    getUser() {
        try {
            const user = JSON.parse(localStorage.getItem("itmart_user"));
            return (user && user.isLoggedIn) ? user : null;
        } catch (e) {
            return null;
        }
    },

    loadWishlist() {
        const user = this.getUser();
        if (user) {
            // ĐÃ ĐĂNG NHẬP / ĐĂNG KÝ: Giữ lại danh sách yêu thích theo tài khoản
            const key = `itmart_wishlist_${user.phone}`;
            const saved = localStorage.getItem(key) || localStorage.getItem("itmart_wishlist");
            this.items = saved ? JSON.parse(saved) : [];
        } else {
            // CHƯA ĐĂNG NHẬP: Khi reload lại web là bị mất hoàn toàn
            this.items = [];
            localStorage.removeItem("itmart_wishlist");
        }
    },

    init() {
        this.loadWishlist();
        this.updateBadge();
        this.updateCardHearts();
    },

    save() {
        const user = this.getUser();
        if (user) {
            // ĐÃ ĐĂNG NHẬP / ĐĂNG KÝ: Lưu vĩnh viễn theo tài khoản
            const key = `itmart_wishlist_${user.phone}`;
            localStorage.setItem(key, JSON.stringify(this.items));
            localStorage.setItem("itmart_wishlist", JSON.stringify(this.items));
        } else {
            this.items = [];
            localStorage.removeItem("itmart_wishlist");
        }
        this.updateBadge();
        this.updateCardHearts();
    },

    isWishlisted(productId) {
        return this.items.includes(productId);
    },

    toggle(productId) {
        const product = typeof PRODUCTS !== "undefined" ? PRODUCTS.find(p => p.id === productId) : null;
        const name = product ? product.name : "Sản phẩm";

        const index = this.items.indexOf(productId);
        if (index > -1) {
            this.items.splice(index, 1);
            this.save();
            if (typeof showToast === "function") {
                showToast(`Đã bỏ "${name}" khỏi danh sách yêu thích`, "info");
            }
        } else {
            this.items.push(productId);
            this.save();
            if (typeof showToast === "function") {
                showToast(`Đã thêm "${name}" vào danh sách yêu thích!`, "success");
            }
        }

        // Nếu modal yêu thích đang mở, cập nhật lại
        const modal = document.getElementById("wishlistModal");
        if (modal && modal.classList.contains("active")) {
            this.renderModal();
        }
    },

    updateBadge() {
        const badges = document.querySelectorAll(".wishlist-badge");
        badges.forEach(badge => {
            badge.textContent = this.items.length;
            badge.style.display = this.items.length > 0 ? "flex" : "none";
        });
    },

    updateCardHearts() {
        const buttons = document.querySelectorAll(".btn-wishlist-toggle");
        buttons.forEach(btn => {
            const id = btn.dataset.id;
            const isFav = this.isWishlisted(id);
            btn.classList.toggle("active", isFav);
            const icon = btn.querySelector("i");
            if (icon) {
                if (isFav) {
                    icon.className = "fa-solid fa-heart";
                } else {
                    icon.className = "fa-regular fa-heart";
                }
            }
        });
    },

    openModal() {
        let modal = document.getElementById("wishlistModal");
        let backdrop = document.getElementById("wishlistBackdrop");

        if (!modal) {
            this.createModalDOM();
            modal = document.getElementById("wishlistModal");
            backdrop = document.getElementById("wishlistBackdrop");
        }

        this.renderModal();
        modal.classList.add("active");
        if (backdrop) backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    closeModal() {
        const modal = document.getElementById("wishlistModal");
        const backdrop = document.getElementById("wishlistBackdrop");
        if (modal) modal.classList.remove("active");
        if (backdrop) backdrop.classList.remove("active");
        document.body.style.overflow = "";
    },

    renderModal() {
        const body = document.getElementById("wishlistModalBody");
        if (!body) return;

        if (this.items.length === 0) {
            body.innerHTML = `
                <div class="wishlist-empty">
                    <i class="fa-regular fa-heart"></i>
                    <h4>Chưa có sản phẩm yêu thích nào</h4>
                    <p>Hãy bấm vào biểu tượng trái tim trên các sản phẩm sữa để lưu lại và mua sau nhé!</p>
                </div>
            `;
            return;
        }

        const favProducts = (typeof PRODUCTS !== "undefined") 
            ? PRODUCTS.filter(p => this.items.includes(p.id)) 
            : [];

        body.innerHTML = `
            <div class="wishlist-items-grid">
                ${favProducts.map(p => {
                    const discountPercent = p.originalPrice > p.salePrice ? Math.round((p.originalPrice - p.salePrice) / p.originalPrice * 100) : 0;
                    return `
                        <div class="wishlist-card">
                            <div class="wishlist-card-img">
                                <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='./images/photo.jpg';"></a>
                                ${discountPercent > 0 ? `<span class="wishlist-discount">-${discountPercent}%</span>` : ''}
                            </div>
                            <div class="wishlist-card-info">
                                <span class="wishlist-brand">${p.brand || 'Chính hãng'}</span>
                                <a href="product.html?id=${p.id}" class="wishlist-name">${p.name}</a>
                                <div class="wishlist-price">
                                    <strong style="color: var(--primary);">${typeof formatVND === "function" ? formatVND(p.salePrice) : p.salePrice + 'đ'}</strong>
                                    <span style="font-size: 12px; color: var(--gray-500);">/ ${p.unit}</span>
                                </div>
                                <div class="wishlist-actions">
                                    <button class="btn-wishlist-cart" onclick="CartSystem.addItem('${p.id}', 1)">
                                        <i class="fa-solid fa-cart-plus"></i> Thêm giỏ
                                    </button>
                                    <button class="btn-wishlist-remove" onclick="WishlistSystem.toggle('${p.id}')" title="Xóa khỏi yêu thích">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
            <div class="wishlist-footer-row">
                <button class="btn-add-all-wishlist" onclick="WishlistSystem.addAllToCart()">
                    <i class="fa-solid fa-cart-shopping"></i> Thêm tất cả vào giỏ hàng
                </button>
            </div>
        `;
    },

    addAllToCart() {
        if (this.items.length === 0) return;
        this.items.forEach(id => {
            if (typeof CartSystem !== "undefined") {
                CartSystem.addItem(id, 1);
            }
        });
        this.closeModal();
        if (typeof CartSystem !== "undefined") {
            CartSystem.openDrawer();
        }
        if (typeof showToast === "function") {
            showToast("Đã thêm toàn bộ sản phẩm yêu thích vào giỏ hàng!");
        }
    },

    createModalDOM() {
        const backdrop = document.createElement("div");
        backdrop.id = "wishlistBackdrop";
        backdrop.className = "modal-backdrop";
        backdrop.onclick = (e) => {
            if (e.target === backdrop) this.closeModal();
        };

        const modal = document.createElement("div");
        modal.id = "wishlistModal";
        modal.className = "modal-box wishlist-modal-box";
        modal.innerHTML = `
            <div class="modal-header-row">
                <h3><i class="fa-solid fa-heart" style="color: #ef4444;"></i> Danh Sách Sản Phẩm Yêu Thích</h3>
                <button type="button" class="modal-close-icon" onclick="WishlistSystem.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="wishlistModalBody" class="wishlist-modal-body"></div>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }
};

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    WishlistSystem.init();
});

// Xuất toàn cục
window.WishlistSystem = WishlistSystem;
