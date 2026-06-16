const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create default active pet
  const pet = await db.pet.upsert({
    where: { id: "default-cat-id" },
    update: {},
    create: {
      id: "default-cat-id",
      name: "Bé Miu",
      nameEn: "Little Miu",
      species: "cat",
      breed: "Mèo ta (Domestic Shorthair)",
      color: "Mướp cam & Trắng",
      gender: "male",
      birthday: new Date("2026-03-01"),
      adoptionDate: new Date("2026-05-15"),
      weight: 2.1,
      personality: ["Hiếu động", "Tò mò", "Quấn sen"],
      avatarUrl: "/images/mock/gallery-2.jpg",
      coverUrl: null,
      bio: "Hành trình lần đầu nuôi mèo của chúng mình. Lưu trữ tất cả kỷ niệm đẹp cùng bé.",
      bioEn: "Our first journey raising a cat. Preserving all beautiful memories together.",
      isActive: true,
    },
  });

  console.log(`Pet created or verified: ${pet.name}`);

  // 2. Create default albums
  const albumFun = await db.album.upsert({
    where: { id: "album-fun-id" },
    update: {},
    create: {
      id: "album-fun-id",
      petId: pet.id,
      name: "Vui chơi & Nghịch ngợm",
      nameEn: "Playful & Funny",
      sortOrder: 1,
    },
  });

  const albumSleep = await db.album.upsert({
    where: { id: "album-sleep-id" },
    update: {},
    create: {
      id: "album-sleep-id",
      petId: pet.id,
      name: "Ngủ nướng",
      nameEn: "Sleeping Beauty",
      sortOrder: 2,
    },
  });

  console.log("Albums created.");

  // 3. Create predefined milestones
  const predefinedMilestones = [
    {
      id: "ms-welcome",
      title: "Chào đón về nhà mới",
      titleEn: "Welcome Home",
      description: "Bắt đầu cuộc hành trình cùng bé mèo mướp cam siêu đáng yêu.",
      descriptionEn: "Started our wonderful journey with a cute orange tabby.",
      category: "first-time",
      isCompleted: true,
      isPredefined: true,
      date: new Date("2026-05-15"),
      ageAtEvent: "2.5 tháng",
      sortOrder: 1,
    },
    {
      id: "ms-purr",
      title: "Tiếng kêu grừ grừ đầu tiên",
      titleEn: "First Purr",
      description: "Khi được gãi cằm, bé khẽ nhắm mắt và kêu grừ grừ thích thú.",
      descriptionEn: "When getting chin scratches, he closed his eyes and purred.",
      category: "first-time",
      isCompleted: true,
      isPredefined: true,
      date: new Date("2026-05-18"),
      ageAtEvent: "2.5 tháng",
      sortOrder: 2,
    },
    {
      id: "ms-vet",
      title: "Khám sức khỏe lần đầu",
      titleEn: "First Vet Visit",
      description: "Bác sĩ khám tổng quát tai, mắt, họng và cân nặng chuẩn.",
      descriptionEn: "Overall checkup by the vet. Standard health and weight.",
      category: "health",
      isCompleted: true,
      isPredefined: true,
      date: new Date("2026-05-20"),
      ageAtEvent: "2.5 tháng",
      sortOrder: 3,
    },
    {
      id: "ms-vaccine",
      title: "Mũi tiêm phòng đầu tiên",
      titleEn: "First Vaccination",
      description: "Tiêm vắc-xin 4 trong 1 phòng bệnh giảm bạch cầu, hô hấp.",
      descriptionEn: "First 4-in-1 vaccine shot to prevent common diseases.",
      category: "health",
      isCompleted: false,
      isPredefined: true,
      date: null,
      ageAtEvent: null,
      sortOrder: 4,
    },
    {
      id: "ms-nail",
      title: "Cắt móng tay lần đầu",
      titleEn: "First Nail Trim",
      description: "Lần đầu tiên được Sen dùng kiềm cắt móng chân.",
      descriptionEn: "First time getting his claws trimmed.",
      category: "growth",
      isCompleted: false,
      isPredefined: true,
      date: null,
      ageAtEvent: null,
      sortOrder: 5,
    },
    {
      id: "ms-birthday",
      title: "Sinh nhật tròn 1 tuổi",
      titleEn: "First Birthday",
      description: "Cột mốc đánh dấu bé chính thức trưởng thành.",
      descriptionEn: "Celebrating one full year of love and growth.",
      category: "growth",
      isCompleted: false,
      isPredefined: true,
      date: null,
      ageAtEvent: null,
      sortOrder: 6,
    },
  ];

  for (const ms of predefinedMilestones) {
    await db.milestone.upsert({
      where: { id: ms.id },
      update: {
        isCompleted: ms.isCompleted,
        date: ms.date,
        ageAtEvent: ms.ageAtEvent,
      },
      create: {
        ...ms,
        petId: pet.id,
      },
    });
  }

  console.log("Predefined milestones seeded.");

  // 4. Create default journal entries
  const journals = [
    {
      id: "j1",
      title: "Ngày đầu đón bé về nhà mới",
      titleEn: "First day bringing the kitty home",
      slug: "welcome-home",
      content: "<p>Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường suốt cả buổi chiều. Chúng mình đã chuẩn bị cát, đồ ăn hạt đầy đủ nhưng bé chưa chịu ăn gì cả. Hy vọng tối nay bé sẽ quen hơn.</p><p>Chúng mình chưa nghĩ ra tên gì hay, nên tạm thời cứ gọi là Bé Miu nha!</p>",
      contentEn: "<p>Today we brought our kitty home. He was a bit shy and hid under the bed all afternoon. We prepared sand and kibble, but he hasn't eaten anything yet. Hopefully he gets used to it tonight.</p><p>We haven't thought of a name yet, so we just call him Miu for now!</p>",
      excerpt: "Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường...",
      excerptEn: "Today we brought our kitty home. He was a bit shy and hid under the bed...",
      coverImage: "/images/mock/gallery-1.jpg",
      category: "daily",
      tags: ["welcome", "newborn", "cát-mèo"],
      mood: "sleepy",
      readingTime: 2,
      isPublished: true,
      isDraft: false,
      publishedAt: new Date("2026-05-15T10:00:00Z"),
    },
    {
      id: "j2",
      title: "Lần đầu tiên nghe tiếng rừ rừ (purring)",
      titleEn: "Hearing his first purr",
      slug: "first-purr-moment",
      content: "<p>Thật kỳ diệu! Sau 3 ngày trốn tránh, chiều nay khi mình đang làm việc, bé tự bò lại gần rồi dụi đầu vào chân mình. Khi mình đưa tay xoa nhẹ cằm bé, bé nhắm tịt mắt lại rồi phát ra tiếng kêu 'grừ... grừ...' liên tục.</p><p>Đó là âm thanh hạnh phúc nhất mình từng nghe! Bé đã tin tưởng tụi mình rồi.</p>",
      contentEn: "<p>Magical! After 3 days of hiding, this afternoon while I was working, he crawled over and rubbed against my leg. When I scratched his chin, he closed his eyes and purred.</p><p>The happiest sound ever! He finally trusts us.</p>",
      excerpt: "Thật kỳ diệu! Sau 3 ngày trốn tránh, chiều nay bé tự bò lại gần rồi dụi đầu...",
      excerptEn: "Magical! After 3 days of hiding, this afternoon he crawled over and rubbed...",
      coverImage: "/images/mock/gallery-2.jpg",
      category: "daily",
      tags: ["purr", "cuddles", "trust"],
      mood: "happy",
      readingTime: 1,
      isPublished: true,
      isDraft: false,
      publishedAt: new Date("2026-05-18T16:45:00Z"),
    },
  ];

  for (const j of journals) {
    await db.journalEntry.upsert({
      where: { id: j.id },
      update: {},
      create: {
        ...j,
        petId: pet.id,
      },
    });
  }

  console.log("Journal entries seeded.");

  // 5. Create default weight logs
  const weights = [
    { id: "w1", weight: 1.2, date: new Date("2026-05-15"), note: "Cân nặng khi đón về" },
    { id: "w2", weight: 1.4, date: new Date("2026-05-22"), note: "Cân nặng sau 1 tuần" },
    { id: "w3", weight: 1.7, date: new Date("2026-06-01"), note: "Cân đầu tháng 6" },
    { id: "w4", weight: 2.1, date: new Date("2026-06-15"), note: "Khám sức khỏe tiêm vắc-xin" },
  ];

  for (const w of weights) {
    await db.weightLog.upsert({
      where: { id: w.id },
      update: {},
      create: {
        ...w,
        petId: pet.id,
      },
    });
  }

  console.log("Weight logs seeded.");

  // 6. Create default health records
  const healths = [
    {
      id: "h1",
      type: "vet-visit",
      title: "Tẩy giun & Khám tổng quát",
      titleEn: "Initial Deworming & Exam",
      description: "Tai mũi họng sạch sẽ, ký sinh trùng âm tính. Cho uống thuốc giun định kỳ.",
      descriptionEn: "Ears, nose, throat are clear. Parasites negative. Administered deworming tablet.",
      date: new Date("2026-05-20"),
      vetName: "Phòng khám thú y PetCare",
      cost: 150000,
    },
  ];

  for (const h of healths) {
    await db.healthRecord.upsert({
      where: { id: h.id },
      update: {},
      create: {
        ...h,
        petId: pet.id,
      },
    });
  }

  console.log("Health records seeded.");
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
