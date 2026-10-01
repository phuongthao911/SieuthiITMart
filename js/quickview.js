/**
 * IT MART - MODAL XEM NHANH SẢN PHẨM (QUICK VIEW MODAL)
 * Xem chi tiết thông số, chọn số lượng và thêm vào giỏ hàng ngay lập tức
 */

const QuickViewSystem = {
    currentProduct: null,
    selectedQuantity: 1,

    init() {
        const modal = document.getElementById("quickViewModal");
        const backdrop = document.getElementById("quickViewBackdrop");
        const closeBtn = document.getElementById("quickViewCloseBtn");

        if (backdrop) {
            backdrop.addEventListener("click", (e) => {
                if (e.target === backdrop) this.close();
            });
        }
        if (closeBtn) closeBtn.addEventListener("click", () => this.close());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal && modal.classList.contains("active")) {
                this.close();
            }
        });
    },

    open(productId) {
        const product = typeof PRODUCTS !== "undefined" ? PRODUCTS.find(p => p.id === productId) : null;
        if (!product) return;

        this.currentProduct = product;
        this.selectedQuantity = 1;

        const modal = document.getElementById("quickViewModal");
        const backdrop = document.getElementById("quickViewBackdrop");
        if (!modal || !backdrop) return;

        // Điền dữ liệu vào modal
        const qvImg = document.getElementById("qvImg");
        qvImg.src = product.image;
        qvImg.alt = product.name;
        qvImg.onerror = function() { this.src = './images/photo.jpg'; };
        document.getElementById("qvBadge").textContent = product.badge || "Chính hãng";
        document.getElementById("qvBadge").style.display = product.badge ? "inline-block" : "none";
        document.getElementById("qvCategory").textContent = product.categoryName;
        document.getElementById("qvTitle").textContent = product.name;
        document.getElementById("qvRatingStars").innerHTML = typeof renderStars === "function" ? renderStars(product.rating) : "★★★★★";
        document.getElementById("qvReviews").textContent = `(${product.reviewsCount} đánh giá từ khách hàng)`;
        document.getElementById("qvSalePrice").textContent = typeof formatVND === "function" ? formatVND(product.salePrice) : `${product.salePrice}đ`;
        
        const origPriceEl = document.getElementById("qvOrigPrice");
        if (origPriceEl) {
            if (product.originalPrice > product.salePrice) {
                origPriceEl.textContent = typeof formatVND === "function" ? formatVND(product.originalPrice) : `${product.originalPrice}đ`;
                origPriceEl.style.display = "inline";
            } else {
                origPriceEl.style.display = "none";
            }
        }

        document.getElementById("qvUnit").textContent = product.unit;
        document.getElementById("qvStock").innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--secondary);"></i> Còn hàng (${product.stock} sản phẩm sẵn có)`;
        document.getElementById("qvDescription").textContent = product.description;
        document.getElementById("qvQtyInput").value = 1;

        // Cập nhật link xem trang riêng
        const oldLinkBtn = document.getElementById("qvOldLinkBtn");
        if (oldLinkBtn) {
            oldLinkBtn.href = `product.html?id=${product.id}`;
        }

        modal.classList.add("active");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    close() {
        const modal = document.getElementById("quickViewModal");
        const backdrop = document.getElementById("quickViewBackdrop");
        if (modal && backdrop) {
            modal.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    changeQty(delta) {
        let val = parseInt(document.getElementById("qvQtyInput").value) || 1;
        val += delta;
        if (val < 1) val = 1;
        if (this.currentProduct && val > this.currentProduct.stock) {
            val = this.currentProduct.stock;
            if (window.ITMToast) {
                window.ITMToast.warning(`Rất tiếc, kho chỉ còn tối đa ${this.currentProduct.stock} sản phẩm!`, "Kho giới hạn");
            }
        }
        document.getElementById("qvQtyInput").value = val;
        this.selectedQuantity = val;
    },

    addToCart() {
        if (!this.currentProduct) return;
        const qty = parseInt(document.getElementById("qvQtyInput").value) || 1;
        if (typeof CartSystem !== "undefined") {
            CartSystem.addItem(this.currentProduct.id, qty);
        } else if (typeof window.addToCart === "function") {
            window.addToCart(this.currentProduct.id, qty);
        }
        this.close();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    QuickViewSystem.init();
});

window.QuickViewSystem = QuickViewSystem;
window.quickView = function(productId) {
    QuickViewSystem.open(productId);
};
