'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Code,
  BookOpen,
  Clock,
  Calendar,
  Code2,
  Layers,
  Palette,
  Server,
  Database,
  Cloud,
  Terminal,
  Container,
  GitBranch,
  Cpu,
  MonitorSmartphone,
  Braces,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const skills = [
  { name: 'React', icon: Braces },
  { name: 'Next.js', icon: Layers },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Node.js', icon: Server },
  { name: 'Python', icon: Terminal },
  { name: 'Docker', icon: Container },
  { name: 'Git', icon: GitBranch },
  { name: 'Tailwind CSS', icon: Palette },
  { name: 'PostgreSQL', icon: Database },
  { name: 'MongoDB', icon: Database },
  { name: 'AWS', icon: Cloud },
  { name: 'Linux', icon: Cpu },
] as const;

interface Project {
  titleKey: string;
  descKey: string;
  tech: string[];
  gradient: string;
  href: string;
}

const projects: Project[] = [
  {
    titleKey: 'project_1_title',
    descKey: 'project_1_description',
    tech: ['Next.js', 'TypeScript', 'Tailwind'],
    gradient: 'from-primary/60 to-secondary/60',
    href: '#',
  },
  {
    titleKey: 'project_2_title',
    descKey: 'project_2_description',
    tech: ['React', 'Node.js', 'MongoDB'],
    gradient: 'from-secondary/60 to-primary/60',
    href: '#',
  },
  {
    titleKey: 'project_3_title',
    descKey: 'project_3_description',
    tech: ['Next.js', 'API', 'Chart.js'],
    gradient: 'from-primary/40 via-secondary/40 to-primary/60',
    href: '#',
  },
];

interface BlogPost {
  titleKey: string;
  excerptKey: string;
  dateKey: string;
  readTime: number;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    titleKey: 'post_1_title',
    excerptKey: 'post_1_excerpt',
    dateKey: 'post_1_date',
    readTime: 5,
    slug: 'building-portfolio-nextjs-15',
  },
  {
    titleKey: 'post_2_title',
    excerptKey: 'post_2_excerpt',
    dateKey: 'post_2_date',
    readTime: 4,
    slug: 'why-typescript-is-must-have',
  },
];

/* ------------------------------------------------------------------ */
/*  Section components                                                 */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)]" />

      {/* Floating decorative blobs */}
      <div
        className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-float"
        style={{ animationDelay: '3s' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-2xl animate-float"
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting */}
          <motion.p
            className="text-lg text-text-secondary md:text-xl"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {t('hero.greeting')}
          </motion.p>

          {/* Name */}
          <motion.h1
            className="mt-3 text-5xl font-bold md:text-7xl"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">{t('hero.name')}</span>
          </motion.h1>

          {/* Role badge */}
          <motion.span
            className="mt-6 inline-block rounded-full bg-primary-light px-5 py-2 text-sm font-semibold text-primary"
            variants={scaleIn}
            transition={{ duration: 0.4 }}
          >
            {t('hero.role')}
          </motion.span>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/projects"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              {t('hero.cta_projects')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-7 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              {t('hero.cta_contact')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SkillsSection() {
  const t = useTranslations('skills');

  return (
    <section className="py-20 sm:py-28" aria-labelledby="skills-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="skills-heading"
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('subtitle')}
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skills.map(({ name, icon: Icon }) => (
            <motion.div
              key={name}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md"
              variants={scaleIn}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-secondary" />
              <span className="text-sm font-medium text-text-secondary">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <section
      className="bg-surface-alt py-20 sm:py-28"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="projects-heading"
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('subtitle')}
          </h2>
          <p className="mt-3 text-text-secondary">{t('description')}</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project) => (
            <motion.article
              key={project.titleKey}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {/* Image placeholder — gradient */}
              <div
                className={`h-48 bg-gradient-to-br ${project.gradient}`}
                aria-hidden="true"
              >
                <div className="flex h-full items-center justify-center">
                  <MonitorSmartphone className="h-12 w-12 text-white/70" />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-text">
                  {t(project.titleKey)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                  {t(project.descKey)}
                </p>

                {/* Tech badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-5 flex gap-4">
                  <a
                    href={project.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    aria-label={`${t('live_demo')} — ${t(project.titleKey)}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('live_demo')}
                  </a>
                  <a
                    href={project.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                    aria-label={`${t('source_code')} — ${t(project.titleKey)}`}
                  >
                    <Code className="h-4 w-4" />
                    {t('source_code')}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            {t('view_all')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function BlogSection() {
  const t = useTranslations('blog');

  return (
    <section className="py-20 sm:py-28" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="blog-heading"
            className="text-3xl font-bold text-text md:text-4xl"
          >
            {t('subtitle')}
          </h2>
          <p className="mt-3 text-text-secondary">{t('description')}</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {t(post.dateKey)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime} {t('min_read')}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-text transition-colors group-hover:text-primary">
                {t(post.titleKey)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                {t(post.excerptKey)}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary-dark"
              >
                <BookOpen className="h-4 w-4" />
                {t('read_more')}
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View all */}
        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            {t('view_all')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ContactCTA() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 sm:py-28" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-gradient-start)] via-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] p-10 text-center shadow-lg sm:p-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={scaleIn}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative blob */}
          <div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h2
              id="cta-heading"
              className="text-3xl font-bold text-text md:text-4xl"
            >
              {t('title')}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-text-secondary">
              {t('description')}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              {t('button')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactCTA />
    </>
  );
}
