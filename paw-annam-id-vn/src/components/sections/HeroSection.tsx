"use client";

import { useTranslations } from "next-intl";
import { Heart, Calendar, Image as ImageIcon, CheckCircle, Award } from "lucide-react";
import Image from "next/image";
import { differenceInDays, differenceInMonths } from "date-fns";
import PawPrint from "../ui/PawPrint";
import { motion } from "framer-motion";

type HeroSectionProps = {
  pet: {
    id: string;
    name: string | null;
    nameEn: string | null;
    species: string;
    breed: string | null;
    color: string | null;
    gender: string | null;
    birthday: Date | null;
    adoptionDate: Date | null;
    weight: number | null;
    personality: string[];
    avatarUrl: string | null;
    coverUrl: string | null;
    bio: string | null;
    bioEn: string | null;
    _count: {
      galleryImages: number;
      milestones: number;
      journalEntries: number;
    };
  };
};

export default function HeroSection({ pet }: HeroSectionProps) {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");

  // Calculate age
  const monthsAge = pet.birthday ? differenceInMonths(new Date(), new Date(pet.birthday)) : 0;
  const daysTogether = pet.adoptionDate ? differenceInDays(new Date(), new Date(pet.adoptionDate)) : 0;

  const displayAge = monthsAge > 0 ? t("age", { months: monthsAge }) : `Newborn`;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gradient-start via-gradient-mid to-gradient-end dark:from-gradient-start dark:via-gradient-mid dark:to-gradient-end pt-8 pb-16 border-b border-border">
      {/* Decorative floating paw prints */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <PawPrint className="absolute top-10 left-10 w-8 h-8 text-primary rotate-12 animate-float" />
        <PawPrint className="absolute bottom-20 right-10 w-12 h-12 text-secondary -rotate-45 animate-float [animation-delay:2s]" />
        <PawPrint className="absolute top-1/2 left-1/3 w-6 h-6 text-primary rotate-45 animate-float [animation-delay:4s]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Cat Image Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative flex-shrink-0"
        >
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary overflow-hidden shadow-lg relative bg-surface-alt flex items-center justify-center">
            {pet.avatarUrl && !pet.avatarUrl.startsWith("/images/mock") ? (
              <Image
                src={pet.avatarUrl}
                alt={pet.name || "Cat"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              // Beautiful SVG fallback drawing of a cat if no avatar is uploaded
              <svg className="w-28 h-28 text-primary/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-3.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" className="hidden" />
                <path d="M12 3a9 9 0 0 0-9 9c0 2.22.8 4.25 2.12 5.84l.03-.04A2.99 2.99 0 0 1 10 15h4a2.99 2.99 0 0 1 4.85 2.8c1.32-1.59 2.12-3.62 2.12-5.8a9 9 0 0 0-9-9zm-3 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            )}
          </div>
          {/* Paw badge overlay */}
          <div className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full shadow-md">
            <Heart className="w-5 h-5 fill-white animate-purr" />
          </div>
        </motion.div>

        {/* Text Info */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold"
            >
              {t("greeting")}{" "}
              <span className="gradient-text">
                {pet.name || "Bé Miu"}
              </span>
            </motion.h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-text-secondary text-sm">
              <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-semibold">
                {displayAge}
              </span>
              {pet.breed && (
                <span className="bg-secondary-light text-secondary px-3 py-1 rounded-full font-semibold">
                  {pet.breed}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
            {pet.bio || t("tagline")}
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 bg-surface/60 backdrop-blur-md border border-border p-4 rounded-2xl max-w-md shadow-sm">
            <div className="text-center">
              <div className="flex justify-center mb-1 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="block text-2xl font-bold text-text">{daysTogether}</span>
              <span className="text-xs text-text-muted">{t("daysTogether")}</span>
            </div>
            <div className="text-center border-x border-border">
              <div className="flex justify-center mb-1 text-secondary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="block text-2xl font-bold text-text">{pet._count.galleryImages}</span>
              <span className="text-xs text-text-muted">{t("photos")}</span>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1 text-primary">
                <Award className="w-5 h-5" />
              </div>
              <span className="block text-2xl font-bold text-text">{pet._count.milestones}</span>
              <span className="text-xs text-text-muted">{t("completedMilestones")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
