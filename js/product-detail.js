/**
 * IT MART - PRODUCT DETAIL CONTROLLER (product-detail.js)
 * Tách riêng hoàn toàn từ product.html
 * Quản lý: Hiển thị sản phẩm, thông số kỹ thuật, đánh giá khách hàng, Mua ngay & Thêm giỏ hàng
 */

let currentProduct = null;
let currentRatingSelection = 5;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const code = urlParams.get("code");

    // Tìm sản phẩm theo ID hoặc theo oldLink
    if (id) {
        currentProduct = PRODUCTS.find(p => p.id === id);
    } else if (code) {
        currentProduct = PRODUCTS.find(p => p.id === code || (p.oldLink && p.oldLink.includes(code)));
    }

    // Nếu không tìm thấy, lấy sản phẩm đầu tiên làm mẫu
    if (!currentProduct) {
        currentProduct = PRODUCTS[0];
    }

    // Lưu sản phẩm vào danh sách vừa xem gần đây (Recently Viewed)
    saveRecentlyViewed(currentProduct.id);

    renderProductDetail(currentProduct);
    renderProductSpecs(currentProduct);
    renderProductReviews(currentProduct);
    initStarSelector();
    renderRelatedProducts(currentProduct);
    renderRecentlyViewed();
    checkAuthSessionDetail();
});

function saveRecentlyViewed(id) {
    let recent = JSON.parse(localStorage.getItem("itmart_recent")) || [];
    recent = recent.filter(item => item !== id);
    recent.unshift(id);
    if (recent.length > 8) recent = recent.slice(0, 8);
    localStorage.setItem("itmart_recent", JSON.stringify(recent));
}

function renderRecentlyViewed() {
    const sec = document.getElementById("recentViewSection");
    const grid = document.getElementById("recentViewGrid");
    if (!sec || !grid) return;

    const recentIds = JSON.parse(localStorage.getItem("itmart_recent")) || [];
    // Loại bỏ sản phẩm hiện tại đang xem
    const otherRecentIds = recentIds.filter(id => id !== currentProduct.id);
    if (otherRecentIds.length === 0) {
        sec.style.display = "none";
        return;
    }

    const recentProducts = otherRecentIds
        .map(id => PRODUCTS.find(p => p.id === id))
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
                <div class="recent-card-price">${formatVNDHelper(p.salePrice)}</div>
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
};

function checkAuthSessionDetail() {
    const user = JSON.parse(localStorage.getItem("itmart_user"));
    const accountBtn = document.getElementById("headerUserBtn") || document.querySelector(".header-action-btn[href*='Log_in']");
    const topBarAuthLink = document.getElementById("topBarAuthLink") || document.querySelector(".top-bar-right a[href*='Log_in']");

    if (user && user.isLoggedIn) {
        if (accountBtn) {
            accountBtn.innerHTML = `
                <i class="fa-solid fa-circle-user" style="color: var(--secondary);"></i>
                <span>${user.name}</span>
            `;
            accountBtn.href = "index.html";
        }

        if (topBarAuthLink) {
            topBarAuthLink.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất`;
            topBarAuthLink.href = "javascript:void(0);";
            topBarAuthLink.title = `Đang đăng nhập: ${user.name} - Bấm để đăng xuất`;
            topBarAuthLink.onclick = async (e) => {
                e.preventDefault();
                const confirmed = await ITMDialog.confirm({
                    title: "Đăng xuất tài khoản",
                    message: "Bạn có muốn đăng xuất khỏi tài khoản IT Mart không?",
                    type: "danger",
                    confirmText: "Đăng xuất",
                    cancelText: "Hủy bỏ",
                    icon: "fa-solid fa-arrow-right-from-bracket"
                });
                if (!confirmed) return;

                localStorage.removeItem("itmart_user");
                localStorage.removeItem("itmart_cart");
                localStorage.removeItem("itmart_orders");
                localStorage.removeItem("itmart_wishlist");
                ITMToast.info("Đã đăng xuất thành công!");
                setTimeout(() => location.reload(), 400);
            };
        }
    } else {
        if (topBarAuthLink) {
            topBarAuthLink.innerHTML = `<i class="fa-solid fa-user"></i> Đăng nhập / Đăng ký`;
            topBarAuthLink.href = "./Log_in.html";
            topBarAuthLink.onclick = null;
        }
    }
}

function renderProductDetail(p) {
    document.getElementById("pageTitle").textContent = `${p.name} - IT Mart`;
    document.getElementById("bcCategory").textContent = p.categoryName;
    document.getElementById("bcCategory").href = `index.html?cat=${p.category}`;
    document.getElementById("bcProductName").textContent = p.name;

    const pImg = document.getElementById("pImg");
    pImg.src = p.image;
    pImg.alt = p.name;
    pImg.onerror = function() { this.src = './images/photo.jpg'; };
    document.getElementById("pBadge").textContent = p.badge || "Chính hãng";
    document.getElementById("pCategory").textContent = p.categoryName;
    document.getElementById("pBrand").textContent = p.brand || "Chính hãng";
    
    const soldFormatted = p.soldCount >= 1000 ? (p.soldCount / 1000).toFixed(1) + 'k' : (p.soldCount || 0);
    document.getElementById("pSold").innerHTML = `<i class="fa-solid fa-fire"></i> Đã bán ${soldFormatted}`;

    document.getElementById("pName").textContent = p.name;
    document.getElementById("pStars").innerHTML = renderStarsHelper(p.rating);
    document.getElementById("pReviews").textContent = `(${p.reviewsCount} đánh giá)`;
    document.getElementById("pSalePrice").textContent = formatVNDHelper(p.salePrice);
    
    const origEl = document.getElementById("pOrigPrice");
    const discountEl = document.getElementById("pDiscountTag");
    if (p.originalPrice > p.salePrice) {
        origEl.textContent = formatVNDHelper(p.originalPrice);
        origEl.style.display = "inline";
        const percent = Math.round((p.originalPrice - p.salePrice) / p.originalPrice * 100);
        discountEl.textContent = `-${percent}%`;
        discountEl.style.display = "inline-block";
    } else {
        origEl.style.display = "none";
        discountEl.style.display = "none";
    }

    document.getElementById("pUnit").textContent = p.unit;
    document.getElementById("pDescription").textContent = p.description;

    // Nút thêm vào giỏ hàng
    const btnAdd = document.getElementById("btnAddToCartDetail");
    if (btnAdd) {
        btnAdd.onclick = () => {
            const qty = parseInt(document.getElementById("detailQty").value) || 1;
            if (typeof CartSystem !== "undefined") {
                CartSystem.addItem(p.id, qty);
                CartSystem.openDrawer();
            }
        };
    }

    // Nút Mua Ngay (chuyển thẳng tới checkout)
    const btnBuy = document.getElementById("btnBuyNowDetail");
    if (btnBuy) {
        btnBuy.onclick = () => {
            const qty = parseInt(document.getElementById("detailQty").value) || 1;
            if (typeof CartSystem !== "undefined") {
                if (!CartSystem.isLoggedIn()) {
                    CartSystem.showAuthRequiredModal("mua ngay sản phẩm");
                    return;
                }
                CartSystem.addItem(p.id, qty);
                CartSystem.openCheckoutModal();
            }
        };
    }

    // Nút Yêu thích
    const btnWishlist = document.getElementById("btnDetailWishlist");
    if (btnWishlist) {
        updateDetailWishlistState(p.id);
        btnWishlist.onclick = () => {
            if (typeof WishlistSystem !== "undefined") {
                WishlistSystem.toggle(p.id);
                updateDetailWishlistState(p.id);
            }
        };
    }
}

function updateDetailWishlistState(id) {
    const btnWishlist = document.getElementById("btnDetailWishlist");
    if (!btnWishlist || typeof WishlistSystem === "undefined") return;
    const isFav = WishlistSystem.isWishlisted(id);
    btnWishlist.classList.toggle("active", isFav);
    btnWishlist.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
}

function adjustQty(delta) {
    const input = document.getElementById("detailQty");
    let val = (parseInt(input.value) || 1) + delta;
    if (val < 1) val = 1;
    if (currentProduct && val > (currentProduct.stock || 99)) {
        val = currentProduct.stock || 99;
        ITMToast.warning(`Rất tiếc, kho chỉ còn tối đa ${val} sản phẩm!`, "Kho giới hạn");
    }
    input.value = val;
}

/**
 * Hiển thị thông số kỹ thuật chuẩn E-Commerce
 */
function renderProductSpecs(p) {
    const specs = p.specs || {};
    document.getElementById("specBrand").textContent = p.brand || "Đang cập nhật";
    document.getElementById("specOrigin").textContent = specs.origin || "Việt Nam";
    document.getElementById("specVolume").textContent = specs.volume || p.unit || "Tiêu chuẩn";
    document.getElementById("specExpiry").textContent = specs.expiry || "In trên bao bì";
    document.getElementById("specStorage").textContent = specs.storage || "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp";
    document.getElementById("specIngredients").textContent = specs.ingredients || "Sữa nguyên chất, vitamin & khoáng chất";
}

/**
 * Hiển thị đánh giá khách hàng
 */
function renderProductReviews(p) {
    const avgScoreEl = document.getElementById("revAvgScore");
    const avgStarsEl = document.getElementById("revAvgStars");
    const totalCountEl = document.getElementById("revTotalCount");
    const reviewsListEl = document.getElementById("reviewsList");

    if (avgScoreEl) avgScoreEl.textContent = p.rating.toFixed(1);
    if (avgStarsEl) avgStarsEl.innerHTML = renderStarsHelper(p.rating);
    if (totalCountEl) totalCountEl.textContent = `Dựa trên ${p.reviewsCount} lượt đánh giá thực tế`;

    // Lấy reviews mặc định + reviews người dùng đã gửi lưu ở localStorage
    const savedKey = "itmart_custom_reviews_" + p.id;
    const customReviews = JSON.parse(localStorage.getItem(savedKey)) || [];
    const allReviews = [...customReviews, ...(p.reviews || [])];

    if (!reviewsListEl) return;

    if (allReviews.length === 0) {
        reviewsListEl.innerHTML = `
            <div style="text-align: center; padding: 24px; color: var(--gray-500); font-size: 14px;">
                Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </div>
        `;
        return;
    }

    reviewsListEl.innerHTML = allReviews.map(rev => `
        <div class="review-item">
            <div class="review-avatar">
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="review-content">
                <div class="review-header">
                    <span class="reviewer-name">${rev.name}</span>
                    <span class="buyer-badge"><i class="fa-solid fa-circle-check"></i> Đã mua hàng tại IT Mart</span>
                    <span class="review-date">${rev.date}</span>
                </div>
                <div class="review-stars">
                    ${renderStarsHelper(rev.rating)}
                </div>
                <p class="review-text">${rev.comment}</p>
            </div>
        </div>
    `).join("");
}

/**
 * Tương tác chọn số sao đánh giá
 */
function initStarSelector() {
    const starContainer = document.getElementById("starSelector");
    if (!starContainer) return;

    // Tự động điền họ tên nếu người dùng đã đăng nhập
    try {
        const user = JSON.parse(localStorage.getItem("itmart_user"));
        if (user && user.fullName) {
            const nameInput = document.getElementById("reviewerName");
            if (nameInput) nameInput.value = user.fullName;
        }
    } catch (e) {}

    const stars = starContainer.querySelectorAll(".star-opt");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            const rating = parseInt(star.dataset.rating);
            currentRatingSelection = rating;
            stars.forEach(s => {
                const sRating = parseInt(s.dataset.rating);
                s.classList.toggle("active", sRating <= rating);
            });
        });
    });
}

/**
 * Xử lý gửi đánh giá của khách hàng (Lưu vào CSDL ProductDB)
 */
window.handleReviewSubmit = function(event) {
    event.preventDefault();
    if (!currentProduct) return;

    const nameInput = document.getElementById("reviewerName");
    const commentInput = document.getElementById("reviewerComment");

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    let hasError = false;
    if (!name) {
        ITMForm.showError("reviewerName", "Vui lòng nhập họ tên của bạn!");
        hasError = true;
    }
    if (!comment) {
        ITMForm.showError("reviewerComment", "Vui lòng viết cảm nhận đánh giá sản phẩm!");
        hasError = true;
    }
    if (hasError) return;

    ITMForm.clearAll();

    // 1. Lưu đánh giá vào ProductDB & LocalStorage
    if (typeof ProductDB !== "undefined" && typeof ProductDB.addReview === "function") {
        ProductDB.addReview(currentProduct.id, {
            author: name,
            rating: currentRatingSelection,
            comment: comment
        });
        currentProduct = ProductDB.findById(currentProduct.id);
    } else {
        const newReview = {
            name: name,
            rating: currentRatingSelection,
            date: "Hôm nay",
            comment: comment
        };
        const savedKey = "itmart_custom_reviews_" + currentProduct.id;
        const customReviews = JSON.parse(localStorage.getItem(savedKey)) || [];
        customReviews.unshift(newReview);
        localStorage.setItem(savedKey, JSON.stringify(customReviews));
    }

    // 2. Thưởng 10 điểm tích lũy thành viên vì đã đánh giá sản phẩm!
    if (typeof LoyaltySystem !== "undefined" && LoyaltySystem.getUser()) {
        const u = LoyaltySystem.getUser();
        u.points = (u.points || 120) + 10;
        localStorage.setItem("itmart_user", JSON.stringify(u));
    }

    // Reset form
    commentInput.value = "";

    // 3. Cập nhật lại giao diện reviews & số sao sản phẩm trên trang
    renderProductReviews(currentProduct);

    // Cập nhật lại số sao ở phần đầu trang
    const ratingTopEl = document.getElementById("pRating");
    if (ratingTopEl) ratingTopEl.textContent = `★ ${currentProduct.rating.toFixed(1)} (${currentProduct.reviewsCount} đánh giá)`;

    ITMToast.success("Cảm ơn bạn đã gửi đánh giá! Nhận xét đã được ghi nhận và bạn được thưởng +10 điểm tích lũy.", "Đánh giá thành công");
};

function renderRelatedProducts(curr) {
    const related = PRODUCTS.filter(p => p.category === curr.category && p.id !== curr.id).slice(0, 4);
    const grid = document.getElementById("relatedProductsGrid");
    if (!grid) return;

    grid.innerHTML = related.map(p => `
        <article class="product-card">
            ${p.badge ? `<div class="product-card-badge">${p.badge}</div>` : ''}
            <div class="product-card-image">
                <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null; this.src='./images/photo.jpg';"></a>
            </div>
            <div class="product-card-body">
                <span class="product-card-category">${p.categoryName}</span>
                <a href="product.html?id=${p.id}"><h3 class="product-card-title">${p.name}</h3></a>
                <div class="product-card-pricing">
                    <span class="price-current">${formatVNDHelper(p.salePrice)}</span>
                </div>
                <div class="product-card-actions">
                    <button class="btn-add-cart" onclick="CartSystem.addItem('${p.id}', 1)"><i class="fa-solid fa-cart-plus"></i> Thêm giỏ</button>
                </div>
            </div>
        </article>
    `).join("");
}

function renderStarsHelper(rating) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
        s += i <= Math.floor(rating) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
    return s;
}

function formatVNDHelper(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "đ");
}
