const listProducts = [
    {
        id: 1,
        name: "Nồi Chiên Không Dầu Premium",
        price: 2490000,
        image: "noi chien.jpg",
        category: "kitchen"
    },
    {
        id: 2,
        name: "Máy Lọc Không Khí AirPurifier",
        price: 3890000,
        image: "may loc.jpg",
        category: "air"
    },
    {
        id: 3,
        name: "Máy Hút Bụi Thông Minh S1",
        price: 6200000,
        image: "may hut bui.jpg",
        category: "clean"
    },
    {
        id: 4, // ID tăng lên thành 4 (Phải duy nhất, không được trùng)
        name: "Máy Xay Sinh Tố Cầm Tay Đa Năng", 
        price: 890000, 
        image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-xay-sinh-to-cam-tay-mini-tefal-bl15fd30_1_.png",
        category: "kitchen" // Tự động chạy vào bộ lọc "Gian Bếp Hiện Đại"
    },
    {
        id: 5, // ID tăng lên thành 5
        name: "Robot Lau Nhà Bản Cao Cấp",
        price: 7500000,
        image: "https://bepvuson.vn/Data/upload/images/robot-hut-bui/qrevo_s_pro.png",
        category: "clean" // Tự động chạy vào bộ lọc "Dọn Dẹp Thông Minh"
    },
    {
        id: 6, // ID tăng lên thành 6
        name: "Lò vi song Stock",
        price: 7500000,
        image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_4_15_638171611723126888_cach-su-dung-lo-vi-song-2.jpg",
        category: "kitchen" // Tự động chạy vào bộ lọc "Gian Bếp Hiện Đại"
    },
    {
        id: 7,
        name: "Máy Tạo Ẩm Phun Sương Siêu Thanh",
        price: 950000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPcMSbytCLY781QAFbqTsGJ-wyeUpCTidl-TN-fIBZAZe-I1CbyiZfSo&s=10",
        category: "air"
    },
    {
        id: 8,
        name: "Robot Lau Nhà B567",
        price: 8990000,
        image: "https://mi360.vn/wp-content/uploads/2025/08/Robot-hut-bui-lau-nha-Ecovacs-Deebot-T50-Pro-Omni.jpg",
        category: "clean"
    },
    {
        id: 9,
        name: "Máy Hút Bụi Cầm Tay Không Dây",
        price: 1850000,
        image: "https://hakawa.vn/wp-content/uploads/2023/11/may-hut-bui-k7.webp",
        category: "clean"
    },

    // ─── 3 SẢN PHẨM KITCHEN MỚI THÊM ───
    {
        id: 10,
        name: "Bếp Từ Đôi Cảm Ứng Thông Minh",
        price: 8900000,
        image: "https://trandinh.vn/wp-content/uploads/2022/09/bep-tu-doi-sunhouse-shb9122mt-I8F4rE-1.png",
        category: "kitchen"
    },
    {
        id: 11,
        name: "Máy Pha Cà Phê Espresso Tự Động",
        price: 5200000,
        image: "https://beplephan.com/wp-content/uploads/2019/11/may-pha-cafe-philips-ep222140-1.webp",
        category: "kitchen"
    },
    {
        id: 12,
        name: "Ấm Siêu Tốc Giữ Nhiệt Khóa Thông Minh",
        price: 850000,
        image: "https://cdn2.fptshop.com.vn/unsafe/2023_8_29_638289234596800288_binh-dun-sieu-toc-thuy-tinh-sunhouse-18l-shd1215b-dd.jpg",
        category: "kitchen"
    }
];