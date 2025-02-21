"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, FileDown } from "lucide-react";
import axios from "axios";

export default function InventoryPage() {
  const [articles, setArticles] = useState([]);
  const [typeArticles, setTypeArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, typesRes] = await Promise.all([
        axios.get("http://localhost:5001/api/articles"),
        axios.get("http://localhost:5001/api/type")
      ]);
      setArticles(articlesRes.data.articles);
      setTypeArticles(typesRes.data.typeArticles);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const getTypeName = (typeArticleId) => {
    const typeArticle = typeArticles.find(type => type.id === typeArticleId);
    return typeArticle ? typeArticle.nom : "Type inconnu";
  };

  const getCategoryName = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "Informatique";
      case 2:
        return "Fourniture";
      case 3:
        return "Communication";
      default:
        return "Autre";
    }
  };

  const filteredArticles = articles.filter(article =>
    Object.values(article).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const downloadCSV = () => {
    const headers = ["Désignation", "Quantité", "Domaine activité", "Groupe d'article"];
    const csvData = displayedArticles.map(article => [
      article.designation,
      article.quantite,
      getCategoryName(article.categorieId),
      getTypeName(article.typeArticleId)
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inventaire.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Base des articles</h1>
        </div>
        <Button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un article..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Désignation</TableHead>
              <TableHead className="font-semibold">Quantité</TableHead>
              <TableHead className="font-semibold">Domaine activité</TableHead>
              <TableHead className="font-semibold">Groupe d'article</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package className="h-8 w-8 mb-2" />
                    <p>Aucun article trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-gray-50">
                  <TableCell>{article.designation}</TableCell>
                  <TableCell>{article.quantite}</TableCell>
                  <TableCell>{getCategoryName(article.categorieId)}</TableCell>
                  <TableCell>{getTypeName(article.typeArticleId)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}