# Living content

Website này dùng một content layer tập trung tại `src/lib/content.ts`.

## Thêm project

Thêm một object vào mảng `projects` với `slug`, `title`, `summary`, `kind`, `status`, `year`, `role`, `stack` và `accent`. Các trường `challenge`, `approach`, `outcome`, `learning` có thể bổ sung dần khi đã có thông tin và asset được phép công khai.

## Thêm note

Thêm một object vào mảng `notes` với `slug`, `title`, `excerpt`, `date`, `readTime`, `tag` và `body`. Mỗi trường có bản `vi` và `en` để giữ hai ngôn ngữ đồng bộ.

## Asset checklist

Trước khi công khai asset dự án, kiểm tra quyền chia sẻ, xóa dữ liệu nhạy cảm, che tên khách hàng nếu cần và ưu tiên screenshot có chú thích ngắn. Không đưa credential, token, dữ liệu người dùng hoặc thông tin nội bộ vào repository.

## Quality gate

Sau mỗi lần cập nhật, chạy `npm run lint`, `npx tsc --noEmit` và `npm run build`. Khi deploy bằng Docker, image chỉ build app chính; subproject `paw-annam-id-vn` được loại khỏi context bằng `.dockerignore`.