import React from "react";
import PawPrint from "./PawPrint";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-3xl bg-surface/40 backdrop-blur-sm relative overflow-hidden py-16">
      {/* Decorative background paw */}
      <PawPrint className="absolute -right-6 -bottom-6 w-24 h-24 text-primary/5 rotate-45 pointer-events-none" />
      <PawPrint className="absolute -left-6 -top-6 w-20 h-20 text-secondary/5 -rotate-12 pointer-events-none" />

      {/* Playful Yarn Ball SVG Vector */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center text-primary animate-float">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-20 h-20"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main yarn ball body */}
          <circle cx="12" cy="12" r="8" className="fill-primary-light/30" />
          {/* Yarn strands wrapped around */}
          <path d="M6 12c3-4 9-4 12 0" />
          <path d="M12 6c-4 3-4 9 0 12" />
          <path d="M5.5 8.5c4-1 9 3 13 8" />
          <path d="M18.5 8.5c-4-1-9 3-13 8" />
          <path d="M9.5 4.5c2 2 3 7 .5 13" />
          {/* Stray tail of yarn */}
          <path d="M16 16c2 1 3 3 2.5 5S14 22 13.5 19s2-3.5 4-4" className="stroke-primary" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      {description && <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action && <div className="relative z-10">{action}</div>}
    </div>
  );
}
