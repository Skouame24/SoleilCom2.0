"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity,
  Clock, 
  Calendar, 
  Users, 
  Printer,
  Share2,
  Edit,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BarChart
} from "lucide-react";
import { useRouter } from 'next/navigation';

const StatCard = ({ title, value, icon: Icon, isLoading }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
        <div className="p-3 bg-primary/5 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

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

const SalesTable = ({ sales, clientMap, articleMap, isLoading }) => {
  const router = useRouter();
  const [activeSale, setActiveSale] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Changed to show 4 items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const handleViewInvoice = (id) => {
    router.push(`/facture/vente/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/editer-vente/${id}`);
  };

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

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between bg-[#4F46E5] text-white py-4">
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Liste des ventes</h3>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">N° Vente</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Montant TTC</TableHead>
                  <TableHead className="w-[120px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(4).fill(null).map((_, index) => (
                  <TableRow key={index}>
                    {Array(5).fill(null).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          <h3 className="font-semibold text-lg">Liste des ventes</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-[#4F46E5]/5">
              <TableRow>
                <TableHead className="w-24 text-[#4F46E5]">N° Vente</TableHead>
                <TableHead className="text-[#4F46E5]">Date</TableHead>
                <TableHead className="text-[#4F46E5]">Client</TableHead>
                <TableHead className="text-right text-[#4F46E5]">Montant TTC</TableHead>
                <TableHead className="w-[120px] text-center text-[#4F46E5]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <TableRow 
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => setActiveSale(activeSale === sale.id ? null : sale.id)}
                  >
                    <TableCell className="font-medium">N°{sale.id}</TableCell>
                    <TableCell>{formatDate(sale.dateVente)}</TableCell>
                    <TableCell>{clientMap[sale.clientId]}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(sale.montantTotal)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:text-[#4F46E5]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSale(activeSale === sale.id ? null : sale.id);
                          }}
                        >
                          {activeSale === sale.id ? (
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
                            handleViewInvoice(sale.id);
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
                            handleEdit(sale.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {activeSale === sale.id && (
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
                              {sale.articleData.map((articleData) => (
                                <TableRow key={articleData.articleId}>
                                  <TableCell>{articleMap[articleData.articleId]?.designation}</TableCell>
                                  <TableCell>
                                    {articleMap[articleData.articleId]?.categorieId === 1
                                      ? 'Informatique'
                                      : articleMap[articleData.articleId]?.categorieId === 2
                                      ? 'Fournitures'
                                      : 'Communication'}
                                  </TableCell>
                                  <TableCell className="text-right">{articleData.quantite}</TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(articleData.prixVente)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(articleData.remiseArticle)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(articleData.tvaArticle)}
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
              ))}
            </TableBody>
          </Table>
        </div>

        {sales.length > itemsPerPage && (
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

const EtatVente = () => {
  const [stats, setStats] = useState({
    totalVentes: 0,
    ventesDuJour: 0,
    ventesDeLaSemaine: 0,
    clients: [],
  });
  const [sales, setSales] = useState([]);
  const [clientMap, setClientMap] = useState({});
  const [articleMap, setArticleMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const printPage = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salesRes, clientsRes, articlesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/ventes'),
          axios.get('http://localhost:5001/api/clients'),
          axios.get('http://localhost:5001/api/articles'),
        ]);

        const sales = salesRes.data.ventes;
        const clients = clientsRes.data.clients;
        const articles = articlesRes.data.articles;

        const dateDuJour = new Date().toISOString().split('T')[0];
        const dateActuelle = new Date();
        const debutSemaine = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), dateActuelle.getDate() - dateActuelle.getDay());

        setStats({
          totalVentes: sales.length,
          ventesDuJour: sales.filter(vente => vente.dateVente === dateDuJour).length,
          ventesDeLaSemaine: sales.filter(vente => new Date(vente.dateVente) >= debutSemaine).length,
          clients: Array.from(new Set(sales.map(vente => vente.clientId))),
        });

        setSales(sales.sort((a, b) => b.id - a.id));

        const clientMapping = {};
        clients.forEach(client => {
          clientMapping[client.id] = `${client.nom} ${client.prenom}`;
        });
        setClientMap(clientMapping);

        const articleMapping = {};
        articles.forEach(article => {
          articleMapping[article.id] = article;
        });
        setArticleMap(articleMapping);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-red-600">Une erreur est survenue</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 p-8">
      {/* Header */}
      <div className="bg-[#4F46E5] text-white p-8 rounded-lg shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <h1 className="text-2xl font-bold">États des ventes</h1>
              </div>
              <p className="text-white/80">Gérer les espaces liés aux ventes</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 hover:bg-white/90"
              onClick={printPage}
            >
              <Printer className="h-4 w-4" />
              Générer un rapport
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total ventes"
            value={stats.totalVentes}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title="Ventes du jour"
            value={stats.ventesDuJour}
            icon={Clock}
            isLoading={isLoading}
          />
          <StatCard
            title="Ventes de la semaine"
            value={stats.ventesDeLaSemaine}
            icon={Calendar}
            isLoading={isLoading}
          />
          <StatCard
            title="Clients"
            value={stats.clients.length}
            icon={Users}
            isLoading={isLoading}
          />
        </div>

        {/* Table */}
        <div className="mt-8">
          <SalesTable
            sales={sales}
            clientMap={clientMap}
            articleMap={articleMap}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default EtatVente;