# BÁO CÁO DỰ ÁN BÀI TẬP LỚN LẬP TRÌNH WEB: HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ IT MART

> **Đề tài**: Xây dựng Hệ thống Thương mại Điện tử Siêu thị Bách hóa Tổng hợp IT Mart (Thực phẩm tươi sống, Sữa dinh dưỡng, Đồ gia dụng và Tiêu dùng thiết yếu).  
> **Môn học**: Lập trình Web  
> **Công nghệ áp dụng**: HTML5 Semantic, Vanilla CSS3 (Design System, Responsive Mobile-First), Vanilla JavaScript (ES6+, Fetch API, LocalStorage), CSDL JSON rời, Node.js Dev Server.  
> **Mã nguồn GitHub**: [https://github.com/phuongthao911/SieuthiITMart.git](https://github.com/phuongthao911/SieuthiITMart.git)

---

## 1. Mục Tiêu & Điểm Nhấn Dự Án

- **Tái cấu trúc và tối ưu hóa vượt bậc**: Từ hơn 83 tệp mã nguồn HTML tĩnh phân mảnh và trùng lặp ban đầu, dự án đã được tinh gọn và nâng cấp toàn diện thành mô hình website thương mại điện tử hiện đại, chuyên nghiệp, tải trang siêu tốc.
- **Mở rộng quy mô siêu thị bách hóa**: Không chỉ dừng lại ở các sản phẩm sữa, hệ thống được mở rộng thành siêu thị đa ngành hàng với hơn **91 sản phẩm** thuộc 6 danh mục thiết yếu: *Sữa dinh dưỡng, Thực phẩm tươi sống, Rau củ quả sạch, Bánh kẹo & Đồ uống, Đồ gia dụng nhà bếp (Sunhouse, Lock&Lock, Elmich) và Hóa mỹ phẩm tiêu dùng*.
- **Tối ưu hóa cơ sở dữ liệu**: Toàn bộ dữ liệu sản phẩm được chuyển đổi thành CSDL [products.json](data/products.json) chuẩn hóa, được nạp bất đồng bộ qua `fetch()` giúp trang tải nhẹ nhàng, dễ mở rộng và bảo trì.
- **Trải nghiệm người dùng (UX/UI) chuẩn e-Commerce**: Đạt chuẩn tương tác mượt mà như các sàn TMĐT lớn (Shopee, WinMart, BachHoaXANH) với Cart Drawer, Live Search gợi ý thông minh, Quick View, thanh toán VietQR và lịch sử đơn hàng.

---

## 2. Cấu Trúc Thư Mục Dự Án (Modular Architecture)

Dự án được tổ chức khoa học, phân tách rành mạch giữa Cấu trúc (HTML), Giao diện (CSS), Logic xử lý (JS) và Dữ liệu (JSON, Images):

```text
BTL-Web/
├── index.html              # Trang chủ: Hero Banner, Flash Sale đếm ngược, danh mục cuộn ngang, Catalog lọc đa chiều
├── product.html            # Trang chi tiết sản phẩm động (product.html?id=sp-01), đánh giá sao tương tác, so sánh
├── Log_in.html             # Trang Đăng nhập / Đăng ký hiện đại (Validation form, xem/ẩn mật khẩu, lưu phiên làm việc)
├── about.html              # Trang Giới thiệu IT Mart, quy trình quản lý chất lượng, chính sách bảo mật & điều khoản
├── stores.html             # Trang Hệ thống siêu thị: Tìm kiếm, lọc theo tỉnh thành (Hà Nội, TP.HCM, ĐN), chỉ đường & hotline
├── policy.html             # Trang Hỗ trợ khách hàng: FAQ Accordion, Giao 2H, Đổi trả 7 ngày & Form góp ý tương tác
├── admin.html              # Cổng Quản trị viên (Admin Portal): Dashboard Chart.js, CRUD Sản phẩm, Quản lý & In đơn hàng
├── README.md               # Báo cáo tổng kết dự án và hướng dẫn vận hành
├── server.js               # Máy chủ HTTP Node.js cục bộ tích hợp MIME types đầy đủ
│
├── css/
│   ├── main.css            # Hệ thống Design System chính (Typography, Header, Footer, Modals, Drawer, Compare, Loyalty)
│   ├── product.css         # Stylesheet chuyên biệt cho trang chi tiết sản phẩm (Gallery ảnh, tab thông số, review)
│   ├── login.css           # Stylesheet tách biệt cho trang đăng nhập/đăng ký
│   ├── pages.css           # Stylesheet dùng chung cho các trang nội dung vệ tinh (About, Stores, Policy, FAQ)
│   └── admin.css           # Stylesheet Back-office Dashboard Quản trị viên (KPI cards, bảng dữ liệu, form modal, in hóa đơn)
│
├── js/
│   ├── products.js         # Nạp CSDL từ data/products.json, đồng bộ LocalStorage, cung cấp CRUD API thêm/sửa/xóa sản phẩm
│   ├── app.js              # Bộ điều phối trung tâm trang chủ: Live search, lọc giá, phân trang, banner, tabs, random brand
│   ├── product-detail.js   # Bộ xử lý dữ liệu trang chi tiết sản phẩm, nạp động theo URL, gửi đánh giá sao tương tác
│   ├── cart.js             # Quản lý Giỏ hàng (Cart Drawer), kho Voucher, tính phí ship, Checkout, VietQR, đồng bộ đơn Admin
│   ├── quickview.js        # Logic popup xem nhanh sản phẩm (Quick View Modal) và chọn số lượng mua ngay
│   ├── wishlist.js         # Tính năng Yêu thích sản phẩm (Wishlist) lưu LocalStorage
│   ├── compare.js          # Hệ thống So sánh Sản phẩm (Compare Tool): Thanh dock nổi và Modal đối chiếu thông số
│   ├── loyalty.js          # Hệ thống Điểm tích lũy & Hạng thành viên VIP (Bronze, Silver, Gold, Diamond)
│   ├── auth.js             # Xử lý xác thực tài khoản, đăng nhập, đăng ký, đồng bộ phiên người dùng
│   ├── pages.js            # Tương tác các trang nội dung: Accordion FAQ, bộ lọc cửa hàng theo thành phố, form góp ý
│   └── admin.js            # Điều khiển Admin Dashboard: Biểu đồ Chart.js, CRUD sản phẩm, cập nhật đơn & in hóa đơn bán lẻ
│
├── data/
│   └── products.json       # CSDL chuẩn hóa 91 sản phẩm đầy đủ thông tin (ID, tên, giá, giảm giá, ảnh, xuất xứ, mô tả...)
│
└── images/
    ├── IT Mart.png         # Logo nhận diện thương hiệu chính thức IT Mart
    ├── Logo.png            # Favicon và icon ứng dụng
    ├── products/           # Thư viện ảnh sản phẩm độ phân giải cao, tên ảnh khớp 100% với tên sản phẩm
    │   ├── sp-29.jpg
    │   ├── sp-30.jpg
    │   └── ... (toàn bộ ảnh từ sp-29 đến sp-91)
    └── ...                 # Các ảnh sản phẩm gốc nhóm sữa và tư liệu đồ họa
```

---

## 3. Các Tính Năng Cốt Lõi Đã Triển Khai Hoàn Hảo (100%)

### 🛒 1. Hệ thống Giỏ hàng & Thanh toán thông minh (Cart Drawer & Smart Checkout)
- **Giỏ hàng trượt (Cart Drawer)**: Hiệu ứng trượt êm ái từ phải sang khi nhấp icon giỏ hàng ở Header hoặc Mobile Nav.
- **Tăng / Giảm / Xóa**: Thao tác số lượng thời gian thực, tự động tính tổng tiền ngay lập tức.
- **Đồng bộ tài khoản**: Khách vãng lai lưu giỏ hàng theo phiên; khách đã đăng nhập được lưu giỏ hàng vĩnh viễn theo tài khoản số điện thoại.
- **Kho Voucher giảm giá 1-Click**:
  - `FREESHIP`: Miễn phí giao hàng toàn quốc (đơn từ 300.000đ).
  - `ITMART10`: Giảm ngay 10% tổng giá trị đơn hàng.
  - `CHAOBANMOI`: Giảm 20.000đ cho khách hàng đăng ký mới.
- **Thanh toán Chuyển khoản QR (VietQR - MBBank)**: Tạo mã QR động tự động khớp số tiền cần thanh toán và nội dung mã đơn hàng, quét mã trả tiền trong 3 giây.
- **Lịch sử đơn hàng đầy đủ**: Hỗ trợ xem lại hóa đơn các đơn đã đặt, hủy đơn hàng trực tiếp khi đang chờ duyệt và nút mua lại đơn cũ tiện lợi.

### 🔍 2. Thanh tìm kiếm thời gian thực & Bộ lọc danh mục hiện đại
- **Live Search gợi ý tức thì**: Gõ từ khóa tìm kiếm (tên sản phẩm, thương hiệu), danh sách kết quả xổ xuống có ảnh thu nhỏ, giá bán và đánh dấu nổi bật từ khóa (highlight keyword).
- **Thanh Danh mục cuộn ngang (Horizontal Draggable Scrollbar)**: Hỗ trợ kéo thả bằng chuột mượt mà và nút mũi tên điều hướng `<` `>` tiện lợi, tự động thích ứng với mọi kích thước màn hình.
- **Thương hiệu nổi bật tự động (Random Featured Brand)**: Mỗi lần truy cập website hoặc chọn danh mục, hệ thống sẽ ngẫu nhiên chọn ra 1 thương hiệu tiêu biểu đại diện, tạo sự mới mẻ và không làm rối mắt người dùng.
- **Bộ lọc đa tiêu chí**: Lọc theo danh mục, lọc theo thương hiệu, lọc theo 4 khoảng giá tiền, sắp xếp theo giá tăng/giảm, giảm giá sâu nhất hoặc đánh giá cao nhất.

### ⚡ 3. Khu vực Flash Sale & Xem nhanh sản phẩm (Quick View)
- **Đồng hồ đếm ngược Flash Sale**: Hiệu ứng đếm ngược thời gian thực (Giờ : Phút : Giây) kích thích nhu cầu mua sắm.
- **Quick View Modal**: Bấm icon xem nhanh để mở hộp thoại xem ảnh phóng to, thông tin tóm tắt, chọn số lượng và thêm vào giỏ hàng ngay tại trang chủ mà không cần tải lại trang.

### 📄 4. Trang Chi Tiết Sản Phẩm Động (`product.html`)
- Thay thế triệt để hàng chục file HTML tĩnh cũ chỉ bằng **1 file mẫu duy nhất**.
- Nhận diện sản phẩm qua URL (`product.html?id=sp-05`), tự động nạp tiêu đề, ảnh gallery, giá niêm yết, phần trăm khuyến mãi, bảng thông số kỹ thuật (xuất xứ, thành phần, bảo quản) và gợi ý các sản phẩm cùng danh mục.

### 🏢 5. Hệ Thống Trang Vệ Tinh Hoàn Chỉnh
- **[about.html](about.html)**: Giới thiệu thương hiệu IT Mart, tiêu chuẩn kiểm định ATVSTP, quy trình bảo quản lạnh Cold Chain đạt chuẩn và chính sách bảo mật dữ liệu.
- **[stores.html](stores.html)**: Danh sách chuỗi 6 siêu thị tại Hà Nội, TP.HCM, Đà Nẵng với bộ lọc khu vực, giờ mở cửa, tiện ích đỗ xe, nút gọi hotline và nút mở Google Maps chỉ đường.
- **[policy.html](policy.html)**: Trung tâm hỗ trợ giải đáp thắc mắc FAQ dạng Accordion, chính sách giao nhanh 2h, đổi trả trong 7 ngày, hướng dẫn thanh toán và **Form gửi ý kiến đóng góp / khiếu nại** có lưu trữ vào hệ thống.

### 👤 6. Xác Thực Tài Khoản & Quản Lý Phiên (Auth System)
- Giao diện đăng nhập / đăng ký chuẩn mực, hỗ trợ kiểm tra dữ liệu đầu vào (validation SĐT, độ dài mật khẩu).
- Khi người dùng đăng nhập thành công, thanh Topbar tự động chuyển sang hiển thị tên người dùng và nút **"Đăng xuất"**.

### 📱 7. Thiết Kế Responsive 100% (Mobile-First)
- **Desktop (màn hình rộng)**: Bố cục lưới thoáng đãng, sắc nét, đầy đủ thanh công cụ và banner khuyến mãi.
- **Mobile / Tablet**: Tối ưu vuốt chạm ngón tay, ẩn bớt thành phần dư thừa, tích hợp **Thanh điều hướng dưới đáy (Mobile Bottom Navigation)** cố định chuẩn trải nghiệm App di động.

### 🌟 8. Cổng Quản Trị Hệ Thống Toàn Diện (Admin Portal - admin.html)
- **Dashboard Thống kê KPI & Biểu đồ Chart.js**:
  - 4 Thẻ KPI thời gian thực: Tổng doanh thu, Tổng đơn hàng, Số mặt hàng kho, Tổng khách hàng.
  - Biểu đồ đường (Line Chart) xu hướng doanh thu 7 ngày qua.
  - Biểu đồ tròn (Doughnut Chart) cơ cấu doanh thu theo nhóm ngành hàng.
  - Bảng xếp hạng Top 5 sản phẩm bán chạy nhất (Best Sellers) và 5 đơn hàng mới nhất cần duyệt.
- **Quản lý Sản phẩm (CRUD Sản phẩm)**:
  - Xem danh sách bảng sản phẩm có tìm kiếm nhanh, lọc theo danh mục, phân trang.
  - Modal Thêm mới / Chỉnh sửa sản phẩm (Tên, thương hiệu, giá gốc, giá khuyến mãi, đơn vị, tồn kho, ảnh, Flash Sale, mô tả).
  - Xóa sản phẩm và nút "Khôi phục CSDL gốc" tiện lợi.
- **Quản lý Đơn hàng & In Hóa Đơn Bán Lẻ**:
  - Xem danh sách đơn đặt từ khách hàng, lọc theo trạng thái đơn.
  - Cập nhật trực tiếp tiến trình đơn hàng (*Chờ xác nhận &rarr; Đang xử lý &rarr; Đang giao &rarr; Hoàn thành / Hủy*).
  - **Mẫu Hóa Đơn Bán Lẻ Siêu Thị (Receipt Print)**: Xem chi tiết hóa đơn và kích hoạt lệnh in ấn trình duyệt (`window.print()`) chuyên nghiệp.
- **Quản lý Khuyến mãi (Vouchers)**: Tạo mới mã coupon, chọn loại chiết khấu (% / số tiền / freeship), giới hạn giá trị đơn hàng tối thiểu.
- **Quản lý Phản hồi khách hàng (Feedback)**: Xem danh sách góp ý/khiếu nại gửi từ trang `policy.html` và đánh dấu đã xử lý.

### ⭐ 9. Nâng Cấp Tương Tác: Đánh Giá Sao, Thẻ VIP & So Sánh Sản Phẩm
- **Đánh giá sao & Bình luận tương tác (Reviews & Star Ratings)**:
  - Khách hàng có thể tự do bấm chọn số sao (1-5 sao vàng), nhập nhận xét tại trang chi tiết sản phẩm.
  - Dữ liệu được ghi nhận vào `ProductDB` và `LocalStorage`, tự động tính toán lại điểm rating trung bình và phân phối sao của sản phẩm ngay lập tức.
- **Hệ thống Điểm tích lũy & Hạng Thẻ VIP (Loyalty Rewards)**:
  - Mua sắm tích lũy điểm thưởng: 10.000đ = 1 điểm IT Mart.
  - Thẻ VIP thành viên hiển thị sang trọng trong Modal Hồ sơ cá nhân với 4 hạng: *🥉 Đồng &rarr; 🥈 Bạc &rarr; 🥇 Vàng (Giảm 2%) &rarr; 💎 Kim Cương (Giảm 5% + Freeship)* cùng thanh tiến trình thăng hạng.
- **Công cụ So Sánh Sản Phẩm (Compare Tool)**:
  - Nút icon so sánh xuất hiện trên từng thẻ sản phẩm và trang chi tiết.
  - Thanh Dock nổi ghim dưới đáy màn hình hiển thị danh sách đang chọn (tối đa 3 sản phẩm).
  - Bảng so sánh Modal trực quan từng thông số: Ảnh, Tên, Giá bán, Mức tiết kiệm, Đánh giá, Quy cách, Xuất xứ, Tình trạng kho và nút Mua ngay.

---

## 4. Công Nghệ & Kỹ Thuật Lập Trình Áp Dụng

| Hạng mục | Công nghệ / Kỹ thuật sử dụng |
| :--- | :--- |
| **Giao diện (Frontend)** | HTML5 Semantic, CSS3 Modern Flexbox & CSS Grid, CSS Variables, Typography Google Font *Plus Jakarta Sans*, FontAwesome 6 Icons |
| **Logic & Tương tác** | Vanilla JavaScript (ES6+), Async/Await, Fetch API, Event Delegation, DOM Manipulation |
| **Lưu trữ dữ liệu** | File dữ liệu tĩnh `data/products.json` đóng vai trò CSDL (Single Source of Truth), `LocalStorage` lưu trữ giỏ hàng, thông tin đăng nhập, lịch sử đơn hàng và ý kiến đóng góp |
| **Tối ưu hiệu năng** | Lazy loading hình ảnh, Debounce tìm kiếm Live Search, nạp trang động không reload |
| **Môi trường chạy** | Node.js Built-in HTTP Server (`server.js`), hỗ trợ chạy trên mọi trình duyệt hiện đại (Chrome, Edge, Firefox, Safari) |

---

## 5. Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm

Dự án được đóng gói hoàn chỉnh, không cần cài đặt các thư viện npm nặng nề, có thể chạy ngay lập tức bằng các cách sau:

### Cách 1: Chạy bằng Node.js Server tích hợp sẵn (Khuyên dùng)
1. Mở cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục `BTL-Web`:
2. Chạy lệnh:
   ```bash
   node server.js
   ```
3. Mở trình duyệt web và truy cập vào địa chỉ:
   ```text
   http://localhost:5500
   ```

### Cách 2: Sử dụng VS Code Extension Live Server
1. Mở thư mục `BTL-Web` bằng Visual Studio Code.
2. Chuột phải vào tệp `index.html` chọn **"Open with Live Server"**.

### Cách 3: Chạy nhanh bằng Python HTTP Server
```bash
# Nếu máy đã có Python:
python -m http.server 5500
```
Truy cập: `http://localhost:5500`

---

## 6. Tổng Kết Đánh Giá

Dự án **Hệ Thống Thương Mại Điện Tử IT Mart** đã giải quyết trọn vẹn yêu cầu của bài tập lớn môn Lập trình Web:
1. Xóa bỏ hoàn toàn tình trạng mã nguồn phân mảnh, trùng lặp code tĩnh.
2. Thiết kế giao diện hiện đại, thẩm mỹ cao, chuẩn nhận diện thương hiệu IT Mart.
3. Luồng trải nghiệm mua sắm mượt mà, đầy đủ các nghiệp vụ thương mại điện tử thực tế từ chọn hàng, tìm kiếm, giỏ hàng, mã giảm giá đến thanh toán và tra cứu đơn hàng.
4. Đáp ứng chuẩn Responsive trên mọi loại thiết bị từ điện thoại thông minh đến máy tính để bàn.

*Báo cáo hoàn thành phục vụ đánh giá Bài Tập Lớn môn Lập trình Web.*
