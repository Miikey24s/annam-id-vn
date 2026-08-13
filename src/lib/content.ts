export type Locale = "vi" | "en";
export type LocalizedText = Record<Locale, string>;
export type ProjectKind = "enterprise" | "dashboard" | "mobile" | "game" | "tool" | "experiment";
export type ProjectStatus = "featured" | "active" | "lab" | "archived";
export type ProjectAccent = "orange" | "lilac" | "yellow";

export type ProjectImage = {
  src: string;
  alt: LocalizedText;
};

export type Project = {
  slug: string;
  title: string;
  summary: LocalizedText;
  kind: ProjectKind;
  status: ProjectStatus;
  year: string;
  role: LocalizedText;
  stack: string[];
  accent: ProjectAccent;
  featured?: boolean;
  image?: ProjectImage;
  gallery?: ProjectImage[];
  challenge?: LocalizedText;
  approach?: LocalizedText;
  outcome?: LocalizedText;
  learning?: LocalizedText;
  links?: { repo?: string; demo?: string };
};

export type Note = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText[];
  tag: LocalizedText;
  date: string;
  readTime: number;
};

export const capabilities: readonly LocalizedText[] = [
  { vi: "Hệ thống nghiệp vụ", en: "Business systems" },
  { vi: "Dashboard dữ liệu", en: "Data dashboards" },
  { vi: "Luồng mobile", en: "Mobile workflows" },
  { vi: "Tool và thử nghiệm", en: "Tools and experiments" },
];

export const projects: readonly Project[] = [
  {
    slug: "gtas-vpp",
    title: "GTAS VPP",
    summary: {
      vi: "Hệ thống quản lý văn phòng phẩm doanh nghiệp, hỗ trợ lập và duyệt yêu cầu, danh mục, bảng giá, phân quyền và tổng hợp số liệu.",
      en: "An enterprise office-supplies system for requests, approvals, catalog and pricing, permissions, and operational summaries.",
    },
    kind: "enterprise",
    status: "featured",
    year: "2026",
    role: { vi: "Đồ án luận văn và phát triển full-stack", en: "Graduation-thesis project and full-stack development" },
    stack: [".NET 10", "ASP.NET Core", "Blazor Server", "EF Core", "SQL Server", "Radzen", "Docker"],
    accent: "orange",
    featured: true,
    image: {
      src: "/projects/gtas-vpp/department-summary.png",
      alt: { vi: "Màn hình tổng hợp theo phòng ban của GTAS VPP", en: "GTAS VPP department summary screen" },
    },
    gallery: [
      {
        src: "/projects/gtas-vpp/my-orders.png",
        alt: { vi: "Màn hình đơn yêu cầu của tôi trong GTAS VPP", en: "GTAS VPP my-requests screen" },
      },
      {
        src: "/projects/gtas-vpp/department-summary.png",
        alt: { vi: "Màn hình tổng hợp theo phòng ban của GTAS VPP", en: "GTAS VPP department summary screen" },
      },
    ],
    challenge: {
      vi: "Tổ chức các luồng yêu cầu và phê duyệt cùng danh mục, bảng giá, phân quyền và số liệu tổng hợp trong một hệ thống doanh nghiệp.",
      en: "Organize request and approval flows alongside catalog, pricing, permission, and summary data in one enterprise system.",
    },
    approach: {
      vi: "Tách backend ASP.NET Core, frontend Blazor Server, DTO dùng chung, test suite, Docker Compose và tài liệu vận hành trong cùng repository.",
      en: "Separate an ASP.NET Core backend, Blazor Server frontend, shared DTOs, test suite, Docker Compose, and operations documentation in one repository.",
    },
    outcome: {
      vi: "Bằng chứng public gồm source code, bộ kiểm thử, sơ đồ kiến trúc và ảnh giao diện thuộc luận văn; nội dung nội bộ không được đưa lên portfolio.",
      en: "Public evidence includes source code, tests, architecture diagrams, and thesis screenshots; internal operational data is excluded from this portfolio.",
    },
    learning: {
      vi: "Hệ thống vận hành cần mô hình hóa vai trò, trạng thái và điểm kiểm tra rõ ràng trước khi tối ưu giao diện.",
      en: "Operational systems benefit from clear roles, states, and checkpoints before surface-level UI optimization.",
    },
    links: { repo: "https://github.com/Miikey24s/gtas_vpp" },
  },
  {
    slug: "smartvpp-mobile",
    title: "SmartVPP Mobile",
    summary: {
      vi: "Workspace Flutter độc lập cho ứng dụng văn phòng phẩm thiên về kho, barcode/QR, đồng bộ Firebase và luồng OCR hóa đơn.",
      en: "An independent Flutter workspace for a warehouse-focused office-supplies app with barcode/QR, Firebase sync, and invoice OCR flows.",
    },
    kind: "mobile",
    status: "active",
    year: "2026",
    role: { vi: "Phát triển ứng dụng mobile", en: "Mobile application development" },
    stack: ["Flutter", "Dart", "Firebase", "Firestore", "mobile_scanner", "OCR"],
    accent: "lilac",
    featured: true,
    challenge: {
      vi: "Đưa các thao tác kho và giao dịch lên mobile mà vẫn giữ ứng dụng độc lập với hệ thống VPP hiện có.",
      en: "Bring warehouse and transaction workflows to mobile while keeping the workspace independent from the existing VPP system.",
    },
    approach: {
      vi: "Xây dựng app shell, domain model, Firebase boundary, barcode/QR camera flow, OCR capture flow và trạng thái mất kết nối.",
      en: "Build an app shell, domain models, Firebase boundary, camera barcode/QR flow, OCR capture flow, and a no-connection state.",
    },
    outcome: {
      vi: "Repository public có scaffold độc lập và widget test; Firebase runtime values và OCR endpoint thật vẫn là cấu hình cần hoàn thiện.",
      en: "The public repository contains an independent scaffold and widget tests; Firebase runtime values and a real OCR endpoint remain configuration work.",
    },
    learning: {
      vi: "Tách ranh giới cấu hình cloud và OCR giúp prototype tiến triển mà không hard-code credential vào ứng dụng.",
      en: "Keeping cloud and OCR configuration behind boundaries lets the prototype progress without hard-coding credentials into the app.",
    },
    links: { repo: "https://github.com/Miikey24s/gtas_vpp_mobile" },
  },
  {
    slug: "mbi-dashboard",
    title: "MBI Dashboard",
    summary: {
      vi: "Nền tảng BI full-stack cho upload dữ liệu, xây dashboard kéo-thả, truy vấn tổng hợp và xuất báo cáo PDF/PNG.",
      en: "A full-stack BI platform for data upload, drag-and-drop dashboards, aggregated queries, and PDF/PNG report export.",
    },
    kind: "dashboard",
    status: "archived",
    year: "2025",
    role: { vi: "Phát triển full-stack", en: "Full-stack development" },
    stack: ["Next.js", "React", "NestJS", "TypeORM", "MySQL", "ECharts", "Docker Compose"],
    accent: "yellow",
    featured: true,
    challenge: {
      vi: "Biến dữ liệu bảng thành báo cáo trực quan, có thể cấu hình và tách biệt theo tổ chức.",
      en: "Turn tabular data into configurable visual reports while keeping organizational data separated.",
    },
    approach: {
      vi: "Kết hợp upload Excel/CSV, nhận diện cột, query engine, report builder kéo-thả, xác thực JWT và Docker Compose.",
      en: "Combine Excel/CSV upload, column detection, a query engine, drag-and-drop report builder, JWT authentication, and Docker Compose.",
    },
    outcome: {
      vi: "Repository public mô tả tám loại biểu đồ, export PDF/PNG, report templates và kiến trúc Next.js + NestJS + MySQL.",
      en: "The public repository documents eight chart types, PDF/PNG export, report templates, and a Next.js + NestJS + MySQL architecture.",
    },
    learning: {
      vi: "Dashboard có ích khi luồng từ dữ liệu đến quyết định được ưu tiên hơn số lượng widget.",
      en: "A dashboard becomes useful when the path from data to decision matters more than the number of widgets.",
    },
    links: { repo: "https://github.com/Miikey24s/MBI_Dashboard" },
  },
  {
    slug: "minesweeper-winforms",
    title: "Minesweeper — Dò Mìn",
    summary: {
      vi: "Đồ án C# WinForms tái hiện trò Dò Mìn với nhiều độ khó, lưu game, tài khoản, bảng xếp hạng và custom control.",
      en: "A C# WinForms Minesweeper project with difficulty levels, saved games, accounts, ranking, and custom controls.",
    },
    kind: "game",
    status: "archived",
    year: "2024",
    role: { vi: "Đồ án nhóm môn Tin học cơ sở", en: "Foundations of Computing group project" },
    stack: ["C#", ".NET Framework 4.7.2", "WinForms", "File storage"],
    accent: "lilac",
    challenge: {
      vi: "Tổ chức game loop, quản lý trạng thái bàn cờ, lưu tiến trình và giao diện desktop trong phạm vi đồ án cơ sở.",
      en: "Organize the game loop, board state, saved progress, and a desktop UI within a foundational course project.",
    },
    approach: {
      vi: "Tách Forms, Models, Services, custom control và Resources; xây dựng các mức chơi, bàn cờ tùy chỉnh, lưu/load và leaderboard.",
      en: "Separate Forms, Models, Services, custom controls, and Resources; build difficulty levels, custom boards, save/load, and a leaderboard.",
    },
    outcome: {
      vi: "Repository public bao gồm solution WinForms, game logic, timer, trạng thái thắng/thua và tài nguyên giao diện.",
      en: "The public repository includes the WinForms solution, game logic, timer, win/loss handling, and UI resources.",
    },
    learning: {
      vi: "Game nhỏ là môi trường tốt để học cách cô lập state, event và feedback cho người dùng.",
      en: "Small games are a useful environment for learning to isolate state, events, and user feedback.",
    },
    links: { repo: "https://github.com/Miikey24s/DA_TinHoc_Nhom6_Minesweeper" },
  },
];

export const notes: readonly Note[] = [
  {
    slug: "designing-for-the-next-change",
    title: { vi: "Thiết kế cho lần thay đổi tiếp theo", en: "Designing for the next change" },
    excerpt: { vi: "Một hệ thống tốt không chỉ chạy được hôm nay; nó còn phải chịu được ngày mai.", en: "A good system does more than run today; it leaves room for tomorrow." },
    body: [{ vi: "Khi xây một hệ thống, thay đổi là điều chắc chắn. Mình ưu tiên ranh giới rõ giữa UI, domain, data và cấu hình để lần thay đổi tiếp theo không trở thành một lần viết lại toàn bộ.", en: "When building a system, change is certain. I prefer clear boundaries between UI, domain, data, and configuration so the next change does not become a full rewrite." }, { vi: "Website này cũng được tổ chức theo cùng nguyên tắc: thêm project hoặc note không đòi hỏi copy lại layout.", en: "This website follows the same principle: adding a project or note should not require copying the layout again." }],
    tag: { vi: "Tư duy sản phẩm", en: "Product thinking" }, date: "2026-08-10", readTime: 4,
  },
  {
    slug: "small-feedback-loops",
    title: { vi: "Feedback loop nhỏ, tiến bộ đều", en: "Small feedback loops, steady progress" },
    excerpt: { vi: "Không phải mọi lần cập nhật đều cần là một bản phát hành lớn.", en: "Not every update needs to be a major release." },
    body: [{ vi: "Một thay đổi nhỏ có baseline, kiểm tra và review rõ ràng thường đáng tin hơn một lần làm lớn nhưng thiếu vòng phản hồi.", en: "A small change with a baseline, checks, and a clear review is often more reliable than a large change with no feedback loop." }, { vi: "Đây cũng là cách mình muốn duy trì website này: cập nhật ngắn, có mục tiêu và có thể xác minh.", en: "It is also how I want to maintain this website: small updates with a purpose and a verifiable result." }],
    tag: { vi: "Nhật ký build", en: "Build log" }, date: "2026-08-08", readTime: 3,
  },
  {
    slug: "from-dashboard-to-decision",
    title: { vi: "Từ dashboard đến quyết định", en: "From dashboard to decision" },
    excerpt: { vi: "Một màn hình nhiều dữ liệu chưa chắc đã giúp người dùng nhìn rõ hơn.", en: "A data-heavy screen does not automatically create a clearer view." },
    body: [{ vi: "Dashboard cần làm nổi bật câu hỏi quan trọng, trạng thái đáng chú ý và hành động tiếp theo.", en: "A dashboard should surface the important question, noteworthy state, and next action." }, { vi: "Biểu đồ chỉ hữu ích khi nó giúp người dùng đi đến một quyết định có căn cứ.", en: "A chart is useful only when it helps a person reach a grounded decision." }],
    tag: { vi: "Data product", en: "Data product" }, date: "2026-08-06", readTime: 4,
  },
];

export const statusLabel: Record<ProjectStatus, LocalizedText> = {
  featured: { vi: "Nổi bật", en: "Featured" },
  active: { vi: "Đang làm", en: "Active" },
  lab: { vi: "Thử nghiệm", en: "Lab" },
  archived: { vi: "Lưu trữ", en: "Archived" },
};

export const kindLabel: Record<ProjectKind, LocalizedText> = {
  enterprise: { vi: "Enterprise", en: "Enterprise" },
  dashboard: { vi: "Dashboard", en: "Dashboard" },
  mobile: { vi: "Mobile", en: "Mobile" },
  game: { vi: "Game", en: "Game" },
  tool: { vi: "Tool", en: "Tool" },
  experiment: { vi: "Thử nghiệm", en: "Experiment" },
};

export function copy(value: LocalizedText, locale: string): string {
  return value[locale === "en" ? "en" : "vi"];
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}
