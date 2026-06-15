// Đọc giỏ hàng cũ đã lưu từ bộ nhớ trình duyệt nếu có, nếu không có thì khởi tạo mảng rỗng []
let cart = JSON.parse(localStorage.getItem('hometech_cart')) || [];

// Khởi chạy khi website vừa load xong
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCart(); // Cập nhật hiển thị số lượng giỏ hàng ngay khi vừa tải trang
});

// ==========================================================================
// HÀM HIỂN THỊ TRUNG TÂM - THAY THẾ CHO RENDERPRODUCTS CŨ
// ==========================================================================
function renderProducts() {
    const productGrid = document.getElementById('product-grid-container');
    if (!productGrid) return;

    // Kiểm tra dữ liệu đầu vào từ products.js
    if (typeof listProducts === 'undefined') {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--gray);">Lỗi: Không tìm thấy dữ liệu sản phẩm.</p>';
        return;
    }

    // 1. Lấy tất cả giá trị hiện tại từ bộ lọc giao diện công khai
    const searchInput = document.getElementById('search-product');
    const searchKey = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const categorySelect = document.getElementById('filter-category');
    const categoryKey = categorySelect ? categorySelect.value : 'all';

    const priceSelect = document.getElementById('filter-price');
    const priceKey = priceSelect ? priceSelect.value : 'all';

    // 2. Thực hiện lọc đồng thời cả 3 điều kiện: Từ khóa + Danh mục + Mức giá
    const filteredProducts = listProducts.filter(product => {
        // Điều kiện 1: Tìm kiếm theo tên
        const matchSearch = product.name.toLowerCase().includes(searchKey);

        // Điều kiện 2: Kiểm tra danh mục
        const matchCategory = (categoryKey === 'all' || product.category === categoryKey);

        // Điều kiện 3: Kiểm tra khoảng giá
        let matchPrice = true;
        if (priceKey === 'under-3m') {
            matchPrice = product.price < 3000000;
        } else if (priceKey === '3m-5m') {
            matchPrice = (product.price >= 3000000 && product.price <= 5000000);
        } else if (priceKey === 'over-5m') {
            matchPrice = product.price > 5000000;
        }

        return matchSearch && matchCategory && matchPrice;
    });

    // 3. Nếu mảng sau khi lọc trống rỗng thì báo lỗi không tìm thấy
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--gray); padding: 40px 0; font-weight:600;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>';
        return;
    }

    // 4. In danh sách sản phẩm đạt yêu cầu ra màn hình
   productGrid.innerHTML = filteredProducts.map((product, index) => `
    <div class="product-card" style="animation: fadeInUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
        <div class="img-wrapper" onclick="window.location.href='detail.html?id=${product.id}'" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <h3 onclick="window.location.href='detail.html?id=${product.id}'" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--dark)'">${product.name}</h3>
        <p class="price">${product.price.toLocaleString()}đ</p>
        <button class="btn btn-buy" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Thêm vào giỏ hàng</button>
    </div>
`).join('');
}

// ==========================================================================
// CẬP NHẬT CÁC HÀM LIÊN QUAN ĐỂ ĐỒNG BỘ LUỒNG DỮ LIỆU MỚI
// ==========================================================================

// Thay thế hàm filterAdvanced cũ thành hàm kích hoạt render ngắn gọn này
function filterAdvanced() {
    renderProducts(); // Gọi thẳng hàm trung tâm để xử lý dữ liệu động
}

// Cập nhật lại hàm xử lý khi click vào Danh mục ở Trang chủ hoặc Menu chính
function showCategoryPage(categoryName) {
    showPage('product'); // Bật trang sản phẩm lên
    
    // Đồng bộ trạng thái chọn của thẻ <select> trên giao diện
    const catSelect = document.getElementById('filter-category');
    if (catSelect) {
        catSelect.value = categoryName;
    }
    
    // Ép chạy lại bộ lọc trung tâm để quét đúng danh mục vừa bấm
    renderProducts();
}

// Hàm được gọi khi nhấn vào danh mục ở trang chủ
function showCategoryPage(categoryName) {
    showPage('product');
    renderProducts(categoryName);
}

// Chuyển đổi qua lại giữa các trang công khai (SPA trên trang index.html)
function showPage(pageId) {
    // 1. Ẩn tất cả các trang và hiện trang được chọn (giữ nguyên logic cũ của bạn)
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const selectedPage = document.getElementById(pageId);
    if(selectedPage) selectedPage.classList.add('active');

    // 2. Cập nhật trạng thái màu sắc chữ hoạt động trên thanh Menu
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Gỡ màu active của icon tài khoản mặc định
    const accountIcon = document.getElementById('nav-account-icon');
    if (accountIcon) accountIcon.style.color = 'var(--dark)';

    // Nếu bấm vào các tab menu chuẩn thì thắp sáng tab đó lên
    const activeNavLink = document.getElementById(`nav-${pageId}`);
    if(activeNavLink) {
        activeNavLink.classList.add('active');
    } else if (pageId === 'account' && accountIcon) {
        // Nếu chuyển sang trang tài khoản thì thắp sáng icon tài khoản lên màu cam
        accountIcon.style.color = 'var(--primary)';
    }

    // Cuộn mượt màn hình lên đầu trang khi đổi tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ẩn/Hiện sidebar giỏ hàng
function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('open');
}

// Thêm sản phẩm (Gom cụm số lượng thông minh và lưu vào bộ nhớ localStorage)
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    
    // Lưu trạng thái giỏ hàng mới vào trình duyệt
    localStorage.setItem('hometech_cart', JSON.stringify(cart));
    
    updateCart();
    
    if(!document.getElementById('cart-modal').classList.contains('open')) {
        toggleCart();
    }
}

// Cập nhật giao diện giỏ hàng Side-modal trên trang chủ
function updateCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Kiểm tra xem các thẻ đếm số lượng có tồn tại trên trang hiện tại không rồi mới cập nhật
    const cartCountEl = document.getElementById('cart-count');
    const cartCountSideEl = document.getElementById('cart-count-side');
    if (cartCountEl) cartCountEl.innerText = totalCount;
    if (cartCountSideEl) cartCountSideEl.innerText = totalCount;
    
    const cartList = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    
    if (!cartList || !totalEl) return;
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; margin-top:50px; color:var(--gray);">Chưa có sản phẩm nào.</p>';
        totalEl.innerText = '0đ';
        return;
    }

    let total = 0;
    cartList.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:#f8fafc; padding:15px; border-radius:12px;">
                <div style="display:flex; gap:12px; align-items:center;">
                    <img src="${item.image}" style="width:45px; height:45px; object-fit:cover; border-radius:8px;" alt="${item.name}">
                    <div>
                        <p style="font-weight:700; color: var(--dark); margin:0;">${item.name}</p>
                        <p style="color:var(--primary); font-size:0.9rem; margin:2px 0 0 0;">${item.price.toLocaleString()}đ x ${item.quantity}</p>
                    </div>
                </div>
                <i class="fa-solid fa-trash" style="color:#ef4444; cursor:pointer;" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    }).join('');
    totalEl.innerText = total.toLocaleString() + 'đ';
}

// Xóa sản phẩm khỏi giỏ hàng và đồng bộ lại localStorage
function removeFromCart(index) {
    cart.splice(index, 1);
    
    // Cập nhật lại bộ nhớ trình duyệt sau khi xóa
    localStorage.setItem('hometech_cart', JSON.stringify(cart));
    
    updateCart();
    
    if(document.getElementById('checkout-page').classList.contains('active')){
        renderCheckoutSummary();
    }
}

// Chuyển hướng người dùng đến giao diện thanh toán đơn hàng
function goToCheckout() {
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    document.getElementById('cart-modal').classList.remove('open');
    showPage('checkout-page');
    renderCheckoutSummary();
}

// Hiển thị danh sách tóm tắt hàng hóa ở trang thanh toán
function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items-list');
    const totalEl = document.getElementById('checkout-total-price');
    
    if (!container || !totalEl) return;

    if(cart.length === 0) {
        container.innerHTML = '<p style="color:var(--gray)">Không có sản phẩm.</p>';
        totalEl.innerText = '0đ';
        showPage('product');
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="checkout-item-row">
                <span>${item.name} (x${item.quantity})</span>
                <strong>${itemTotal.toLocaleString()}đ</strong>
            </div>
        `;
    }).join('');
    
    totalEl.innerText = total.toLocaleString() + 'đ';
}

// Xử lý hoàn tất đặt hàng đơn hàng
function confirmOrder(event) {
    event.preventDefault();

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('pop-name').innerText = name;
    document.getElementById('pop-phone').innerText = phone;
    document.getElementById('pop-total').innerText = total.toLocaleString() + 'đ';

    document.getElementById('success-modal').classList.add('show');

    // Xóa sạch giỏ hàng trong code và cả trên LocalStorage sau khi đặt thành công
    cart = [];
    localStorage.removeItem('hometech_cart');
    
    updateCart();
    document.querySelector('.checkout-form').reset();
}

// Hàm đóng Popup thông báo khi đặt hàng thành công
function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('show');
    showPage('home');
}

/* --- LOGIC CHATBOX --- */
function toggleChat() {
    document.getElementById('chat-window').classList.toggle('open');
}

function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<div class="chat-message user">${msg}</div>`;
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        chatMessages.innerHTML += `<div class="chat-message bot">Cảm ơn bạn đã quan tâm! Kỹ thuật viên HomeTech tại Đà Nẵng sẽ nhắn tin hỗ trợ trực tiếp cho bạn ngay bây giờ nhé.</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// HÀM ĐIỀU KHIỂN BUNG MENU TƯ VẤN 3 CỔNG CAO CẤP
function toggleConsultationMenu() {
    const menu = document.getElementById('consult-menu');
    const icon = document.getElementById('widget-icon');
    
    // Kiểm tra trạng thái hiện tại dựa trên thuộc tính opacity inline
    if (menu.style.opacity === "1") {
        // Nếu đang mở -> Thực hiện ẩn đi mượt mà
        menu.style.opacity = "0";
        menu.style.visibility = "hidden";
        menu.style.transform = "translateY(20px)";
        icon.className = "fa-solid fa-headset"; // Quay về icon tai nghe ban đầu
    } else {
        // Nếu đang ẩn -> Thực hiện bung lên
        menu.style.opacity = "1";
        menu.style.visibility = "visible";
        menu.style.transform = "translateY(0)";
        icon.className = "fa-solid fa-xmark"; // Biến đổi thành dấu X để đóng
    }
}

// TỰ ĐỘNG XỬ LÝ ẨN MÀN HÌNH INTRO LOGO KHI LOAD TRANG
window.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('motion-preloader');
    
    if (preloader) {
        setTimeout(() => {
            // Tạo hiệu ứng kéo rèm mờ dần và đẩy nhẹ lên trên
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.transform = 'translateY(-20px)';
            
            // Xóa hoàn toàn khỏi DOM sau khi ẩn để không nặng web
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 1500); // 1500ms = 1.5 giây (Thời gian hoàn hảo để xem xong hiệu ứng logo)
    }
});

