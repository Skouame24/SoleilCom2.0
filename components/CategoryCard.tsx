"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  count: number | string;
  onClick: () => void;
}

export function CategoryCard({ title, image, count, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300
                 hover:shadow-[0_20px_40px_-15px_rgba(71,99,228,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.15)]
                 bg-white dark:bg-slate-900"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay gradient avec animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/80 via-transparent to-transparent 
                      opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Contenu avec animation */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-white group-hover:text-[#fbbf24] transition-colors duration-300">
              {title}
            </h3>
            <span className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-1.5 rounded-full text-sm font-semibold
                           shadow-lg transform transition-all duration-300 group-hover:scale-105
                           group-hover:bg-white">
              {count}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CategoryCard;