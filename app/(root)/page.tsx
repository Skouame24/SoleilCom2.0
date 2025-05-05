'use client';

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
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-7xl ">
          <Button
            variant="ghost"
            className="mb-4 -ml-2 text-blue-800 hover:text-blue-900 hover:bg-yellow-100 transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux catégories
          </Button>
        </div>
        <div className="flex-1 w-full">
          {renderCategoryComponent()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)]">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            Domaine d&apos;activité
          </h1>
          <div className="h-1.5 w-48 mx-auto bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {categoryData.map((category) => (
            <div key={category.title} className="transform hover:scale-105 transition-transform duration-300">
              <CategoryCard 
                title={category.title}
                image={category.image}
                count={isLoading ? "..." : categoryCounts[category.id] || 0}
                onClick={() => setSelectedCategory(category.title)}
              />
            </div>
          ))} 
        </div>
      </main>
    </div>
  );
}