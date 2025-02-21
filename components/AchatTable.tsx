"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Eye, 
  Share2, 
  Edit, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  BarChart
} from "lucide-react";
import { useRouter } from 'next/navigation';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="hidden sm:flex hover:bg-[#4F46E5] hover:text-white"
      >
        Premier
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:bg-[#4F46E5] hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>
      
      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-8 hover:bg-[#4F46E5] hover:text-white"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={`w-8 ${
              currentPage === page 
                ? "bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90"
                : "hover:bg-[#4F46E5] hover:text-white"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              className="w-8 hover:bg-[#4F46E5] hover:text-white"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:bg-[#4F46E5] hover:text-white"
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex hover:bg-[#4F46E5] hover:text-white"
      >
        Dernier
      </Button>
    </div>
  );
};

const AchatTable = () => {
  const router = useRouter();
  const [activeAchat, setActiveAchat] = useState(null);
  const [achats, setAchats] = useState([]);
  const [fournisseurMap, setFournisseurMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Changed to 4 items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [achatsRes, fournisseursRes] = await Promise.all([
          axios.get('http://localhost:5001/api/achats'),
          axios.get('http://localhost:5001/api/fournisseur')
        ]);

        const sortedAchats = achatsRes.data.achats.sort((a, b) => b.id - a.id);
        setAchats(sortedAchats);

        const fournisseurMapping = {};
        fournisseursRes.data.fournisseurs.forEach(f => {
          fournisseurMapping[f.id] = `${f.nom} ${f.prenom}`;
        });
        setFournisseurMap(fournisseurMapping);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShare = (id) => {
    router.push(`/facture/achat/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/editer-achat/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchats = achats.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(achats.length / itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (error) {
    return (
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Erreur lors du chargement des achats</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-[#4F46E5] text-white py-4">
        <div className="flex items-center space-x-2">
          <BarChart className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Liste des achats</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#4F46E5]/5">
              <TableRow>
                <TableHead className="w-24 text-[#4F46E5]">N° Achat</TableHead>
                <TableHead className="text-[#4F46E5]">Date</TableHead>
                <TableHead className="text-[#4F46E5]">Fournisseur</TableHead>
                <TableHead className="text-right text-[#4F46E5]">Montant TTC</TableHead>
                <TableHead className="w-[120px] text-center text-[#4F46E5]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(4).fill(null).map((_, index) => (
                  <TableRow key={index}>
                    {Array(5).fill(null).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : currentAchats.length > 0 ? (
                currentAchats.map((achat) => (
                  <React.Fragment key={achat.id}>
                    <TableRow 
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => setActiveAchat(activeAchat === achat.id ? null : achat.id)}
                    >
                      <TableCell className="font-medium">N°{achat.id}</TableCell>
                      <TableCell>{formatDate(achat.dateAchat)}</TableCell>
                      <TableCell>{fournisseurMap[achat.fournisseurId]}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(achat.montantTotal)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:text-[#4F46E5]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAchat(activeAchat === achat.id ? null : achat.id);
                            }}
                          >
                            {activeAchat === achat.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:text-[#4F46E5]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(achat.id);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:text-[#4F46E5]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(achat.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {activeAchat === achat.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="bg-muted/50 p-4 animate-in slide-in-from-top duration-200">
                            <Table>
                              <TableHeader className="bg-[#4F46E5]/5">
                                <TableRow>
                                  <TableHead className="text-[#4F46E5]">Désignation</TableHead>
                                  <TableHead className="text-[#4F46E5]">Catégorie</TableHead>
                                  <TableHead className="text-right text-[#4F46E5]">Quantité</TableHead>
                                  <TableHead className="text-right text-[#4F46E5]">Prix U HT</TableHead>
                                  <TableHead className="text-right text-[#4F46E5]">Remise</TableHead>
                                  <TableHead className="text-right text-[#4F46E5]">TVA</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {achat.articlesData.map((article) => (
                                  <TableRow key={article.articleId}>
                                    <TableCell>{article.designation}</TableCell>
                                    <TableCell>
                                      {article.categorieId === 1 ? 'Informatique' :
                                       article.categorieId === 2 ? 'Fournitures' :
                                       article.categorieId === 3 ? 'Communication' : ''}
                                    </TableCell>
                                    <TableCell className="text-right">{article.quantite}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(article.prix)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(article.remiseArticle)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(article.tvaArticle)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucun achat trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {achats.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AchatTable;