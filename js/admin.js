/**
 * IT MART - ADMIN PORTAL CONTROLLER (admin.js)
 * Quản lý toàn bộ chức năng Back-office Dashboard, CRUD Sản phẩm, Quản lý đơn hàng, Biểu đồ Chart.js
 */

const AdminApp = {
    currentTab: "dashboard",
    productPage: 1,
    productsPerPage: 10,
    productSearch: "",
    productCategory: "all",
    orderStatusFilter: "all",
    charts: {},

    init() {
        this.initDefaultOrders();
        this.initDefaultCoupons();
        this.bindNavTabs();
        this.renderDashboard();
        this.initProductsTab();
        this.initOrdersTab();
        this.initVouchersTab();
        this.initFeedbackTab();
    },

    // Khởi tạo các đơn hàng mẫu để giao diện luôn đầy đủ dữ liệu trực quan
    initDefaultOrders() {
        const existing = localStorage.getItem("itmart_all_orders");
        if (!existing || JSON.parse(existing).length === 0) {
            const demoOrders = [
                {
                    id: "ITM-982145",
                    date: "01/10/2026, 14:20",
                    name: "Nguyễn Văn Tuấn",
                    phone: "0912345678",
                    address: "Số 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
                    note: "Giao trong giờ hành chính",
                    paymentMethod: "Chuyển khoản QR ngân hàng",
                    status: "Chờ xác nhận",
                    total: 385000,
                    items: [
                        { id: "sp-29", name: "Súp lơ xanh Đà Lạt VietGAP 500g", salePrice: 28000, quantity: 2, image: "./images/products/sp-29.jpg" },
                        { id: "sp-78", name: "Bộ 3 nồi inox 5 đáy Sunhouse SH888", salePrice: 329000, quantity: 1, image: "./images/products/sp-78.jpg" }
                    ]
                },
                {
                    id: "ITM-874211",
                    date: "01/10/2026, 11:45",
                    name: "Trần Thị Mai Phương",
                    phone: "0981224455",
                    address: "45 Thái Hà, Đống Đa, Hà Nội",
                    note: "Gọi trước khi giao 10 phút",
                    paymentMethod: "Tiền mặt khi nhận hàng (COD)",
                    status: "Đang giao hàng",
                    total: 462000,
                    items: [
                        { id: "sp-01", name: "Lốc 4 hộp Sữa tươi Vinamilk 110ml", salePrice: 28500, quantity: 4, image: "./images/1.jpeg" },
                        { id: "sp-34", name: "Táo Envy New Zealand Size 30 (1kg)", salePrice: 189000, quantity: 1, image: "./images/products/sp-34.jpg" },
                        { id: "sp-41", name: "Thịt ba chỉ heo quế CP Khay 500g", salePrice: 79000, quantity: 2, image: "./images/products/sp-41.jpg" }
                    ]
                },
                {
                    id: "ITM-763901",
                    date: "30/09/2026, 18:30",
                    name: "Lê Hoàng Long",
                    phone: "0977889900",
                    address: "88 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh",
                    note: "",
                    paymentMethod: "Chuyển khoản QR ngân hàng",
                    status: "Hoàn thành",
                    total: 620000,
                    items: [
                        { id: "sp-80", name: "Bình giữ nhiệt Lock&Lock Feather Light 450ml", salePrice: 249000, quantity: 2, image: "./images/products/sp-80.png" },
                        { id: "sp-07", name: "Thùng 48 hộp Sữa tươi TH True MILK 180ml", salePrice: 385000, quantity: 1, image: "./images/Th-organic.jpg" }
                    ]
                },
                {
                    id: "ITM-652190",
                    date: "30/09/2026, 09:15",
                    name: "Phạm Thúy Hằng",
                    phone: "0905123456",
                    address: "156 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
                    note: "Để ở bảo vệ sảnh A",
                    paymentMethod: "Tiền mặt khi nhận hàng (COD)",
                    status: "Hoàn thành",
                    total: 215000,
                    items: [
                        { id: "sp-47", name: "Trứng gà tươi Ba Huân Hộp 10 quả", salePrice: 35000, quantity: 2, image: "./images/products/sp-47.jpg" },
                        { id: "sp-30", name: "Cà chua Beef Đà Lạt VietGAP 1kg", salePrice: 32000, quantity: 2, image: "./images/products/sp-30.jpg" },
                        { id: "sp-73", name: "Nước giặt xả OMO Matic túi 3.6kg", salePrice: 195000, quantity: 1, image: "./images/products/sp-73.jpg" }
                    ]
                },
                {
                    id: "ITM-541982",
                    date: "29/09/2026, 16:40",
                    name: "Hoàng Minh Đức",
                    phone: "0934567890",
                    address: "215 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh",
                    note: "Hủy do đổi ý mua món khác",
                    paymentMethod: "Tiền mặt khi nhận hàng (COD)",
                    status: "Đã hủy",
                    total: 154000,
                    items: [
                        { id: "sp-13", name: "Lốc 4 hộp Sữa chua uống Kun Cam 180ml", salePrice: 29500, quantity: 2, image: "./images/kun-sua-chua-uong-huong-cam-180ml_4-goi-4-20230410013450.png" }
                    ]
                }
            ];
            localStorage.setItem("itmart_all_orders", JSON.stringify(demoOrders));
        }
    },

    // Khởi tạo các mã voucher mặc định
    initDefaultCoupons() {
        const existing = localStorage.getItem("itmart_coupons");
        if (!existing) {
            const defaultCoupons = [
                { code: "FREESHIP", type: "freeship", value: 30000, minOrder: 300000, desc: "Miễn phí vận chuyển toàn quốc đơn từ 300k", count: 128 },
                { code: "ITMART10", type: "percent", value: 10, minOrder: 0, desc: "Giảm 10% tổng đơn hàng bất kỳ", count: 85 },
                { code: "CHAOBANMOI", type: "amount", value: 20000, minOrder: 100000, desc: "Giảm ngay 20.000đ cho khách hàng mới", count: 240 }
            ];
            localStorage.setItem("itmart_coupons", JSON.stringify(defaultCoupons));
        }
    },

    // Điều hướng chuyển đổi các Tab quản trị
    bindNavTabs() {
        document.querySelectorAll(".nav-item[data-tab]").forEach(btn => {
            btn.addEventListener("click", () => {
                const tab = btn.getAttribute("data-tab");
                this.switchTab(tab);
            });
        });
    },

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll(".nav-item[data-tab]").forEach(b => {
            b.classList.toggle("active", b.getAttribute("data-tab") === tabName);
        });

        document.querySelectorAll(".admin-tab-pane").forEach(pane => {
            pane.classList.remove("active");
        });
        const targetPane = document.getElementById(`tab-${tabName}`);
        if (targetPane) targetPane.classList.add("active");

        const titles = {
            dashboard: "Tổng Quan & Báo Cáo Doanh Thu",
            products: "Quản Lý Danh Mục & Sản Phẩm",
            orders: "Quản Lý Đơn Hàng & Vận Chuyển",
            vouchers: "Quản Lý Khuyến Mại & Voucher",
            feedback: "Ý Kiến Đóng Góp & Khiếu Nại",
            settings: "Cài Đặt Hệ Thống & CSDL"
        };
        document.getElementById("adminPageTitle").textContent = titles[tabName] || "Quản Trị IT Mart";

        if (tabName === "dashboard") this.renderDashboard();
        if (tabName === "products") this.renderProductsTable();
        if (tabName === "orders") this.renderOrdersTable();
        if (tabName === "vouchers") this.renderVouchersTable();
        if (tabName === "feedback") this.renderFeedbackTable();
    },

    // 1. DASHBOARD OVERVIEW & CHARTS
    renderDashboard() {
        const orders = this.getAllOrders();
        const products = ProductDB.getAll();

        // Tính doanh thu
        const validOrders = orders.filter(o => o.status !== "Đã hủy");
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalOrdersCount = orders.length;
        const totalProductsCount = products.length;
        
        // Khách hàng độc nhất theo số điện thoại
        const uniquePhones = new Set(orders.map(o => o.phone).filter(Boolean));
        const totalCustomers = Math.max(uniquePhones.size, 15);

        // Cập nhật thẻ KPI
        document.getElementById("kpiTotalRevenue").textContent = this.formatCurrency(totalRevenue);
        document.getElementById("kpiTotalOrders").textContent = totalOrdersCount.toLocaleString("vi-VN");
        document.getElementById("kpiTotalProducts").textContent = totalProductsCount.toLocaleString("vi-VN");
        document.getElementById("kpiTotalCustomers").textContent = totalCustomers.toLocaleString("vi-VN");

        // Vẽ biểu đồ
        this.renderRevenueChart(orders);
        this.renderCategoryChart(products);
        this.renderBestSellers(products);
        this.renderRecentOrders(orders);
    },

    renderRevenueChart(orders) {
        const ctx = document.getElementById("revenueChart");
        if (!ctx) return;

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        const labels = ["T2 (25/9)", "T3 (26/9)", "T4 (27/9)", "T5 (28/9)", "T6 (29/9)", "T7 (30/9)", "CN (01/10)"];
        const revenueData = [1250000, 1890000, 2450000, 2100000, 3420000, 4850000, 5600000];

        this.charts.revenue = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Doanh thu (VNĐ)",
                    data: revenueData,
                    borderColor: "#ea2e2e",
                    backgroundColor: "rgba(234, 46, 46, 0.08)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: "#ea2e2e",
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Doanh thu: ${context.parsed.y.toLocaleString("vi-VN")} đ`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (v) => (v / 1000000).toFixed(1) + " tr"
                        },
                        grid: { color: "#f1f5f9" }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderCategoryChart(products) {
        const ctx = document.getElementById("categoryChart");
        if (!ctx) return;

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const catCounts = {};
        products.forEach(p => {
            const cat = p.categoryName || "Khác";
            catCounts[cat] = (catCounts[cat] || 0) + 1;
        });

        const labels = Object.keys(catCounts).slice(0, 5);
        const data = labels.map(k => catCounts[k]);

        this.charts.category = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#ea2e2e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { boxWidth: 12, padding: 12, font: { size: 11.5 } }
                    }
                },
                cutout: "68%"
            }
        });
    },

    renderBestSellers(products) {
        const tbody = document.getElementById("bestSellersTableBody");
        if (!tbody) return;

        const sorted = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);

        tbody.innerHTML = sorted.map((p, idx) => `
            <tr>
                <td><strong>#${idx + 1}</strong></td>
                <td>
                    <div class="product-cell">
                        <img src="${p.image}" alt="${p.name}" onerror="this.src='./images/Logo.png';">
                        <div>
                            <div class="product-cell-name">${p.name}</div>
                            <div class="product-cell-sku">${p.brand} • ${p.categoryName}</div>
                        </div>
                    </div>
                </td>
                <td><strong>${this.formatCurrency(p.salePrice)}</strong></td>
                <td><span class="status-badge badge-success">${(p.soldCount || 120) + (5 - idx) * 35} đã bán</span></td>
                <td>⭐ ${p.rating} (${p.reviewsCount} review)</td>
            </tr>
        `).join("");
    },

    renderRecentOrders(orders) {
        const tbody = document.getElementById("recentOrdersTableBody");
        if (!tbody) return;

        const recent = orders.slice(0, 5);
        tbody.innerHTML = recent.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.name}<br><small style="color: #64748b;">${o.phone}</small></td>
                <td>${o.date}</td>
                <td><strong>${this.formatCurrency(o.total)}</strong></td>
                <td>${this.getStatusBadge(o.status)}</td>
                <td>
                    <button type="button" class="btn-icon" title="Xem chi tiết" onclick="AdminApp.viewOrder('${o.id}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    },

    // 2. PRODUCTS MANAGEMENT TAB
    initProductsTab() {
        const searchInput = document.getElementById("adminProductSearch");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.productSearch = e.target.value.trim().toLowerCase();
                this.productPage = 1;
                this.renderProductsTable();
            });
        }

        const catSelect = document.getElementById("adminCategoryFilter");
        if (catSelect) {
            // Nạp danh mục vào dropdown
            catSelect.innerHTML = `<option value="all">Tất cả danh mục (${CATEGORIES.length - 1})</option>` +
                CATEGORIES.filter(c => c.id !== "all").map(c => `<option value="${c.id}">${c.name}</option>`).join("");

            catSelect.addEventListener("change", (e) => {
                this.productCategory = e.target.value;
                this.productPage = 1;
                this.renderProductsTable();
            });
        }
    },

    renderProductsTable() {
        const tbody = document.getElementById("adminProductsTableBody");
        if (!tbody) return;

        let items = ProductDB.getAll();

        if (this.productCategory !== "all") {
            items = items.filter(p => p.category === this.productCategory);
        }

        if (this.productSearch) {
            items = items.filter(p => 
                p.name.toLowerCase().includes(this.productSearch) ||
                p.brand.toLowerCase().includes(this.productSearch) ||
                p.id.toLowerCase().includes(this.productSearch)
            );
        }

        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / this.productsPerPage) || 1;
        if (this.productPage > totalPages) this.productPage = totalPages;

        const startIdx = (this.productPage - 1) * this.productsPerPage;
        const currentItems = items.slice(startIdx, startIdx + this.productsPerPage);

        if (currentItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy sản phẩm nào.</td></tr>`;
            document.getElementById("productsPagination").innerHTML = "";
            return;
        }

        tbody.innerHTML = currentItems.map(p => {
            const isOutOfStock = (p.stock || 0) <= 0;
            return `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='./images/Logo.png';">
                            <div>
                                <div class="product-cell-name">${p.name}</div>
                                <div class="product-cell-sku">${p.brand} • ${p.categoryName}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: #ea2e2e;">${this.formatCurrency(p.salePrice)}</div>
                        ${p.originalPrice > p.salePrice ? `<small style="text-decoration: line-through; color: #94a3b8;">${this.formatCurrency(p.originalPrice)}</small>` : ""}
                    </td>
                    <td>
                        <span style="font-weight: 700;">${p.stock || 100}</span> ${p.unit || "Món"}
                    </td>
                    <td>
                        <span class="status-badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}">
                            ${isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                        </span>
                        ${p.flashSale ? '<span class="status-badge badge-warning" style="margin-left: 4px;">⚡ Flash</span>' : ''}
                    </td>
                    <td>⭐ ${p.rating} (${p.reviewsCount})</td>
                    <td>
                        <div class="action-btns">
                            <button type="button" class="btn-icon" title="Chỉnh sửa sản phẩm" onclick="AdminApp.openEditProductModal('${p.id}')">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="btn-icon btn-delete" title="Xóa sản phẩm" onclick="AdminApp.deleteProduct('${p.id}')">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        // Cập nhật phân trang
        this.renderPagination("productsPagination", totalItems, totalPages, this.productPage, (newPage) => {
            this.productPage = newPage;
            this.renderProductsTable();
        });
    },

    openAddProductModal() {
        document.getElementById("modalProductTitle").textContent = "Thêm Sản Phẩm Mới";
        document.getElementById("productFormId").value = "";
        document.getElementById("prodName").value = "";
        document.getElementById("prodBrand").value = "";
        document.getElementById("prodCategory").innerHTML = CATEGORIES.filter(c => c.id !== "all").map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        document.getElementById("prodOriginalPrice").value = "";
        document.getElementById("prodSalePrice").value = "";
        document.getElementById("prodUnit").value = "Hộp";
        document.getElementById("prodStock").value = "100";
        document.getElementById("prodImage").value = "./images/products/sp-29.jpg";
        document.getElementById("prodFlashSale").checked = false;
        document.getElementById("prodDescription").value = "";

        document.getElementById("productModal").classList.add("active");
    },

    openEditProductModal(id) {
        const p = ProductDB.findById(id);
        if (!p) return;

        document.getElementById("modalProductTitle").textContent = `Chỉnh Sửa: ${p.name}`;
        document.getElementById("productFormId").value = p.id;
        document.getElementById("prodName").value = p.name;
        document.getElementById("prodBrand").value = p.brand;
        document.getElementById("prodCategory").innerHTML = CATEGORIES.filter(c => c.id !== "all").map(c => `
            <option value="${c.id}" ${c.id === p.category ? "selected" : ""}>${c.name}</option>
        `).join("");
        document.getElementById("prodOriginalPrice").value = p.originalPrice;
        document.getElementById("prodSalePrice").value = p.salePrice;
        document.getElementById("prodUnit").value = p.unit || "Hộp";
        document.getElementById("prodStock").value = p.stock || 100;
        document.getElementById("prodImage").value = p.image;
        document.getElementById("prodFlashSale").checked = Boolean(p.flashSale);
        document.getElementById("prodDescription").value = p.description || "";

        document.getElementById("productModal").classList.add("active");
    },

    closeProductModal() {
        document.getElementById("productModal").classList.remove("active");
    },

    saveProduct(event) {
        event.preventDefault();
        const id = document.getElementById("productFormId").value;
        const name = document.getElementById("prodName").value.trim();
        const brand = document.getElementById("prodBrand").value.trim();
        const category = document.getElementById("prodCategory").value;
        const originalPrice = Number(document.getElementById("prodOriginalPrice").value);
        const salePrice = Number(document.getElementById("prodSalePrice").value);
        const unit = document.getElementById("prodUnit").value.trim() || "Món";
        const stock = Number(document.getElementById("prodStock").value) || 100;
        const image = document.getElementById("prodImage").value.trim() || "./images/products/sp-29.jpg";
        const flashSale = document.getElementById("prodFlashSale").checked;
        const description = document.getElementById("prodDescription").value.trim();

        if (!name || !salePrice) {
            alert("Vui lòng điền đầy đủ tên sản phẩm và giá bán!");
            return;
        }

        if (id) {
            // Update
            ProductDB.updateProduct(id, {
                name, brand, category, originalPrice, salePrice, unit, stock, image, flashSale, description
            });
            alert(`Đã cập nhật sản phẩm "${name}" thành công!`);
        } else {
            // Add new
            ProductDB.addProduct({
                name, brand, category, originalPrice, salePrice, unit, stock, image, flashSale, description
            });
            alert(`Đã thêm mới sản phẩm "${name}" thành công!`);
        }

        this.closeProductModal();
        this.renderProductsTable();
        this.renderDashboard();
    },

    deleteProduct(id) {
        const p = ProductDB.findById(id);
        if (!p) return;

        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" (ID: ${p.id}) khỏi hệ thống?`)) {
            ProductDB.deleteProduct(id);
            alert("Đã xóa sản phẩm thành công!");
            this.renderProductsTable();
            this.renderDashboard();
        }
    },

    resetProductsDefault() {
        if (confirm("Bạn có chắc muốn khôi phục danh sách sản phẩm về CSDL mặc định ban đầu?")) {
            ProductDB.resetToDefault();
            alert("Đã khôi phục CSDL sản phẩm thành công!");
            this.renderProductsTable();
            this.renderDashboard();
        }
    },

    // 3. ORDERS MANAGEMENT TAB
    initOrdersTab() {
        const statusSelect = document.getElementById("adminOrderStatusFilter");
        if (statusSelect) {
            statusSelect.addEventListener("change", (e) => {
                this.orderStatusFilter = e.target.value;
                this.renderOrdersTable();
            });
        }
    },

    getAllOrders() {
        try {
            return JSON.parse(localStorage.getItem("itmart_all_orders")) || [];
        } catch (e) {
            return [];
        }
    },

    saveAllOrders(orders) {
        localStorage.setItem("itmart_all_orders", JSON.stringify(orders));
    },

    renderOrdersTable() {
        const tbody = document.getElementById("adminOrdersTableBody");
        if (!tbody) return;

        let orders = this.getAllOrders();

        if (this.orderStatusFilter !== "all") {
            orders = orders.filter(o => o.status.includes(this.orderStatusFilter));
        }

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">Không có đơn hàng nào.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>
                    <strong>${o.name}</strong><br>
                    <small style="color: #64748b;"><i class="fa-solid fa-phone"></i> ${o.phone}</small>
                </td>
                <td>${o.date}</td>
                <td>
                    <div style="font-weight: 700; color: #ea2e2e;">${this.formatCurrency(o.total)}</div>
                    <small style="color: #64748b;">${o.items ? o.items.length : 0} món</small>
                </td>
                <td>
                    <small style="color: #475569;">${o.paymentMethod || "COD"}</small>
                </td>
                <td>
                    <select class="table-select" style="padding: 4px 8px; font-size: 12px; font-weight: 700;" onchange="AdminApp.updateOrderStatus('${o.id}', this.value)">
                        <option value="Chờ xác nhận" ${o.status.includes("Chờ") ? "selected" : ""}>Chờ xác nhận</option>
                        <option value="Đang xử lý" ${o.status.includes("xử lý") ? "selected" : ""}>Đang xử lý</option>
                        <option value="Đang giao hàng" ${o.status.includes("giao") ? "selected" : ""}>Đang giao hàng</option>
                        <option value="Hoàn thành" ${o.status.includes("Hoàn thành") ? "selected" : ""}>Hoàn thành</option>
                        <option value="Đã hủy" ${o.status.includes("hủy") ? "selected" : ""}>Đã hủy</option>
                    </select>
                </td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="btn-icon" title="Xem & In hóa đơn" onclick="AdminApp.viewOrder('${o.id}')">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    },

    updateOrderStatus(orderId, newStatus) {
        const orders = this.getAllOrders();
        const target = orders.find(o => o.id === orderId);
        if (target) {
            target.status = newStatus;
            this.saveAllOrders(orders);
            this.renderDashboard();
            alert(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"!`);
        }
    },

    viewOrder(orderId) {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const receiptEl = document.getElementById("orderReceiptContent");
        receiptEl.innerHTML = `
            <div class="receipt-box" id="printReceiptArea">
                <div class="receipt-header">
                    <h2>IT MART VIỆT NAM</h2>
                    <p>Chuỗi Siêu Thị Bách Hóa & Sữa Dinh Dưỡng Thượng Hạng</p>
                    <p>Hotline: 0981.224.45 - Website: itmart.vn</p>
                    <h3 style="margin-top: 12px; font-size: 16px;">HÓA ĐƠN BÁN HÀNG</h3>
                </div>

                <div class="receipt-info-row">
                    <span>Mã hóa đơn: <strong>${order.id}</strong></span>
                    <span>Thời gian: ${order.date}</span>
                </div>
                <div class="receipt-info-row">
                    <span>Khách hàng: <strong>${order.name}</strong></span>
                    <span>SĐT: ${order.phone}</span>
                </div>
                <div class="receipt-info-row">
                    <span>Địa chỉ nhận: ${order.address}</span>
                </div>
                ${order.note ? `<div class="receipt-info-row"><span>Ghi chú: ${order.note}</span></div>` : ""}

                <table class="receipt-items-table">
                    <thead>
                        <tr>
                            <th>Tên mặt hàng</th>
                            <th style="text-align: center;">SL</th>
                            <th style="text-align: right;">Đơn giá</th>
                            <th style="text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(order.items || []).map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td style="text-align: center;">${item.quantity}</td>
                                <td style="text-align: right;">${this.formatCurrency(item.salePrice)}</td>
                                <td style="text-align: right;">${this.formatCurrency(item.salePrice * item.quantity)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div class="receipt-total-row">
                    <span>TỔNG TIỀN THANH TOÁN:</span>
                    <span style="color: #ea2e2e;">${this.formatCurrency(order.total)}</span>
                </div>
                <div class="receipt-info-row" style="margin-top: 8px;">
                    <span>Phương thức thanh toán:</span>
                    <strong>${order.paymentMethod || "Tiền mặt (COD)"}</strong>
                </div>

                <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
                    <p>Cảm ơn quý khách đã mua sắm tại IT Mart!</p>
                    <p>Đổi trả miễn phí trong 7 ngày nếu sản phẩm có lỗi.</p>
                </div>
            </div>
        `;

        document.getElementById("orderReceiptModal").classList.add("active");
    },

    closeOrderReceiptModal() {
        document.getElementById("orderReceiptModal").classList.remove("active");
    },

    printReceipt() {
        window.print();
    },

    // 4. VOUCHERS MANAGEMENT TAB
    initVouchersTab() {
        this.renderVouchersTable();
    },

    renderVouchersTable() {
        const tbody = document.getElementById("adminVouchersTableBody");
        if (!tbody) return;

        const coupons = JSON.parse(localStorage.getItem("itmart_coupons")) || [];

        tbody.innerHTML = coupons.map((c, idx) => `
            <tr>
                <td><strong style="color: #ea2e2e; font-size: 15px; letter-spacing: 0.5px;">${c.code}</strong></td>
                <td>
                    <span class="status-badge badge-info">
                        ${c.type === "percent" ? `Giảm ${c.value}%` : (c.type === "freeship" ? "Miễn phí ship" : `Giảm ${this.formatCurrency(c.value)}`)}
                    </span>
                </td>
                <td>${c.desc}</td>
                <td>Đơn từ ${this.formatCurrency(c.minOrder || 0)}</td>
                <td><strong>${c.count || 50}</strong> lượt</td>
                <td>
                    <button type="button" class="btn-icon btn-delete" title="Xóa mã" onclick="AdminApp.deleteCoupon(${idx})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    },

    openAddCouponModal() {
        document.getElementById("couponCode").value = "";
        document.getElementById("couponType").value = "percent";
        document.getElementById("couponValue").value = "10";
        document.getElementById("couponMinOrder").value = "200000";
        document.getElementById("couponDesc").value = "";
        document.getElementById("couponModal").classList.add("active");
    },

    closeCouponModal() {
        document.getElementById("couponModal").classList.remove("active");
    },

    saveCoupon(event) {
        event.preventDefault();
        const code = document.getElementById("couponCode").value.trim().toUpperCase();
        const type = document.getElementById("couponType").value;
        const value = Number(document.getElementById("couponValue").value);
        const minOrder = Number(document.getElementById("couponMinOrder").value) || 0;
        const desc = document.getElementById("couponDesc").value.trim() || `Giảm giá mã ${code}`;

        if (!code || !value) {
            alert("Vui lòng điền mã code và giá trị giảm!");
            return;
        }

        const coupons = JSON.parse(localStorage.getItem("itmart_coupons")) || [];
        if (coupons.some(c => c.code === code)) {
            alert("Mã giảm giá này đã tồn tại!");
            return;
        }

        coupons.push({ code, type, value, minOrder, desc, count: 100 });
        localStorage.setItem("itmart_coupons", JSON.stringify(coupons));
        alert(`Đã tạo thành công voucher "${code}"!`);

        this.closeCouponModal();
        this.renderVouchersTable();
    },

    deleteCoupon(index) {
        const coupons = JSON.parse(localStorage.getItem("itmart_coupons")) || [];
        if (confirm(`Bạn có chắc muốn xóa mã giảm giá "${coupons[index].code}"?`)) {
            coupons.splice(index, 1);
            localStorage.setItem("itmart_coupons", JSON.stringify(coupons));
            this.renderVouchersTable();
        }
    },

    // 5. FEEDBACK MANAGEMENT TAB
    initFeedbackTab() {
        this.renderFeedbackTable();
    },

    renderFeedbackTable() {
        const tbody = document.getElementById("adminFeedbackTableBody");
        if (!tbody) return;

        const feedbacks = JSON.parse(localStorage.getItem("itmart_feedbacks")) || [];

        if (feedbacks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Chưa có phản hồi nào từ khách hàng.</td></tr>`;
            return;
        }

        tbody.innerHTML = feedbacks.map((fb, idx) => `
            <tr>
                <td><strong>${fb.id}</strong></td>
                <td>
                    <strong>${fb.name}</strong><br>
                    <small style="color: #64748b;">${fb.phone}</small>
                </td>
                <td><span class="status-badge badge-warning">${this.getFeedbackTypeName(fb.type)}</span></td>
                <td style="max-width: 320px; line-height: 1.5;">${fb.message}</td>
                <td>${fb.createdAt}</td>
                <td>
                    <button type="button" class="btn-icon" title="Đánh dấu đã phản hồi" onclick="AdminApp.resolveFeedback(${idx})">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    },

    getFeedbackTypeName(type) {
        const map = {
            service: "Dịch vụ CSKH",
            product: "Chất lượng sản phẩm",
            shipping: "Giao hàng & Shipper",
            website: "Góp ý giao diện",
            other: "Ý kiến khác"
        };
        return map[type] || "Góp ý chung";
    },

    resolveFeedback(index) {
        const feedbacks = JSON.parse(localStorage.getItem("itmart_feedbacks")) || [];
        alert(`Đã liên hệ xử lý xong phản hồi của khách hàng "${feedbacks[index].name}"!`);
        feedbacks.splice(index, 1);
        localStorage.setItem("itmart_feedbacks", JSON.stringify(feedbacks));
        this.renderFeedbackTable();
    },

    // TIỆN ÍCH CHUNG
    formatCurrency(val) {
        return (val || 0).toLocaleString("vi-VN") + " đ";
    },

    getStatusBadge(status) {
        if (!status) return `<span class="status-badge badge-info">Chờ duyệt</span>`;
        if (status.includes("Hoàn thành")) return `<span class="status-badge badge-success">Hoàn thành</span>`;
        if (status.includes("giao")) return `<span class="status-badge badge-info">Đang giao</span>`;
        if (status.includes("hủy")) return `<span class="status-badge badge-danger">Đã hủy</span>`;
        if (status.includes("xử lý")) return `<span class="status-badge badge-warning">Đang xử lý</span>`;
        return `<span class="status-badge badge-warning">${status}</span>`;
    },

    renderPagination(containerId, totalItems, totalPages, currentPage, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `<div>Hiển thị trang <strong>${currentPage}</strong> / ${totalPages} (${totalItems} mục)</div>`;
        html += `<div class="pagination-controls">`;
        
        if (currentPage > 1) {
            html += `<button type="button" class="page-btn" onclick="AdminApp.productPage--; AdminApp.renderProductsTable();">&laquo; Trước</button>`;
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            html += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" onclick="AdminApp.productPage = ${i}; AdminApp.renderProductsTable();">${i}</button>`;
        }

        if (currentPage < totalPages) {
            html += `<button type="button" class="page-btn" onclick="AdminApp.productPage++; AdminApp.renderProductsTable();">Sau &raquo;</button>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AdminApp.init();
});
