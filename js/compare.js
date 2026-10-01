/**
 * IT MART - PRODUCT COMPARISON SYSTEM (compare.js)
 * So sánh trực quan thông số, giá bán, khuyến mãi và đánh giá giữa 2-3 sản phẩm
 */

const CompareSystem = {
    items: [],
    maxItems: 3,

    init() {
        this.createDockElement();
        this.createModalElement();
        this.updateDock();
    },

    isCompared(id) {
        return this.items.includes(id);
    },

    toggle(id) {
        if (this.isCompared(id)) {
            this.remove(id);
        } else {
            this.add(id);
        }
    },

    add(id) {
        if (this.items.includes(id)) return;

        if (this.items.length >= this.maxItems) {
            if (window.ITMToast) {
                window.ITMToast.warning(`Hệ thống chỉ hỗ trợ so sánh tối đa ${this.maxItems} sản phẩm cùng lúc. Vui lòng bỏ bớt sản phẩm khác!`, "Giới hạn so sánh");
            }
            return;
        }

        const p = typeof ProductDB !== "undefined" ? ProductDB.findById(id) : null;
        this.items.push(id);
        this.updateDock();

        if (p) {
            this.showToast(`Đã thêm "${p.name}" vào danh sách so sánh (${this.items.length}/${this.maxItems})`);
        }
    },

    remove(id) {
        this.items = this.items.filter(item => item !== id);
        this.updateDock();
        // Cập nhật lại modal nếu đang mở
        const modal = document.getElementById("compareModal");
        if (modal && modal.classList.contains("active")) {
            this.renderModalContent();
        }
    },

    clear() {
        this.items = [];
        this.updateDock();
        this.closeModal();
    },

    createDockElement() {
        if (document.getElementById("compareDock")) return;

        const dock = document.createElement("div");
        dock.id = "compareDock";
        dock.className = "compare-floating-dock";
        dock.innerHTML = `
            <div class="compare-dock-container">
                <div class="compare-dock-info">
                    <i class="fa-solid fa-code-compare"></i>
                    <span>So sánh sản phẩm (<strong id="compareCount">0</strong>/${this.maxItems})</span>
                </div>
                <div class="compare-dock-thumbnails" id="compareThumbnails"></div>
                <div class="compare-dock-actions">
                    <button type="button" class="btn-dock-clear" onclick="CompareSystem.clear()">Xóa hết</button>
                    <button type="button" class="btn-dock-view" onclick="CompareSystem.openModal()">
                        <i class="fa-solid fa-table-columns"></i> So Sánh Ngay
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(dock);
    },

    createModalElement() {
        if (document.getElementById("compareModal")) return;

        const modal = document.createElement("div");
        modal.id = "compareModal";
        modal.className = "modal-backdrop";
        modal.innerHTML = `
            <div class="modal-box compare-modal-box">
                <div class="modal-header-row">
                    <h3><i class="fa-solid fa-code-compare"></i> Bảng So Sánh Chi Tiết Sản Phẩm</h3>
                    <button type="button" class="modal-close-icon" onclick="CompareSystem.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="compare-modal-body" id="compareModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) this.closeModal();
        });
    },

    updateDock() {
        const dock = document.getElementById("compareDock");
        const countEl = document.getElementById("compareCount");
        const thumbsEl = document.getElementById("compareThumbnails");

        if (!dock || !countEl || !thumbsEl) return;

        countEl.textContent = this.items.length;

        if (this.items.length === 0) {
            dock.classList.remove("active");
            return;
        }

        dock.classList.add("active");

        thumbsEl.innerHTML = this.items.map(id => {
            const p = typeof ProductDB !== "undefined" ? ProductDB.findById(id) : null;
            if (!p) return "";
            return `
                <div class="compare-thumb-item" title="${p.name}">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='./images/Logo.png';">
                    <button type="button" class="btn-remove-thumb" onclick="CompareSystem.remove('${p.id}')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        }).join("");
    },

    openModal() {
        if (this.items.length < 2) {
            if (window.ITMToast) {
                window.ITMToast.warning("Vui lòng chọn ít nhất 2 sản phẩm để thực hiện so sánh đối chiếu!", "Chưa đủ sản phẩm");
            }
            return;
        }
        this.renderModalContent();
        const modal = document.getElementById("compareModal");
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    },

    closeModal() {
        const modal = document.getElementById("compareModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    },

    renderModalContent() {
        const body = document.getElementById("compareModalBody");
        if (!body) return;

        if (this.items.length === 0) {
            body.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--gray-500);">Không có sản phẩm nào trong danh sách so sánh.</div>`;
            return;
        }

        const products = this.items.map(id => typeof ProductDB !== "undefined" ? ProductDB.findById(id) : null).filter(Boolean);

        body.innerHTML = `
            <div class="compare-table-wrapper">
                <table class="compare-table">
                    <tbody>
                        <!-- 1. HÌNH ẢNH & TÊN -->
                        <tr class="row-header">
                            <td class="col-spec-title">Sản Phẩm</td>
                            ${products.map(p => `
                                <td class="col-product-item">
                                    <div class="compare-card-top">
                                        <button type="button" class="btn-compare-del" onclick="CompareSystem.remove('${p.id}')" title="Xóa khỏi so sánh">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                        <img src="${p.image}" alt="${p.name}" class="compare-img" onerror="this.src='./images/Logo.png';">
                                        <a href="product.html?id=${p.id}" class="compare-prod-name">${p.name}</a>
                                        <div class="compare-badge">${p.brand} • ${p.categoryName}</div>
                                    </div>
                                </td>
                            `).join("")}
                        </tr>

                        <!-- 2. GIÁ BÁN -->
                        <tr>
                            <td class="col-spec-title">Giá Khuyến Mãi</td>
                            ${products.map(p => `
                                <td>
                                    <div class="compare-price">${(p.salePrice || 0).toLocaleString("vi-VN")} đ</div>
                                    ${p.originalPrice > p.salePrice ? `<div class="compare-old-price">${p.originalPrice.toLocaleString("vi-VN")} đ</div>` : ""}
                                </td>
                            `).join("")}
                        </tr>

                        <!-- 3. MỨC GIẢM GIÁ -->
                        <tr>
                            <td class="col-spec-title">Mức Tiết Kiệm</td>
                            ${products.map(p => {
                                const diff = p.originalPrice > p.salePrice ? Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100) : 0;
                                return `<td><strong style="color: #16a34a;">${diff > 0 ? `Giảm ${diff}%` : 'Giá chuẩn'}</strong></td>`;
                            }).join("")}
                        </tr>

                        <!-- 4. ĐÁNH GIÁ SAO -->
                        <tr>
                            <td class="col-spec-title">Đánh Giá Khách Hàng</td>
                            ${products.map(p => `
                                <td>
                                    <span style="color: #f59e0b; font-weight: 700;">★ ${p.rating}</span>
                                    <span style="color: var(--gray-500); font-size: 12px;">(${p.reviewsCount} nhận xét)</span>
                                </td>
                            `).join("")}
                        </tr>

                        <!-- 5. QUY CÁCH / ĐƠN VỊ -->
                        <tr>
                            <td class="col-spec-title">Quy Cách Đóng Gói</td>
                            ${products.map(p => `<td>${p.unit || (p.specs ? p.specs.volume : 'Món')}</td>`).join("")}
                        </tr>

                        <!-- 6. XUẤT XỨ -->
                        <tr>
                            <td class="col-spec-title">Xuất Xứ Nguồn Gốc</td>
                            ${products.map(p => `<td>${(p.specs && p.specs.origin) ? p.specs.origin : 'Việt Nam'}</td>`).join("")}
                        </tr>

                        <!-- 7. TÌNH TRẠNG KHO -->
                        <tr>
                            <td class="col-spec-title">Tình Trạng Kho</td>
                            ${products.map(p => `
                                <td>
                                    <span class="status-pill ${(p.stock || 100) > 0 ? 'pill-in-stock' : 'pill-out-stock'}">
                                        ${(p.stock || 100) > 0 ? `Còn hàng (${p.stock || 100})` : 'Hết hàng'}
                                    </span>
                                </td>
                            `).join("")}
                        </tr>

                        <!-- 8. NÚT MUA HÀNG -->
                        <tr>
                            <td class="col-spec-title">Thao Tác</td>
                            ${products.map(p => `
                                <td>
                                    <button type="button" class="btn-compare-add-cart" onclick="CartSystem.addItem('${p.id}', 1); CartSystem.openDrawer(); CompareSystem.closeModal();">
                                        <i class="fa-solid fa-cart-plus"></i> Chọn Mua
                                    </button>
                                </td>
                            `).join("")}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    showToast(msg) {
        if (typeof showToast === "function") {
            showToast(msg);
        } else {
            console.log(msg);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    CompareSystem.init();
});
