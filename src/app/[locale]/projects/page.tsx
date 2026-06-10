'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code, MonitorSmartphone } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type Category = 'all' | 'web' | 'mobile' | 'other';

interface Project {
  id: string;
  name: string;
  desc: string;
  tech: string[];
  category: Exclude<Category, 'all'>;
  github?: string;
  demo?: string;
  gradient: string;
}

const projects: Project[] = [
  {
    id: 'annam-id-vn',
    name: 'annam.id.vn',
    desc: 'Personal portfolio website built with modern tech stack',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    category: 'web',
    github: 'https://github.com/Miikey24s/annam-id-vn',
    demo: 'https://annam.id.vn',
    gradient: 'from-primary to-secondary',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    desc: 'Full-stack task management application with real-time updates',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    category: 'web',
    gradient: 'from-primary to-primary-dark',
  },
  {
    id: 'weather-dashboard',
    name: 'Weather Dashboard',
    desc: 'Beautiful weather app with charts and forecasts',
    tech: ['Next.js', 'Chart.js', 'OpenWeather API'],
    category: 'web',
    gradient: 'from-secondary to-secondary-dark',
  },
  {
    id: 'chat-app',
    name: 'Chat App',
    desc: 'Real-time messaging with end-to-end encryption',
    tech: ['React Native', 'Firebase', 'TypeScript'],
    category: 'mobile',
    gradient: 'from-primary-light to-secondary-light',
  },
  {
    id: 'cli-tools',
    name: 'CLI Tools',
    desc: 'Collection of developer productivity CLI tools',
    tech: ['Node.js', 'TypeScript', 'Commander.js'],
    category: 'other',
    gradient: 'from-secondary to-primary',
  },
  {
    id: 'ecommerce-api',
    name: 'E-commerce API',
    desc: 'RESTful API for e-commerce with authentication',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
    category: 'web',
    gradient: 'from-primary-dark to-secondary-dark',
  },
];

const categories: Category[] = ['all', 'web', 'mobile', 'other'];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const filterLabelMap: Record<Category, string> = {
    all: t('filter_all'),
    web: t('filter_web'),
    mobile: t('filter_mobile'),
    other: t('filter_other'),
  };

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-20 sm:py-28">
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
            <p className="mt-4 text-lg text-text-secondary">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar & grid */}
      <section className="pb-20 sm:pb-28" aria-labelledby="projects-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="projects-heading" className="sr-only">
            {t('subtitle')}
          </h2>

          {/* Filter pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            role="group"
            aria-label="Filter projects by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'
                }`}
                aria-pressed={activeFilter === cat}
              >
                {filterLabelMap[cat]}
              </button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <motion.div
            className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Gradient placeholder image */}
                  <div
                    className={`h-48 bg-gradient-to-br ${project.gradient}`}
                    aria-hidden="true"
                  >
                    <div className="flex h-full items-center justify-center">
                      <MonitorSmartphone className="h-12 w-12 text-white/70" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-text">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                      {project.desc}
                    </p>

                    {/* Tech badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-5 flex gap-3">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                          aria-label={`${t('live_demo')} — ${project.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t('live_demo')}
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
                          aria-label={`${t('source_code')} — ${project.name}`}
                        >
                          <Code className="h-4 w-4" />
                          {t('source_code')}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}
