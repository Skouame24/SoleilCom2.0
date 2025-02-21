"use client"

import { useState, useEffect } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Communication from "@/components/Communication";
import Informatique from "@/components/Informatique";
import Fourniture from "@/components/Fourniture";
import axios from "axios";

const categoryData = [
  {
    id: 1,
    title: "Informatique",
    image: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Fournitures",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60",
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const promises = categoryData.map(category =>
          axios.get(`http://localhost:5001/api/articles/category/${category.id}`)
            .then(response => {
              const articles = response.data.articles;
              return {
                id: category.id,
                count: articles.reduce((sum: number, article: any) => sum + article.quantite, 0)
              };
            })
        );

        const results = await Promise.all(promises);
        const counts = results.reduce((acc, { id, count }) => {
          acc[id] = count;
          return acc;
        }, {});

        setCategoryCounts(counts);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des counts:', error);
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const renderCategoryComponent = () => {
    switch (selectedCategory?.toLowerCase()) {
      case "informatique":
        return <Informatique />;
      case "fournitures":
        return <Fourniture />;
      case "smartphones":
        return <Communication />;
      default:
        return null;
    }
  };

  if (selectedCategory) {
    return (
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-[#4763E4] hover:text-[#3b52c4] hover:bg-[#4763E4]/10"
          onClick={() => setSelectedCategory(null)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux catégories
        </Button>
        {renderCategoryComponent()}
      </div>
    );
  }

  return (
    <div>
      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#4763E4] to-[#3b52c4] bg-clip-text text-transparent">
          Domaine d&apos;activité
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.map((category) => (
            <CategoryCard 
              key={category.title}
              title={category.title}
              image={category.image}
              count={isLoading ? "..." : categoryCounts[category.id] || 0}
              onClick={() => setSelectedCategory(category.title)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}