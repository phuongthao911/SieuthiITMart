/**
 * IT MART - PAGES HELPER (About, Stores, Policy & Help Center)
 */

document.addEventListener("DOMContentLoaded", () => {
    initHeaderState();
    initHashNavigation();
    initFaqAccordion();
    initStoresFilter();
    initFeedbackForm();
});

// Đồng bộ trạng thái đăng nhập & badge giỏ hàng
function initHeaderState() {
    // 1. Cập nhật giỏ hàng badge
    try {
        const user = JSON.parse(localStorage.getItem("itmart_user"));
        const key = (user && user.isLoggedIn) ? `itmart_cart_${user.phone}` : "itmart_cart_guest";
        const items = JSON.parse(localStorage.getItem(key)) || [];
        const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        const badge = document.getElementById("cartBadgeCount");
        if (badge) badge.textContent = totalCount;
        const mobileBadge = document.getElementById("mobileCartBadge");
        if (mobileBadge) mobileBadge.textContent = totalCount;
    } catch (e) {}

    // 2. Cập nhật nút tài khoản
    try {
        const user = JSON.parse(localStorage.getItem("itmart_user"));
        const topBarAuth = document.getElementById("topBarAuthLink");
        const headerUserBtn = document.getElementById("headerUserBtn");

        if (user && user.isLoggedIn) {
            if (topBarAuth) {
                topBarAuth.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất (${user.fullName || user.phone})`;
                topBarAuth.href = "#logout";
                topBarAuth.onclick = (e) => {
                    e.preventDefault();
                    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                        localStorage.removeItem("itmart_user");
                        window.location.reload();
                    }
                };
            }
            if (headerUserBtn) {
                headerUserBtn.innerHTML = `
                    <i class="fa-solid fa-user-check" style="color: var(--primary);"></i>
                    <span style="font-weight: 700; color: var(--primary);">${(user.fullName || "Tài khoản").split(" ").pop()}</span>
                `;
                headerUserBtn.href = "index.html";
                headerUserBtn.title = `Đã đăng nhập: ${user.fullName || user.phone}`;
            }
        }
    } catch (e) {}
}

// Chuyển tab hoặc cuộn đến hash anchor khi click sidebar / link từ ngoài vào
function initHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const targetEl = document.querySelector(hash);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                updateActiveSidebar(hash);
            }
        }, 150);
    }

    // Lắng nghe click các link sidebar có href="#..."
    document.querySelectorAll(".sidebar-menu-link").forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", href);
                    updateActiveSidebar(href);
                }
            }
        });
    });
}

function updateActiveSidebar(hash) {
    document.querySelectorAll(".sidebar-menu-link").forEach(link => {
        if (link.getAttribute("href") === hash) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Accordion FAQ trong Policy/Trợ giúp
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                // Đóng tất cả item khác
                faqItems.forEach(i => i.classList.remove("active"));
                // Toggle item hiện tại
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });
}

// Bộ lọc & tìm kiếm cửa hàng trong stores.html
function initStoresFilter() {
    const cityButtons = document.querySelectorAll(".city-btn");
    const searchInput = document.getElementById("storeSearchInput");
    const storeCards = document.querySelectorAll(".store-card");

    if (!cityButtons.length && !searchInput) return;

    let selectedCity = "all";
    let searchQuery = "";

    function filterCards() {
        storeCards.forEach(card => {
            const cardCity = card.getAttribute("data-city") || "";
            const textContent = card.textContent.toLowerCase();
            
            const matchCity = (selectedCity === "all" || cardCity === selectedCity);
            const matchSearch = (!searchQuery || textContent.includes(searchQuery));

            if (matchCity && matchSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });

        // Kiểm tra xem có cửa hàng nào không
        const visibleCards = Array.from(storeCards).filter(c => c.style.display !== "none");
        let emptyNotice = document.getElementById("storesEmptyNotice");
        if (visibleCards.length === 0) {
            if (!emptyNotice) {
                emptyNotice = document.createElement("div");
                emptyNotice.id = "storesEmptyNotice";
                emptyNotice.style.cssText = "grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-500); font-size: 15px;";
                emptyNotice.innerHTML = `<i class="fa-solid fa-shop-slash" style="font-size: 36px; margin-bottom: 12px; display: block; color: var(--gray-400);"></i>Không tìm thấy cửa hàng nào phù hợp với tìm kiếm của bạn.`;
                const container = document.getElementById("storesGrid");
                if (container) container.appendChild(emptyNotice);
            } else {
                emptyNotice.style.display = "block";
            }
        } else if (emptyNotice) {
            emptyNotice.style.display = "none";
        }
    }

    cityButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            cityButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedCity = btn.getAttribute("data-city");
            filterCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterCards();
        });
    }
}

// Xử lý gửi biểu mẫu Ý kiến đóng góp & Khiếu nại
function initFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("fbName")?.value.trim() || "";
        const phone = document.getElementById("fbPhone")?.value.trim() || "";
        const email = document.getElementById("fbEmail")?.value.trim() || "";
        const type = document.getElementById("fbType")?.value || "";
        const message = document.getElementById("fbMessage")?.value.trim() || "";

        if (!name || !phone || !message) {
            alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và nội dung góp ý!");
            return;
        }

        // Lưu góp ý vào localStorage để lưu trữ thực tế
        const feedbacks = JSON.parse(localStorage.getItem("itmart_feedbacks")) || [];
        const newFeedback = {
            id: "FB-" + Date.now(),
            name,
            phone,
            email,
            type,
            message,
            createdAt: new Date().toLocaleString("vi-VN")
        };
        feedbacks.unshift(newFeedback);
        localStorage.setItem("itmart_feedbacks", JSON.stringify(feedbacks));

        // Reset form và thông báo thành công
        form.reset();

        const successNotice = document.getElementById("feedbackSuccessAlert");
        if (successNotice) {
            successNotice.style.display = "block";
            successNotice.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                successNotice.style.display = "none";
            }, 6000);
        } else {
            alert("Cảm ơn bạn đã gửi ý kiến đóng góp! IT Mart đã tiếp nhận và sẽ phản hồi trong vòng 24h làm việc.");
        }
    });
}
