/**
 * IT MART - ỨNG DỤNG ĐIỀU KHIỂN CHÍNH (MAIN APP)
 * Quản lý hiển thị sản phẩm, tìm kiếm Live Search, bộ lọc danh mục, sắp xếp & phân trang
 */

// Trạng thái ứng dụng (Application State)
const AppState = {
    products: typeof PRODUCTS !== "undefined" ? PRODUCTS : [],
    filteredProducts: [],
    currentCategory: "all",
    currentBrand: "all",
    priceRange: "all",
    customPriceMin: null,
    customPriceMax: null,
    searchQuery: "",
    sortBy: "default",
    currentPage: 1,
    itemsPerPage: 8,
    cart: JSON.parse(localStorage.getItem("itmart_cart")) || []
};

// Khởi động khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Đọc tham số URL (nếu có truy cập từ trang cũ hoặc link trực tiếp ?cat=suatuoi)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("cat");
    if (catParam) {
        AppState.currentCategory = catParam;
    }

    // Khởi tạo các thành phần
    initCategoryTabs();
    initBrandFilters();
    initPriceFilters();
    initSearch();
    initSorting();
    initFlashSaleCountdown();
    renderFlashSaleProducts();
    renderRecentlyViewed();
    updateCartBadge();
    checkAuthSession();
    
    // Đóng profile modal khi bấm vào nền backdrop
    const profileModal = document.getElementById("userProfileModal");
    if (profileModal) {
        profileModal.addEventListener("click", (e) => {
            if (e.target === profileModal) window.closeProfileModal();
        });
    }

    // Áp dụng bộ lọc & hiển thị ban đầu
    applyFilters();
}

/**
 * Kiểm tra trạng thái đăng nhập người dùng
 */
function checkAuthSession() {
    const user = JSON.parse(localStorage.getItem("itmart_user"));
    const accountBtn = document.getElementById("headerUserBtn") || document.querySelector(".header-action-btn[title='Tài khoản cá nhân']");
    const topBarAuthLink = document.getElementById("topBarAuthLink") || document.querySelector(".top-bar-right a[href*='Log_in']");
    const mobileAuthLink = document.querySelector(".mobile-bottom-nav a[href*='Log_in']");

    if (user && user.isLoggedIn) {
        // Cập nhật nút tài khoản trên header chính
        if (accountBtn) {
            accountBtn.innerHTML = `
                <i class="fa-solid fa-circle-user" style="color: var(--secondary);"></i>
                <span>${user.name}</span>
            `;
            accountBtn.href = "#";
            accountBtn.onclick = (e) => {
                e.preventDefault();
                openProfileModal();
            };
        }

        // Chuyển nút Đăng nhập / Đăng ký trên thanh top-bar thành Đăng xuất
        if (topBarAuthLink) {
            topBarAuthLink.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất`;
            topBarAuthLink.href = "javascript:void(0);";
            topBarAuthLink.title = `Đang đăng nhập: ${user.name} - Bấm để đăng xuất`;
            topBarAuthLink.onclick = (e) => {
                e.preventDefault();
                logoutUser();
            };
        }

        // Cập nhật thanh điều hướng trên mobile
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = `
                <i class="fa-solid fa-user-check" style="color: var(--primary);"></i>
                <span>${user.name}</span>
            `;
            mobileAuthLink.href = "javascript:void(0);";
            mobileAuthLink.onclick = (e) => {
                e.preventDefault();
                openProfileModal();
            };
        }
    } else {
        if (topBarAuthLink) {
            topBarAuthLink.innerHTML = `<i class="fa-solid fa-user"></i> Đăng nhập / Đăng ký`;
            topBarAuthLink.href = "./Log_in.html";
            topBarAuthLink.title = "Đăng nhập hoặc đăng ký tài khoản";
            topBarAuthLink.onclick = null;
        }
    }
}

window.openProfileModal = function() {
    const user = JSON.parse(localStorage.getItem("itmart_user"));
    if (!user) {
        window.location.href = "Log_in.html";
        return;
    }
    const modal = document.getElementById("userProfileModal");
    const body = document.getElementById("userProfileBody");
    if (!modal || !body) return;

    const orders = (typeof CartSystem !== "undefined") ? CartSystem.getOrders() : (JSON.parse(localStorage.getItem(`itmart_orders_${user.phone}`)) || []);

    body.innerHTML = `
        <div class="profile-info-grid">
            <div class="profile-avatar">
                <i class="fa-solid fa-user-check"></i>
            </div>
            <div class="profile-meta">
                <h4>${user.name}</h4>
                <p><i class="fa-solid fa-phone"></i> ${user.phone}</p>
                <p><i class="fa-solid fa-bag-shopping"></i> Đã đặt: <strong>${orders.length} đơn hàng</strong></p>
            </div>
        </div>
        <div class="profile-address-box">
            <label><strong><i class="fa-solid fa-location-dot"></i> Địa chỉ giao hàng mặc định:</strong></label>
            <input type="text" id="profileAddressInput" value="${user.address || ''}" placeholder="Nhập địa chỉ nhận hàng để tự động điền khi thanh toán...">
            <button type="button" class="btn-save-address" onclick="saveUserAddress()">Lưu địa chỉ</button>
        </div>
        <div class="profile-actions-row">
            <button type="button" class="btn-profile-orders" onclick="closeProfileModal(); CartSystem.openOrderHistoryModal();">
                <i class="fa-solid fa-clock-rotate-left"></i> Xem lịch sử đơn hàng
            </button>
            <button type="button" class="btn-profile-logout" onclick="logoutUser()">
                <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
            </button>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
};

window.closeProfileModal = function() {
    const modal = document.getElementById("userProfileModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
};

window.saveUserAddress = function() {
    const user = JSON.parse(localStorage.getItem("itmart_user"));
    const input = document.getElementById("profileAddressInput");
    if (!user || !input) return;

    user.address = input.value.trim();
    localStorage.setItem("itmart_user", JSON.stringify(user));
    if (typeof showToast === "function") {
        showToast("Đã cập nhật địa chỉ giao hàng mặc định!");
    }
};

window.logoutUser = function() {
    if (confirm("Bạn có muốn đăng xuất khỏi tài khoản không?")) {
        // Dữ liệu tài khoản đã được bảo lưu an toàn theo số điện thoại (itmart_cart_<phone>, itmart_orders_<phone>)
        localStorage.removeItem("itmart_user");
        localStorage.removeItem("itmart_cart");
        localStorage.removeItem("itmart_orders");
        localStorage.removeItem("itmart_wishlist");
        location.reload();
    }
};

/**
 * Định dạng tiền tệ VND
 */
function formatVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(amount).replace("₫", "đ");
}

/**
 * Khởi tạo các Tab danh mục & tương tác cuộn ngang
 */
function initCategoryTabs() {
    const categoryContainer = document.getElementById("categoryPills");
    if (!categoryContainer) return;

    categoryContainer.innerHTML = CATEGORIES.map(cat => `
        <li>
            <button class="category-pill-btn ${cat.id === AppState.currentCategory ? 'active' : ''}" 
                    data-category="${cat.id}">
                <i class="fa-solid ${cat.icon}"></i>
                <span>${cat.name}</span>
            </button>
        </li>
    `).join("");

    categoryContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-pill-btn");
        if (!btn) return;

        categoryContainer.querySelectorAll(".category-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Tự động cuộn nút được chọn vào giữa thanh điều hướng
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

        AppState.currentCategory = btn.dataset.category;
        AppState.currentBrand = "all";
        AppState.currentPage = 1;
        renderBrandFilters();
        applyFilters();

        // Cuộn mượt về danh mục sản phẩm nếu đang ở dưới
        const catalogSec = document.getElementById("catalogSection");
        if (catalogSec) {
            catalogSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    initCategoryScrollControls();
}

/**
 * Điều khiển thanh cuộn ngang danh mục: Nút mũi tên < > & kéo rê chuột
 */
function initCategoryScrollControls() {
    const viewport = document.getElementById("categoryScrollViewport") || document.querySelector(".category-nav .container");
    const prevBtn = document.getElementById("catNavPrev");
    const nextBtn = document.getElementById("catNavNext");

    if (!viewport) return;

    // Bấm nút mũi tên trái
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            viewport.scrollBy({ left: -260, behavior: "smooth" });
        });
    }

    // Bấm nút mũi tên phải
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            viewport.scrollBy({ left: 260, behavior: "smooth" });
        });
    }

    // Kéo chuột tự nhiên (Drag to scroll)
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    viewport.addEventListener("mousedown", (e) => {
        isDown = true;
        viewport.classList.add("is-dragging");
        startX = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
        if (isDown) {
            isDown = false;
            viewport.classList.remove("is-dragging");
        }
    });

    viewport.addEventListener("mouseleave", () => {
        if (isDown) {
            isDown = false;
            viewport.classList.remove("is-dragging");
        }
    });

    viewport.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 1.5;
        viewport.scrollLeft = scrollLeft - walk;
    });
}

/**
 * BỘ LỌC THƯƠNG HIỆU NỔI BẬT:
 * Mỗi danh mục chỉ hiển thị đúng 1 thương hiệu tiêu biểu/nổi bật nhất
 * (được chọn ngẫu nhiên mỗi lần người dùng truy cập web app)
 */
let categoryFeaturedBrandMap = {};

function initFeaturedBrandsRandom() {
    categoryFeaturedBrandMap = {};
    if (typeof CATEGORIES === "undefined" || !AppState.products) return;

    CATEGORIES.forEach(cat => {
        if (cat.id === "all") return;
        const catProducts = AppState.products.filter(p => p.category === cat.id);
        const catBrands = [...new Set(catProducts.map(p => p.brand).filter(Boolean))];
        if (catBrands.length > 0) {
            // Random 1 thương hiệu nổi bật đại diện cho danh mục này
            const randIndex = Math.floor(Math.random() * catBrands.length);
            categoryFeaturedBrandMap[cat.id] = catBrands[randIndex];
        }
    });
}

function renderBrandFilters() {
    const brandContainer = document.getElementById("brandPills");
    if (!brandContainer) return;

    let brandsToShow = [];

    if (AppState.currentCategory === "all") {
        // Khi ở "Tất cả sản phẩm": Mỗi danh mục chỉ góp 1 thương hiệu nổi bật nhất (đã random)
        const repBrands = Object.values(categoryFeaturedBrandMap);
        brandsToShow = [...new Set(repBrands)];
    } else {
        // Khi chọn 1 danh mục cụ thể: chỉ hiển thị đúng 1 thương hiệu nổi bật nhất của danh mục đó
        const catBrand = categoryFeaturedBrandMap[AppState.currentCategory];
        if (catBrand) {
            brandsToShow = [catBrand];
        } else {
            const catProducts = AppState.products.filter(p => p.category === AppState.currentCategory);
            const catBrands = [...new Set(catProducts.map(p => p.brand).filter(Boolean))];
            if (catBrands.length > 0) {
                brandsToShow = [catBrands[0]];
            }
        }
    }

    const allBrandsList = ["Tất cả thương hiệu", ...brandsToShow];

    brandContainer.innerHTML = allBrandsList.map(brand => {
        const isAll = brand === "Tất cả thương hiệu";
        const isActive = isAll ? (AppState.currentBrand === "all" || !AppState.currentBrand) : (brand === AppState.currentBrand);
        return `
            <button class="brand-pill-btn ${isActive ? 'active' : ''}" 
                    data-brand="${brand}">
                ${brand}
            </button>
        `;
    }).join("");
}

function initBrandFilters() {
    const brandContainer = document.getElementById("brandPills");
    if (!brandContainer) return;

    initFeaturedBrandsRandom();
    renderBrandFilters();

    brandContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".brand-pill-btn");
        if (!btn) return;

        brandContainer.querySelectorAll(".brand-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedBrand = btn.dataset.brand;
        AppState.currentBrand = (selectedBrand === "Tất cả thương hiệu") ? "all" : selectedBrand;
        AppState.currentPage = 1;
        applyFilters();
    });
}

/**
 * Hiển thị dải sản phẩm Flash Sale giờ vàng
 */
function renderFlashSaleProducts() {
    const flashGrid = document.getElementById("flashSaleGrid");
    if (!flashGrid) return;

    const flashItems = AppState.products.filter(p => p.flashSale);
    if (flashItems.length === 0) return;

    flashGrid.innerHTML = flashItems.map(p => {
        const discountPercent = p.originalPrice > p.salePrice ? Math.round((p.originalPrice - p.salePrice) / p.originalPrice * 100) : 0;
        return `
            <div class="flash-card" data-id="${p.id}">
                ${discountPercent > 0 ? `<div class="flash-discount-tag">-${discountPercent}%</div>` : ''}
                <a href="product.html?id=${p.id}" class="flash-img-link">
                    <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='./images/photo.jpg';">
                </a>
                <div class="flash-info">
                    <span class="flash-brand">${p.brand || 'Chính hãng'}</span>
                    <a href="product.html?id=${p.id}" class="flash-name" title="${p.name}">${p.name}</a>
                    <div class="flash-price-row">
                        <span class="flash-sale-price">${formatVND(p.salePrice)}</span>
                        ${p.originalPrice > p.salePrice ? `<span class="flash-orig-price">${formatVND(p.originalPrice)}</span>` : ''}
                    </div>
                    <div class="flash-progress-wrap">
                        <div class="flash-progress-bar" style="width: ${p.flashProgress || 80}%"></div>
                        <span class="flash-progress-text"><i class="fa-solid fa-fire"></i> ĐÃ BÁN ${p.flashProgress || 80}%</span>
                    </div>
                    <button class="flash-btn-buy" onclick="CartSystem.addItem('${p.id}', 1)">
                        <i class="fa-solid fa-cart-shopping"></i> Chọn mua
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

/**
 * Khởi tạo thanh tìm kiếm Live Search
 */
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");
    const searchForm = document.getElementById("searchForm");
    const searchSuggestions = document.getElementById("searchSuggestions");

    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        AppState.searchQuery = query;
        AppState.currentPage = 1;

        if (searchClear) {
            searchClear.style.display = query ? "block" : "none";
        }

        renderSuggestions(query);
        applyFilters();
    });

    if (searchClear) {
        searchClear.addEventListener("click", () => {
            searchInput.value = "";
            AppState.searchQuery = "";
            searchClear.style.display = "none";
            if (searchSuggestions) searchSuggestions.style.display = "none";
            applyFilters();
            searchInput.focus();
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (searchSuggestions) searchSuggestions.style.display = "none";
            applyFilters();
        });
    }

    // Đóng danh sách gợi ý khi click ra ngoài
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container") && searchSuggestions) {
            searchSuggestions.style.display = "none";
        }
    });
}

/**
 * Hiển thị gợi ý tìm kiếm tức thì
 */
function renderSuggestions(query) {
    const searchSuggestions = document.getElementById("searchSuggestions");
    if (!searchSuggestions) return;

    if (!query || query.length < 2) {
        searchSuggestions.style.display = "none";
        return;
    }

    const matched = AppState.products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matched.length === 0) {
        searchSuggestions.innerHTML = `<div style="padding: 14px; text-align: center; color: var(--gray-500); font-size: 13.5px;">Không tìm thấy sản phẩm phù hợp</div>`;
        searchSuggestions.style.display = "block";
        return;
    }

    searchSuggestions.innerHTML = matched.map(p => `
        <div class="search-suggestion-item" onclick="selectSuggestion('${p.id}')">
            <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='./images/photo.jpg';">
            <div class="search-suggestion-info">
                <div class="search-suggestion-title">${highlightQuery(p.name, query)}</div>
                <div class="search-suggestion-price">${formatVND(p.salePrice)} <span style="font-size: 11px; color: var(--gray-500); font-weight: normal;">(${p.unit})</span></div>
            </div>
        </div>
    `).join("");

    searchSuggestions.style.display = "block";
}

function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span style="color: var(--primary); background: #fee2e2; border-radius: 2px;">$1</span>`);
}

window.selectSuggestion = function(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    const searchInput = document.getElementById("searchInput");
    const searchSuggestions = document.getElementById("searchSuggestions");
    if (searchInput) searchInput.value = product.name;
    if (searchSuggestions) searchSuggestions.style.display = "none";

    AppState.searchQuery = product.name.toLowerCase();
    applyFilters();
};

/**
 * Khởi tạo bộ lọc khoảng giá
 */
function initPriceFilters() {
    const priceFiltersContainer = document.getElementById("priceFilters");
    if (!priceFiltersContainer) return;

    priceFiltersContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".price-filter-btn");
        if (!btn) return;

        priceFiltersContainer.querySelectorAll(".price-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        AppState.priceRange = btn.dataset.range;
        AppState.customPriceMin = null;
        AppState.customPriceMax = null;
        const minEl = document.getElementById("priceMinInput");
        const maxEl = document.getElementById("priceMaxInput");
        if (minEl) minEl.value = "";
        if (maxEl) maxEl.value = "";

        AppState.currentPage = 1;
        applyFilters();
    });
}

/**
 * Áp dụng bộ lọc khoảng giá tùy chọn
 */
window.applyCustomPrice = function() {
    const minEl = document.getElementById("priceMinInput");
    const maxEl = document.getElementById("priceMaxInput");
    const minVal = minEl && minEl.value ? parseInt(minEl.value) : null;
    const maxVal = maxEl && maxEl.value ? parseInt(maxEl.value) : null;

    if (minVal === null && maxVal === null) {
        alert("Vui lòng nhập mức giá tối thiểu hoặc tối đa!");
        return;
    }

    if (minVal !== null && maxVal !== null && minVal > maxVal) {
        alert("Giá tối thiểu không được lớn hơn giá tối đa!");
        return;
    }

    AppState.customPriceMin = minVal;
    AppState.customPriceMax = maxVal;
    AppState.priceRange = "custom";

    // Bỏ active ở các nút nhanh
    const priceFiltersContainer = document.getElementById("priceFilters");
    if (priceFiltersContainer) {
        priceFiltersContainer.querySelectorAll(".price-filter-btn").forEach(b => b.classList.remove("active"));
    }

    AppState.currentPage = 1;
    applyFilters();

    if (typeof showToast === "function") {
        showToast("Đã áp dụng khoảng giá tùy chọn!");
    }
};

/**
 * Hiển thị các sản phẩm vừa xem
 */
function renderRecentlyViewed() {
    const sec = document.getElementById("recentViewSection");
    const grid = document.getElementById("recentViewGrid");
    if (!sec || !grid) return;

    const recentIds = JSON.parse(localStorage.getItem("itmart_recent")) || [];
    if (recentIds.length === 0) {
        sec.style.display = "none";
        return;
    }

    const recentProducts = recentIds
        .map(id => AppState.products.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 5);

    if (recentProducts.length === 0) {
        sec.style.display = "none";
        return;
    }

    sec.style.display = "block";
    grid.innerHTML = recentProducts.map(p => `
        <div class="recent-card">
            <a href="product.html?id=${p.id}" class="recent-card-img">
                <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='./images/photo.jpg';">
            </a>
            <div class="recent-card-info">
                <a href="product.html?id=${p.id}" class="recent-card-title">${p.name}</a>
                <div class="recent-card-price">${formatVND(p.salePrice)}</div>
                <button type="button" class="btn-recent-cart" onclick="CartSystem.addItem('${p.id}', 1)" title="Thêm vào giỏ">
                    <i class="fa-solid fa-cart-plus"></i> Thêm giỏ
                </button>
            </div>
        </div>
    `).join("");
}

window.clearRecentlyViewed = function() {
    localStorage.removeItem("itmart_recent");
    const sec = document.getElementById("recentViewSection");
    if (sec) sec.style.display = "none";
    if (typeof showToast === "function") {
        showToast("Đã xóa lịch sử xem sản phẩm", "info");
    }
};

/**
 * Khởi tạo bộ sắp xếp
 */
function initSorting() {
    const sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", (e) => {
        AppState.sortBy = e.target.value;
        applyFilters();
    });
}

/**
 * Lọc và sắp xếp sản phẩm
 */
function applyFilters() {
    let result = [...AppState.products];

    // Lọc theo danh mục
    if (AppState.currentCategory !== "all") {
        result = result.filter(p => p.category === AppState.currentCategory);
    }

    // Lọc theo thương hiệu
    if (AppState.currentBrand && AppState.currentBrand !== "all" && AppState.currentBrand !== "Tất cả thương hiệu") {
        result = result.filter(p => p.brand === AppState.currentBrand);
    }

    // Lọc theo khoảng giá mặc định hoặc tùy chọn
    if (AppState.priceRange === "under-30k") {
        result = result.filter(p => p.salePrice < 30000);
    } else if (AppState.priceRange === "30k-60k") {
        result = result.filter(p => p.salePrice >= 30000 && p.salePrice <= 60000);
    } else if (AppState.priceRange === "over-60k") {
        result = result.filter(p => p.salePrice > 60000);
    } else if (AppState.priceRange === "custom") {
        if (AppState.customPriceMin !== null && !isNaN(AppState.customPriceMin)) {
            result = result.filter(p => p.salePrice >= AppState.customPriceMin);
        }
        if (AppState.customPriceMax !== null && !isNaN(AppState.customPriceMax)) {
            result = result.filter(p => p.salePrice <= AppState.customPriceMax);
        }
    }

    // Lọc theo từ khóa tìm kiếm
    if (AppState.searchQuery) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(AppState.searchQuery) ||
            (p.brand && p.brand.toLowerCase().includes(AppState.searchQuery)) ||
            p.categoryName.toLowerCase().includes(AppState.searchQuery) ||
            p.description.toLowerCase().includes(AppState.searchQuery)
        );
    }

    // Sắp xếp
    switch (AppState.sortBy) {
        case "best-seller":
            result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
            break;
        case "price-asc":
            result.sort((a, b) => a.salePrice - b.salePrice);
            break;
        case "price-desc":
            result.sort((a, b) => b.salePrice - a.salePrice);
            break;
        case "discount":
            result.sort((a, b) => (b.originalPrice - b.salePrice) - (a.originalPrice - a.salePrice));
            break;
        case "rating":
            result.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Giữ thứ tự ban đầu
            break;
    }

    AppState.filteredProducts = result;
    renderProducts();
    renderPagination();
    updateResultCount();
}

/**
 * Hiển thị lưới sản phẩm
 */
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const total = AppState.filteredProducts.length;

    if (total === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <h3>Không có sản phẩm nào phù hợp!</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục sản phẩm khác.</p>
                <button class="empty-reset-btn" onclick="resetFilters()">
                    <i class="fa-solid fa-arrow-rotate-left"></i> Xem tất cả sản phẩm
                </button>
            </div>
        `;
        return;
    }

    // Tính toán phân trang
    const startIndex = (AppState.currentPage - 1) * AppState.itemsPerPage;
    const pageProducts = AppState.filteredProducts.slice(startIndex, startIndex + AppState.itemsPerPage);

    grid.innerHTML = pageProducts.map(p => {
        const discountPercent = p.originalPrice > p.salePrice ? Math.round((p.originalPrice - p.salePrice) / p.originalPrice * 100) : 0;
        const soldFormatted = p.soldCount >= 1000 ? (p.soldCount / 1000).toFixed(1) + 'k' : (p.soldCount || 0);

        return `
            <article class="product-card" data-id="${p.id}">
                ${discountPercent > 0 ? `<div class="product-card-discount">-${discountPercent}%</div>` : ''}
                ${p.badge ? `<div class="product-card-badge">${p.badge}</div>` : ''}
                <div class="product-card-image">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='./images/photo.jpg';">
                    </a>
                </div>
                <div class="product-card-body">
                    <div class="product-card-brand-row">
                        <span class="product-card-brand">${p.brand || 'Chính hãng'}</span>
                        <span class="product-card-category">${p.categoryName}</span>
                    </div>
                    <a href="product.html?id=${p.id}">
                        <h3 class="product-card-title" title="${p.name}">${p.name}</h3>
                    </a>
                    <div class="product-card-rating">
                        <div class="stars">
                            ${renderStars(p.rating)}
                        </div>
                        <span class="rating-num">${p.rating}</span>
                        <span class="reviews-count">(${p.reviewsCount})</span>
                    </div>
                    <div class="product-card-meta">
                        <span>ĐVT: <strong>${p.unit}</strong></span>
                        <span class="sold-count-badge"><i class="fa-solid fa-fire"></i> Đã bán ${soldFormatted}</span>
                    </div>
                    <div class="product-card-pricing">
                        <div class="price-row">
                            <span class="price-current">${formatVND(p.salePrice)}</span>
                            ${p.originalPrice > p.salePrice ? `<span class="price-original">${formatVND(p.originalPrice)}</span>` : ''}
                        </div>
                    </div>
                    ${p.flashSale ? `
                        <div class="card-flash-progress">
                            <div class="card-flash-bar" style="width: ${p.flashProgress || 75}%"></div>
                            <span>ĐÃ BÁN ${p.flashProgress || 75}%</span>
                        </div>
                    ` : ''}
                    <div class="product-card-actions">
                        <button class="btn-add-cart" onclick="CartSystem.addItem('${p.id}', 1)">
                            <i class="fa-solid fa-cart-plus"></i> Thêm giỏ
                        </button>
                        <button class="btn-quick-view" onclick="QuickViewSystem.open('${p.id}')" title="Xem nhanh thông tin">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button class="btn-card-wishlist ${typeof WishlistSystem !== 'undefined' && WishlistSystem.isWishlisted(p.id) ? 'active' : ''}" 
                                onclick="WishlistSystem.toggle('${p.id}')" title="Yêu thích">
                            <i class="${typeof WishlistSystem !== 'undefined' && WishlistSystem.isWishlisted(p.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

/**
 * Hiển thị số sao đánh giá
 */
function renderStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += `<i class="fa-solid fa-star"></i>`;
        } else if (i - rating <= 0.5) {
            stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
        } else {
            stars += `<i class="fa-regular fa-star"></i>`;
        }
    }
    return stars;
}

/**
 * Hiển thị phân trang
 */
function renderPagination() {
    const container = document.getElementById("paginationContainer");
    if (!container) return;

    const totalPages = Math.ceil(AppState.filteredProducts.length / AppState.itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = `
        <button class="page-btn" ${AppState.currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${AppState.currentPage - 1})">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${AppState.currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="page-btn" ${AppState.currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${AppState.currentPage + 1})">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    container.innerHTML = html;
}

window.goToPage = function(page) {
    AppState.currentPage = page;
    renderProducts();
    renderPagination();
    const catalogSec = document.getElementById("catalogSection");
    if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};

function updateResultCount() {
    const countEl = document.getElementById("resultCount");
    if (countEl) {
        countEl.textContent = `Hiển thị ${AppState.filteredProducts.length} sản phẩm`;
    }
}

window.resetFilters = function() {
    AppState.currentCategory = "all";
    AppState.currentBrand = "all";
    AppState.searchQuery = "";
    AppState.sortBy = "default";
    AppState.currentPage = 1;

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) sortSelect.value = "default";

    const categoryContainer = document.getElementById("categoryPills");
    if (categoryContainer) {
        categoryContainer.querySelectorAll(".category-pill-btn").forEach((b, idx) => {
            b.classList.toggle("active", idx === 0);
        });
    }

    const brandContainer = document.getElementById("brandPills");
    if (brandContainer) {
        brandContainer.querySelectorAll(".brand-pill-btn").forEach((b, idx) => {
            b.classList.toggle("active", idx === 0);
        });
    }

    applyFilters();
};

/**
 * Xử lý thêm vào giỏ hàng thống nhất qua CartSystem
 */
window.addToCart = function(productId, quantity = 1) {
    if (typeof CartSystem !== "undefined") {
        CartSystem.addItem(productId, quantity);
    }
};

function updateCartBadge() {
    if (typeof CartSystem !== "undefined") {
        CartSystem.updateBadge();
        return;
    }
    const badge = document.getElementById("cartBadgeCount");
    if (badge) badge.style.display = "none";
}

/**
 * Hiển thị Toast thông báo
 */
window.showToast = function(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color: var(--secondary); font-size: 18px;"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

/**
 * Đếm ngược Flash Sale sinh động
 */
function initFlashSaleCountdown() {
    const hoursEl = document.getElementById("countdownHours");
    const minsEl = document.getElementById("countdownMins");
    const secsEl = document.getElementById("countdownSecs");

    if (!hoursEl || !minsEl || !secsEl) return;

    // Giả lập đếm ngược 8 tiếng kể từ thời điểm mở web
    let totalSeconds = 8 * 3600 + 45 * 60 + 20;

    setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            totalSeconds = 8 * 3600;
        }

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, "0");
        minsEl.textContent = String(m).padStart(2, "0");
        secsEl.textContent = String(s).padStart(2, "0");
    }, 1000);
}

/**
 * Quick View preview
 */
window.quickView = function(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    // Tạm thời hiển thị alert hoặc chuyển hướng trang chi tiết
    if (product.oldLink) {
        window.location.href = product.oldLink;
    }
};

window.handleProductClick = function(event, productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (product && product.oldLink) {
        // Cho phép chuyển hướng tới file chi tiết tương ứng
        return true;
    }
};
