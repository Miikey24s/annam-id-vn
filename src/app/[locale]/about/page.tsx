'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  Download,
  Briefcase,
  GraduationCap,
  Code2,
  Server,
  Cloud,
  Wrench,
  ChevronRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const experienceKeys = [1, 2, 3] as const;

interface SkillCategory {
  labelKey: string;
  icon: typeof Code2;
  items: string[];
}

const skillCategories: SkillCategory[] = [
  {
    labelKey: 'skills_frontend',
    icon: Code2,
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML/CSS'],
  },
  {
    labelKey: 'skills_backend',
    icon: Server,
    items: ['Node.js', 'Python', 'Express', 'PostgreSQL', 'MongoDB', 'REST / GraphQL'],
  },
  {
    labelKey: 'skills_devops',
    icon: Cloud,
    items: ['Docker', 'AWS', 'CI/CD', 'Linux', 'Nginx', 'Vercel'],
  },
  {
    labelKey: 'skills_tools',
    icon: Wrench,
    items: ['Git', 'VS Code', 'Figma', 'Jira', 'Postman', 'Terminal'],
  },
];

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function PageHeader() {
  const t = useTranslations('about');

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Decorative gradient blob */}
      <div
        className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold md:text-5xl">
            <span className="gradient-text">{t('title')}</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bio                                                                */
/* ------------------------------------------------------------------ */

function BioSection() {
  const t = useTranslations('about');

  return (
    <section className="pb-20 sm:pb-28" aria-labelledby="bio-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* Avatar placeholder */}
          <motion.div
            className="shrink-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-56 w-56 overflow-hidden rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 shadow-lg ring-4 ring-surface">
              <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/80">
                AN
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="bio-heading"
              className="text-3xl font-bold text-text md:text-4xl"
            >
              {t('subtitle')}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-text-secondary">
              {t('bio')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience Timeline                                                */
/* ------------------------------------------------------------------ */

function ExperienceSection() {
  const t = useTranslations('about');

  return (
    <section
      className="bg-surface-alt py-20 sm:py-28"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="experience-heading"
          className="text-center text-3xl font-bold text-text md:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Briefcase className="mr-2 inline-block h-7 w-7 text-primary" />
          {t('experience_title')}
        </motion.h2>

        {/* Timeline */}
        <div className="relative mt-14">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-12"
          >
            {experienceKeys.map((idx, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  className={`relative flex flex-col pl-14 md:pl-0 ${
                    isLeft ? 'md:pr-[calc(50%+2rem)]' : 'md:pl-[calc(50%+2rem)]'
                  }`}
                  variants={isLeft ? fadeInLeft : fadeInRight}
                  transition={{ duration: 0.5 }}
                >
                  {/* Dot */}
                  <span
                    className="absolute left-[14px] top-1.5 h-4 w-4 rounded-full border-[3px] border-primary bg-surface md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  />

                  <div className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
                    <span className="text-sm font-semibold text-primary">
                      {t(`experience_${idx}_year` as const)}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-text">
                      {t(`experience_${idx}_role` as const)}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-text-muted">
                      {t(`experience_${idx}_company` as const)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {t(`experience_${idx}_description` as const)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skills Grid                                                        */
/* ------------------------------------------------------------------ */

function SkillsGridSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 sm:py-28" aria-labelledby="skills-grid-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="skills-grid-heading"
          className="text-center text-3xl font-bold text-text md:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          {t('skills_title')}
        </motion.h2>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {skillCategories.map(({ labelKey, icon: Icon, items }) => (
            <motion.div
              key={labelKey}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              variants={scaleIn}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text">
                  {t(labelKey)}
                </h3>
              </div>

              <ul className="mt-5 space-y-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Education                                                          */
/* ------------------------------------------------------------------ */

function EducationSection() {
  const t = useTranslations('about');

  return (
    <section
      className="bg-surface-alt py-20 sm:py-28"
      aria-labelledby="education-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="education-heading"
          className="text-center text-3xl font-bold text-text md:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <GraduationCap className="mr-2 inline-block h-7 w-7 text-primary" />
          {t('education_title')}
        </motion.h2>

        <motion.div
          className="mx-auto mt-12 max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-text">
            {t('education_degree')}
          </h3>
          <p className="mt-1 font-medium text-primary">
            {t('education_school')}
          </p>
          <p className="mt-1 text-sm text-text-muted">{t('education_year')}</p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {t('education_description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Download CV                                                        */
/* ------------------------------------------------------------------ */

function DownloadCVSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="#"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
          >
            <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            {t('download_cv')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      <PageHeader />
      <BioSection />
      <ExperienceSection />
      <SkillsGridSection />
      <EducationSection />
      <DownloadCVSection />
    </>
  );
}
