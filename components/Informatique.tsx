import { useState, useEffect } from "react";
import axios from "axios";
import { Monitor } from "lucide-react";
import { CategoryLayout } from "@/components/CategoryLayout";
import { ArticlesTable } from "@/components/ArticlesTable";

export default function Informatique() {
  const [articles, setArticles] = useState([]);
  const [typeArticles, setTypeArticles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [articlesResponse, typesResponse] = await Promise.all([
          axios.get("http://localhost:5001/api/articles/category/1"),
          axios.get("http://localhost:5001/api/type")
        ]);

        setArticles(articlesResponse.data.articles);
        const types = typesResponse.data.typeArticles.reduce((acc, type) => {
          acc[type.id] = type.nom;
          return acc;
        }, {});
        setTypeArticles(types);
      } catch (err) {
        setError("Erreur lors de la récupération des données informatiques.");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CategoryLayout
      icon={<Monitor className="h-8 w-8 text-primary-600" />}
      title="Domaine Informatique"
      titleClassName="text-4xl font-bold text-primary-800 relative pb-4 mb-8 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-32 after:h-1 after:bg-secondary-400"
      isLoading={isLoading}
      error={error}
      isEmpty={articles.length === 0}
      className="container mx-auto px-4 py-8"
    >
      <div>
        {/* <div className="bg-primary-50 p-4 border-b border-primary-100">
          <h2 className="text-2xl font-semibold text-primary-700 flex items-center">
            <span>Liste des équipements</span>
            <div className="ml-4 h-1 flex-grow bg-secondary-400 rounded-full opacity-50" />
          </h2>
        </div> */}
        <div >
          <ArticlesTable 
            articles={articles} 
            typeArticles={typeArticles}
            className="w-full divide-y divide-primary-100"
          />
        </div>
      </div>
    </CategoryLayout>
  );
}