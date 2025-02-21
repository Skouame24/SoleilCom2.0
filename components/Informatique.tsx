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
      icon={<Monitor className="h-6 w-6" />}
      title="Domaine Informatique"
      isLoading={isLoading}
      error={error}
      isEmpty={articles.length === 0}
    >
      <ArticlesTable articles={articles} typeArticles={typeArticles} />
    </CategoryLayout>
  );
}