/**
 * IT MART - CƠ SỞ DỮ LIỆU SẢN PHẨM & CSDL ENGINE (ProductDB)
 * Đã tối ưu hóa cấu trúc CSDL: Chuẩn hóa dữ liệu (Normalization), Đánh chỉ mục (Indexing), Hỗ trợ truy vấn nhanh
 * Đồng bộ với tệp JSON CSDL: data/products.json
 */

// 1. BẢNG DANH MỤC (CATEGORIES TABLE)
const CATEGORIES = [
    {
        "id": "all",
        "name": "Tất cả sản phẩm",
        "icon": "fa-border-all"
    },
    {
        "id": "rau-cu",
        "name": "Rau củ tươi sạch",
        "icon": "fa-carrot"
    },
    {
        "id": "trai-cay",
        "name": "Trái cây tươi",
        "icon": "fa-apple-whole"
    },
    {
        "id": "thit-trung",
        "name": "Thịt, Trứng & Hải sản",
        "icon": "fa-drumstick-bite"
    },
    {
        "id": "sua-tuoi",
        "name": "Sữa tươi",
        "icon": "fa-cow"
    },
    {
        "id": "sua-hat",
        "name": "Sữa hạt - Đậu",
        "icon": "fa-seedling"
    },
    {
        "id": "sua-chua",
        "name": "Sữa chua - Váng sữa",
        "icon": "fa-ice-cream"
    },
    {
        "id": "banh-keo",
        "name": "Bánh kẹo - Ăn vặt",
        "icon": "fa-cookie-bite"
    },
    {
        "id": "do-uong",
        "name": "Nước giải khát",
        "icon": "fa-bottle-water"
    },
    {
        "id": "tra-ca-phe",
        "name": "Trà & Cà phê",
        "icon": "fa-mug-hot"
    },
    {
        "id": "mi-an-lien",
        "name": "Mì & Ăn liền",
        "icon": "fa-bowl-food"
    },
    {
        "id": "dong-lanh",
        "name": "Đồ đông lạnh & Chế biến",
        "icon": "fa-snowflake"
    },
    {
        "id": "gia-vi",
        "name": "Gia vị & Đồ hộp",
        "icon": "fa-kitchen-set"
    },
    {
        "id": "hoa-pham",
        "name": "Hóa phẩm & Chăm sóc",
        "icon": "fa-pump-soap"
    },
    {
        "id": "gia-dung",
        "name": "Đồ gia dụng & Bếp",
        "icon": "fa-blender"
    }
];

// 2. BẢNG THƯƠNG HIỆU (BRANDS TABLE)
const BRANDS = [
    "Tất cả thương hiệu",
    "TH True Milk",
    "Vinamilk",
    "Cô Gái Hà Lan",
    "Dalat Milk",
    "YoMost",
    "Kun",
    "Monte",
    "Sahmyook",
    "Promess",
    "Binggrae",
    "VietGAP Đà Lạt",
    "Đà Lạt Farm",
    "Envy",
    "Nông Sản Việt",
    "MeatDeli",
    "Ba Huân",
    "PaciBeef",
    "CP Foods",
    "Leroy Seafood",
    "Vissan",
    "CJ Cầu Tre",
    "G Kitchen",
    "Thọ Phát",
    "The Laughing Cow",
    "Orion",
    "Lay's",
    "Kinh Đô",
    "Glico",
    "Haribo",
    "Coca-Cola",
    "Pepsi",
    "Suntory Tea+",
    "Number 1",
    "LaVie",
    "Trung Nguyên",
    "Nescafé",
    "Highlands",
    "Cozy",
    "Lipton",
    "Acecook",
    "Omachi",
    "Indomie",
    "Simply",
    "Nam Ngư",
    "Chinsu",
    "Knorr",
    "Seaspimex",
    "137 Degrees",
    "OMO",
    "Sunlight",
    "Sunsilk",
    "Dove",
    "P/S",
    "Sunhouse",
    "Lock&Lock",
    "Inochi"
];

// 3. TẠO MAP DANH MỤC ĐỂ TRA CỨU O(1)
const _CAT_MAP = new Map(CATEGORIES.map(c => [c.id, c.name]));

// 4. KHO DỮ LIỆU SẢN PHẨM ĐƯỢC CHUẨN HÓA (COMPACT RECORD STORE)
const _RAW_PRODUCTS = [
  {
    "id": "sp-01",
    "name": "Sữa chua lên men tự nhiên Yomost cam hộp 1L",
    "brand": "YoMost",
    "cat": "sua-chua",
    "orig": 40900,
    "sale": 30800,
    "unit": "Hộp 1L",
    "img": "./images/photo.jpg",
    "badge": "Flash Sale -25%",
    "rate": 4.8,
    "revs": 142,
    "sold": 1420,
    "flash": 1,
    "prog": 85,
    "stock": 45,
    "desc": "Sữa chua uống YoMost vị cam lên men tự nhiên từ nguồn sữa tươi thanh trùng chọn lọc, giàu dinh dưỡng, hỗ trợ tiêu hóa khỏe mạnh và tăng cường đề kháng.",
    "specs": {
      "origin": "Việt Nam (FrieslandCampina)",
      "volume": "1000ml (1 Lít)",
      "expiry": "8 tháng kể từ ngày sản xuất",
      "storage": "Bảo quản nơi khô ráo, thoáng mát hoặc ngăn mát 4-8°C",
      "ingredients": "Sữa bò lên men tự nhiên, nước ép cam nguyên chất, đường tinh luyện, Vitamin B3, B6, B12"
    },
    "reviews": [
      {
        "name": "Nguyễn Thùy Linh",
        "rating": 5,
        "date": "15/09/2026",
        "comment": "Vị cam chua ngọt thanh mát, date còn rất mới. Cả nhà mình đều thích uống lạnh!"
      },
      {
        "name": "Trần Hoàng Quân",
        "rating": 5,
        "date": "02/09/2026",
        "comment": "Giao hàng 2 giờ nhận đúng lúc đang cần, đóng gói cẩn thận trong thùng carton lót xốp."
      }
    ]
  },
  {
    "id": "sp-02",
    "name": "Sữa chua uống vị dâu Kun lốc 4 hộp x 180ml",
    "brand": "Kun",
    "cat": "sua-chua",
    "orig": 30900,
    "sale": 24700,
    "unit": "Lốc 4 hộp",
    "img": "./images/sua-chua-uong-lif-kun-huong-kem-dau-hop-180ml-4-20230410013553-thumb-1.jpg",
    "badge": "Bán chạy",
    "rate": 4.9,
    "revs": 210,
    "sold": 2850,
    "flash": 1,
    "prog": 92,
    "stock": 80,
    "desc": "Sữa chua uống hương kem dâu thơm ngon, bổ sung bộ ba vitamin K2, D3 và Canxi giúp phát triển chiều cao vượt trội cho trẻ em.",
    "specs": {
      "origin": "Việt Nam (Lof Kun)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng kể từ NSX",
      "storage": "Nhiệt độ phòng hoặc ướp lạnh trước khi uống",
      "ingredients": "Sữa lên men tự nhiên, hương dâu tổng hợp, vitamin K2, vitamin D3, khoáng chất Canxi"
    },
    "reviews": [
      {
        "name": "Mẹ Bé Bông",
        "rating": 5,
        "date": "20/09/2026",
        "comment": "Bé nhà mình chỉ chịu uống Kun dâu, mua lốc ở IT Mart rẻ hơn siêu thị gần nhà nhiều."
      }
    ]
  },
  {
    "id": "sp-03",
    "name": "Sữa chua ăn TH True Yogurt có đường hộp 100g",
    "brand": "TH True Milk",
    "cat": "sua-chua",
    "orig": 7200,
    "sale": 6000,
    "unit": "Hộp 100g",
    "img": "./images/th-milk-sua-chua-an-vi-tu-nhien-100g_5ceb2511-a809-405a-b334-12864c14e739-og-thumb-1.jpg",
    "badge": "Bán chạy",
    "rate": 5,
    "revs": 350,
    "sold": 4600,
    "flash": 0,
    "prog": 70,
    "stock": 120,
    "desc": "Lên men tự nhiên từ sữa tươi sạch nguyên chất của trang trại TH, hoàn toàn không sử dụng chất bảo quản, giữ trọn vẹn hương vị tự nhiên và vi chất quý giá.",
    "specs": {
      "origin": "Việt Nam (TH True Milk Nghệ An)",
      "volume": "100g / hộp",
      "expiry": "45 ngày kể từ ngày sản xuất",
      "storage": "Luôn bảo quản lạnh ở nhiệt độ 2°C – 8°C",
      "ingredients": "100% Sữa tươi sạch nguyên chất, đường, men Streptococcus thermophilus và Lactobacillus bulgaricus"
    },
    "reviews": [
      {
        "name": "Phạm Minh Tâm",
        "rating": 5,
        "date": "18/09/2026",
        "comment": "Sữa chua sánh mịn, vị ngọt vừa vặn không bị gắt, ăn kèm ngũ cốc yến mạch buổi sáng rất ngon."
      }
    ]
  },
  {
    "id": "sp-04",
    "name": "Sữa chua uống SuSu hương cam túi 110ml",
    "brand": "Vinamilk",
    "cat": "sua-chua",
    "orig": 5200,
    "sale": 4900,
    "unit": "Gói 110ml",
    "img": "./images/10195011_08923664-7fbf-4c0a-949a-ef41e5a8e6f7-og-thumb-1.jpg",
    "badge": "Hot",
    "rate": 4.7,
    "revs": 89,
    "sold": 1100,
    "flash": 0,
    "prog": 60,
    "stock": 95,
    "desc": "Bổ sung chất xơ hòa tan Prebiotic và Vitamin A giúp bé mắt sáng ngời, đường ruột khỏe mạnh và năng động suốt ngày dài.",
    "specs": {
      "origin": "Việt Nam (Vinamilk)",
      "volume": "110ml",
      "expiry": "6 tháng",
      "storage": "Bảo quản nơi khô ráo thoáng mát",
      "ingredients": "Sữa tươi tiệt trùng, nước, đường, chất xơ Prebiotic, Vitamin A, B6, B12"
    },
    "reviews": [
      {
        "name": "Lê Lan Anh",
        "rating": 5,
        "date": "12/09/2026",
        "comment": "Túi nhỏ tiện bỏ cặp cho con đi học mầm non, bé rất thích hút."
      }
    ]
  },
  {
    "id": "sp-05",
    "name": "Lốc 4 hộp váng sữa uống hương sô cô la Zott Monte chai 95ml",
    "brand": "Monte",
    "cat": "sua-chua",
    "orig": 58500,
    "sale": 57200,
    "unit": "Lốc 4 chai",
    "img": "./images/VS1.jpg",
    "badge": "Nhập khẩu Đức",
    "rate": 4.9,
    "revs": 165,
    "sold": 1890,
    "flash": 1,
    "prog": 78,
    "stock": 60,
    "desc": "Váng sữa Monte bổ dưỡng từ sữa tươi hảo hạng kết hợp hương vị sô cô la thơm ngon béo ngậy, giàu Canxi và Vitamin A cho sự phát triển của bé.",
    "specs": {
      "origin": "Cộng Hòa Liên Bang Đức (Zott SE & Co. KG)",
      "volume": "4 x 95ml",
      "expiry": "180 ngày",
      "storage": "Bảo quản lạnh 4°C – 8°C",
      "ingredients": "Sữa nguyên kem (49%), kem, hạt phỉ, sô cô la bột, Canxi, Vitamin A"
    },
    "reviews": [
      {
        "name": "Hoàng Yến",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Monte socola hàng chuẩn Đức, vị ngậy béo rất đỉnh. Con mình ăn tăng cân đều."
      }
    ]
  },
  {
    "id": "sp-06",
    "name": "Lốc 4 hộp váng sữa uống hương vani Zott Monte chai 95ml",
    "brand": "Monte",
    "cat": "sua-chua",
    "orig": 58500,
    "sale": 57200,
    "unit": "Lốc 4 chai",
    "img": "./images/VS2.jpg",
    "badge": "Nhập khẩu Đức",
    "rate": 4.8,
    "revs": 134,
    "sold": 1560,
    "flash": 0,
    "prog": 65,
    "stock": 55,
    "desc": "Váng sữa hương vani truyền thống thơm lừng, cung cấp năng lượng dồi dào và hàm lượng chất béo tốt cho thể trạng bé.",
    "specs": {
      "origin": "Đức (Zott GmbH)",
      "volume": "4 x 95ml",
      "expiry": "6 tháng",
      "storage": "Bảo quản ngăn mát tủ lạnh",
      "ingredients": "Sữa nguyên kem, kem, đường, tinh bột biến tính, hương vani tự nhiên"
    },
    "reviews": [
      {
        "name": "Đỗ Mai Trang",
        "rating": 5,
        "date": "10/09/2026",
        "comment": "Vị vani thơm ngọt dịu, dễ uống hơn vị socola đối với bé nhỏ."
      }
    ]
  },
  {
    "id": "sp-07",
    "name": "Sữa chua uống hương cam Kun lốc 4 hộp x 180ml",
    "brand": "Kun",
    "cat": "sua-chua",
    "orig": 30900,
    "sale": 24700,
    "unit": "Lốc 4 hộp",
    "img": "./images/kun-sua-chua-uong-huong-cam-180ml_4-goi-4-20230410013450.png",
    "badge": "Giảm 20%",
    "rate": 4.8,
    "revs": 180,
    "sold": 2200,
    "flash": 0,
    "prog": 75,
    "stock": 75,
    "desc": "Vị cam chua ngọt sảng khoái, nguồn dinh dưỡng tối ưu từ sữa tươi và công thức phát triển chiều cao toàn diện của Lof Kun.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 180ml",
      "expiry": "8 tháng",
      "storage": "Nhiệt độ phòng hoặc ngăn mát",
      "ingredients": "Sữa lên men tự nhiên, nước ép cam, đường, Vitamin K2, D3, A"
    },
    "reviews": [
      {
        "name": "Bùi Quốc Anh",
        "rating": 5,
        "date": "14/09/2026",
        "comment": "Giá lốc 4 hộp 24k quá rẻ, date xa."
      }
    ]
  },
  {
    "id": "sp-08",
    "name": "Thức uống từ sữa chua vị lựu YoMost lốc 4 hộp x 170ml",
    "brand": "YoMost",
    "cat": "sua-chua",
    "orig": 38900,
    "sale": 34800,
    "unit": "Lốc 4 hộp",
    "img": "./images/SC1.png",
    "badge": "Vị mới",
    "rate": 4.7,
    "revs": 92,
    "sold": 980,
    "flash": 0,
    "prog": 55,
    "stock": 50,
    "desc": "Sự hòa quyện độc đáo giữa sữa chua thanh mát và nước ép quả lựu đỏ rực rỡ, giàu chất chống oxy hóa và vitamin C.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 170ml",
      "expiry": "8 tháng",
      "storage": "Nơi thoáng mát",
      "ingredients": "Sữa chua lên men, nước ép lựu đỏ, vitamin C, kẽm"
    },
    "reviews": [
      {
        "name": "Vũ Khánh Linh",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Vị lựu uống lạ miệng và rất cuốn, giải nhiệt buổi trưa rất tốt."
      }
    ]
  },
  {
    "id": "sp-09",
    "name": "Thức uống từ sữa chua vị cam YoMost lốc 4 hộp x 170ml",
    "brand": "YoMost",
    "cat": "sua-chua",
    "orig": 38900,
    "sale": 34800,
    "unit": "Lốc 4 hộp",
    "img": "./images/SC2.png",
    "badge": "Ưa chuộng",
    "rate": 4.9,
    "revs": 115,
    "sold": 1750,
    "flash": 0,
    "prog": 80,
    "stock": 65,
    "desc": "Vị cam tươi mới bùng nổ năng lượng, thơm ngon uống lạnh cực đã, phù hợp cho mọi thành viên trong gia đình.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 170ml",
      "expiry": "8 tháng",
      "storage": "Tránh ánh nắng trực tiếp",
      "ingredients": "Sữa chua lên men, nước cam ép, vitamin nhóm B"
    },
    "reviews": [
      {
        "name": "Đặng Thị Hằng",
        "rating": 5,
        "date": "16/09/2026",
        "comment": "Hàng giao nhanh, lốc sữa nguyên vẹn không bị móp méo."
      }
    ]
  },
  {
    "id": "sp-10",
    "name": "Sữa đậu đen, óc chó Sahmyook Hàn Quốc túi 195ml",
    "brand": "Sahmyook",
    "cat": "sua-hat",
    "orig": 25500,
    "sale": 19200,
    "unit": "Túi 195ml",
    "img": "./images/1.jpeg",
    "badge": "Hàn Quốc",
    "rate": 4.9,
    "revs": 310,
    "sold": 5200,
    "flash": 1,
    "prog": 88,
    "stock": 110,
    "desc": "Sữa hạt dinh dưỡng nổi tiếng từ Sahmyook Hàn Quốc kết hợp hạt óc chó và đậu đen, bổ não, đẹp da và tốt cho tim mạch.",
    "specs": {
      "origin": "Hàn Quốc (Sahmyook Foods)",
      "volume": "195ml / túi",
      "expiry": "12 tháng kể từ NSX",
      "storage": "Bảo quản nhiệt độ phòng, ngon hơn khi uống lạnh",
      "ingredients": "Dịch chiết đậu đen (47%), hạt óc chó nghiền, hạnh nhân, đậu phộng, muối tinh"
    },
    "reviews": [
      {
        "name": "Trịnh Thảo",
        "rating": 5,
        "date": "05/09/2026",
        "comment": "Sữa óc chó đậu đen Sahmyook thì nổi tiếng rồi, thơm bùi ngọt dịu cực kỳ."
      }
    ]
  },
  {
    "id": "sp-11",
    "name": "Sữa đậu nành hạnh nhân Vinamilk 4 hộp x 180ml",
    "brand": "Vinamilk",
    "cat": "sua-hat",
    "orig": 35200,
    "sale": 33000,
    "unit": "Lốc 4 hộp",
    "img": "./images/SDN-HN.jpg",
    "badge": "Tốt tim mạch",
    "rate": 4.8,
    "revs": 120,
    "sold": 1350,
    "flash": 0,
    "prog": 60,
    "stock": 85,
    "desc": "Từ 100% hạt đậu nành không biến đổi gen chọn lọc kết hợp hạt hạnh nhân Mỹ thơm lừng, bổ sung Omega 3-6-9 và vitamin E dồi dào.",
    "specs": {
      "origin": "Việt Nam (Vinamilk)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Dịch trích đậu nành, hạnh nhân nghiền nhuyễn, Omega 3, Vitamin E, B1"
    },
    "reviews": [
      {
        "name": "Cao Thanh Thủy",
        "rating": 5,
        "date": "09/09/2026",
        "comment": "Vị hạnh nhân thơm nhẹ, không bị ngọt quá, mình ăn kiêng uống rất yên tâm."
      }
    ]
  },
  {
    "id": "sp-12",
    "name": "Sữa đậu nành đậu đỏ Vinamilk lốc 4 hộp x 180ml",
    "brand": "Vinamilk",
    "cat": "sua-hat",
    "orig": 35200,
    "sale": 33000,
    "unit": "Lốc 4 hộp",
    "img": "./images/SDN-daudo.jpg",
    "badge": "Thơm ngon",
    "rate": 4.6,
    "revs": 78,
    "sold": 820,
    "flash": 0,
    "prog": 50,
    "stock": 60,
    "desc": "Đậu nành thanh đạm hòa quyện cùng đậu đỏ bổ huyết, thanh nhiệt cơ thể, ít ngọt phù hợp cho người ăn uống lành mạnh.",
    "specs": {
      "origin": "Việt Nam (Vinamilk)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Đậu nành không biến đổi gen, đậu đỏ cao cấp, đường phèn thanh khiết"
    },
    "reviews": [
      {
        "name": "Phan Văn Nam",
        "rating": 4,
        "date": "11/09/2026",
        "comment": "Vị đậu đỏ thơm đậm, uống lạnh buổi xế chiều rất đã khát."
      }
    ]
  },
  {
    "id": "sp-13",
    "name": "Sữa đậu đen, óc chó Sahmyook lốc 3 hộp 140ml",
    "brand": "Sahmyook",
    "cat": "sua-hat",
    "orig": 50000,
    "sale": 42700,
    "unit": "Lốc 3 hộp",
    "img": "./images/Suadauden-occho.jpeg",
    "badge": "Cao cấp",
    "rate": 4.9,
    "revs": 94,
    "sold": 1100,
    "flash": 0,
    "prog": 72,
    "stock": 40,
    "desc": "Dòng sản phẩm cao cấp đóng hộp tiện lợi, dồi dào axit béo thiết yếu, hỗ trợ tăng cường trí nhớ cho người lớn và trẻ nhỏ.",
    "specs": {
      "origin": "Hàn Quốc",
      "volume": "3 x 140ml",
      "expiry": "1 năm",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Đậu đen tự nhiên, óc chó Mỹ, Canxi sinh học"
    },
    "reviews": [
      {
        "name": "Bảo Ngọc",
        "rating": 5,
        "date": "17/09/2026",
        "comment": "Đóng hộp vuông vắn đẹp mắt, dùng làm quà biếu cũng rất sang trọng."
      }
    ]
  },
  {
    "id": "sp-14",
    "name": "Lốc 4 hộp sữa tươi tiệt trùng không đường Vinamilk Green Farm 180ml",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 38500,
    "sale": 37200,
    "unit": "Lốc 4 hộp",
    "img": "./images/1.jpg",
    "badge": "Green Farm",
    "rate": 4.9,
    "revs": 240,
    "sold": 3400,
    "flash": 0,
    "prog": 82,
    "stock": 90,
    "desc": "Sữa tươi thuần khiết từ trang trại sinh thái Vinamilk Green Farm, thanh nhẹ tự nhiên, hoàn toàn không đường, tốt cho vóc dáng.",
    "specs": {
      "origin": "Việt Nam (Vinamilk Green Farm Tây Ninh)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng kể từ NSX",
      "storage": "Nơi khô ráo hoặc ướp lạnh",
      "ingredients": "100% Sữa bò tươi nguyên chất từ trang trại sinh thái chuẩn quốc tế"
    },
    "reviews": [
      {
        "name": "Chị Thảo Hà Nội",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Sữa Green Farm vị thanh béo tự nhiên, không đường nhưng uống không hề tanh, rất ngon!"
      }
    ]
  },
  {
    "id": "sp-15",
    "name": "Sữa dinh dưỡng Có Đường Vinamilk ADM - Lốc 4 Hộp 110ml",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 22900,
    "sale": 20000,
    "unit": "Lốc 4 hộp",
    "img": "./images/ADM_110.jpg",
    "badge": "Bổ sung Omega",
    "rate": 4.8,
    "revs": 195,
    "sold": 2900,
    "flash": 1,
    "prog": 90,
    "stock": 100,
    "desc": "Giàu Omega 3, Vitamin A và Canxi giúp phát triển trí não toàn diện và thể chất dẻo dai cho lứa tuổi học đường.",
    "specs": {
      "origin": "Việt Nam (Vinamilk)",
      "volume": "4 x 110ml",
      "expiry": "6 tháng",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Sữa tươi, đường, Omega-3 từ dầu cá tinh khiết, Canxi, Vitamin A, D3"
    },
    "reviews": [
      {
        "name": "Lương Tuấn",
        "rating": 5,
        "date": "19/09/2026",
        "comment": "Mua cho 2 đứa nhỏ uống kèm bữa phụ đi học, giá rẻ hơn tạp hóa gần 5 ngàn 1 lốc."
      }
    ]
  },
  {
    "id": "sp-16",
    "name": "Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk Green Farm 110ml",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 28900,
    "sale": 24800,
    "unit": "Lốc 4 hộp",
    "img": "./images/Lốc 4 hộp sữa tươi tiệt trùng ít đường Vinamilk Green Farm 110ml.jpg",
    "badge": "Tiết kiệm",
    "rate": 4.9,
    "revs": 160,
    "sold": 1950,
    "flash": 0,
    "prog": 68,
    "stock": 85,
    "desc": "Dung tích 110ml tiện lợi mang theo đi học, vị ít đường thanh mát ngọt dịu kích thích vị giác của trẻ.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 110ml",
      "expiry": "6 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Sữa tươi 97%, đường tinh luyện 2.8%, chất ổn định tự nhiên"
    },
    "reviews": [
      {
        "name": "Hồ Quỳnh Anh",
        "rating": 5,
        "date": "13/09/2026",
        "comment": "Vị ít đường rất hợp khẩu vị trẻ em ngày nay, không sợ béo phì."
      }
    ]
  },
  {
    "id": "sp-17",
    "name": "Sữa tươi tiệt trùng Promess nguyên chất Organic 1L",
    "brand": "Promess",
    "cat": "sua-tuoi",
    "orig": 70000,
    "sale": 62700,
    "unit": "Hộp 1L",
    "img": "./images/Promess-62.700.jpg",
    "badge": "Pháp 100%",
    "rate": 5,
    "revs": 88,
    "sold": 920,
    "flash": 1,
    "prog": 74,
    "stock": 35,
    "desc": "Sữa tươi Organic nhập khẩu trực tiếp từ Pháp, đạt chuẩn hữu cơ châu Âu nghiêm ngặt, giàu đạm và canxi tự nhiên.",
    "specs": {
      "origin": "Pháp (Lactinov - BBA Group)",
      "volume": "1000ml (1 Lít)",
      "expiry": "12 tháng",
      "storage": "Nơi thoáng mát, mở nắp bảo quản tủ lạnh dùng trong 3 ngày",
      "ingredients": "100% Sữa bò tươi hữu cơ nguyên chất chuẩn châu Âu"
    },
    "reviews": [
      {
        "name": "Bác Sĩ Thu Trang",
        "rating": 5,
        "date": "08/09/2026",
        "comment": "Sữa Organic của Pháp pha cà phê latte hoặc làm bánh béo ngậy thơm nức mũi, chuẩn 5 sao."
      }
    ]
  },
  {
    "id": "sp-18",
    "name": "Thùng 48 hộp sữa tươi tiệt trùng TH True Milk ít đường 180ml",
    "brand": "TH True Milk",
    "cat": "sua-tuoi",
    "orig": 450000,
    "sale": 428400,
    "unit": "Thùng 48 hộp",
    "img": "./images/Thùng 48 hộp sữ tươi tiwwtj trùng TH Tr.jpg",
    "badge": "Giá sỉ tốt",
    "rate": 5,
    "revs": 420,
    "sold": 6800,
    "flash": 1,
    "prog": 95,
    "stock": 25,
    "desc": "Thùng 48 hộp tiết kiệm cho cả gia đình, cam kết 100% sữa tươi sạch từ cụm trang trại bò sữa tập trung ứng dụng công nghệ cao TH.",
    "specs": {
      "origin": "Việt Nam (Trang trại TH Nghệ An)",
      "volume": "48 hộp x 180ml",
      "expiry": "6 tháng kể từ NSX",
      "storage": "Để nơi khô ráo, tránh ánh nắng",
      "ingredients": "Hoàn toàn từ sữa bò tươi sạch nguyên chất của trang trại TH (96%), đường (3.8%)"
    },
    "reviews": [
      {
        "name": "Ngô Quốc Bảo",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Mua nguyên thùng ship tận cửa trong 2 tiếng, shipper nhiệt tình bê tận lên tầng 3 chung cư!"
      }
    ]
  },
  {
    "id": "sp-19",
    "name": "Sữa tươi tiệt trùng Vinamilk 100% không đường hộp 1L",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 37000,
    "sale": 35900,
    "unit": "Hộp 1L",
    "img": "./images/vinamilk-kd-1L.jpg",
    "badge": "Chuẩn Quốc Gia",
    "rate": 4.8,
    "revs": 280,
    "sold": 4900,
    "flash": 0,
    "prog": 80,
    "stock": 150,
    "desc": "Dòng sữa tươi truyền thống quốc dân từ Vinamilk, lý tưởng để uống trực tiếp, pha chế cà phê, làm bánh và nấu ăn.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "1000ml",
      "expiry": "6 tháng",
      "storage": "Sau khi mở nắp giữ lạnh và dùng trong 3 ngày",
      "ingredients": "100% Sữa bò tươi nguyên chất"
    },
    "reviews": [
      {
        "name": "Vũ Hải Đăng",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Sữa không đường pha cà phê sáng mỗi ngày là thói quen của mình, giá tại IT Mart rất cạnh tranh."
      }
    ]
  },
  {
    "id": "sp-20",
    "name": "Sữa tiệt trùng Vinamilk Flex không đường tách béo hộp 1L",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 34600,
    "sale": 32000,
    "unit": "Hộp 1L",
    "img": "./images/Sữa tiệt trùng Vinamilk Flex không đường hộp 1L.jpg",
    "badge": "Tách béo",
    "rate": 4.7,
    "revs": 110,
    "sold": 1450,
    "flash": 0,
    "prog": 62,
    "stock": 70,
    "desc": "Gấp đôi Canxi và giảm 50% chất béo, lựa chọn số 1 cho người đang ăn kiêng, tập luyện thể thao giữ dáng và bảo vệ hệ xương khớp.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "1L",
      "expiry": "6 tháng",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Sữa bò tươi tách béo 50%, Canxi hữu cơ tăng cường, Vitamin D"
    },
    "reviews": [
      {
        "name": "Phạm Thúy Hằng",
        "rating": 5,
        "date": "15/09/2026",
        "comment": "Gymmer chân ái đây rồi, tách béo uống không lo mỡ thừa."
      }
    ]
  },
  {
    "id": "sp-21",
    "name": "Sữa tươi tiệt trùng hương dâu TH True Milk lốc 4 hộp x 180ml",
    "brand": "TH True Milk",
    "cat": "sua-tuoi",
    "orig": 38500,
    "sale": 36200,
    "unit": "Lốc 4 hộp",
    "img": "./images/TH-dau.jpeg",
    "badge": "Vị dâu tây",
    "rate": 4.8,
    "revs": 130,
    "sold": 1680,
    "flash": 0,
    "prog": 69,
    "stock": 75,
    "desc": "Hương dâu tây ngọt ngào quyện cùng sữa tươi sạch TH nguyên chất mang đến cảm giác thích thú cho các bé khi thưởng thức.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nơi râm mát",
      "ingredients": "Sữa tươi sạch TH 93%, đường, hương dâu tự nhiên"
    },
    "reviews": [
      {
        "name": "Nguyễn Kim Ngân",
        "rating": 5,
        "date": "07/09/2026",
        "comment": "TH vị dâu thơm tự nhiên không bị nồng mùi hương liệu như các hãng khác."
      }
    ]
  },
  {
    "id": "sp-22",
    "name": "Sữa tiệt trùng sô cô la Active Cô Gái Hà Lan lốc 4 hộp x 180ml",
    "brand": "Cô Gái Hà Lan",
    "cat": "sua-tuoi",
    "orig": 37900,
    "sale": 35000,
    "unit": "Lốc 4 hộp",
    "img": "./images/CGHL-scl.png",
    "badge": "Năng lượng",
    "rate": 4.8,
    "revs": 175,
    "sold": 2300,
    "flash": 0,
    "prog": 77,
    "stock": 68,
    "desc": "Công thức Active 20+ kết hợp sô cô la đậm đà giải phóng năng lượng bền bỉ cho ngày dài học tập và vận động.",
    "specs": {
      "origin": "Việt Nam (Dutch Lady)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nơi thoáng mát",
      "ingredients": "Sữa tươi, bột cacao nguyên chất, Canxi, Magie, Vitamin nhóm B"
    },
    "reviews": [
      {
        "name": "Trần Đức Trọng",
        "rating": 5,
        "date": "16/09/2026",
        "comment": "Vị cacao đậm đà uống lạnh sau khi đá bóng hồi sức cực nhanh."
      }
    ]
  },
  {
    "id": "sp-23",
    "name": "Lốc 4 hộp sữa tươi thanh trùng Vinamilk chứa tổ yến 180ml",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 60000,
    "sale": 52700,
    "unit": "Lốc 4 hộp",
    "img": "./images/VNM-toyen.jpg",
    "badge": "Tổ yến quý",
    "rate": 5,
    "revs": 96,
    "sold": 1250,
    "flash": 1,
    "prog": 86,
    "stock": 45,
    "desc": "Sữa tươi bổ sung tinh chất tổ yến thượng hạng, tăng cường sức đề kháng và bồi bổ thể lực nhanh chóng cho cả gia đình.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nơi mát mẻ",
      "ingredients": "Sữa tươi sạch, tinh chất tổ yến thiên nhiên, Canxi, Vitamin D3"
    },
    "reviews": [
      {
        "name": "Bác Hòa Cầu Giấy",
        "rating": 5,
        "date": "11/09/2026",
        "comment": "Bồi bổ cho người lớn tuổi rất tốt, thơm dịu dễ uống."
      }
    ]
  },
  {
    "id": "sp-24",
    "name": "Sữa tươi tiệt trùng TH True Milk Organic 500ml",
    "brand": "TH True Milk",
    "cat": "sua-tuoi",
    "orig": 34600,
    "sale": 32000,
    "unit": "Hộp 500ml",
    "img": "./images/Th-organic.jpg",
    "badge": "Chuẩn Hữu Cơ",
    "rate": 4.9,
    "revs": 65,
    "sold": 780,
    "flash": 0,
    "prog": 58,
    "stock": 30,
    "desc": "Được sản xuất từ đàn bò chăn thả tự nhiên trên đồng cỏ hữu cơ đạt chuẩn quốc tế EC 834/2007 và USDA-NOP.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "500ml",
      "expiry": "6 tháng",
      "storage": "Tránh nhiệt độ cao",
      "ingredients": "100% Sữa tươi hữu cơ đạt chuẩn châu Âu và Mỹ"
    },
    "reviews": [
      {
        "name": "Phan Ánh Dương",
        "rating": 5,
        "date": "20/09/2026",
        "comment": "Chất lượng Organic chuẩn chỉnh, vị ngọt hậu thanh tao."
      }
    ]
  },
  {
    "id": "sp-25",
    "name": "Lốc 4 hộp sữa tươi ít đường vị đường đen Dalat Milk 180ml",
    "brand": "Dalat Milk",
    "cat": "sua-tuoi",
    "orig": 30900,
    "sale": 29700,
    "unit": "Lốc 4 hộp",
    "img": "./images/viduongden.jpg",
    "badge": "Đường đen",
    "rate": 4.8,
    "revs": 145,
    "sold": 1650,
    "flash": 0,
    "prog": 71,
    "stock": 80,
    "desc": "Vị sữa tươi béo ngậy phối cùng hương đường đen trứ danh, mang đến trải nghiệm đồ uống chuẩn quán trà sữa ngay tại nhà.",
    "specs": {
      "origin": "Việt Nam (Dalat Milk Lâm Đồng)",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Sữa tươi cao nguyên Lâm Đồng, siro đường đen tự nhiên"
    },
    "reviews": [
      {
        "name": "Trương Mỹ Duyên",
        "rating": 5,
        "date": "14/09/2026",
        "comment": "Vị đường đen siêu thơm, thêm trân châu trắng vào uống y như Gong Cha luôn!"
      }
    ]
  },
  {
    "id": "sp-26",
    "name": "Sữa tiệt trùng sô cô la Vinamilk bịch giấy 220ml",
    "brand": "Vinamilk",
    "cat": "sua-tuoi",
    "orig": 10900,
    "sale": 7700,
    "unit": "Gói 220ml",
    "img": "./images/SCL -Vinamilk-goi-220.jpg",
    "badge": "Giá siêu rẻ",
    "rate": 4.7,
    "revs": 310,
    "sold": 6100,
    "flash": 0,
    "prog": 84,
    "stock": 200,
    "desc": "Dạng bịch tiện lợi và tiết kiệm, vị socola thơm ngọt bùi được đông đảo học sinh sinh viên yêu thích.",
    "specs": {
      "origin": "Việt Nam",
      "volume": "220ml",
      "expiry": "6 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Sữa tươi tiệt trùng, bột ca cao, đường"
    },
    "reviews": [
      {
        "name": "Sinh viên Bách Khoa",
        "rating": 5,
        "date": "02/09/2026",
        "comment": "Bịch 220ml to đùng mà chưa tới 8k, cứu đói mỗi kỳ ôn thi."
      }
    ]
  },
  {
    "id": "sp-27",
    "name": "Lốc 4 hộp sữa tươi tiệt trùng Dalat Milk không đường 180ml",
    "brand": "Dalat Milk",
    "cat": "sua-tuoi",
    "orig": 40900,
    "sale": 34700,
    "unit": "Lốc 4 hộp",
    "img": "./images/Dalat-milk.jpg",
    "badge": "Cao nguyên",
    "rate": 5,
    "revs": 190,
    "sold": 2400,
    "flash": 0,
    "prog": 76,
    "stock": 65,
    "desc": "Từ cao nguyên Lâm Đồng với khí hậu mát mẻ quanh năm, sữa tươi Dalat Milk giữ trọn vị thơm ngậy đặc trưng khó quên.",
    "specs": {
      "origin": "Lâm Đồng, Việt Nam",
      "volume": "4 x 180ml",
      "expiry": "6 tháng",
      "storage": "Nơi mát mẻ",
      "ingredients": "100% Sữa tươi cao nguyên nguyên chất"
    },
    "reviews": [
      {
        "name": "Hoàng Minh",
        "rating": 5,
        "date": "18/09/2026",
        "comment": "Dalat Milk không đường có độ béo ngậy tự nhiên rất khác biệt so với các hãng khác, cực kỳ ngon."
      }
    ]
  },
  {
    "id": "sp-28",
    "name": "Lốc 6 hộp sữa tươi tiệt trùng Binggrae Hương dưa lưới 200ml",
    "brand": "Binggrae",
    "cat": "sua-tuoi",
    "orig": 120900,
    "sale": 111700,
    "unit": "Lốc 6 hộp",
    "img": "./images/Bringrae.jpg",
    "badge": "Binggrae Hàn",
    "rate": 4.9,
    "revs": 110,
    "sold": 1300,
    "flash": 1,
    "prog": 82,
    "stock": 40,
    "desc": "Thương hiệu sữa hoa quả quốc dân Hàn Quốc, hương thơm dưa lưới tươi mát kích thích vị giác ngay từ ngụm đầu tiên.",
    "specs": {
      "origin": "Hàn Quốc (Binggrae Co., Ltd)",
      "volume": "6 x 200ml",
      "expiry": "8 tháng",
      "storage": "Uống ngon hơn khi để tủ lạnh thật lạnh",
      "ingredients": "Sữa tươi thanh trùng Hàn Quốc, nước ép dưa lưới cô đặc, đường"
    },
    "reviews": [
      {
        "name": "Phan Thùy Chi",
        "rating": 5,
        "date": "23/09/2026",
        "comment": "Sữa dưa lưới Binggrae uống mê mẩn, mở tủ lạnh ra là thơm nức cả phòng!"
      }
    ]
  },
  {
    "id": "sp-29",
    "name": "Bánh ChocoPie Orion vị truyền thống hộp 12 cái 396g",
    "brand": "Orion",
    "cat": "banh-keo",
    "orig": 62000,
    "sale": 54500,
    "unit": "Hộp 12 cái",
    "img": "./images/products/sp-29.jpg",
    "badge": "Bán chạy #1",
    "rate": 4.9,
    "revs": 380,
    "sold": 5400,
    "flash": 1,
    "prog": 88,
    "stock": 90,
    "desc": "Bánh ChocoPie Orion trứ danh với lớp vỏ bánh xốp mềm thơm mùi cacao đậm đà, kẹp giữa là lớp kem dẻo marshmallow dai ngọt béo ngậy độc quyền.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn Orion)",
      "volume": "396g (12 gói x 33g)",
      "expiry": "12 tháng kể từ NSX",
      "storage": "Nơi khô ráo, thoáng mát dưới 28°C",
      "ingredients": "Bột mì, đường, siro ngô, chất béo thực vật, bột cacao, sữa bột nguyên kem, gelatin, hương vani"
    },
    "reviews": [
      {
        "name": "Nguyễn Hải Đăng",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "ChocoPie Orion hộp 12 cái ăn hoài không ngán, date mới tinh, bao bì nguyên vẹn."
      },
      {
        "name": "Trần Mai Trang",
        "rating": 5,
        "date": "18/09/2026",
        "comment": "Bánh mềm ngọt bùi vừa vặn, bọn trẻ con nhà mình thích mê."
      }
    ]
  },
  {
    "id": "sp-30",
    "name": "Snack khoai tây chiên giòn Lay's Stax vị tự nhiên lon 105g",
    "brand": "Lay's",
    "cat": "banh-keo",
    "orig": 39000,
    "sale": 34000,
    "unit": "Lon 105g",
    "img": "./images/products/sp-30.jpg",
    "badge": "Giòn rụm",
    "rate": 4.8,
    "revs": 215,
    "sold": 3100,
    "flash": 0,
    "prog": 72,
    "stock": 85,
    "desc": "Từng lát khoai tây giòn tan mỏng mịn, giữ nguyên vị ngọt bùi tự nhiên của khoai tây tươi, đóng dạng lon tiện lợi không lo vỡ vụn khi mang đi dã ngoại.",
    "specs": {
      "origin": "Việt Nam (PepsiCo)",
      "volume": "105g",
      "expiry": "12 tháng",
      "storage": "Nơi khô ráo, đậy kín nắp sau khi mở",
      "ingredients": "Khoai tây tươi (52%), dầu thực vật tinh luyện, bột gia vị tự nhiên, muối ăn"
    },
    "reviews": [
      {
        "name": "Lê Hoàng Yến",
        "rating": 5,
        "date": "20/09/2026",
        "comment": "Lon Stax vị tự nhiên giòn rụm, nhâm nhi khi cày phim cực đã."
      }
    ]
  },
  {
    "id": "sp-31",
    "name": "Bánh quy sữa Cosy Marie Kinh Đô gói lớn 336g",
    "brand": "Kinh Đô",
    "cat": "banh-keo",
    "orig": 38000,
    "sale": 32500,
    "unit": "Gói 336g",
    "img": "./images/products/sp-31.jpg",
    "badge": "Thơm bơ sữa",
    "rate": 4.8,
    "revs": 190,
    "sold": 2950,
    "flash": 0,
    "prog": 65,
    "stock": 75,
    "desc": "Bánh quy Cosy Marie bổ sung Canxi và DHA, thơm lừng vị bơ sữa hảo hạng, rất thích hợp chấm sữa tươi hoặc dùng cho bữa xế của cả gia đình.",
    "specs": {
      "origin": "Việt Nam (Mondelez Kinh Đô)",
      "volume": "336g",
      "expiry": "12 tháng",
      "storage": "Nơi khô ráo, thoáng mát",
      "ingredients": "Bột mì, dầu cọ, đường, bơ, sữa đặc có đường, Canxi carbonat, DHA"
    },
    "reviews": [
      {
        "name": "Trần Mai Anh",
        "rating": 5,
        "date": "18/09/2026",
        "comment": "Bánh thơm bơ sữa ngọt thanh, chấm vào sữa tươi không đường ăn siêu ngon."
      }
    ]
  },
  {
    "id": "sp-32",
    "name": "Bánh que Pocky Glico hương dâu giòn tan hộp 38g",
    "brand": "Glico",
    "cat": "banh-keo",
    "orig": 16500,
    "sale": 14500,
    "unit": "Hộp 38g",
    "img": "./images/products/sp-32.jpg",
    "badge": "Nhật Bản",
    "rate": 4.9,
    "revs": 310,
    "sold": 4200,
    "flash": 1,
    "prog": 82,
    "stock": 120,
    "desc": "Bánh que giòn tan phủ trọn lớp kem dâu tây ngọt thơm hấp dẫn, thiết kế phần tay cầm sạch sẽ không dính tay, món ăn vặt yêu thích của giới trẻ.",
    "specs": {
      "origin": "Thái Lan (Tập đoàn Ezaki Glico Nhật Bản)",
      "volume": "38g / hộp",
      "expiry": "12 tháng",
      "storage": "Nhiệt độ dưới 28°C",
      "ingredients": "Bột mì, đường tinh luyện, dầu thực vật, bột sữa nguyên chất, bột dâu tây tự nhiên"
    },
    "reviews": [
      {
        "name": "Vũ Quỳnh Trang",
        "rating": 5,
        "date": "15/09/2026",
        "comment": "Pocky vị dâu ăn giòn thơm, ngọt vừa phải, bé nhà mình rất mê."
      }
    ]
  },
  {
    "id": "sp-33",
    "name": "Bánh dinh dưỡng AFC lúa mì mè cải hộp 172g",
    "brand": "Kinh Đô",
    "cat": "banh-keo",
    "orig": 33000,
    "sale": 28500,
    "unit": "Hộp 172g",
    "img": "./images/products/sp-33.jpg",
    "badge": "Ít calo",
    "rate": 4.7,
    "revs": 160,
    "sold": 2400,
    "flash": 0,
    "prog": 68,
    "stock": 80,
    "desc": "Bánh cracker giòn rụm bổ sung chất xơ tự nhiên từ rau củ tươi, Canxi và Vitamin D, món ăn nhẹ lý tưởng cho dân văn phòng và người ăn kiêng.",
    "specs": {
      "origin": "Việt Nam (Mondelez Kinh Đô)",
      "volume": "172g (8 gói nhỏ x 21.5g)",
      "expiry": "12 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Bột mì, dầu cọ thực vật, rau cải sấy khô, men tự nhiên, Canxi hữu cơ"
    },
    "reviews": [
      {
        "name": "Đỗ Bích Thảo",
        "rating": 5,
        "date": "19/09/2026",
        "comment": "Bánh giòn mằn mặn thơm vị rau củ, ăn xế chiều không lo tăng cân."
      }
    ]
  },
  {
    "id": "sp-34",
    "name": "Kẹo dẻo gấu Haribo Goldbears nhập khẩu Đức gói 80g",
    "brand": "Haribo",
    "cat": "banh-keo",
    "orig": 27000,
    "sale": 23500,
    "unit": "Gói 80g",
    "img": "./images/products/sp-34.jpg",
    "badge": "Nhập khẩu Đức",
    "rate": 4.9,
    "revs": 290,
    "sold": 4100,
    "flash": 0,
    "prog": 75,
    "stock": 95,
    "desc": "Kẹo dẻo hình gấu biểu tượng của Haribo với 6 vị trái cây tự nhiên: táo, dâu tây, mâm xôi, cam, chanh và dứa, dẻo dai sảng khoái không phẩm màu nhân tạo.",
    "specs": {
      "origin": "Cộng Hòa Liên Bang Đức (Haribo GmbH)",
      "volume": "80g",
      "expiry": "18 tháng",
      "storage": "Nhiệt độ phòng mát",
      "ingredients": "Siro glucose, đường, nước ép hoa quả nguyên chất cô đặc, gelatin, sáp ong"
    },
    "reviews": [
      {
        "name": "Phạm Gia Huy",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Haribo chuẩn Đức ăn dai giòn sần sật, vị hoa quả đậm đà tự nhiên."
      }
    ]
  },
  {
    "id": "sp-35",
    "name": "Thùng 24 lon Nước ngọt Coca-Cola Sleek nguyên bản 320ml",
    "brand": "Coca-Cola",
    "cat": "do-uong",
    "orig": 245000,
    "sale": 225000,
    "unit": "Thùng 24 lon",
    "img": "./images/products/sp-35.jpg",
    "badge": "Giá sỉ siêu rẻ",
    "rate": 5,
    "revs": 520,
    "sold": 7800,
    "flash": 1,
    "prog": 95,
    "stock": 45,
    "desc": "Nước giải khát có ga Coca-Cola hương vị nguyên bản sảng khoái bùng nổ, thiết kế lon Sleek thon gọn sang trọng, món đồ uống không thể thiếu trong các bữa tiệc.",
    "specs": {
      "origin": "Việt Nam (Coca-Cola Beverages)",
      "volume": "24 lon x 320ml",
      "expiry": "12 tháng kể từ NSX",
      "storage": "Nơi khô mát, ngon hơn khi ướp lạnh",
      "ingredients": "Nước bão hòa CO2, đường HFCS, màu caramen tự nhiên, hương tự nhiên, caffeine"
    },
    "reviews": [
      {
        "name": "Lê Tấn Phát",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Mua cả thùng giá hời hơn tạp hóa, ship giao tới tận phòng rất nhanh."
      }
    ]
  },
  {
    "id": "sp-36",
    "name": "Lốc 6 lon Nước ngọt Pepsi Không Calo 320ml",
    "brand": "Pepsi",
    "cat": "do-uong",
    "orig": 62000,
    "sale": 54000,
    "unit": "Lốc 6 lon",
    "img": "./images/products/sp-36.jpg",
    "badge": "0 Calo",
    "rate": 4.8,
    "revs": 340,
    "sold": 4600,
    "flash": 0,
    "prog": 80,
    "stock": 70,
    "desc": "Vị sảng khoái cực đỉnh của Pepsi với công thức 0 calo, 0 đường, thỏa mãn cơn khát mà không lo ngại vấn đề cân nặng hay đường huyết.",
    "specs": {
      "origin": "Việt Nam (Suntory PepsiCo)",
      "volume": "6 lon x 320ml",
      "expiry": "12 tháng",
      "storage": "Nơi thoáng mát",
      "ingredients": "Nước bão hòa CO2, chất điều chỉnh độ acid, chất tạo ngọt tổng hợp (Aspartame, Sucralose)"
    },
    "reviews": [
      {
        "name": "Ngô Trí Kiên",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Pepsi Black không calo uống lạnh cực đã, ăn đồ chiên rán kèm lon này bao nhẹ bụng."
      }
    ]
  },
  {
    "id": "sp-37",
    "name": "Trà Ô long Tea+ Plus vị thanh mát chai 455ml",
    "brand": "Suntory Tea+",
    "cat": "do-uong",
    "orig": 12000,
    "sale": 10500,
    "unit": "Chai 455ml",
    "img": "./images/products/sp-37.jpg",
    "badge": "Chứa OTPP",
    "rate": 4.9,
    "revs": 280,
    "sold": 4900,
    "flash": 0,
    "prog": 85,
    "stock": 110,
    "desc": "Trích ly từ những lá trà ô long thượng hạng với công nghệ Nhật Bản, chứa chất OTPP tự nhiên giúp hạn chế hấp thu chất béo sau bữa ăn.",
    "specs": {
      "origin": "Việt Nam (Suntory PepsiCo)",
      "volume": "455ml",
      "expiry": "12 tháng",
      "storage": "Nơi râm mát",
      "ingredients": "Nước tinh khiết, lá trà ô long, đường tinh luyện, hoạt chất OTPP tự nhiên"
    },
    "reviews": [
      {
        "name": "Đinh Thu Hương",
        "rating": 5,
        "date": "16/09/2026",
        "comment": "Trà Tea Plus thanh mát nhẹ nhàng, ăn lẩu nướng xong uống rất dễ tiêu."
      }
    ]
  },
  {
    "id": "sp-38",
    "name": "Trà xanh Không Độ thanh lọc giải nhiệt chai 455ml",
    "brand": "Number 1",
    "cat": "do-uong",
    "orig": 11500,
    "sale": 9900,
    "unit": "Chai 455ml",
    "img": "./images/products/sp-38.jpg",
    "badge": "EGCG cao",
    "rate": 4.8,
    "revs": 220,
    "sold": 3800,
    "flash": 0,
    "prog": 75,
    "stock": 85,
    "desc": "Chiết xuất từ đọt trà non Thái Nguyên tươi mới, giàu hoạt chất chống oxy hóa EGCG và Vitamin C giúp giải nhiệt cuộc sống và xua tan căng thẳng mệt mỏi.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn Tân Hiệp Phát)",
      "volume": "455ml",
      "expiry": "12 tháng",
      "storage": "Nhiệt độ phòng hoặc ngăn mát",
      "ingredients": "Nước tinh khiết, trà xanh Thái Nguyên, đường fructose, vitamin C"
    },
    "reviews": [
      {
        "name": "Hoàng Đức Nam",
        "rating": 5,
        "date": "17/09/2026",
        "comment": "Uống giải khát ngày hè thì Không Độ vẫn là số 1, vị chát nhẹ ngọt hậu."
      }
    ]
  },
  {
    "id": "sp-39",
    "name": "Nước ép cam có tép Minute Maid Teppy chai 327ml",
    "brand": "Coca-Cola",
    "cat": "do-uong",
    "orig": 13000,
    "sale": 11000,
    "unit": "Chai 327ml",
    "img": "./images/products/sp-39.jpg",
    "badge": "Tép cam tươi",
    "rate": 4.9,
    "revs": 195,
    "sold": 2800,
    "flash": 1,
    "prog": 78,
    "stock": 90,
    "desc": "Nước ép cam Teppy mọng nước hòa quyện cùng những tép cam thật giòn tan vui miệng, bổ sung Vitamin C dồi dào tăng cường đề kháng.",
    "specs": {
      "origin": "Việt Nam (Coca-Cola)",
      "volume": "327ml",
      "expiry": "9 tháng",
      "storage": "Bảo quản nơi thoáng mát",
      "ingredients": "Nước, nước ép cam cô đặc, tép cam tươi tự nhiên, đường, Vitamin C"
    },
    "reviews": [
      {
        "name": "Nguyễn Minh Phương",
        "rating": 5,
        "date": "14/09/2026",
        "comment": "Tép cam nhai sựt sựt rất sướng miệng, con nít người lớn đều thích."
      }
    ]
  },
  {
    "id": "sp-40",
    "name": "Thùng 24 chai Nước khoáng thiên nhiên LaVie 500ml",
    "brand": "LaVie",
    "cat": "do-uong",
    "orig": 115000,
    "sale": 102000,
    "unit": "Thùng 24 chai",
    "img": "./images/products/sp-40.jpg",
    "badge": "Khoáng tự nhiên",
    "rate": 5,
    "revs": 460,
    "sold": 8200,
    "flash": 0,
    "prog": 90,
    "stock": 50,
    "desc": "Nước khoáng thiên nhiên LaVie chắt lọc qua nhiều tầng địa chất sâu, chứa 6 khoáng chất thiết yếu (K, Mg, Na, Ca, Fl, HCO3) tốt cho sức khỏe mỗi ngày.",
    "specs": {
      "origin": "Việt Nam (Nestlé Waters)",
      "volume": "24 chai x 500ml",
      "expiry": "24 tháng",
      "storage": "Nơi sạch sẽ, tránh ánh nắng trực tiếp",
      "ingredients": "100% Nước khoáng thiên nhiên ngầm sâu nguồn Long An"
    },
    "reviews": [
      {
        "name": "Trịnh Thùy Dung",
        "rating": 5,
        "date": "23/09/2026",
        "comment": "Giao thùng nước 24 chai nặng trịch lên tận căn hộ, nước uống vị khoáng thanh nhẹ."
      }
    ]
  },
  {
    "id": "sp-41",
    "name": "Cà phê hòa tan G7 3in1 Trung Nguyên hộp 18 gói x 16g",
    "brand": "Trung Nguyên",
    "cat": "tra-ca-phe",
    "orig": 68000,
    "sale": 59000,
    "unit": "Hộp 18 gói",
    "img": "./images/products/sp-41.jpg",
    "badge": "Huyền thoại G7",
    "rate": 5,
    "revs": 650,
    "sold": 9800,
    "flash": 1,
    "prog": 96,
    "stock": 130,
    "desc": "Cà phê G7 3in1 trứ danh thế giới với hương thơm nồng nàn quyến rũ và vị đậm đà khác biệt từ nguồn hạt cà phê Robusta Buôn Ma Thuột số 1.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn Trung Nguyên Legend)",
      "volume": "18 gói x 16g (288g)",
      "expiry": "24 tháng kể từ NSX",
      "storage": "Nơi khô ráo, tránh ẩm ướt",
      "ingredients": "Cà phê hòa tan nguyên chất, đường tinh luyện, bột kem không sữa"
    },
    "reviews": [
      {
        "name": "Nguyễn Văn Hùng",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Sáng nào cũng làm một ly G7 tỉnh táo làm việc cả ngày, hương thơm nức mũi."
      }
    ]
  },
  {
    "id": "sp-42",
    "name": "Cà phê sữa đá Nescafé 3in1 Đậm Đà Hài Hòa hộp 20 gói",
    "brand": "Nescafé",
    "cat": "tra-ca-phe",
    "orig": 72000,
    "sale": 63500,
    "unit": "Hộp 20 gói",
    "img": "./images/products/sp-42.jpg",
    "badge": "Vị sữa đá chuẩn",
    "rate": 4.8,
    "revs": 310,
    "sold": 4500,
    "flash": 0,
    "prog": 76,
    "stock": 80,
    "desc": "Nescafé 3in1 vị cà phê sữa đá đậm đà béo ngậy hòa quyện hài hòa cùng vị đắng thanh tao, mang trọn hương vị quán xá vào từng ngụm cà phê sáng.",
    "specs": {
      "origin": "Việt Nam (Nestlé)",
      "volume": "20 gói x 17g (340g)",
      "expiry": "12 tháng",
      "storage": "Bảo quản nơi khô mát",
      "ingredients": "Đường, bột kem pha cà phê, cà phê hòa tan 11.5%, hương tổng hợp"
    },
    "reviews": [
      {
        "name": "Lê Ngọc Bích",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Pha 2 gói thêm đá là ra đúng ly cà phê sữa đá lề đường thơm lừng béo ngậy."
      }
    ]
  },
  {
    "id": "sp-43",
    "name": "Lon Cà phê sữa Highlands Coffee 185ml thơm béo",
    "brand": "Highlands",
    "cat": "tra-ca-phe",
    "orig": 17500,
    "sale": 15000,
    "unit": "Lon 185ml",
    "img": "./images/products/sp-43.jpg",
    "badge": "Highlands Chuẩn",
    "rate": 4.9,
    "revs": 390,
    "sold": 6200,
    "flash": 0,
    "prog": 88,
    "stock": 100,
    "desc": "Sự kết hợp hoàn hảo giữa những hạt cà phê Robusta và Arabica thượng hạng rang xay tỉ mỉ cùng sữa thơm béo đặc trưng của Highlands Coffee.",
    "specs": {
      "origin": "Việt Nam (Highlands Coffee)",
      "volume": "185ml",
      "expiry": "12 tháng",
      "storage": "Nơi khô ráo, uống lạnh cực ngon",
      "ingredients": "Nước cốt cà phê đậm đặc, sữa tươi, đường, chất điều chỉnh độ acid"
    },
    "reviews": [
      {
        "name": "Trương Tuấn Anh",
        "rating": 5,
        "date": "20/09/2026",
        "comment": "Lon tiện lợi mang đi làm, vị chuẩn như mua tại quầy Highlands mà giá mềm hơn nhiều."
      }
    ]
  },
  {
    "id": "sp-44",
    "name": "Trà túi lọc Cozy hương đào thơm lừng hộp 20 túi x 2g",
    "brand": "Cozy",
    "cat": "tra-ca-phe",
    "orig": 34000,
    "sale": 29500,
    "unit": "Hộp 20 túi",
    "img": "./images/products/sp-44.jpg",
    "badge": "Pha trà đào hot",
    "rate": 4.8,
    "revs": 240,
    "sold": 3700,
    "flash": 0,
    "prog": 70,
    "stock": 90,
    "desc": "Hương đào ngọt ngào quyến rũ hòa cùng búp trà đen tự nhiên nguyên chất, bí quyết tự tay pha chế món trà đào cam sả thanh nhiệt nức tiếng.",
    "specs": {
      "origin": "Việt Nam (Công ty CP Sản phẩm Sinh thái)",
      "volume": "20 túi lọc x 2g (40g)",
      "expiry": "24 tháng",
      "storage": "Nơi khô thoáng",
      "ingredients": "Trà đen búp non chọn lọc, hương đào tổng hợp"
    },
    "reviews": [
      {
        "name": "Nguyễn Khánh Huyền",
        "rating": 5,
        "date": "12/09/2026",
        "comment": "Dùng gói trà Cozy đào này ủ rồi thêm đào ngâm Kronos là thành trà đào Phúc Long ngay!"
      }
    ]
  },
  {
    "id": "sp-45",
    "name": "Trà túi lọc Lipton Nhãn Vàng Yellow Label hộp 25 túi x 2g",
    "brand": "Lipton",
    "cat": "tra-ca-phe",
    "orig": 42000,
    "sale": 36000,
    "unit": "Hộp 25 túi",
    "img": "./images/products/sp-45.jpg",
    "badge": "Anh Quốc",
    "rate": 4.9,
    "revs": 280,
    "sold": 4400,
    "flash": 0,
    "prog": 82,
    "stock": 85,
    "desc": "Trà Lipton Yellow Label với búp trà đen tinh túy sấy khô giữ trọn hương vị đậm sâu, bổ sung năng lượng tỉnh táo và thư thái tâm hồn.",
    "specs": {
      "origin": "Indonesia (Unilever Lipton)",
      "volume": "25 túi x 2g (50g)",
      "expiry": "24 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "100% Búp trà đen nguyên chất"
    },
    "reviews": [
      {
        "name": "Vũ Hải Yến",
        "rating": 5,
        "date": "19/09/2026",
        "comment": "Trà Lipton truyền thống pha với chút chanh và mật ong buổi sáng rất ấm bụng."
      }
    ]
  },
  {
    "id": "sp-46",
    "name": "Thùng 30 gói Mì Hảo Hảo tôm chua cay 75g",
    "brand": "Acecook",
    "cat": "mi-an-lien",
    "orig": 135000,
    "sale": 122000,
    "unit": "Thùng 30 gói",
    "img": "./images/products/sp-46.jpg",
    "badge": "Mì quốc dân",
    "rate": 5,
    "revs": 890,
    "sold": 15400,
    "flash": 1,
    "prog": 98,
    "stock": 60,
    "desc": "Món mì ăn liền huyền thoại số 1 Việt Nam với sợi mì vàng dai trứ danh và gói súp tôm chua cay đậm đà khó cưỡng của Acecook.",
    "specs": {
      "origin": "Việt Nam (Acecook Việt Nam)",
      "volume": "30 gói x 75g (2.25kg)",
      "expiry": "5 tháng kể từ NSX",
      "storage": "Nơi khô ráo, tránh ánh nắng",
      "ingredients": "Bột mì, dầu cọ, muối, đường, nước mắm, tôm khô, ớt, chất điều vị"
    },
    "reviews": [
      {
        "name": "Phạm Văn Long",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Mua cả thùng mì Hảo Hảo trữ trong nhà lúc đói nấu thêm quả trứng và hành lá là hết sảy!"
      }
    ]
  },
  {
    "id": "sp-47",
    "name": "Thùng 30 gói Mì khoai tây Omachi sốt bò hầm 80g",
    "brand": "Omachi",
    "cat": "mi-an-lien",
    "orig": 265000,
    "sale": 242000,
    "unit": "Thùng 30 gói",
    "img": "./images/products/sp-47.jpg",
    "badge": "Không lo nóng",
    "rate": 4.9,
    "revs": 430,
    "sold": 6200,
    "flash": 0,
    "prog": 84,
    "stock": 40,
    "desc": "Sợi mì làm từ tinh chất khoai tây tươi dai mướt kết hợp gói xốt bò hầm rau củ quả thơm lừng sánh mịn, ăn ngon mà hoàn toàn không lo bị nóng trong.",
    "specs": {
      "origin": "Việt Nam (Masan Consumer)",
      "volume": "30 gói x 80g",
      "expiry": "6 tháng",
      "storage": "Nơi thoáng mát",
      "ingredients": "Bột mì, tinh bột khoai tây, thịt bò cô đặc, rau củ quả tươi sấy (cà rốt, ngò gai)"
    },
    "reviews": [
      {
        "name": "Đào Phương Linh",
        "rating": 5,
        "date": "17/09/2026",
        "comment": "Sợi Omachi dai ngon đỉnh chóp, nước dùng ngọt thanh từ xương bò hầm."
      }
    ]
  },
  {
    "id": "sp-48",
    "name": "Mì xào khô Indomie Mi Goreng vị đặc biệt lốc 5 gói x 85g",
    "brand": "Indomie",
    "cat": "mi-an-lien",
    "orig": 35000,
    "sale": 29900,
    "unit": "Lốc 5 gói",
    "img": "./images/products/sp-48.jpg",
    "badge": "Mì xào số 1",
    "rate": 4.9,
    "revs": 510,
    "sold": 8800,
    "flash": 1,
    "prog": 92,
    "stock": 120,
    "desc": "Mì xào khô nổi tiếng toàn cầu từ Indonesia với trọn bộ 5 gói gia vị độc đáo: dầu hành phi, sốt ớt ngọt, hành phi giòn rụm và tương ngọt béo ngậy.",
    "specs": {
      "origin": "Indonesia (Indofood CBP)",
      "volume": "5 gói x 85g",
      "expiry": "8 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Bột mì, dầu cọ tinh luyện, hành phi giòn, tương ngọt kecap manis, ớt bột"
    },
    "reviews": [
      {
        "name": "Bùi Thế Bảo",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Mì xào Indomie chiên thêm quả trứng ốp la lòng đào rưới tương ớt ăn ngon quên sầu."
      }
    ]
  },
  {
    "id": "sp-49",
    "name": "Phở bò Cung Đình Hà Nội nước cốt hầm xương gói 68g",
    "brand": "Acecook",
    "cat": "mi-an-lien",
    "orig": 11500,
    "sale": 9800,
    "unit": "Gói 68g",
    "img": "./images/products/sp-49.jpg",
    "badge": "Nước cốt hầm",
    "rate": 4.8,
    "revs": 220,
    "sold": 3100,
    "flash": 0,
    "prog": 69,
    "stock": 90,
    "desc": "Sợi phở dai mềm từ hạt gạo dẻo thơm kết hợp gói nước cốt hầm xương bò cô đặc cùng hoa hồi, thảo quả chuẩn phong vị phở gia truyền Hà Nội.",
    "specs": {
      "origin": "Việt Nam (Micoem)",
      "volume": "68g",
      "expiry": "8 tháng",
      "storage": "Nơi sạch sẽ khô mát",
      "ingredients": "Gạo tẻ nguyên chất, tinh chất xương bò hầm, quế, hồi, gừng nướng"
    },
    "reviews": [
      {
        "name": "Nguyễn Thu Hà",
        "rating": 5,
        "date": "15/09/2026",
        "comment": "Nước cốt phở bò thơm mùi quế hồi rất thật, sợi phở mềm mướt."
      }
    ]
  },
  {
    "id": "sp-50",
    "name": "Miến sườn heo Phú Hương Acecook gói 58g",
    "brand": "Acecook",
    "cat": "mi-an-lien",
    "orig": 13500,
    "sale": 11500,
    "unit": "Gói 58g",
    "img": "./images/products/sp-50.jpg",
    "badge": "Thanh đạm",
    "rate": 4.7,
    "revs": 175,
    "sold": 2500,
    "flash": 0,
    "prog": 66,
    "stock": 80,
    "desc": "Sợi miến trong suốt làm từ tinh bột đậu xanh thanh mát, nước súp sườn heo ngọt lịm đậm đà, ít tinh bột xấu phù hợp cho người giữ vóc dáng.",
    "specs": {
      "origin": "Việt Nam (Acecook)",
      "volume": "58g",
      "expiry": "8 tháng",
      "storage": "Nơi khô ráo",
      "ingredients": "Tinh bột đậu xanh, tinh bột khoai tây, chiết xuất sườn heo, nấm mèo sấy"
    },
    "reviews": [
      {
        "name": "Trần Mai Phương",
        "rating": 5,
        "date": "18/09/2026",
        "comment": "Miến Phú Hương ăn thanh nhẹ, sợi miến dai dai nấu ăn sáng cực hợp."
      }
    ]
  },
  {
    "id": "sp-51",
    "name": "Dầu thực vật tinh luyện Simply Đậu Nành can 1 Lít",
    "brand": "Simply",
    "cat": "gia-vi",
    "orig": 69000,
    "sale": 61000,
    "unit": "Chai 1L",
    "img": "./images/products/sp-51.jpg",
    "badge": "Tốt cho tim",
    "rate": 5,
    "revs": 390,
    "sold": 6500,
    "flash": 0,
    "prog": 88,
    "stock": 100,
    "desc": "Chiết xuất 100% từ hạt đậu nành chọn lọc, giàu Omega 3-6-9 và Phytosterol tự nhiên được Hội Tim Mạch Học Việt Nam khuyên dùng bảo vệ sức khỏe trái tim.",
    "specs": {
      "origin": "Việt Nam (Calyxo - Simply)",
      "volume": "1000ml (1 Lít)",
      "expiry": "24 tháng kể từ NSX",
      "storage": "Nơi khô ráo, tránh ánh sáng mạnh",
      "ingredients": "100% Dầu đậu nành nguyên chất tinh luyện, Vitamin A palmitat"
    },
    "reviews": [
      {
        "name": "Cô Nguyễn Lan",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Nhà tôi chỉ dùng dầu Simply chiên xào, dầu trong veo không bị khét hay ám mùi."
      }
    ]
  },
  {
    "id": "sp-52",
    "name": "Nước mắm cá cơm Nam Ngư Đệ Nhị chai lớn 900ml",
    "brand": "Nam Ngư",
    "cat": "gia-vi",
    "orig": 38000,
    "sale": 33000,
    "unit": "Chai 900ml",
    "img": "./images/products/sp-52.jpg",
    "badge": "Chuẩn vị nhà",
    "rate": 4.8,
    "revs": 480,
    "sold": 8900,
    "flash": 0,
    "prog": 91,
    "stock": 120,
    "desc": "Nước mắm Nam Ngư Đệ Nhị từ nguồn cá cơm tươi ngon Phú Quốc ủ chượp theo phương pháp truyền thống, vị mặn dịu ngọt hậu đặc trưng cho món ăn Việt.",
    "specs": {
      "origin": "Việt Nam (Masan Consumer)",
      "volume": "900ml",
      "expiry": "12 tháng",
      "storage": "Nơi khô ráo, đậy kín nắp sau khi dùng",
      "ingredients": "Nước mắm cốt cá cơm, nước, muối tinh, đường, chất điều vị"
    },
    "reviews": [
      {
        "name": "Trần Văn Cường",
        "rating": 5,
        "date": "19/09/2026",
        "comment": "Chai lớn 900ml dùng cả tháng, chấm thịt luộc hay kho cá đều rất ngon."
      }
    ]
  },
  {
    "id": "sp-53",
    "name": "Tương ớt Chinsu vị cay nồng hảo hạng chai 250g",
    "brand": "Chinsu",
    "cat": "gia-vi",
    "orig": 16000,
    "sale": 13500,
    "unit": "Chai 250g",
    "img": "./images/products/sp-53.jpg",
    "badge": "Vạn món ngon",
    "rate": 4.9,
    "revs": 620,
    "sold": 11200,
    "flash": 1,
    "prog": 94,
    "stock": 150,
    "desc": "Được làm từ những trái ớt đỏ chín mọng tự nhiên kết hợp tỏi thơm và muối hạt tinh khiết lên men tự nhiên, tạo độ sánh mịn và vị cay kích thích bùng nổ vị giác.",
    "specs": {
      "origin": "Việt Nam (Masan Consumer)",
      "volume": "250g",
      "expiry": "9 tháng",
      "storage": "Nơi râm mát",
      "ingredients": "Nước, ớt tươi chọn lọc 21%, đường, tỏi, muối, cà chua cô đặc"
    },
    "reviews": [
      {
        "name": "Hoàng Minh Trí",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Ăn phở, ăn mì hay chấm mực nướng mà thiếu tương ớt Chinsu là mất nửa độ ngon!"
      }
    ]
  },
  {
    "id": "sp-54",
    "name": "Hạt nêm từ thịt Knorr Thịt Thăn & Xương Ống gói 400g",
    "brand": "Knorr",
    "cat": "gia-vi",
    "orig": 42000,
    "sale": 36500,
    "unit": "Gói 400g",
    "img": "./images/products/sp-54.jpg",
    "badge": "Ngọt từ thịt",
    "rate": 4.9,
    "revs": 350,
    "sold": 5700,
    "flash": 0,
    "prog": 82,
    "stock": 90,
    "desc": "Chiết xuất từ thịt thăn, tủy và xương ống hầm trong nhiều giờ chuẩn VIETGAP, mang đến vị ngọt sâu lắng và hương thơm tự nhiên cho mọi món canh xào.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "400g",
      "expiry": "15 tháng",
      "storage": "Để nơi khô ráo, tránh ánh sáng trực tiếp",
      "ingredients": "Muối, đường, dầu cọ, bột sắn, nước cốt hầm thịt thăn và xương ống"
    },
    "reviews": [
      {
        "name": "Bác Thanh Mai",
        "rating": 5,
        "date": "16/09/2026",
        "comment": "Hạt nêm Knorr nêm canh rau ngót hay xào thịt vị ngọt thanh không bị lợ cổ."
      }
    ]
  },
  {
    "id": "sp-55",
    "name": "Cá ngừ ngâm dầu sốt cà chua Seaspimex lon 185g",
    "brand": "Seaspimex",
    "cat": "gia-vi",
    "orig": 35000,
    "sale": 29500,
    "unit": "Lon 185g",
    "img": "./images/products/sp-55.jpg",
    "badge": "Mở nắp ăn liền",
    "rate": 4.8,
    "revs": 160,
    "sold": 2200,
    "flash": 0,
    "prog": 70,
    "stock": 75,
    "desc": "Thịt cá ngừ đại dương tươi ngon nạc mềm kết hợp sốt cà chua đậm đà và dầu nành nguyên chất, giàu đạm và Omega-3, ăn kèm bánh mì hoặc cơm nóng siêu tiện.",
    "specs": {
      "origin": "Việt Nam (Seaspimex Việt Nam)",
      "volume": "185g",
      "expiry": "3 năm",
      "storage": "Nhiệt độ phòng",
      "ingredients": "Cá ngừ (55%), sốt cà chua, dầu đậu nành, muối, tiêu gia vị"
    },
    "reviews": [
      {
        "name": "Nguyễn Tuấn Linh",
        "rating": 5,
        "date": "14/09/2026",
        "comment": "Cá ngừ thịt chắc không bị tanh, sốt cà chua kẹp bánh mì ăn sáng siêu đỉnh."
      }
    ]
  },
  {
    "id": "sp-56",
    "name": "Sữa hạt sen & hạt óc chó TH True Nut lốc 4 hộp x 180ml",
    "brand": "TH True Milk",
    "cat": "sua-hat",
    "orig": 52000,
    "sale": 46500,
    "unit": "Lốc 4 hộp",
    "img": "./images/products/sp-56.jpg",
    "badge": "Vị ngọt chà là",
    "rate": 4.9,
    "revs": 185,
    "sold": 2600,
    "flash": 1,
    "prog": 85,
    "stock": 65,
    "desc": "Sự hòa quyện thanh mát giữa hạt sen đồng quê và hạt óc chó giàu dưỡng chất, hoàn toàn không bổ sung đường tinh luyện mà sử dụng vị ngọt tự nhiên từ quả chà là quý giá.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn TH)",
      "volume": "4 hộp x 180ml",
      "expiry": "6 tháng kể từ NSX",
      "storage": "Nơi khô ráo hoặc ngăn mát",
      "ingredients": "Dịch hạt sen, hạt óc chó nghiền nhuyễn, sữa tươi sạch TH, quả chà là"
    },
    "reviews": [
      {
        "name": "Phạm Thúy Hường",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Vị ngọt nhẹ từ chà là rất tự nhiên, hạt sen thơm bùi giúp dễ ngủ hơn hẳn."
      }
    ]
  },
  {
    "id": "sp-57",
    "name": "Sữa hạt hạnh nhân nguyên chất 137 Degrees Thái Lan hộp 180ml",
    "brand": "137 Degrees",
    "cat": "sua-hat",
    "orig": 33000,
    "sale": 28000,
    "unit": "Hộp 180ml",
    "img": "./images/products/sp-57.jpg",
    "badge": "Nhập khẩu Thái",
    "rate": 5,
    "revs": 140,
    "sold": 1900,
    "flash": 0,
    "prog": 77,
    "stock": 55,
    "desc": "Chế biến từ 94% hạt hạnh nhân tươi nguyên chất thu hoạch từ California, không chất bảo quản, không đường mía, giàu canxi và axit folic cho mẹ bầu và người ăn thuần chay.",
    "specs": {
      "origin": "Thái Lan (Simple Foods Co., Ltd)",
      "volume": "180ml",
      "expiry": "12 tháng",
      "storage": "Nơi khô thoáng",
      "ingredients": "Sữa hạt hạnh nhân 94%, mật hoa dừa hữu cơ 5%, hạt hướng dương 1%"
    },
    "reviews": [
      {
        "name": "Vũ Khánh Ly",
        "rating": 5,
        "date": "17/09/2026",
        "comment": "Sữa hạt hạnh nhân đỉnh cao của Thái Lan, vị béo thơm thuần khiết không bị ngấy."
      }
    ]
  },
  {
    "id": "sp-58",
    "name": "Cà chua bi Ruby Đà Lạt chuẩn VietGAP hộp 500g",
    "brand": "VietGAP Đà Lạt",
    "cat": "rau-cu",
    "orig": 32000,
    "sale": 26500,
    "unit": "Hộp 500g",
    "img": "./images/products/sp-58.jpg",
    "badge": "VietGAP",
    "rate": 4.9,
    "revs": 210,
    "sold": 3800,
    "flash": 1,
    "prog": 90,
    "stock": 65,
    "desc": "Cà chua bi Ruby quả mọng nước, đỏ tươi, vị chua ngọt hài hòa tự nhiên, giàu vitamin C và Lycopene chống oxy hóa, ăn sống hay làm salad đều tuyệt ngon.",
    "specs": {
      "origin": "Đà Lạt, Lâm Đồng (Nông trại VietGAP)",
      "volume": "500g / hộp",
      "expiry": "Dùng ngon nhất trong 5-7 ngày",
      "storage": "Bảo quản ngăn mát tủ lạnh 8-12°C",
      "ingredients": "100% Cà chua bi Ruby tươi sạch tự nhiên"
    },
    "reviews": [
      {
        "name": "Nguyễn Thu Hà",
        "rating": 5,
        "date": "28/09/2026",
        "comment": "Cà chua bi giòn ngọt, vỏ mỏng không bị chua gắt, bé nhà mình ăn sống như hoa quả."
      }
    ]
  },
  {
    "id": "sp-59",
    "name": "Bông cải xanh (Súp lơ) Đà Lạt tươi sạch cây 500g",
    "brand": "VietGAP Đà Lạt",
    "cat": "rau-cu",
    "orig": 38000,
    "sale": 31000,
    "unit": "Cây 500g",
    "img": "./images/products/sp-59.jpg",
    "badge": "Tươi trong ngày",
    "rate": 4.8,
    "revs": 165,
    "sold": 2900,
    "flash": 0,
    "prog": 75,
    "stock": 45,
    "desc": "Bông cải xanh búp cuộn chặt, búp xanh mướt giàu sulforaphane, canxi và chất xơ, thích hợp luộc chấm kho quẹt hoặc xào thịt bò bổ dưỡng.",
    "specs": {
      "origin": "Đà Lạt, Lâm Đồng",
      "volume": "Cây ~500g",
      "expiry": "5 ngày trong ngăn mát",
      "storage": "Bọc màng bọc thực phẩm giữ lạnh",
      "ingredients": "100% Búp bông cải xanh tươi Đà Lạt"
    },
    "reviews": [
      {
        "name": "Chị Bích Hạnh",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Súp lơ xanh mướt, luộc lên nước ngọt thanh, cuống giòn ngọt."
      }
    ]
  },
  {
    "id": "sp-60",
    "name": "Rau xà lách mỡ thủy canh sạch giòn ngọt túi 300g",
    "brand": "Đà Lạt Farm",
    "cat": "rau-cu",
    "orig": 25000,
    "sale": 19500,
    "unit": "Túi 300g",
    "img": "./images/products/sp-60.jpg",
    "badge": "Thủy canh",
    "rate": 4.9,
    "revs": 195,
    "sold": 3400,
    "flash": 0,
    "prog": 82,
    "stock": 50,
    "desc": "Trồng theo phương pháp thủy canh hồi lưu khép kín, lá rau xanh nõn mướt mát, giòn ngọt tự nhiên, an toàn tuyệt đối không dư lượng thuốc BVTV.",
    "specs": {
      "origin": "Đà Lạt, Việt Nam",
      "volume": "300g / túi",
      "expiry": "3 - 5 ngày",
      "storage": "Ngăn rau củ tủ lạnh",
      "ingredients": "100% Xà lách mỡ thủy canh sạch"
    },
    "reviews": [
      {
        "name": "Trần Mai Anh",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Rau sạch sẽ không có hạt đất nào, rửa sơ là trộn dầu giấm ăn liền cực giòn."
      }
    ]
  },
  {
    "id": "sp-61",
    "name": "Cà rốt tươi Đà Lạt củ ngọt giòn túi 500g",
    "brand": "VietGAP Đà Lạt",
    "cat": "rau-cu",
    "orig": 22000,
    "sale": 17500,
    "unit": "Túi 500g",
    "img": "./images/products/sp-61.jpg",
    "badge": "Giàu Beta-Caroten",
    "rate": 4.8,
    "revs": 140,
    "sold": 2200,
    "flash": 0,
    "prog": 70,
    "stock": 70,
    "desc": "Cà rốt Đà Lạt củ thon đều màu cam đậm, lõi nhỏ giòn ngọt, giàu vitamin A sáng mắt, rất lý tưởng để ép nước uống hoặc hầm súp canh sườn.",
    "specs": {
      "origin": "Lâm Đồng, Việt Nam",
      "volume": "500g / túi",
      "expiry": "10 ngày ở nhiệt độ mát",
      "storage": "Để nơi khô ráo thoáng khí hoặc ngăn mát",
      "ingredients": "100% Cà rốt tươi Đà Lạt"
    },
    "reviews": [
      {
        "name": "Phạm Hải Yến",
        "rating": 5,
        "date": "20/09/2026",
        "comment": "Cà rốt ép với táo thơm ngọt không hề hăng, củ cứng cáp tươi rói."
      }
    ]
  },
  {
    "id": "sp-62",
    "name": "Khoai tây vàng Đà Lạt vỏ mỏng ruột vàng túi 1kg",
    "brand": "Đà Lạt Farm",
    "cat": "rau-cu",
    "orig": 35000,
    "sale": 29000,
    "unit": "Túi 1kg",
    "img": "./images/products/sp-62.jpg",
    "badge": "Đà Lạt 100%",
    "rate": 4.9,
    "revs": 280,
    "sold": 4600,
    "flash": 0,
    "prog": 78,
    "stock": 90,
    "desc": "Khoai tây giống vàng Đà Lạt ruột vàng óng, bở bùi ngọt tự nhiên, không sượng, thích hợp chiên xù, làm khoai tây nghiền hoặc nấu cà ri béo ngậy.",
    "specs": {
      "origin": "Đà Lạt, Việt Nam",
      "volume": "1000g (1kg)",
      "expiry": "15 ngày",
      "storage": "Nơi khô thoáng, tránh ánh sáng trực tiếp",
      "ingredients": "100% Khoai tây vàng tươi chọn lọc"
    },
    "reviews": [
      {
        "name": "Đỗ Minh Quân",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Khoai củ đều tay, chiên nồi chiên không dầu giòn rụm bên ngoài bở mềm bên trong."
      }
    ]
  },
  {
    "id": "sp-63",
    "name": "Dưa leo Baby giống Nhật Bản ngọt mát hộp 500g",
    "brand": "VietGAP Đà Lạt",
    "cat": "rau-cu",
    "orig": 26000,
    "sale": 21000,
    "unit": "Hộp 500g",
    "img": "./images/products/sp-63.jpg",
    "badge": "Giòn tan",
    "rate": 4.9,
    "revs": 175,
    "sold": 2700,
    "flash": 1,
    "prog": 86,
    "stock": 60,
    "desc": "Dưa leo baby quả nhỏ xinh xắn, vỏ mỏng ruột đặc ít hạt, vị ngọt mát giải nhiệt, ăn kèm các món cuốn hoặc chấm muối ớt cực đã.",
    "specs": {
      "origin": "Lâm Đồng (Chuẩn VietGAP)",
      "volume": "500g / hộp",
      "expiry": "5 - 7 ngày",
      "storage": "Ngăn mát tủ lạnh",
      "ingredients": "100% Dưa leo baby giống Nhật"
    },
    "reviews": [
      {
        "name": "Lương Thùy Linh",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Dưa leo giòn rụm ngọt lịm không một chút đắng, đóng hộp sạch đẹp."
      }
    ]
  },
  {
    "id": "sp-64",
    "name": "Táo Envy New Zealand nhập khẩu size 70 hộp 3 quả",
    "brand": "Envy",
    "cat": "trai-cay",
    "orig": 110000,
    "sale": 89000,
    "unit": "Hộp 3 quả",
    "img": "./images/products/sp-64.jpg",
    "badge": "New Zealand",
    "rate": 5,
    "revs": 390,
    "sold": 5200,
    "flash": 1,
    "prog": 94,
    "stock": 55,
    "desc": "Dòng táo cao cấp Envy New Zealand nổi tiếng với vỏ đỏ rực rỡ, thịt giòn đanh chắc nịch, thơm nồng nàn và độ ngọt đậm vị quý phái.",
    "specs": {
      "origin": "New Zealand (Envy™ Apples)",
      "volume": "Hộp 3 quả (~800g)",
      "expiry": "Dùng ngon trong 2 tuần khi giữ lạnh",
      "storage": "Nhiệt độ 2°C - 5°C trong ngăn mát",
      "ingredients": "100% Táo Envy tươi nhập khẩu loại 1"
    },
    "reviews": [
      {
        "name": "Bác Sĩ Hoàng Yến",
        "rating": 5,
        "date": "29/09/2026",
        "comment": "Táo Envy cắn giòn tan ngọt lịm nước, quả căng bóng làm quà biếu cũng sang."
      }
    ]
  },
  {
    "id": "sp-65",
    "name": "Nho đen không hạt ngón tay Úc ngọt lịm hộp 500g",
    "brand": "Nông Sản Nhập Khẩu",
    "cat": "trai-cay",
    "orig": 145000,
    "sale": 125000,
    "unit": "Hộp 500g",
    "img": "./images/products/sp-65.jpg",
    "badge": "Không hạt",
    "rate": 4.9,
    "revs": 220,
    "sold": 3100,
    "flash": 0,
    "prog": 80,
    "stock": 40,
    "desc": "Dáng quả thon dài độc đáo, vỏ mỏng màu tím đen phủ lớp phấn tự nhiên, cùi giòn sần sật mọng nước ngọt sắc không chát.",
    "specs": {
      "origin": "Úc (Australia)",
      "volume": "500g / hộp",
      "expiry": "7 ngày trong tủ lạnh",
      "storage": "Bảo quản lạnh 0°C - 4°C, ăn đến đâu rửa đến đó",
      "ingredients": "100% Nho ngón tay nhập khẩu nguyên chùm"
    },
    "reviews": [
      {
        "name": "Trịnh Gia Bảo",
        "rating": 5,
        "date": "27/09/2026",
        "comment": "Nho tươi cuống xanh lét, ngọt lịm không hạt các bé nhà mình ăn rất yên tâm."
      }
    ]
  },
  {
    "id": "sp-66",
    "name": "Chuối tiêu hồng Laba Đà Lạt chín dẻo tự nhiên nải ~1.2kg",
    "brand": "Đà Lạt Farm",
    "cat": "trai-cay",
    "orig": 38000,
    "sale": 32000,
    "unit": "Nải ~1.2kg",
    "img": "./images/products/sp-66.jpg",
    "badge": "Tiến Vua Laba",
    "rate": 4.8,
    "revs": 310,
    "sold": 4400,
    "flash": 0,
    "prog": 76,
    "stock": 60,
    "desc": "Đặc sản chuối Laba tiến vua trứ danh vùng đất Lâm Đồng, thịt chuối vàng đậm, dẻo quánh, vị ngọt thơm thảo mộc đặc trưng giàu Kali bổ não.",
    "specs": {
      "origin": "Đà Lạt, Việt Nam",
      "volume": "Nải 1.1kg - 1.3kg",
      "expiry": "4 - 6 ngày ở nhiệt độ phòng",
      "storage": "Để nơi thoáng khí, không để trong túi nilon kín",
      "ingredients": "100% Chuối Laba Đà Lạt chín tự nhiên"
    },
    "reviews": [
      {
        "name": "Phạm Văn Quang",
        "rating": 5,
        "date": "23/09/2026",
        "comment": "Chuối thơm dẻo bùi khác hẳn chuối thường, ăn trước khi tập gym rất tốt."
      }
    ]
  },
  {
    "id": "sp-67",
    "name": "Dưa hấu ruột đỏ không hạt Long An ngọt lịm quả ~2.5kg",
    "brand": "Nông Sản Việt",
    "cat": "trai-cay",
    "orig": 55000,
    "sale": 45000,
    "unit": "Quả ~2.5kg",
    "img": "./images/products/sp-67.jpg",
    "badge": "Không hạt",
    "rate": 4.9,
    "revs": 420,
    "sold": 6100,
    "flash": 1,
    "prog": 92,
    "stock": 50,
    "desc": "Dưa hấu vỏ mỏng xanh bóng, ruột đỏ au từ tâm ra vỏ, hoàn toàn không hạt tiện lợi, hàm lượng nước dồi dào giải nhiệt mùa nóng cực sảng khoái.",
    "specs": {
      "origin": "Long An, Việt Nam",
      "volume": "Quả 2.3kg - 2.7kg",
      "expiry": "10 ngày để ngoài, bổ ra bảo quản lạnh 3 ngày",
      "storage": "Nhiệt độ phòng hoặc ngăn mát",
      "ingredients": "100% Dưa hấu ruột đỏ không hạt Mặt Trời Đỏ"
    },
    "reviews": [
      {
        "name": "Vũ Kim Tuyến",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Bổ quả dưa đỏ au ngọt lịm nước, không có hạt nào ăn sướng miệng thật."
      }
    ]
  },
  {
    "id": "sp-68",
    "name": "Cam sành Tiền Giang mọng nước nhiều tép túi 1kg",
    "brand": "Nông Sản Việt",
    "cat": "trai-cay",
    "orig": 35000,
    "sale": 28000,
    "unit": "Túi 1kg",
    "img": "./images/products/sp-68.jpg",
    "badge": "Vắt nước cực ngọt",
    "rate": 4.8,
    "revs": 260,
    "sold": 3900,
    "flash": 0,
    "prog": 74,
    "stock": 80,
    "desc": "Cam sành miền Tây vỏ xanh mỏng, ruột vàng cam mọng nước, vị chua ngọt thanh nhẹ chứa hàm lượng vitamin C cực lớn giúp tăng cường đề kháng.",
    "specs": {
      "origin": "Tiền Giang, Việt Nam",
      "volume": "1000g (1kg)",
      "expiry": "7 - 10 ngày",
      "storage": "Để nơi thoáng mát hoặc ngăn rau tủ lạnh",
      "ingredients": "100% Cam sành miền Tây tươi mới"
    },
    "reviews": [
      {
        "name": "Đặng Thị Thảo",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Vắt 2 quả cam được cả cốc to đầy ắp nước, pha chút mật ong uống bao tỉnh."
      }
    ]
  },
  {
    "id": "sp-69",
    "name": "Bơ sáp 034 Đắk Lắk cơm vàng dẻo béo túi 1kg",
    "brand": "Nông Sản Việt",
    "cat": "trai-cay",
    "orig": 65000,
    "sale": 52000,
    "unit": "Túi 1kg",
    "img": "./images/products/sp-69.jpg",
    "badge": "Dẻo quánh",
    "rate": 4.9,
    "revs": 310,
    "sold": 4500,
    "flash": 0,
    "prog": 88,
    "stock": 55,
    "desc": "Bơ dài 034 nức tiếng Tây Nguyên, hạt lép cơm vàng ươm, dẻo quánh béo ngậy không xơ, làm sinh tố bơ sữa hoặc dầm sữa chua ăn cực ghiền.",
    "specs": {
      "origin": "Đắk Lắk, Việt Nam",
      "volume": "1000g (1kg / ~3-4 quả)",
      "expiry": "Ủ chín ăn trong 3 ngày sau khi mềm tay",
      "storage": "Để nhiệt độ phòng cho chín đều, chín rồi cho ngăn mát",
      "ingredients": "100% Bơ sáp giống 034 tuyển chọn"
    },
    "reviews": [
      {
        "name": "Lê Cẩm Tú",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Bơ 034 dẻo quánh cơm vàng đậm, hạt bé tí teo, xay sinh tố béo ngậy thơm lừng."
      }
    ]
  },
  {
    "id": "sp-70",
    "name": "Thịt ba chỉ heo sạch chuẩn mát MeatDeli khay 400g",
    "brand": "MeatDeli",
    "cat": "thit-trung",
    "orig": 79000,
    "sale": 68000,
    "unit": "Khay 400g",
    "img": "./images/products/sp-70.jpg",
    "badge": "Thịt mát Oxy Fresh",
    "rate": 5,
    "revs": 510,
    "sold": 7900,
    "flash": 1,
    "prog": 95,
    "stock": 60,
    "desc": "Thịt heo sạch MeatDeli ứng dụng công nghệ làm mát Oxy-Fresh 9 tầng châu Âu, tỷ lệ nạc mỡ cân đối lý tưởng, mềm mọng nước không chất tạo nạc.",
    "specs": {
      "origin": "Việt Nam (Masan MeatLife)",
      "volume": "400g / khay",
      "expiry": "5 ngày trong ngăn mát 0-4°C",
      "storage": "Luôn bảo quản lạnh 0°C đến 4°C",
      "ingredients": "100% Thịt heo ba chỉ tươi sạch nguyên chất"
    },
    "reviews": [
      {
        "name": "Cô Nguyễn Hồng",
        "rating": 5,
        "date": "29/09/2026",
        "comment": "Thịt MeatDeli luộc lên nước trong veo không một chút bọt bẩn, thịt thơm ngọt mềm."
      }
    ]
  },
  {
    "id": "sp-71",
    "name": "Trứng gà tươi sạch kháng khuẩn Ba Huân hộp 10 quả",
    "brand": "Ba Huân",
    "cat": "thit-trung",
    "orig": 36000,
    "sale": 31000,
    "unit": "Hộp 10 quả",
    "img": "./images/products/sp-71.jpg",
    "badge": "Xử lý UV",
    "rate": 4.9,
    "revs": 680,
    "sold": 11500,
    "flash": 0,
    "prog": 90,
    "stock": 120,
    "desc": "Trứng gà tươi Ba Huân trải qua quy trình khử trùng bằng tia UV và làm sạch tự động, lòng đỏ đỏ au giàu đạm và vitamin D bổ dưỡng cho bé.",
    "specs": {
      "origin": "Việt Nam (Ba Huân Group)",
      "volume": "Hộp 10 quả",
      "expiry": "30 ngày kể từ ngày đóng gói",
      "storage": "Bảo quản ngăn mát tủ lạnh",
      "ingredients": "100% Trứng gà công nghiệp sạch tiệt trùng"
    },
    "reviews": [
      {
        "name": "Trần Văn Cường",
        "rating": 5,
        "date": "27/09/2026",
        "comment": "Lòng đỏ to tròn béo ngậy, chiên ốp la lòng đào chấm nước tương ăn kèm bánh mì rất đã."
      }
    ]
  },
  {
    "id": "sp-72",
    "name": "Thịt thăn bò Úc tươi thái lát xào nhúng lẩu khay 300g",
    "brand": "PaciBeef",
    "cat": "thit-trung",
    "orig": 115000,
    "sale": 98000,
    "unit": "Khay 300g",
    "img": "./images/products/sp-72.jpg",
    "badge": "Bò Úc nhập",
    "rate": 5,
    "revs": 340,
    "sold": 4600,
    "flash": 1,
    "prog": 88,
    "stock": 45,
    "desc": "Thịt bò Úc ăn cỏ tự nhiên cắt lát mỏng tiêu chuẩn bằng máy chuyên dụng, thịt mềm tan ngọt thớ, không dai, nhúng lẩu hoặc xào cần tỏi cực nhanh chín.",
    "specs": {
      "origin": "Úc (Australia - Đóng gói tại VN)",
      "volume": "300g / khay",
      "expiry": "Ngăn đông 6 tháng, ngăn mát 3 ngày",
      "storage": "Bảo quản lạnh sâu -18°C hoặc mát 0-4°C",
      "ingredients": "100% Thịt thăn bò Úc nguyên chất"
    },
    "reviews": [
      {
        "name": "Ngô Trí Kiên",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Bò nhúng lẩu sôi 15 giây là chín tới mềm ngọt, thớ thịt đẹp mắt."
      }
    ]
  },
  {
    "id": "sp-73",
    "name": "Ức gà phi lê tươi sạch CP Foods khay 500g",
    "brand": "CP Foods",
    "cat": "thit-trung",
    "orig": 48000,
    "sale": 42000,
    "unit": "Khay 500g",
    "img": "./images/products/sp-73.jpg",
    "badge": "Gymmer chân ái",
    "rate": 4.8,
    "revs": 290,
    "sold": 5100,
    "flash": 0,
    "prog": 84,
    "stock": 75,
    "desc": "Ức gà lọc bỏ hoàn toàn da và mỡ, dồi dào protein tinh khiết hỗ trợ phát triển cơ bắp và giảm mỡ, đóng khay hút chân không an toàn vệ sinh.",
    "specs": {
      "origin": "Việt Nam (CP Group Thái Lan)",
      "volume": "500g / khay",
      "expiry": "5 ngày trong ngăn mát",
      "storage": "Bảo quản 0°C đến 4°C",
      "ingredients": "100% Ức gà phi lê tươi CP sạch"
    },
    "reviews": [
      {
        "name": "Phan Tuấn Đạt",
        "rating": 5,
        "date": "24/09/2026",
        "comment": "Ức gà CP tươi ngon không bị bở, ướp chút muối tiêu áp chảo ăn mềm mọng."
      }
    ]
  },
  {
    "id": "sp-74",
    "name": "Cá hồi Nauy tươi phi lê cắt khúc khay 250g",
    "brand": "Leroy Seafood",
    "cat": "thit-trung",
    "orig": 165000,
    "sale": 145000,
    "unit": "Khay 250g",
    "img": "./images/products/sp-74.jpg",
    "badge": "Nauy nhập khẩu",
    "rate": 5,
    "revs": 310,
    "sold": 3800,
    "flash": 1,
    "prog": 91,
    "stock": 35,
    "desc": "Cá hồi Đại Tây Dương nhập khẩu trực tiếp từ Nauy, vân mỡ cam óng ả giàu Omega-3 và DHA, có thể ăn sống Sashimi hoặc áp chảo sốt bơ chanh thơm lừng.",
    "specs": {
      "origin": "Nauy (Norway - Leroy Seafood Group)",
      "volume": "250g / khay",
      "expiry": "Dùng ngon nhất trong 3 ngày",
      "storage": "Luôn bảo quản lạnh 0°C - 2°C",
      "ingredients": "100% Cá hồi Nauy tươi phi lê lọc xương"
    },
    "reviews": [
      {
        "name": "Bác Sĩ Thu Trang",
        "rating": 5,
        "date": "28/09/2026",
        "comment": "Miếng cá hồi tươi rói, nấu cháo cho em bé hoặc áp chảo sốt cam ngon tuyệt hảo."
      }
    ]
  },
  {
    "id": "sp-75",
    "name": "Tôm thẻ chân trắng tươi sống làm sạch khay 300g",
    "brand": "Nông Sản Việt",
    "cat": "thit-trung",
    "orig": 85000,
    "sale": 74000,
    "unit": "Khay 300g",
    "img": "./images/products/sp-75.jpg",
    "badge": "Tươi ngon",
    "rate": 4.8,
    "revs": 185,
    "sold": 2600,
    "flash": 0,
    "prog": 72,
    "stock": 40,
    "desc": "Tôm thẻ sinh thái vùng đầm phá Cà Mau, thịt săn chắc giòn ngọt tự nhiên, đã được làm sạch râu và chỉ lưng, luộc nước dừa hoặc nướng muối ớt đều tuyệt.",
    "specs": {
      "origin": "Cà Mau, Việt Nam",
      "volume": "300g / khay",
      "expiry": "3 ngày trong ngăn mát, 30 ngày trong ngăn đông",
      "storage": "Nhiệt độ -18°C hoặc 0-4°C",
      "ingredients": "100% Tôm thẻ chân trắng tươi chọn lọc"
    },
    "reviews": [
      {
        "name": "Hoàng Minh Trí",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Tôm thịt chắc nịch vỏ mỏng, hấp bia sả ngọt lịm chấm muối ớt xanh hết ý."
      }
    ]
  },
  {
    "id": "sp-76",
    "name": "Xúc xích tiệt trùng heo Vissan gói 5 cây x 35g",
    "brand": "Vissan",
    "cat": "dong-lanh",
    "orig": 24000,
    "sale": 20000,
    "unit": "Gói 5 cây",
    "img": "./images/products/sp-76.jpg",
    "badge": "Vissan chính hãng",
    "rate": 4.8,
    "revs": 340,
    "sold": 6800,
    "flash": 0,
    "prog": 85,
    "stock": 110,
    "desc": "Xúc xích tiệt trùng thơm ngon đậm đà vị thịt heo tự nhiên, tiện lợi bóc vỏ ăn liền hoặc ăn kèm mì tôm, bánh mì cho bữa sáng nhanh gọn.",
    "specs": {
      "origin": "Việt Nam (Vissan)",
      "volume": "5 cây x 35g (175g)",
      "expiry": "4 tháng kể từ NSX",
      "storage": "Nhiệt độ phòng hoặc ngăn mát",
      "ingredients": "Thịt heo (60%), mỡ heo, tinh bột bắp, muối, đường, tiêu"
    },
    "reviews": [
      {
        "name": "Lê Tấn Phát",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Xúc xích Vissan ăn từ nhỏ đến lớn vẫn mê, bóc ăn liền lúc đói siêu tiện."
      }
    ]
  },
  {
    "id": "sp-77",
    "name": "Há cảo tôm thịt CJ Cầu Tre khay 300g (12 viên)",
    "brand": "CJ Cầu Tre",
    "cat": "dong-lanh",
    "orig": 48000,
    "sale": 41500,
    "unit": "Khay 300g",
    "img": "./images/products/sp-77.jpg",
    "badge": "Chuẩn Dimsum",
    "rate": 4.9,
    "revs": 270,
    "sold": 4200,
    "flash": 1,
    "prog": 88,
    "stock": 55,
    "desc": "Lớp vỏ bột trong mờ dai mềm bao trọn phần nhân tôm thịt mọng nước giòn ngọt chuẩn phong vị Dimsum nhà hàng Hong Kong, chỉ cần hấp 6 phút là dùng được.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn CJ Hàn Quốc)",
      "volume": "300g (12 viên)",
      "expiry": "12 tháng kể từ NSX",
      "storage": "Ngăn đông tủ lạnh -18°C",
      "ingredients": "Tôm (25%), thịt heo, củ sắn, bột mì, dầu mè, gia vị Dimsum"
    },
    "reviews": [
      {
        "name": "Trương Mỹ Duyên",
        "rating": 5,
        "date": "27/09/2026",
        "comment": "Há cảo vỏ mỏng dai, cắn ngập nhân tôm ngọt thịt, chấm tương ớt xì dầu ngon tuyệt."
      }
    ]
  },
  {
    "id": "sp-78",
    "name": "Chả lụa bì ớt xiêm xanh G Kitchen cây 500g",
    "brand": "G Kitchen",
    "cat": "dong-lanh",
    "orig": 98000,
    "sale": 85000,
    "unit": "Cây 500g",
    "img": "./images/products/sp-78.jpg",
    "badge": "Ớt xiêm xanh cay thơm",
    "rate": 4.9,
    "revs": 380,
    "sold": 5600,
    "flash": 0,
    "prog": 82,
    "stock": 65,
    "desc": "Thịt heo sạch 3F Plus kết hợp bì sần sật và những quả ớt xiêm xanh rừng cay nồng thơm ngát, ăn kèm muối tiêu chanh hoặc dưa góp cực đưa cơm.",
    "specs": {
      "origin": "Việt Nam (GreenFeed - G Kitchen)",
      "volume": "500g / cây",
      "expiry": "40 ngày",
      "storage": "Bảo quản ngăn mát 0°C - 4°C",
      "ingredients": "Thịt heo sạch 3F Plus (70%), bì heo, ớt xiêm xanh tươi, nước mắm nhĩ"
    },
    "reviews": [
      {
        "name": "Đào Phương Linh",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Vị ớt xiêm thơm nức cay the the, bì giòn sần sật nhậu hay ăn cơm đều số 1."
      }
    ]
  },
  {
    "id": "sp-79",
    "name": "Bánh bao nhân thịt xá xíu trứng cút Thọ Phát gói 4 cái",
    "brand": "Thọ Phát",
    "cat": "dong-lanh",
    "orig": 42000,
    "sale": 36000,
    "unit": "Gói 4 cái",
    "img": "./images/products/sp-79.jpg",
    "badge": "Thọ Phát trứ danh",
    "rate": 4.8,
    "revs": 410,
    "sold": 6500,
    "flash": 0,
    "prog": 79,
    "stock": 80,
    "desc": "Vỏ bánh xốp mềm trắng ngần thơm mùi sữa kết hợp nhân thịt xá xíu đậm đà cùng trứng cút béo bùi, bữa ăn sáng hoàn hảo nóng hổi chỉ sau 10 phút hấp.",
    "specs": {
      "origin": "Việt Nam (Bánh Bao Thọ Phát)",
      "volume": "Gói 4 cái x 100g (400g)",
      "expiry": "30 ngày trong ngăn đông",
      "storage": "Bảo quản ngăn đá tủ lạnh",
      "ingredients": "Bột mì hảo hạng, thịt heo xá xíu, trứng cút, mộc nhĩ, hành tím"
    },
    "reviews": [
      {
        "name": "Bùi Thế Bảo",
        "rating": 5,
        "date": "21/09/2026",
        "comment": "Bánh bao Thọ Phát thì nổi tiếng rồi, hấp buổi sáng cho 2 đứa con đi học vừa ngon vừa tiện."
      }
    ]
  },
  {
    "id": "sp-80",
    "name": "Phô mai Con Bò Cười truyền thống hộp 8 miếng 112g",
    "brand": "The Laughing Cow",
    "cat": "dong-lanh",
    "orig": 41000,
    "sale": 35500,
    "unit": "Hộp 8 miếng",
    "img": "./images/products/sp-80.png",
    "badge": "Pháp",
    "rate": 4.9,
    "revs": 320,
    "sold": 5400,
    "flash": 0,
    "prog": 80,
    "stock": 90,
    "desc": "Phô mai tam giác mềm mịn ngậy béo giàu Canxi và Kẽm, bổ sung năng lượng nhanh chóng cho trẻ nhỏ, ăn trực tiếp hoặc phết lên bánh mì giòn tan.",
    "specs": {
      "origin": "Việt Nam (Tập đoàn Bel Pháp)",
      "volume": "8 miếng x 14g (112g)",
      "expiry": "9 tháng kể từ NSX",
      "storage": "Nhiệt độ phòng hoặc ngăn mát",
      "ingredients": "Sữa bò tiệt trùng, bơ, phô mai lên men tự nhiên, khoáng chất Canxi"
    },
    "reviews": [
      {
        "name": "Chị Lan Anh",
        "rating": 5,
        "date": "19/09/2026",
        "comment": "Con mình thích ăn phô mai con bò cười phết bánh mì sandwich buổi sáng."
      }
    ]
  },
  {
    "id": "sp-81",
    "name": "Nước giặt xả OMO Matic cửa trước hoa anh đào túi 3.6kg",
    "brand": "OMO",
    "cat": "hoa-pham",
    "orig": 215000,
    "sale": 189000,
    "unit": "Túi 3.6kg",
    "img": "./images/products/sp-81.jpg",
    "badge": "Túi siêu tiết kiệm",
    "rate": 5,
    "revs": 780,
    "sold": 12400,
    "flash": 1,
    "prog": 97,
    "stock": 60,
    "desc": "Công thức màn chắn kháng bẩn Polyshield xoáy bay vết bẩn cứng đầu mà không hại sợi vải, lưu hương hoa anh đào thanh khiết sang trọng suốt cả tuần.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "3.6kg / túi",
      "expiry": "3 năm kể từ NSX",
      "storage": "Để nơi khô ráo, đậy nắp kín sau khi dùng",
      "ingredients": "Sodium Linear Alkylbenzene Sulfonate, tinh dầu hoa anh đào, chất quang hoạt"
    },
    "reviews": [
      {
        "name": "Cô Nguyễn Lan",
        "rating": 5,
        "date": "29/09/2026",
        "comment": "Túi 3.6kg dùng được mấy tháng, giặt máy cửa trước ít bọt mà quần áo thơm nức."
      }
    ]
  },
  {
    "id": "sp-82",
    "name": "Nước rửa chén Sunlight thiên nhiên tinh dầu bưởi tây chai 750g",
    "brand": "Sunlight",
    "cat": "hoa-pham",
    "orig": 33000,
    "sale": 28000,
    "unit": "Chai 750g",
    "img": "./images/products/sp-82.jpg",
    "badge": "100% Gốc thực vật",
    "rate": 4.9,
    "revs": 520,
    "sold": 9100,
    "flash": 0,
    "prog": 88,
    "stock": 120,
    "desc": "Chiết xuất tinh dầu bưởi tây và lô hội tự nhiên dịu nhẹ với da tay, đánh bay dầu mỡ cứng đầu chỉ trong một lần quẹt, an toàn cho cả chén đĩa trẻ em.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "750g / chai",
      "expiry": "3 năm",
      "storage": "Nơi thoáng mát",
      "ingredients": "Chiết xuất bưởi tây tự nhiên, nha đam, hoạt chất làm sạch sinh học"
    },
    "reviews": [
      {
        "name": "Phạm Hải Đăng",
        "rating": 5,
        "date": "23/09/2026",
        "comment": "Rửa chén sạch bong kin kít, mùi bưởi thơm dễ chịu không bị khô rát tay."
      }
    ]
  },
  {
    "id": "sp-83",
    "name": "Dầu gội Sunsilk óng mượt rạng ngời tinh chất bồ kết chai 650g",
    "brand": "Sunsilk",
    "cat": "hoa-pham",
    "orig": 145000,
    "sale": 125000,
    "unit": "Chai 650g",
    "img": "./images/products/sp-83.jpg",
    "badge": "Óng mượt bồ kết",
    "rate": 4.8,
    "revs": 390,
    "sold": 5800,
    "flash": 0,
    "prog": 76,
    "stock": 70,
    "desc": "Hỗn hợp tinh chất bồ kết và dầu dừa tự nhiên giúp nuôi dưỡng mái tóc đen óng ả mượt mà, xua tan nỗi lo tóc xơ rối bết dính trong ngày dài.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "650g / chai vòi nhấn",
      "expiry": "3 năm",
      "storage": "Tránh nhiệt độ cao và ánh nắng",
      "ingredients": "Chiết xuất bồ kết đậm đặc, tinh dầu hoa trà, dưỡng chất Pro-V"
    },
    "reviews": [
      {
        "name": "Trương Thảo",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Gội xong tóc suôn mượt vào nếp, mùi bồ kết thoang thoảng lưu hương lâu."
      }
    ]
  },
  {
    "id": "sp-84",
    "name": "Sữa tắm Dưỡng Thể Chuyên Sâu Dove Deeply Nourishing chai 500g",
    "brand": "Dove",
    "cat": "hoa-pham",
    "orig": 135000,
    "sale": 118000,
    "unit": "Chai 500g",
    "img": "./images/products/sp-84.jpg",
    "badge": "Dưỡng ẩm sâu",
    "rate": 4.9,
    "revs": 460,
    "sold": 6900,
    "flash": 0,
    "prog": 84,
    "stock": 65,
    "desc": "Công nghệ NutriumMoisture độc quyền cung cấp dưỡng chất tự nhiên nuôi dưỡng làn da căng mọng mềm mại từ sâu bên trong, hương thơm quý phái.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "500g / chai",
      "expiry": "30 tháng",
      "storage": "Nơi khô mát",
      "ingredients": "Dưỡng chất dưỡng ẩm tự nhiên NutriumMoisture, glycerin, stearic acid"
    },
    "reviews": [
      {
        "name": "Nguyễn Khánh Linh",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Tắm xong da mềm mượt như da em bé, bọt mịn màng thích lắm."
      }
    ]
  },
  {
    "id": "sp-85",
    "name": "Kem đánh răng P/S Than Hoạt Tính trắng răng tự nhiên tuýp 230g",
    "brand": "P/S",
    "cat": "hoa-pham",
    "orig": 45000,
    "sale": 38000,
    "unit": "Tuýp 230g",
    "img": "./images/products/sp-85.jpg",
    "badge": "Trắng răng tự nhiên",
    "rate": 4.9,
    "revs": 620,
    "sold": 9400,
    "flash": 1,
    "prog": 90,
    "stock": 140,
    "desc": "Than hoạt tính cao cấp kết hợp tinh chất tre tự nhiên giúp loại bỏ vết ố vàng trên men răng, trả lại nụ cười rạng rỡ và hơi thở thơm mát tự tin.",
    "specs": {
      "origin": "Việt Nam (Unilever)",
      "volume": "230g / tuýp lớn",
      "expiry": "3 năm",
      "storage": "Đậy nắp sau khi dùng",
      "ingredients": "Bột than hoạt tính, tinh chất tre thiên nhiên, Canxi, Fluoride"
    },
    "reviews": [
      {
        "name": "Trần Đức Trọng",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Đánh răng rất sạch mảng bám, răng sáng lên thấy rõ sau 2 tuần dùng."
      }
    ]
  },
  {
    "id": "sp-86",
    "name": "Chảo chống dính đáy từ Sunhouse Mama 24cm",
    "brand": "Sunhouse",
    "cat": "gia-dung",
    "orig": 225000,
    "sale": 185000,
    "unit": "Chiếc 24cm",
    "img": "./images/products/sp-86.jpg",
    "badge": "Đáy từ cao cấp",
    "rate": 4.9,
    "revs": 320,
    "sold": 4100,
    "flash": 1,
    "prog": 88,
    "stock": 45,
    "desc": "Chảo chống dính Sunhouse Mama đúc nhôm nguyên khối dày dặn, phủ lớp chống dính đá hoa cương siêu bền, đáy từ bắt nhiệt cực nhanh dùng được cho mọi loại bếp.",
    "specs": {
      "origin": "Việt Nam (Sunhouse Group)",
      "volume": "Đường kính 24cm, dày 2.8mm",
      "expiry": "Bảo hành chính hãng 12 tháng",
      "storage": "Vệ sinh bằng miếng bọt biển mềm, tránh chà búi sắt",
      "ingredients": "Hợp kim nhôm đúc, chống dính Whitford (Mỹ), tay cầm bọc silicon cách nhiệt"
    },
    "reviews": [
      {
        "name": "Nguyễn Thị Mai",
        "rating": 5,
        "date": "28/09/2026",
        "comment": "Chảo chiên trứng không cần dầu vẫn trượt ro ro, đáy từ bắt nhiệt rất nhạy với bếp từ Bosch."
      }
    ]
  },
  {
    "id": "sp-87",
    "name": "Nồi cơm điện nắp gài Sunhouse dung tích 1.8L",
    "brand": "Sunhouse",
    "cat": "gia-dung",
    "orig": 520000,
    "sale": 445000,
    "unit": "Chiếc 1.8L",
    "img": "./images/products/sp-87.png",
    "badge": "Tiết kiệm điện",
    "rate": 4.9,
    "revs": 450,
    "sold": 5600,
    "flash": 0,
    "prog": 75,
    "stock": 45,
    "desc": "Lòng nồi hợp kim nhôm tráng men chống dính kép bền bỉ, công nghệ ủ ấm 3D giữ cơm nóng dẻo suốt 24 giờ mà không bị khô hay ôi thiu.",
    "specs": {
      "origin": "Việt Nam (Sunhouse)",
      "volume": "Dung tích 1.8 Lít (4 - 6 người ăn)",
      "expiry": "Bảo hành 12 tháng tại các TTBH toàn quốc",
      "storage": "Để nơi khô ráo, rút phích cắm sau khi dùng",
      "ingredients": "Vỏ nhựa PP cao cấp cách nhiệt, lòng nồi hợp kim nhôm chống dính"
    },
    "reviews": [
      {
        "name": "Trần Văn Hưng",
        "rating": 5,
        "date": "25/09/2026",
        "comment": "Nấu cơm dẻo thơm chín đều không bị cháy đáy, dung tích 1.8L vừa vặn cho cả nhà 4 người."
      }
    ]
  },
  {
    "id": "sp-88",
    "name": "Ấm đun siêu tốc inox 2 lớp cách nhiệt Lock&Lock 1.8L",
    "brand": "Lock&Lock",
    "cat": "gia-dung",
    "orig": 380000,
    "sale": 299000,
    "unit": "Chiếc 1.8L",
    "img": "./images/products/sp-88.jpg",
    "badge": "Lock&Lock Hàn Quốc",
    "rate": 5,
    "revs": 580,
    "sold": 7200,
    "flash": 1,
    "prog": 94,
    "stock": 50,
    "desc": "Thân ấm 2 lớp chống bỏng tay, ruột ấm bằng inox 304 nguyên khối không mùi, tự ngắt điện an toàn khi nước sôi hoặc cạn nước, đun sôi 1.8L chỉ trong 4 phút.",
    "specs": {
      "origin": "Hàn Quốc (Gia công Trung Quốc / Lock&Lock)",
      "volume": "1.8 Lít, Công suất 1800W",
      "expiry": "Bảo hành chính hãng 24 tháng",
      "storage": "Tránh ngâm đế điện vào nước",
      "ingredients": "Ruột inox 304 thực phẩm cao cấp, vỏ ngoài nhựa chống bỏng"
    },
    "reviews": [
      {
        "name": "Lê Hoàng Quân",
        "rating": 5,
        "date": "29/09/2026",
        "comment": "Ấm đun siêu nhanh, vỏ ngoài sờ không hề nóng, Lock&Lock dùng bền bỉ yên tâm."
      }
    ]
  },
  {
    "id": "sp-89",
    "name": "Bộ 3 hộp thủy tinh chịu nhiệt bảo quản thực phẩm Lock&Lock",
    "brand": "Lock&Lock",
    "cat": "gia-dung",
    "orig": 215000,
    "sale": 175000,
    "unit": "Bộ 3 hộp",
    "img": "./images/products/sp-89.jpg",
    "badge": "Chịu nhiệt 400°C",
    "rate": 5,
    "revs": 620,
    "sold": 8900,
    "flash": 0,
    "prog": 86,
    "stock": 65,
    "desc": "Thủy tinh Borosilicate cao cấp chịu sốc nhiệt lên tới 400°C, dùng an toàn trong lò vi sóng, lò nướng và máy rửa bát, nắp gài 4 cạnh khóa kín chống tràn 100%.",
    "specs": {
      "origin": "Việt Nam (Lock&Lock Living)",
      "volume": "Bộ 3 hộp (400ml, 630ml, 950ml)",
      "expiry": "Độ bền vĩnh cửu",
      "storage": "Mở nắp khi cho vào lò vi sóng",
      "ingredients": "Thủy tinh Borosilicate, nắp nhựa PP không chứa BPA, gioăng silicone"
    },
    "reviews": [
      {
        "name": "Nguyễn Thùy Linh",
        "rating": 5,
        "date": "26/09/2026",
        "comment": "Mang cơm đi làm bằng hộp Lock&Lock không lo canh tràn ra túi, quay lò vi sóng thoải mái."
      }
    ]
  },
  {
    "id": "sp-90",
    "name": "Bộ 10 đôi đũa hợp kim kháng khuẩn mạ vàng phong cách Nhật",
    "brand": "Inochi",
    "cat": "gia-dung",
    "orig": 75000,
    "sale": 59000,
    "unit": "Bộ 10 đôi",
    "img": "./images/products/sp-90.jpg",
    "badge": "Chống mốc 100%",
    "rate": 4.8,
    "revs": 380,
    "sold": 6400,
    "flash": 0,
    "prog": 72,
    "stock": 80,
    "desc": "Chất liệu sợi thủy tinh và hợp kim cao cấp chịu nhiệt 220°C, bề mặt nhám chống trơn trượt khi gắp thức ăn, không bám mỡ, không bao giờ bị ẩm mốc như đũa gỗ.",
    "specs": {
      "origin": "Việt Nam (Inochi Nhật Bản)",
      "volume": "Hộp 10 đôi (Dài 24.3cm)",
      "expiry": "Sử dụng lâu dài",
      "storage": "Rửa sạch sau khi dùng, dùng được máy rửa bát",
      "ingredients": "Sợi thủy tinh cao cấp (Glass Fiber) phủ ion bạc kháng khuẩn"
    },
    "reviews": [
      {
        "name": "Phạm Thúy Hằng",
        "rating": 5,
        "date": "22/09/2026",
        "comment": "Đũa cầm đầm tay, đầu đũa nhám gắp sợi bún hay hột lạc không bị tuột, không lo mốc."
      }
    ]
  },
  {
    "id": "sp-91",
    "name": "Bình giữ nhiệt Inox 316 Lock&Lock Energetic One-Touch 550ml",
    "brand": "Lock&Lock",
    "cat": "gia-dung",
    "orig": 340000,
    "sale": 285000,
    "unit": "Bình 550ml",
    "img": "./images/products/sp-91.jpg",
    "badge": "Inox 316 Y tế",
    "rate": 5,
    "revs": 520,
    "sold": 7800,
    "flash": 1,
    "prog": 96,
    "stock": 60,
    "desc": "Lòng bình làm từ thép không gỉ inox 316 y tế cao cấp chống ăn mòn tuyệt đối, giữ nóng 12 tiếng và giữ lạnh 24 tiếng, nắp bật mở một chạm có khóa an toàn chống rò rỉ.",
    "specs": {
      "origin": "Hàn Quốc (Lock&Lock)",
      "volume": "Dung tích 550ml",
      "expiry": "Bảo hành giữ nhiệt 1 năm",
      "storage": "Tránh va đập mạnh làm móp chân không",
      "ingredients": "Lòng inox 316, thân inox 304, nắp nhựa PP nguyên sinh"
    },
    "reviews": [
      {
        "name": "Vũ Hải Đăng",
        "rating": 5,
        "date": "29/09/2026",
        "comment": "Bình giữ đá từ sáng tới tối tan không đáng kể, ruột 316 bóng loáng không bám mùi cà phê."
      }
    ]
  }
];

// 5. CƠ SỞ DỮ LIỆU ĐỐI TƯỢNG (PRODUCT DATABASE ENGINE)
class ProductDatabase {
    constructor() {
        this._items = [];
        this._indexById = new Map();
        this._indexByCat = new Map();
        this._indexByBrand = new Map();
        this._init();
    }

    _init() {
        let sourceList = _RAW_PRODUCTS;
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                const custom = localStorage.getItem("itmart_custom_products");
                if (custom) {
                    const parsed = JSON.parse(custom);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        sourceList = parsed;
                    }
                }
            }
        } catch (e) {
            console.warn("Could not load custom products from localStorage", e);
        }

        this._rebuildIndexes(sourceList);
    }

    _rebuildIndexes(list) {
        this._items = list.map(r => {
            const cat = r.cat || r.category || "rau-cu";
            return {
                id: r.id,
                name: r.name,
                brand: r.brand || "IT Mart",
                category: cat,
                categoryName: _CAT_MAP.get(cat) || r.categoryName || cat,
                originalPrice: r.orig !== undefined ? r.orig : (r.originalPrice || 0),
                salePrice: r.sale !== undefined ? r.sale : (r.salePrice || 0),
                unit: r.unit || "Hộp",
                image: r.img || r.image || "./images/products/sp-29.jpg",
                badge: r.badge || "",
                rating: Number(r.rate !== undefined ? r.rate : (r.rating || 5.0)),
                reviewsCount: Number(r.revs !== undefined ? r.revs : (r.reviewsCount || 0)),
                soldCount: Number(r.sold !== undefined ? r.sold : (r.soldCount || 0)),
                flashSale: Boolean(r.flash !== undefined ? r.flash : r.flashSale),
                flashProgress: Number(r.prog !== undefined ? r.prog : (r.flashProgress || 45)),
                stock: Number(r.stock !== undefined ? r.stock : 100),
                description: r.desc || r.description || "",
                specs: r.specs || {},
                reviews: r.reviews || []
            };
        });

        this._indexById.clear();
        this._indexByCat.clear();
        this._indexByBrand.clear();

        this._items.forEach(p => {
            this._indexById.set(p.id, p);
            if (!this._indexByCat.has(p.category)) this._indexByCat.set(p.category, []);
            this._indexByCat.get(p.category).push(p);
            if (!this._indexByBrand.has(p.brand)) this._indexByBrand.set(p.brand, []);
            this._indexByBrand.get(p.brand).push(p);
        });
    }

    saveToStorage() {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.setItem("itmart_custom_products", JSON.stringify(this._items));
            }
        } catch (e) {
            console.error("Failed to save products to localStorage", e);
        }
    }

    resetToDefault() {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.removeItem("itmart_custom_products");
            }
        } catch (e) {}
        this._rebuildIndexes(_RAW_PRODUCTS);
        return this._items;
    }

    addProduct(pData) {
        const id = pData.id || `sp-${Date.now().toString().slice(-4)}`;
        const newProduct = {
            id: id,
            name: pData.name,
            brand: pData.brand || "IT Mart",
            category: pData.category || "rau-cu",
            categoryName: _CAT_MAP.get(pData.category) || pData.category,
            originalPrice: Number(pData.originalPrice) || Number(pData.salePrice) || 0,
            salePrice: Number(pData.salePrice) || 0,
            unit: pData.unit || "Món",
            image: pData.image || "./images/products/sp-29.jpg",
            badge: pData.badge || "Mới",
            rating: 5.0,
            reviewsCount: 0,
            soldCount: 0,
            flashSale: Boolean(pData.flashSale),
            flashProgress: 0,
            stock: Number(pData.stock) || 50,
            description: pData.description || "",
            specs: pData.specs || { "Xuất Xứ": "Việt Nam", "Bảo Quản": "Nhiệt độ phòng", "Hạn Sử Dụng": "12 tháng" },
            reviews: []
        };

        this._items.unshift(newProduct);
        this._rebuildIndexes(this._items);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(id, fields) {
        const p = this.findById(id);
        if (!p) return null;

        Object.assign(p, fields);
        if (fields.category) {
            p.categoryName = _CAT_MAP.get(fields.category) || fields.category;
        }
        this._rebuildIndexes(this._items);
        this.saveToStorage();
        return p;
    }

    deleteProduct(id) {
        const idx = this._items.findIndex(p => p.id === id);
        if (idx !== -1) {
            this._items.splice(idx, 1);
            this._rebuildIndexes(this._items);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    addReview(productId, reviewData) {
        const p = this.findById(productId);
        if (!p) return null;

        const rev = {
            id: "REV-" + Date.now(),
            author: reviewData.author || "Khách hàng ẩn danh",
            phone: reviewData.phone ? reviewData.phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2") : "",
            rating: Number(reviewData.rating) || 5,
            comment: reviewData.comment || "",
            date: new Date().toLocaleDateString("vi-VN"),
            verified: true
        };

        if (!p.reviews) p.reviews = [];
        p.reviews.unshift(rev);

        // Cập nhật rating và reviewsCount
        const totalRating = p.reviews.reduce((sum, r) => sum + r.rating, 0);
        p.reviewsCount = p.reviews.length;
        p.rating = Number((totalRating / p.reviewsCount).toFixed(1));

        this._rebuildIndexes(this._items);
        this.saveToStorage();
        return rev;
    }

    // Lấy toàn bộ danh sách sản phẩm
    getAll() {
        return this._items;
    }

    // Tìm theo ID với tốc độ O(1)
    findById(id) {
        return this._indexById.get(id) || null;
    }

    // Lọc theo danh mục với chỉ mục O(1)
    findByCategory(catId) {
        if (!catId || catId === "all") return this._items;
        return this._indexByCat.get(catId) || [];
    }

    // Lọc theo thương hiệu O(1)
    findByBrand(brand) {
        if (!brand || brand === "all" || brand === "Tất cả thương hiệu") return this._items;
        return this._indexByBrand.get(brand) || [];
    }

    // Lấy các sản phẩm Flash Sale
    getFlashSales() {
        return this._items.filter(p => p.flashSale);
    }

    // Tìm kiếm đa năng (Tên, Thương hiệu, Danh mục, Mô tả)
    search(query) {
        if (!query) return this._items;
        const q = query.toLowerCase().trim();
        return this._items.filter(p => 
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            p.categoryName.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
    }

    // Lấy sản phẩm liên quan
    getRelated(currentProduct, limit = 4) {
        if (!currentProduct) return [];
        return this._items
            .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, limit);
    }

    // Thống kê cơ sở dữ liệu
    stats() {
        return {
            totalProducts: this._items.length,
            totalCategories: CATEGORIES.length,
            totalBrands: BRANDS.length,
            flashSaleCount: this.getFlashSales().length
        };
    }
}

// 6. KHỞI TẠO CSDL TOÀN CỤC & TƯƠNG THÍCH HOÀN TOÀN HỆ THỐNG
const ProductDB = new ProductDatabase();
const PRODUCTS = ProductDB.getAll();

if (typeof window !== "undefined") {
    window.ProductDB = ProductDB;
    window.PRODUCTS = PRODUCTS;
    window.CATEGORIES = CATEGORIES;
    window.BRANDS = BRANDS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { ProductDB, PRODUCTS, CATEGORIES, BRANDS };
}