# 🐾 Hướng dẫn Cài đặt, Sử dụng & Triển khai (DigitalOcean)

Tài liệu này hướng dẫn chi tiết cách thiết lập, chạy thử dưới local và triển khai (deploy) trang web **paw.annam.id.vn** lên máy chủ **DigitalOcean (DO) Droplet** sử dụng Docker & Nginx.

---

## 1. Yêu cầu Hệ thống & Tài khoản
Trước khi bắt đầu, bạn cần đăng ký các tài khoản dịch vụ sau:
1. **Supabase** (Miễn phí): Dùng làm Database PostgreSQL & Hệ thống xác thực (Auth).
2. **Cloudinary** (Miễn phí): Dùng để lưu trữ, tối ưu hóa dung lượng hình ảnh tự động.
3. **DigitalOcean**: Đã tạo một Droplet chạy Ubuntu (khuyên dùng gói $4 hoặc $6/tháng).
4. **Tên miền (Domain)**: Đã trỏ bản ghi A `paw.annam.id.vn` về IP của Droplet.

---

## 2. Cấu hình biến môi trường (`.env`)
Tạo file `.env` (hoặc `.env.local`) tại thư mục gốc `paw-annam-id-vn/` với nội dung sau:

```env
# ═══ Cấu hình Web App ═══
NEXT_PUBLIC_SITE_URL=https://paw.annam.id.vn
NEXT_PUBLIC_MAIN_SITE_URL=https://annam.id.vn
NODE_ENV=production

# ═══ Cấu hình Database (PostgreSQL từ Supabase) ═══
# URL kết nối trực tiếp (Transaction Mode)
DATABASE_URL="postgresql://postgres.[username]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# ═══ Cấu hình Supabase Auth ═══
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ═══ Cấu hình Cloudinary (Lưu ảnh) ═══
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789123456
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ═══ Email Admin Duy nhất được vào trang Quản lý ═══
ADMIN_EMAIL=annamnguyen204@gmail.com
```

### Cách lấy thông tin biến môi trường:
* **DATABASE_URL & SUPABASE_URL / KEYS**: Vào Supabase Dashboard -> Project Settings -> Database & API.
* **Cloudinary**: Vào Cloudinary Console -> Dashboard để lấy Cloud Name, API Key, và API Secret. Tạo một **Upload Preset** không ký danh (Unsigned) tên là `ml_default` (hoặc tùy chọn) trong Settings -> Upload để hỗ trợ upload từ trình duyệt.

---

## 3. Chạy thử dưới Local (Development)

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Đẩy Database Schema lên Supabase**:
   ```bash
   npx prisma db push
   ```

3. **Gieo dữ liệu mẫu (Seeding)**:
   ```bash
   npx prisma db seed
   ```

4. **Khởi chạy môi trường Dev**:
   ```bash
   npm run dev
   ```
   Mở trình duyệt truy cập `http://localhost:3000`.

---

## 4. Triển khai lên DigitalOcean (Docker & Nginx)

### Bước 4.1: Chuẩn bị trên Droplet
Đăng nhập vào Droplet qua SSH và cài đặt Docker + Docker Compose:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
```

### Bước 4.2: Copy mã nguồn lên Droplet
Bạn có thể dùng Git để clone repo hoặc dùng SCP/SFTP để tải thư mục `paw-annam-id-vn` lên máy chủ.

### Bước 4.3: Build & Chạy Docker Container
Tại thư mục gốc chứa project trên Droplet, chạy lệnh sau:
```bash
# Build image và chạy container ở chế độ background
docker-compose -f docker/docker-compose.yml up -d --build
```
Kiểm tra xem container hoạt động ổn định chưa:
```bash
docker ps
```
*Lúc này, web app sẽ chạy nội bộ tại cổng `3001` trên Droplet.*

### Bước 4.4: Tạo database tables và gieo dữ liệu trên Container
Chạy lệnh di cư (Prisma migrations) và seed trực tiếp bên trong container:
```bash
docker exec -it paw-app npx prisma migrate deploy
docker exec -it paw-app npx prisma db seed
```

### Bước 4.5: Cấu hình Nginx làm Reverse Proxy
Cài đặt Nginx trên Droplet:
```bash
sudo apt install -y nginx
```

Tạo cấu hình virtual host cho subdomain `paw.annam.id.vn`:
```bash
sudo nano /etc/nginx/sites-available/paw.annam.id.vn
```

Dán nội dung sau vào file cấu hình (thay thế cổng `3001` nếu thay đổi):
```nginx
server {
    listen 80;
    server_name paw.annam.id.vn;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kích hoạt cấu hình và khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/paw.annam.id.vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 4.6: Cài đặt SSL miễn phí với Let's Encrypt
Dùng Certbot để tự động lấy và cài đặt chứng chỉ SSL:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d paw.annam.id.vn
```
Chọn tự động redirect HTTP sang HTTPS khi được hỏi. Quá trình triển khai hoàn tất!

---

## 5. Hướng dẫn Sử dụng Website

### 5.1 Giao diện Public (Khách truy cập)
* **Trang chủ (`/`)**: Hiển thị thông tin tổng quan về bé mèo: Tên, tuổi, cân nặng, số ngày bên nhau, và các cột mốc nổi bật mới nhất.
* **Dòng thời gian (`/timeline`)**: Hiển thị toàn bộ kỷ niệm đan xen giữa bài viết nhật ký và các cột mốc đã hoàn thành, xếp theo thời gian từ mới nhất. Hỗ trợ lọc theo loại bài viết.
* **Thư viện ảnh (`/gallery`)**: Nơi chứa những bức ảnh đáng yêu nhất, phân loại theo album hoặc đánh dấu yêu thích. Click vào ảnh sẽ mở Lightbox hỗ trợ chuyển tiếp ảnh bằng phím mũi tên hoặc vuốt màn hình.
* **Cột mốc (`/milestones`)**: Tổng hợp các cột mốc phát triển của mèo. Đặc biệt tích hợp **Máy tính tuổi mèo** quy đổi tuổi mèo sang tuổi người tương đương.
* **Nhật ký (`/journal`)**: Tổng hợp các câu chuyện, bài học chăm sóc mèo định dạng rich-text. Hỗ trợ tìm kiếm bài viết và lọc theo tags.
* **Sức khỏe (`/health`)**: Biểu đồ cân nặng trực quan bằng SVG và lịch trình tiêm chủng, lịch hẹn thăm khám sắp tới.

### 5.2 Giao diện Admin (`/admin`)
* Để đăng nhập, truy cập `/vi/admin/login`.
* Nhập đúng địa chỉ `ADMIN_EMAIL` đã khai báo trong file `.env`. Hệ thống Supabase Auth sẽ gửi một **Magic Link** về hòm thư của bạn. Click vào link để đăng nhập trực tiếp mà không cần mật khẩu.
* Sau khi đăng nhập, hệ thống sẽ đưa bạn đến Bảng điều khiển (Dashboard). Tại đây bạn có thể:
  1. **Thông tin bé mèo**: Chỉnh sửa tên, ngày sinh, giống mèo, tính cách, tiểu sử, cập nhật ảnh đại diện/ảnh bìa.
  2. **Quản lý nhật ký**: Soạn thảo bài viết mới bằng trình soạn thảo Tiptap trực quan, chèn ảnh, viết song ngữ (Tiếng Việt & Tiếng Anh), gắn thẻ tags, chọn cảm xúc của bé trong ngày hôm đó.
  3. **Quản lý thư viện**: Kéo thả nhiều ảnh/video cùng lúc để upload trực tiếp lên Cloudinary/Supabase. Có thể chia album hoặc đánh dấu ảnh yêu thích để xuất hiện trên trang chủ.
  4. **Quản lý cột mốc**: Tick chọn hoàn thành các cột mốc có sẵn (ví dụ: Ngày tiêm phòng đầu tiên, Ngày biết kêu grừ grừ...) hoặc tự tạo cột mốc tùy chỉnh mới.
  5. **Quản lý sức khỏe**: Ghi chép cân nặng (hệ thống tự động vẽ biểu đồ), tạo lịch sử tiêm chủng và đặt lịch hẹn khám định kỳ tiếp theo.
