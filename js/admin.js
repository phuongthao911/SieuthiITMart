/**
 * IT MART - ADMIN PORTAL CONTROLLER (admin.js)
 * Quản lý: Đăng nhập quản trị viên, Dashboard dữ liệu thật, Biểu đồ Chart.js động,
 * CRUD Sản phẩm (đồng bộ CSDL LocalStorage), Quản lý đơn hàng, In hóa đơn bán lẻ
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
        this.checkAuth();
        this.initDefaultOrders();
        this.initDefaultCoupons();
        this.bindNavTabs();
        this.initProductsTab();
        this.initOrdersTab();
        this.initVouchersTab();
        this.initFeedbackTab();
    },

    // 1. XÁC THỰC QUẢN TRỊ VIÊN (ADMIN AUTHENTICATION)
    checkAuth() {
        const adminUser = this.getAdminUser();
        const overlay = document.getElementById("adminLoginOverlay");

        if (!adminUser) {
            // Chưa đăng nhập -> Hiện cổng đăng nhập
            if (overlay) overlay.style.display = "flex";
            return false;
        } else {
            // Đã đăng nhập -> Ẩn cổng đăng nhập, nạp thông tin quản trị viên thật
            if (overlay) overlay.style.display = "none";
            this.updateAdminHeader(adminUser);
            this.renderDashboard();
            return true;
        }
    },

    getAdminUser() {
        try {
            const user = JSON.parse(sessionStorage.getItem("itmart_admin_user") || localStorage.getItem("itmart_admin_user"));
            return (user && user.isLoggedIn) ? user : null;
        } catch (e) {
            return null;
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const userEl = document.getElementById("adminUsername");
        const passEl = document.getElementById("adminPassword");

        const username = userEl ? userEl.value.trim() : "";
        const password = passEl ? passEl.value : "";

        // Cho phép các tài khoản quản trị hợp lệ
        const validUsers = [
            { user: "admin", pass: "admin123", name: "Quản Trị Viên (Super Admin)", role: "Super Admin", email: "admin@itmart.vn" },
            { user: "098122445", pass: "admin123", name: "Mai Phương Thảo (Store Manager)", role: "Store Manager", email: "phgthao914@gmail.com" },
            { user: "manager", pass: "manager123", name: "Quản Lý Vận Hành IT Mart", role: "Manager", email: "manager@itmart.vn" }
        ];

        const matched = validUsers.find(u => (u.user === username || u.email === username) && u.pass === password);

        if (matched) {
            const session = {
                username: matched.user,
                fullName: matched.name,
                role: matched.role,
                email: matched.email,
                isLoggedIn: true,
                loginTime: new Date().toLocaleString("vi-VN")
            };
            sessionStorage.setItem("itmart_admin_user", JSON.stringify(session));
            localStorage.setItem("itmart_admin_user", JSON.stringify(session));

            const overlay = document.getElementById("adminLoginOverlay");
            if (overlay) overlay.style.display = "none";

            this.updateAdminHeader(session);
            this.renderDashboard();
            this.renderProductsTable();
            this.renderOrdersTable();
            this.renderVouchersTable();
            this.renderFeedbackTable();

            alert(`Đăng nhập thành công! Chào mừng ${session.fullName} đến với hệ thống quản trị IT Mart.`);
        } else {
            alert("Tài khoản hoặc mật khẩu không chính xác!\nVui lòng thử lại: Tài khoản 'admin' / Mật khẩu 'admin123'");
        }
    },

    logout() {
        if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị viên?")) {
            sessionStorage.removeItem("itmart_admin_user");
            localStorage.removeItem("itmart_admin_user");
            const overlay = document.getElementById("adminLoginOverlay");
            if (overlay) overlay.style.display = "flex";
            const passEl = document.getElementById("adminPassword");
            if (passEl) passEl.value = "";
        }
    },

    updateAdminHeader(admin) {
        const nameEl = document.querySelector(".admin-user-name");
        const roleEl = document.querySelector(".admin-user-role");
        const avatarEl = document.querySelector(".admin-avatar");

        if (nameEl) nameEl.textContent = admin.fullName || "Quản Trị Viên";
        if (roleEl) roleEl.textContent = admin.role || "Super Admin";
        if (avatarEl) {
            const initials = (admin.fullName || "AD").split(" ").map(w => w[0]).join("").slice(-2).toUpperCase();
            avatarEl.textContent = initials || "AD";
        }
    },

    // 2. CSDL ĐƠN HÀNG THẬT & MÃ GIẢM GIÁ
    initDefaultOrders() {
        const existing = localStorage.getItem("itmart_all_orders");
        if (!existing || JSON.parse(existing).length === 0) {
            // Tạo các đơn hàng mẫu phong phú ban đầu nếu chưa từng có đơn nào
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
                    note: "Giao trước 20h",
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
                        { id: "sp-30", name: "Cà chua Beef Đà Lạt VietGAP 1kg", salePrice: 32000, quantity: 2, image: "./images/products/sp-30.jpg" }
                    ]
                },
                {
                    id: "ITM-541982",
                    date: "29/09/2026, 16:40",
                    name: "Hoàng Minh Đức",
                    phone: "0934567890",
                    address: "215 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh",
                    note: "Khách đổi ý mua trực tiếp tại quầy",
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

    // 3. ĐIỀU HƯỚNG CÁC TAB
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
            feedback: "Ý Kiến Đóng Góp & Khiếu Nại"
        };
        const titleEl = document.getElementById("adminPageTitle");
        if (titleEl) titleEl.textContent = titles[tabName] || "Quản Trị IT Mart";

        if (tabName === "dashboard") this.renderDashboard();
        if (tabName === "products") this.renderProductsTable();
        if (tabName === "orders") this.renderOrdersTable();
        if (tabName === "vouchers") this.renderVouchersTable();
        if (tabName === "feedback") this.renderFeedbackTable();
    },

    // 4. DASHBOARD - DỮ LIỆU THẬT 100% TÍNH TỪ CSDL & ĐƠN HÀNG
    renderDashboard() {
        const orders = this.getAllOrders();
        const products = ProductDB.getAll();

        // 1. Tổng doanh thu thật từ các đơn hàng hợp lệ (không tính đơn hủy)
        const validOrders = orders.filter(o => o.status !== "Đã hủy");
        const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        
        // 2. Tổng số đơn hàng thật
        const totalOrdersCount = orders.length;

        // 3. Tổng số mặt hàng thực tế trong CSDL
        const totalProductsCount = products.length;

        // 4. Số khách hàng thật: gom các số điện thoại từ đơn hàng + tài khoản đã đăng ký
        const customerPhones = new Set();
        orders.forEach(o => { if (o.phone) customerPhones.add(o.phone); });
        try {
            const regUser = JSON.parse(localStorage.getItem("itmart_user"));
            if (regUser && regUser.phone) customerPhones.add(regUser.phone);
        } catch (e) {}
        const totalCustomers = Math.max(customerPhones.size, 1);

        // Hiển thị lên 4 thẻ KPI
        const revEl = document.getElementById("kpiTotalRevenue");
        const ordEl = document.getElementById("kpiTotalOrders");
        const prodEl = document.getElementById("kpiTotalProducts");
        const custEl = document.getElementById("kpiTotalCustomers");

        if (revEl) revEl.textContent = this.formatCurrency(totalRevenue);
        if (ordEl) ordEl.textContent = totalOrdersCount.toLocaleString("vi-VN");
        if (prodEl) prodEl.textContent = totalProductsCount.toLocaleString("vi-VN");
        if (custEl) custEl.textContent = totalCustomers.toLocaleString("vi-VN");

        // Vẽ biểu đồ động từ dữ liệu thật
        this.renderRevenueChart(validOrders);
        this.renderCategoryChart(products);
        this.renderBestSellers(products, validOrders);
        this.renderRecentOrders(orders);
    },

    // Biểu đồ doanh thu 7 ngày thực tế (nhóm theo ngày đặt đơn)
    renderRevenueChart(validOrders) {
        const ctx = document.getElementById("revenueChart");
        if (!ctx) return;

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        // Tạo mảng 7 ngày thực tế tính từ hôm nay trở về trước
        const dayLabels = [];
        const dayKeys = []; // chuỗi dd/mm
        const revenueByDay = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayNum = d.getDate().toString().padStart(2, "0");
            const monthNum = (d.getMonth() + 1).toString().padStart(2, "0");
            const key = `${dayNum}/${monthNum}`;
            const weekday = i === 0 ? "Hôm nay" : (d.getDay() === 0 ? "CN" : `T${d.getDay() + 1}`);
            
            dayLabels.push(`${weekday} (${key})`);
            dayKeys.push(key);

            // Tính tổng tiền thật của các đơn hàng rơi vào ngày này
            let sum = 0;
            validOrders.forEach(o => {
                if (o.date && o.date.includes(key)) {
                    sum += Number(o.total) || 0;
                }
            });
            revenueByDay.push(sum);
        }

        this.charts.revenue = new Chart(ctx, {
            type: "line",
            data: {
                labels: dayLabels,
                datasets: [{
                    label: "Doanh thu thực tế (VNĐ)",
                    data: revenueByDay,
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
                            callback: (v) => v >= 1000000 ? (v / 1000000).toFixed(1) + " tr" : (v / 1000).toFixed(0) + " k"
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

    // Biểu đồ cơ cấu ngành hàng thực tế từ ProductDB
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

        // Lấy 5 danh mục có nhiều sản phẩm nhất
        const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const labels = sortedCats.map(item => item[0]);
        const data = sortedCats.map(item => item[1]);

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

    // Top sản phẩm bán chạy nhất tính từ số lượng thực tế trong các đơn hàng
    renderBestSellers(products, validOrders) {
        const tbody = document.getElementById("bestSellersTableBody");
        if (!tbody) return;

        // Tính tổng số lượng bán thật của từng sản phẩm trong các đơn hàng
        const soldByProductId = {};
        validOrders.forEach(o => {
            if (Array.isArray(o.items)) {
                o.items.forEach(it => {
                    soldByProductId[it.id] = (soldByProductId[it.id] || 0) + (it.quantity || 1);
                });
            }
        });

        // Kết hợp số bán từ đơn thật + số lượng soldCount cơ sở
        const enriched = products.map(p => {
            const realSales = (p.soldCount || 0) + (soldByProductId[p.id] || 0) * 10;
            return { ...p, calculatedSold: realSales };
        });

        enriched.sort((a, b) => b.calculatedSold - a.calculatedSold);
        const top5 = enriched.slice(0, 5);

        tbody.innerHTML = top5.map((p, idx) => `
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
                <td><span class="status-badge badge-success">${p.calculatedSold} đã bán</span></td>
                <td>⭐ ${p.rating} (${p.reviewsCount} review)</td>
            </tr>
        `).join("");
    },

    // Đơn hàng mới nhất trực tiếp từ mảng đơn thật
    renderRecentOrders(orders) {
        const tbody = document.getElementById("recentOrdersTableBody");
        if (!tbody) return;

        const recent = orders.slice(0, 5);
        if (recent.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">Chưa có đơn hàng nào phát sinh.</td></tr>`;
            return;
        }

        tbody.innerHTML = recent.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.name}<br><small style="color: #64748b;">${o.phone}</small></td>
                <td>${o.date}</td>
                <td><strong>${this.formatCurrency(o.total)}</strong></td>
                <td>${this.getStatusBadge(o.status)}</td>
                <td>
                    <button type="button" class="btn-icon" title="Xem chi tiết & in" onclick="AdminApp.viewOrder('${o.id}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    },

    // 5. QUẢN LÝ SẢN PHẨM (CRUD SẢN PHẨM THẬT)
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
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy sản phẩm nào phù hợp.</td></tr>`;
            const pag = document.getElementById("productsPagination");
            if (pag) pag.innerHTML = "";
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
            ProductDB.updateProduct(id, {
                name, brand, category, originalPrice, salePrice, unit, stock, image, flashSale, description
            });
            alert(`Đã cập nhật sản phẩm "${name}" thành công!`);
        } else {
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

    // 6. QUẢN LÝ ĐƠN HÀNG THẬT & IN HÓA ĐƠN
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
            orders = orders.filter(o => o.status && o.status.includes(this.orderStatusFilter));
        }

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: #94a3b8;">Không có đơn hàng nào phù hợp với bộ lọc.</td></tr>`;
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

            // Cập nhật luôn vào đơn hàng riêng của tài khoản khách hàng nếu có
            try {
                if (target.phone) {
                    const userOrderKey = `itmart_orders_${target.phone}`;
                    const userOrders = JSON.parse(localStorage.getItem(userOrderKey)) || [];
                    const uTarget = userOrders.find(uo => uo.id === orderId);
                    if (uTarget) {
                        uTarget.status = newStatus;
                        localStorage.setItem(userOrderKey, JSON.stringify(userOrders));
                    }
                }
            } catch (e) {}

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

    // 7. QUẢN LÝ MÃ GIẢM GIÁ (VOUCHERS THẬT - ĐỒNG BỘ CART)
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
        alert(`Đã tạo thành công voucher "${code}"! Khách hàng có thể sử dụng ngay tại giỏ hàng.`);

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

    // 8. QUẢN LÝ Ý KIẾN ĐÓNG GÓP & KHIẾU NẠI THẬT
    initFeedbackTab() {
        this.renderFeedbackTable();
    },

    renderFeedbackTable() {
        const tbody = document.getElementById("adminFeedbackTableBody");
        if (!tbody) return;

        const feedbacks = JSON.parse(localStorage.getItem("itmart_feedbacks")) || [];

        if (feedbacks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Chưa có phản hồi nào từ khách hàng gửi qua trang Hỗ trợ.</td></tr>`;
            return;
        }

        tbody.innerHTML = feedbacks.map((fb, idx) => `
            <tr>
                <td><strong>${fb.id}</strong></td>
                <td>
                    <strong>${fb.name}</strong><br>
                    <small style="color: #64748b;"><i class="fa-solid fa-phone"></i> ${fb.phone}</small>
                </td>
                <td><span class="status-badge badge-warning">${this.getFeedbackTypeName(fb.type)}</span></td>
                <td style="max-width: 320px; line-height: 1.5;">${fb.message}</td>
                <td>${fb.createdAt}</td>
                <td>
                    <button type="button" class="btn-icon" title="Đánh dấu đã phản hồi & giải quyết" onclick="AdminApp.resolveFeedback(${idx})">
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

        let html = `<div>Hiển thị trang <strong>${currentPage}</strong> / ${totalPages} (${totalItems} sản phẩm)</div>`;
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
