"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Pencil, Plus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";

export default function PurchaseForm() {
  const [types, setTypes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [type, setType] = useState("");
  const [remisePercentage, setRemisePercentage] = useState(0);
  const [tvaPercentage, setTvaPercentage] = useState(18);
  const [remiseTotalPourcent, setRemiseTotalPourcent] = useState(0);
  const [addedArticles, setAddedArticles] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, articlesRes, fournisseursRes] = await Promise.all([
          axios.get("http://localhost:5001/api/type"),
          axios.get("http://localhost:5001/api/articles"),
          axios.get("http://localhost:5001/api/fournisseur"),
        ]);

        setTypes(typesRes.data.typeArticles);
        setArticles(articlesRes.data.articles);
        setFournisseurs(fournisseursRes.data.fournisseurs);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données",
        });
      }
    };

    fetchData();
  }, []);

  const calculateArticleTotals = (price, quantity, remise, tva) => {
    // Calcul du montant HT initial
    const montantHT = price * quantity;
    
    // Calcul de la remise sur l'article
    const montantRemise = (montantHT * remise) / 100;
    
    // Montant HT après remise article
    const montantHTApresRemise = montantHT - montantRemise;
    
    // Calcul de la TVA sur le montant après remise
    const montantTVA = (montantHT * tva) / 100;

    return {
      montantHT,
      montantRemise,
      montantTVA,
      montantTTC: montantHTApresRemise + montantTVA
    };
  };

  const handleAddToTable = () => {
    if (!selectedArticle || selectedQuantity <= 0 || selectedPrice <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement",
      });
      return;
    }

    const articleToAdd = articles.find(
      (article) => article.designation === selectedArticle
    );

    if (articleToAdd) {
      const totals = calculateArticleTotals(
        selectedPrice,
        selectedQuantity,
        remisePercentage,
        tvaPercentage
      );

      const articleData = {
        articleId: articleToAdd.id,
        designation: articleToAdd.designation,
        caracteristique: articleToAdd.caracteristique,
        quantite: selectedQuantity,
        prix: selectedPrice,
        type: type,
        categorieId: articleToAdd.categorieId,
        montantHT: totals.montantHT,
        remiseArticle: totals.montantRemise,
        tvaArticle: totals.montantTVA,
        montantTTC: totals.montantTTC,
        remisePercentage,
        tvaPercentage
      };

      setAddedArticles((prev) => [...prev, articleData]);

      // Réinitialisation des champs
      setSelectedArticle("");
      setSelectedQuantity(1);
      setSelectedPrice(0);
      setType("");
      setRemisePercentage(0);
      setTvaPercentage(18);

      toast({
        title: "Succès",
        description: "Article ajouté au panier",
      });
    }
  };

  const handleDeleteArticle = (index) => {
    setAddedArticles((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Article supprimé",
      description: "L'article a été retiré du panier",
    });
  };

  const handleEditArticle = (index) => {
    const articleToEdit = addedArticles[index];
    setSelectedArticle(articleToEdit.designation);
    setSelectedQuantity(articleToEdit.quantite);
    setSelectedPrice(articleToEdit.prix);
    setType(articleToEdit.type);
    setRemisePercentage(articleToEdit.remisePercentage);
    setTvaPercentage(articleToEdit.tvaPercentage);
    handleDeleteArticle(index);
  };

  const calculateTotals = () => {
    // Total HT avant toute remise
    const totalHT = addedArticles.reduce((sum, article) => sum + article.montantHT, 0);
    
    // Total des remises sur articles
    const totalRemiseArticles = addedArticles.reduce((sum, article) => sum + article.remiseArticle, 0);
    
    // Total TVA
    const totalTVA = addedArticles.reduce((sum, article) => sum + article.tvaArticle, 0);
    
    // Montant HT après remises articles
    const montantHTApresRemiseArticles = totalHT - totalRemiseArticles;
    
    // Calcul de la remise globale
    const remiseGlobale = (montantHTApresRemiseArticles * remiseTotalPourcent) / 100;
    
    // Montant HT final après toutes les remises
    const montantHTFinal = montantHTApresRemiseArticles - remiseGlobale;
    
    // Montant TTC final
    const montantTTC = montantHTFinal + totalTVA;

    return {
      totalHT,
      totalRemiseArticles,
      remiseGlobale,
      totalTVA,
      montantTTC
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFournisseur || !selectedDate || addedArticles.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    try {
      const totals = calculateTotals();
      const achatData = {
        fournisseurId: selectedFournisseur,
        dateAchat: selectedDate,
        articlesData: addedArticles,
        montantHT: totals.totalHT.toFixed(2),
        montantTVA: totals.totalTVA.toFixed(2),
        remiseArticles: totals.totalRemiseArticles.toFixed(2),
        remiseGlobale: totals.remiseGlobale.toFixed(2),
        remiseGlobalePourcent: remiseTotalPourcent,
        montantTotal: totals.montantTTC.toFixed(2)
      };

      const response = await axios.post("http://localhost:5001/api/achats", achatData);

      // Réinitialisation du formulaire
      setSelectedFournisseur("");
      setSelectedDate("");
      setAddedArticles([]);
      setRemisePercentage(0);
      setTvaPercentage(18);
      setSelectedArticle("");
      setSelectedQuantity(1);
      setSelectedPrice(0);
      setType("");
      setRemiseTotalPourcent(0);

      toast({
        title: "Succès",
        description: response.data.message || "Achat enregistré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer l'achat",
      });
    }
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50/20">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-7 w-7 text-yellow-500" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
          Enregistrer un achat
        </h1>
      </div>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Card className="border border-gray-100 hover:border-yellow-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 text-white border-b-2 border-yellow-400/20">
            <h2 className="text-lg font-semibold">Détails Fournisseur</h2>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label className="text-gray-700">Fournisseur</Label>
              <Select
                value={selectedFournisseur}
                onValueChange={setSelectedFournisseur}
              >
                <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300">
                  <SelectValue placeholder="Choisissez un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {fournisseurs.map((f) => (
                    f.id && (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.nom} {f.prenom}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 hover:border-yellow-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">Information Article</h2>
            <Button
              onClick={handleAddToTable}
              disabled={!selectedArticle || selectedQuantity <= 0 || selectedPrice <= 0}
              className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Article</Label>
                <Select
                  value={selectedArticle}
                  onValueChange={setSelectedArticle}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Sélectionnez un article" />
                  </SelectTrigger>
                  <SelectContent>
                    {articles.map((article) => (
                      article.designation && (
                        <SelectItem key={article.id} value={article.designation}>
                          {article.designation}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Quantité</Label>
                <Input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value, 10))}
                  min="1"
                  className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Groupe</Label>
                <Select
                  value={type}
                  onValueChange={setType}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue placeholder="Choisissez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      t.nom && (
                        <SelectItem key={t.id} value={t.nom}>
                          {t.nom}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Prix</Label>
                <Input
                  type="number"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Remise article (%)</Label>
                <Input
                  type="number"
                  value={remisePercentage}
                  onChange={(e) => setRemisePercentage(parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">TVA (%)</Label>
                <Input
                  type="number"
                  value={tvaPercentage}
                  onChange={(e) => setTvaPercentage(parseFloat(e.target.value))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                  <TableRow>
                    <TableHead className="font-semibold text-blue-900">Désignation</TableHead>
                    <TableHead className="font-semibold text-blue-900">Quantité</TableHead>
                    <TableHead className="font-semibold text-blue-900">Prix U HT</TableHead>
                    <TableHead className="font-semibold text-blue-900">Montant HT</TableHead>
                    <TableHead className="font-semibold text-blue-900">Remise</TableHead>
                    <TableHead className="font-semibold text-blue-900">TVA</TableHead>
                    <TableHead className="font-semibold text-blue-900">Montant TTC</TableHead>
                    <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addedArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Aucun article ajouté pour le moment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    addedArticles.map((article, index) => (
                      <TableRow key={index} className="hover:bg-yellow-50/50 transition-colors duration-200">
                        <TableCell className="font-medium">{article.designation}</TableCell>
                        <TableCell>{article.quantite}</TableCell>
                        <TableCell>{article.prix.toFixed(2)} FCFA</TableCell>
                        <TableCell>{article.montantHT.toFixed(2)} FCFA</TableCell>
                        <TableCell>{article.remiseArticle.toFixed(2)} FCFA</TableCell>
                        <TableCell>{article.tvaArticle.toFixed(2)} FCFA</TableCell>
                        <TableCell className="font-medium">{article.montantTTC.toFixed(2)} FCFA</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteArticle(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditArticle(index)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <div className="w-1/2">
            <Card className="border border-gray-100 hover:border-yellow-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardContent className="py-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Remise globale (%)</Label>
                  <Input
                    type="number"
                    value={remiseTotalPourcent}
                    onChange={(e) => setRemiseTotalPourcent(parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    className="border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border border-gray-100 hover:border-yellow-200/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 text-white border-b-2 border-yellow-400/20">
            <h2 className="text-lg font-semibold">Récapitulatif</h2>
          </CardHeader>
          <CardContent className="pt-6">
            {addedArticles.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="font-semibold text-blue-900">Total HT</TableHead>
                      <TableHead className="font-semibold text-blue-900">Remise articles</TableHead>
                      <TableHead className="font-semibold text-blue-900">Remise globale ({remiseTotalPourcent}%)</TableHead>
                      <TableHead className="font-semibold text-blue-900">Total TVA</TableHead>
                      <TableHead className="font-semibold text-blue-900">Montant TTC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-white hover:bg-yellow-50/50 transition-colors duration-200">
                      <TableCell>{totals.totalHT.toFixed(2)} FCFA</TableCell>
                      <TableCell>{totals.totalRemiseArticles.toFixed(2)} FCFA</TableCell>
                      <TableCell>{totals.remiseGlobale.toFixed(2)} FCFA</TableCell>
                      <TableCell>{totals.totalTVA.toFixed(2)} FCFA</TableCell>
                      <TableCell className="font-bold text-blue-900">{totals.montantTTC.toFixed(2)} FCFA</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Aucun article ajouté pour le moment.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-1/3 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow transition-all duration-300 py-6 text-lg"
            disabled={addedArticles.length === 0}
          >
            Enregistrer
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}