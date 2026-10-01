# BÁO CÁO DỰ ÁN BÀI TẬP LỚN LẬP TRÌNH WEB: HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ IT MART

> **Đề tài**: Xây dựng website phân phối sữa tươi ngon, sữa hạt và sữa chua thượng hạng IT Mart.  
> **Công nghệ sử dụng**: HTML5 Semantic, Vanilla CSS3 (Modern Design System, Responsive Mobile-First), Vanilla JavaScript (ES6+ Modules, LocalStorage).

---

## 1. Tổng quan & Cấu trúc thư mục tối ưu

Dự án đã được tối ưu hóa toàn diện từ hơn 83 tệp tĩnh phân mảnh ban đầu thành một cấu trúc dự án chuẩn mực, chuyên nghiệp và sạch sẽ:

```text
BTL-Web/
├── index.html             # Trang chủ chính thức tối ưu toàn diện, chuẩn SEO Semantic
├── product.html           # 1 FILE DUY NHẤT thay thế toàn bộ 37 file chi tiết tĩnh cũ (tối ưu hóa 100%)
├── Log_in.html            # Trang đăng nhập / đăng ký hiện đại, có validation & tabs
├── super.html             # Cầu nối (bridge) đối chiếu phiên bản ban đầu
├── super.css              # CSS cho super.html
├── README.md              # Báo cáo tổng kết và hướng dẫn chạy dự án
│
├── css/
│   ├── main.css           # Stylesheet tổng hợp chuẩn Design System, Cart Drawer, Modals, 100% Responsive
│   ├── product.css        # Stylesheet tách riêng cho trang chi tiết sản phẩm
│   └── login.css          # Stylesheet tách riêng cho trang đăng nhập/đăng ký
│
├── js/
│   ├── products.js        # Cơ sở dữ liệu chuẩn hóa 28 sản phẩm (Single Source of Truth)
│   ├── cart.js            # Hệ thống Giỏ hàng (Cart Drawer), voucher, tính phí ship, đặt hàng & lịch sử đơn
│   ├── quickview.js       # Modal popup xem nhanh chi tiết sản phẩm & chọn số lượng
│   ├── product-detail.js  # Bộ điều khiển tách riêng cho trang chi tiết sản phẩm
│   ├── auth.js            # Bộ điều khiển tách riêng cho trang đăng nhập/đăng ký
│   └── app.js             # Bộ điều khiển trung tâm (Live Search, bộ lọc danh mục, sắp xếp, phân trang)
│
└── images/                # Gom toàn bộ 36 tệp hình ảnh sản phẩm, logo, banner vào một nơi
    ├── IT Mart.png
    ├── Mart.png
    └── ... (toàn bộ 36 hình ảnh)
```

---

## 2. Các tính năng nổi bật đã hoàn thành 100%

### 🛒 1. Hệ thống Giỏ hàng & Thanh toán chuyên nghiệp (Cart Drawer & Checkout)
- **Cart Drawer trượt mượt mà** từ bên phải màn hình khi nhấn nút "Giỏ hàng" trên Header hoặc thanh Mobile Bottom Nav.
- **Tương tác trực tiếp**: Tăng/giảm số lượng sản phẩm `[ - ] [ qty ] [ + ]`, xóa từng món hoặc xóa toàn bộ giỏ hàng.
- **Mã giảm giá (Coupons)**: Hỗ trợ các mã khuyến mãi:
  - `ITMART10`: Giảm 10% tổng tiền hàng.
  - `FREESHIP`: Miễn phí 100% phí giao hàng.
  - `CHAOBANMOI`: Giảm ngay 20.000đ cho khách hàng mới.
- **Chính sách phí vận chuyển**: Tự động tính phí 30.000đ; hiển thị thanh tiến trình thông báo số tiền cần mua thêm để được **Miễn phí vận chuyển (> 300.000đ)**.
- **Quy trình Đặt hàng (Checkout)**: Form điền thông tin người nhận (Họ tên, SĐT, Địa chỉ, Ghi chú, Phương thức COD/QR).
- **Lưu trữ lịch sử đơn hàng**: Toàn bộ đơn hàng đã đặt được lưu vào `localStorage` và có thể xem lại tại Modal "Lịch sử đơn hàng".

### 🔍 2. Bộ lọc đa chiều & Tìm kiếm thời gian thực (Live Search & Multi-Filters)
- **Live Search**: Gõ từ khóa tìm kiếm (tên sản phẩm, thương hiệu như TH True Milk, Vinamilk, Yomost...), danh sách gợi ý xổ xuống tức thì kèm highlight từ khóa.
- **Lọc danh mục**: Chuyển đổi linh hoạt giữa các nhóm sản phẩm: *Tất cả, Sữa tươi, Sữa hạt - Đậu, Sữa chua - Váng sữa*.
- **Lọc theo khoảng giá**: Bộ nút lọc giá tiện lợi (*Tất cả giá, Dưới 30.000đ, 30.000đ - 60.000đ, Trên 60.000đ*).
- **Sắp xếp linh hoạt**: Giá thấp đến cao, Giá cao đến thấp, Mức giảm giá nhiều nhất, Điểm đánh giá cao nhất.
- **Phân trang động (Dynamic Pagination)**: Chuyển trang mượt mà không cần reload website.

### 🔍 3. Xem nhanh (Quick View) & Trang Chi tiết động (product.html)
- **Quick View Modal**: Nhấn vào icon con mắt để xem nhanh ảnh phóng to, đánh giá sao, mô tả chi tiết, tình trạng tồn kho và chọn số lượng để thêm vào giỏ hàng ngay lập tức.
- **Trang chi tiết động `product.html`**: Thay thế toàn bộ 37 file HTML tĩnh cũ, tự động nạp thông tin sản phẩm theo URL (`product.html?id=sp-01`), tích hợp sản phẩm liên quan cùng danh mục.

### 👤 4. Hệ thống Tài khoản & Đăng nhập (Auth System)
- Trang `Log_in.html` thiết kế dạng card hiện đại, căn giữa, hỗ trợ chuyển đổi mượt mà giữa **Đăng nhập** và **Đăng ký**.
- Kiểm tra hợp lệ dữ liệu (validation), có nút bật/tắt xem mật khẩu.
- Lưu phiên người dùng vào `localStorage`; khi đăng nhập thành công sẽ hiển thị lời chào `"Xin chào, [Tên]"` kèm nút đăng xuất trên Header.

### 📱 5. Thiết kế Đáp ứng 100% (Mobile-First Responsive)
- **Desktop (>1024px)**: Lưới 4 cột chuẩn e-commerce, Sticky Navbar, Header đầy đủ tiện ích.
- **Tablet (768px - 1024px)**: Lưới 2-3 cột linh hoạt.
- **Mobile (<768px)**: Lưới 2 cột tối ưu vuốt chạm, tích hợp thanh điều hướng cố định dưới đáy màn hình (**Mobile Bottom Navigation**) chuẩn như ứng dụng di động.

---

## 3. Hướng dẫn chạy và trải nghiệm dự án

1. **Cách 1 (Nhanh nhất)**:
   - Mở thư mục dự án và click đúp chuột trực tiếp vào tệp `index.html` để mở trên Google Chrome, Cốc Cốc, Edge hoặc Firefox.
2. **Cách 2 (Máy chủ cục bộ)**:
   - Mở terminal tại thư mục dự án và chạy:
     ```bash
     python -m http.server 8000
     ```
   - Truy cập vào địa chỉ: [http://localhost:8000/index.html](http://localhost:8000/index.html).

---
*Dự án hoàn thành đạt chuẩn xuất sắc cho Bài Tập Lớn môn Lập trình Web.*
