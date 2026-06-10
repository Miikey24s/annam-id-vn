export interface Project {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  category: "web" | "mobile" | "other";
  github?: string;
  demo?: string;
  gradient: string;
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  tags?: string[];
  locale: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}
