/**
 * IT MART - UNIFIED NOTIFICATION & DIALOG & FORM VALIDATION SYSTEM (notification.js)
 * Cung cấp:
 * 1. ITMToast: Toast thông báo góc màn hình (Success, Error, Warning, Info)
 * 2. ITMDialog: Hộp thoại xác nhận / cảnh báo (thay thế window.confirm và window.alert)
 * 3. ITMForm: Hiển thị error message màu đỏ ngay dưới ô nhập liệu khi dữ liệu không hợp lệ
 */

(function() {
    'use strict';

    // =========================================================================
    // 1. TOAST NOTIFICATION SYSTEM
    // =========================================================================
    const ITMToast = {
        container: null,

        getContainer() {
            if (!this.container || !document.body.contains(this.container)) {
                this.container = document.getElementById("itmToastContainer");
                if (!this.container) {
                    this.container = document.createElement("div");
                    this.container.id = "itmToastContainer";
                    this.container.className = "itm-toast-container";
                    document.body.appendChild(this.container);
                }
            }
            return this.container;
        },

        show(message, type = "success", title = null, duration = 3500) {
            const container = this.getContainer();

            const icons = {
                success: "fa-solid fa-circle-check",
                error: "fa-solid fa-circle-xmark",
                warning: "fa-solid fa-triangle-exclamation",
                info: "fa-solid fa-circle-info"
            };

            const defaultTitles = {
                success: "Thành công",
                error: "Thông báo lỗi",
                warning: "Cảnh báo",
                info: "Thông tin"
            };

            const finalTitle = title || defaultTitles[type] || "Thông báo";
            const iconClass = icons[type] || icons.info;

            const toast = document.createElement("div");
            toast.className = `itm-toast itm-toast-${type}`;
            toast.innerHTML = `
                <div class="itm-toast-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="itm-toast-content">
                    <div class="itm-toast-title">${finalTitle}</div>
                    <div class="itm-toast-message">${message}</div>
                </div>
                <button type="button" class="itm-toast-close" title="Đóng">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="itm-toast-progress">
                    <div class="itm-toast-progress-bar" style="transition: width ${duration}ms linear; width: 100%;"></div>
                </div>
            `;

            container.appendChild(toast);

            // Bắt đầu chạy progress bar
            requestAnimationFrame(() => {
                const bar = toast.querySelector(".itm-toast-progress-bar");
                if (bar) bar.style.width = "0%";
            });

            // Tự động đóng toast
            let timer = setTimeout(() => {
                this.dismiss(toast);
            }, duration);

            // Nút đóng thủ công
            const closeBtn = toast.querySelector(".itm-toast-close");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    clearTimeout(timer);
                    this.dismiss(toast);
                });
            }

            return toast;
        },

        dismiss(toast) {
            if (!toast || toast.classList.contains("itm-toast-out")) return;
            toast.classList.add("itm-toast-out");
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 250);
        },

        success(msg, title, duration) { return this.show(msg, "success", title, duration); },
        error(msg, title, duration) { return this.show(msg, "error", title, duration); },
        warning(msg, title, duration) { return this.show(msg, "warning", title, duration); },
        info(msg, title, duration) { return this.show(msg, "info", title, duration); }
    };

    // Tương thích ngược với các trang cũ gọi window.showToast
    window.showToast = function(message, type = "success") {
        ITMToast.show(message, type);
    };

    window.ITMToast = ITMToast;


    // =========================================================================
    // 2. DIALOG CONFIRMATION & ALERT SYSTEM (THAY THẾ WINDOW.CONFIRM / ALERT)
    // =========================================================================
    const ITMDialog = {
        /**
         * Hiện modal xác nhận (trả về Promise true/false)
         * @param {Object} options { title, message, type: 'danger'|'warning'|'info'|'success', confirmText, cancelText, icon }
         */
        confirm(options = {}) {
            return new Promise((resolve) => {
                const {
                    title = "Xác nhận hành động",
                    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
                    type = "warning",
                    confirmText = "Xác nhận",
                    cancelText = "Hủy bỏ",
                    icon = null
                } = options;

                const defaultIcons = {
                    danger: "fa-solid fa-triangle-exclamation",
                    warning: "fa-solid fa-circle-exclamation",
                    info: "fa-solid fa-circle-question",
                    success: "fa-solid fa-circle-check"
                };

                const iconClass = icon || defaultIcons[type] || defaultIcons.info;

                const backdrop = document.createElement("div");
                backdrop.className = `itm-dialog-backdrop itm-dialog-${type}`;
                backdrop.innerHTML = `
                    <div class="itm-dialog-card">
                        <div class="itm-dialog-body">
                            <div class="itm-dialog-icon">
                                <i class="${iconClass}"></i>
                            </div>
                            <div class="itm-dialog-title">${title}</div>
                            <div class="itm-dialog-message">${message}</div>
                        </div>
                        <div class="itm-dialog-footer">
                            <button type="button" class="itm-dialog-btn itm-dialog-btn-cancel">${cancelText}</button>
                            <button type="button" class="itm-dialog-btn itm-dialog-btn-confirm">${confirmText}</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(backdrop);

                const cleanUp = (result) => {
                    document.removeEventListener("keydown", onKeyDown);
                    backdrop.remove();
                    resolve(result);
                };

                const onKeyDown = (e) => {
                    if (e.key === "Escape") cleanUp(false);
                };
                document.addEventListener("keydown", onKeyDown);

                const cancelBtn = backdrop.querySelector(".itm-dialog-btn-cancel");
                const confirmBtn = backdrop.querySelector(".itm-dialog-btn-confirm");

                cancelBtn.addEventListener("click", () => cleanUp(false));
                confirmBtn.addEventListener("click", () => cleanUp(true));

                backdrop.addEventListener("click", (e) => {
                    if (e.target === backdrop) cleanUp(false);
                });

                confirmBtn.focus();
            });
        },

        /**
         * Hiện modal thông báo Alert (trả về Promise khi đóng)
         * @param {Object} options { title, message, type: 'info'|'success'|'danger'|'warning', buttonText, icon }
         */
        alert(options = {}) {
            return new Promise((resolve) => {
                const {
                    title = "Thông báo",
                    message = "",
                    type = "info",
                    buttonText = "Đã hiểu",
                    icon = null
                } = options;

                const defaultIcons = {
                    danger: "fa-solid fa-circle-xmark",
                    warning: "fa-solid fa-triangle-exclamation",
                    info: "fa-solid fa-circle-info",
                    success: "fa-solid fa-circle-check"
                };

                const iconClass = icon || defaultIcons[type] || defaultIcons.info;

                const backdrop = document.createElement("div");
                backdrop.className = `itm-dialog-backdrop itm-dialog-${type}`;
                backdrop.innerHTML = `
                    <div class="itm-dialog-card">
                        <div class="itm-dialog-body">
                            <div class="itm-dialog-icon">
                                <i class="${iconClass}"></i>
                            </div>
                            <div class="itm-dialog-title">${title}</div>
                            <div class="itm-dialog-message">${message}</div>
                        </div>
                        <div class="itm-dialog-footer">
                            <button type="button" class="itm-dialog-btn itm-dialog-btn-confirm" style="width: 100%;">${buttonText}</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(backdrop);

                const closeDialog = () => {
                    document.removeEventListener("keydown", onKeyDown);
                    backdrop.remove();
                    resolve(true);
                };

                const onKeyDown = (e) => {
                    if (e.key === "Escape" || e.key === "Enter") closeDialog();
                };
                document.addEventListener("keydown", onKeyDown);

                const confirmBtn = backdrop.querySelector(".itm-dialog-btn-confirm");
                confirmBtn.addEventListener("click", closeDialog);

                backdrop.addEventListener("click", (e) => {
                    if (e.target === backdrop) closeDialog();
                });

                confirmBtn.focus();
            });
        }
    };

    window.ITMDialog = ITMDialog;


    // =========================================================================
    // 3. FORM INLINE ERROR MESSAGE SYSTEM (DÒNG LỖI ĐỎ NGAY DƯỚI INPUT)
    // =========================================================================
    const ITMForm = {
        /**
         * Tìm input element theo id hoặc node
         */
        getElement(inputOrId) {
            if (typeof inputOrId === "string") {
                return document.getElementById(inputOrId);
            }
            return inputOrId;
        },

        /**
         * Hiển thị dòng lỗi màu đỏ ngay dưới ô bị lỗi
         * @param {HTMLElement|string} inputOrId 
         * @param {string} message 
         */
        showError(inputOrId, message) {
            const el = this.getElement(inputOrId);
            if (!el) return;

            // Đánh dấu viền đỏ và hiệu ứng shake cho input
            el.classList.add("itm-input-error");

            // Xác định container cha để chèn error message vào ngay sau wrapper
            const parent = el.closest(".input-with-icon") || 
                           el.closest(".admin-login-input-wrap") || 
                           el.closest(".cart-input-wrap") ||
                           el;

            // Xóa error message cũ nếu có
            this.clearError(el, false);

            // Tạo message lỗi đỏ
            const errorDiv = document.createElement("div");
            errorDiv.className = "itm-error-message";
            errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${message}</span>`;
            
            // Đặt ID liên kết
            if (el.id) {
                errorDiv.setAttribute("data-for", el.id);
            }

            // Chèn ngay sau parent wrapper hoặc input
            if (parent.nextSibling) {
                parent.parentNode.insertBefore(errorDiv, parent.nextSibling);
            } else {
                parent.parentNode.appendChild(errorDiv);
            }

            // Tự động xóa lỗi khi người dùng gõ lại vào ô
            const clearListener = () => {
                this.clearError(el);
                el.removeEventListener("input", clearListener);
                el.removeEventListener("change", clearListener);
            };
            el.addEventListener("input", clearListener);
            el.addEventListener("change", clearListener);

            // Focus nhẹ vào input lỗi
            try {
                el.focus();
            } catch (err) {}
        },

        /**
         * Xóa thông báo lỗi và viền đỏ của 1 input
         */
        clearError(inputOrId, removeClass = true) {
            const el = this.getElement(inputOrId);
            if (!el) return;

            if (removeClass) {
                el.classList.remove("itm-input-error");
            }

            // Tìm node error message tương ứng
            const parent = el.closest(".input-with-icon") || 
                           el.closest(".admin-login-input-wrap") || 
                           el.closest(".cart-input-wrap") ||
                           el;

            let next = parent.nextElementSibling;
            if (next && next.classList.contains("itm-error-message")) {
                next.remove();
            } else if (el.id) {
                const found = document.querySelector(`.itm-error-message[data-for="${el.id}"]`);
                if (found) found.remove();
            }
        },

        /**
         * Xóa toàn bộ lỗi trong một form hoặc container
         */
        clearAll(containerOrForm) {
            const root = this.getElement(containerOrForm) || document;
            root.querySelectorAll(".itm-input-error").forEach(el => el.classList.remove("itm-input-error"));
            root.querySelectorAll(".itm-error-message").forEach(el => el.remove());
        }
    };

    window.ITMForm = ITMForm;

})();
