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
      className="group cursor-pointer overflow-hidden rounded-xl hover:shadow-xl hover:shadow-[#4763E4]/10 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-white">
              {title}
            </h3>
            <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {count}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}