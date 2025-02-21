import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { CategoryLayout } from "@/components/CategoryLayout";
import { ArticlesTable } from "@/components/ArticlesTable";

export default function Communication() {
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
          axios.get("http://localhost:5001/api/articles/category/3"),
          axios.get("http://localhost:5001/api/type")
        ]);

        setArticles(articlesResponse.data.articles);
        const types = typesResponse.data.typeArticles.reduce((acc, type) => {
          acc[type.id] = type.nom;
          return acc;
        }, {});
        setTypeArticles(types);
      } catch (err) {
        setError("Erreur lors de la récupération des données de communication.");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CategoryLayout
      icon={<MessageSquare className="h-6 w-6" />}
      title="Domaine Communication"
      isLoading={isLoading}
      error={error}
      isEmpty={articles.length === 0}
    >
      <ArticlesTable articles={articles} typeArticles={typeArticles} />
    </CategoryLayout>
  );
}