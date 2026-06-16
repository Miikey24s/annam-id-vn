import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên bé"),
  nameEn: z.string().optional().nullable(),
  species: z.string().default("cat"),
  breed: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  gender: z.string().default("unknown"),
  birthday: z.string().optional().nullable(),
  adoptionDate: z.string().optional().nullable(),
  weight: z.string().or(z.number()).optional().nullable(),
  personality: z.array(z.string()).default([]),
  avatarUrl: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  bioEn: z.string().optional().nullable(),
});

export const journalSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài viết"),
  titleEn: z.string().optional().nullable(),
  slug: z.string().min(1, "Vui lòng nhập slug bài viết"),
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
  contentEn: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  excerptEn: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().default("daily"),
  tags: z.array(z.string()).default([]),
  mood: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  isDraft: z.boolean().default(true),
});

export const milestoneSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề cột mốc"),
  titleEn: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  ageAtEvent: z.string().optional().nullable(),
  isCompleted: z.boolean().default(false),
});

export const weightSchema = z.object({
  weight: z.number().min(0.01, "Cân nặng phải lớn hơn 0"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  note: z.string().optional().nullable(),
});

export const healthSchema = z.object({
  type: z.string().min(1, "Vui lòng chọn loại hồ sơ"),
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  titleEn: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  date: z.string().min(1, "Vui lòng chọn ngày thực hiện"),
  nextDate: z.string().optional().nullable(),
  vetName: z.string().optional().nullable(),
  cost: z.string().or(z.number()).optional().nullable(),
});
