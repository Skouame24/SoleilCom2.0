import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Article {
  id: number;
  designation: string;
  caracteristique: string;
  quantite: number;
  typeArticleId: number;
}

interface ArticlesTableProps {
  articles: Article[];
  typeArticles: Record<number, string>;
}

export function ArticlesTable({ articles, typeArticles }: ArticlesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-primary-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary-100 to-primary-50">
              <TableHead className="text-primary-800 font-semibold py-4">Désignation</TableHead>
              <TableHead className="text-primary-800 font-semibold py-4">Caractéristique</TableHead>
              <TableHead className="text-primary-800 font-semibold py-4">Quantité</TableHead>
              <TableHead className="text-primary-800 font-semibold py-4">Type d'article</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedArticles.map((article) => (
              <TableRow 
                key={article.id}
                className="border-b border-primary-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-colors duration-200"
              >
                <TableCell className="font-medium text-primary-800">
                  {article.designation}
                </TableCell>
                <TableCell className="text-primary-600">
                  {article.caracteristique}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      article.quantite > 0 
                        ? "bg-gradient-to-r from-secondary-400 to-secondary-300 text-primary-900 font-medium hover:from-secondary-500 hover:to-secondary-400 transition-colors duration-200"
                        : "bg-gradient-to-r from-red-200 to-red-100 text-red-800 hover:from-red-300 hover:to-red-200"
                    }
                  >
                    {article.quantite}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-primary-600 bg-primary-50 px-2 py-1 rounded-full text-sm">
                    {typeArticles[article.typeArticleId] || "Type inconnu"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-primary-600">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}