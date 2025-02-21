"use client"
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
import { Trash2, Pencil, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";


export default function SellForm() {
    
        const [types, setTypes] = useState([]);
        const [articles, setArticles] = useState([]);
        const [clients, setClients] = useState([]);
        const [selectedClient, setSelectedClient] = useState("");
        const [selectedDate, setSelectedDate] = useState("");
        const [selectedArticle, setSelectedArticle] = useState("");
        const [selectedQuantity, setSelectedQuantity] = useState(1);
        const [selectedPrice, setSelectedPrice] = useState(0);
        const [remisePercentage, setRemisePercentage] = useState(0);
        const [tvaPercentage, setTvaPercentage] = useState(18);
        const [remiseTotalPourcent, setRemiseTotalPourcent] = useState(0);
        const [addedArticles, setAddedArticles] = useState([]);
        const [totalRemise, setTotalRemise] = useState(0);
        const [totalTva, setTotalTva] = useState(0);
        const { toast } = useToast();
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const [typesRes, articlesRes, clientsRes] = await Promise.all([
                axios.get("http://localhost:5001/api/type"),
                axios.get("http://localhost:5001/api/articles"),
                axios.get("http://localhost:5001/api/clients"),
              ]);
      
              setTypes(typesRes.data.typeArticles);
              setArticles(articlesRes.data.articles);
              setClients(clientsRes.data.clients);
            } catch (error) {
              console.error("Error fetching data:", error);
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les données",
              });
            }
          };
      
          fetchData();
        }, []);
      
        const handleAddToTable = () => {
          if (selectedArticle && selectedQuantity > 0 && selectedPrice > 0) {
            const articleToAdd = articles.find(
              (article) => article.designation === selectedArticle
            );
            
            if (articleToAdd) {
              const montantHorsTaxeArticle = selectedPrice * selectedQuantity;
              const remiseArticle = (montantHorsTaxeArticle * remisePercentage) / 100;
              const tvaArticle = (montantHorsTaxeArticle * tvaPercentage) / 100;
      
              const articleData = {
                articleId: articleToAdd.id,
                designation: articleToAdd.designation,
                caracteristique: articleToAdd.caracteristique,
                quantite: selectedQuantity,
                prix: selectedPrice,
                typeArticleId: articleToAdd.typeArticleId,
                remiseArticle: remiseArticle,
                tvaArticle: tvaArticle,
              };
      
              setAddedArticles((prev) => [...prev, articleData]);
              setTotalRemise((prev) => prev + remiseArticle);
              setTotalTva((prev) => prev + tvaArticle);
      
              // Reset fields
              setSelectedArticle("");
              setSelectedQuantity(1);
              setSelectedPrice(0);
              setRemisePercentage(0);
              setTvaPercentage(18);
            }
          }
        };
      
        const handleDeleteArticle = (index) => {
          const deletedArticle = addedArticles[index];
          setTotalRemise((prev) => prev - deletedArticle.remiseArticle);
          setTotalTva((prev) => prev - deletedArticle.tvaArticle);
          setAddedArticles((prev) => prev.filter((_, i) => i !== index));
        };
      
        const handleEditArticle = (index) => {
          const articleToEdit = addedArticles[index];
          setSelectedArticle(articleToEdit.designation);
          setSelectedQuantity(articleToEdit.quantite);
          setSelectedPrice(articleToEdit.prix);
          handleDeleteArticle(index);
        };
      
        const handleFormSubmit = async (e) => {
          e.preventDefault();
      
          if (!selectedClient || !selectedDate || addedArticles.length === 0) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Veuillez remplir tous les champs obligatoires",
            });
            return;
          }
      
          try {
            const venteData = {
              clientId: selectedClient,
              articleData: addedArticles.map((article) => ({
                quantite: article.quantite,
                articleId: article.articleId,
                prixVente: article.prix,
                remiseArticle: article.remiseArticle,
                tvaArticle: article.tvaArticle,
              })),
              tauxRemise: totalRemise,
              montantTVA: totalTva,
              dateVente: selectedDate,
              montantTotal: montantTotalTTC,
              remiseTotalPourcent: remiseTotalPourcent,
            };
      
            const response = await axios.post("http://localhost:5001/api/ventes", venteData);
      
            // Reset form
            setSelectedClient("");
            setSelectedDate("");
            setAddedArticles([]);
            setRemisePercentage(0);
            setTvaPercentage(18);
            setSelectedArticle("");
            setSelectedQuantity(1);
            setSelectedPrice(0);
            setRemiseTotalPourcent(0);
            setTotalRemise(0);
            setTotalTva(0);
      
            toast({
              title: "Succès",
              description: response.data.message,
            });
          } catch (error) {
            console.error("Error submitting sale:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible d'enregistrer la vente",
            });
          }
        };
      
        const montantHorsTaxe = addedArticles.reduce(
          (total, article) => total + article.prix * article.quantite,
          0
        );
        const montantTotalTTC = (montantHorsTaxe - (montantHorsTaxe * remiseTotalPourcent / 100)) + totalTva;
        const remiseTotal = (montantTotalTTC * remiseTotalPourcent) / 100;
      
        return (
          <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Enregistrer une vente</h1>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Card>
                <CardHeader className="bg-[#4F46E5] text-white">
                  <h2 className="text-lg font-semibold">Details Client</h2>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          c.id && (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.nom} {c.prenom}
                            </SelectItem>
                          )
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-white">
                  <h2 className="text-lg font-semibold">Article information</h2>
                  <Button
                    onClick={handleAddToTable}
                    disabled={!selectedArticle || selectedQuantity <= 0 || selectedPrice <= 0}
                    className="gradient-button bg-[#4F46E5]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Article</Label>
                      <Select
                        value={selectedArticle}
                        onValueChange={setSelectedArticle}
                      >
                        <SelectTrigger>
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
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value, 10))}
                        min="1"
                      />
                    </div>
      
                    <div className="space-y-2">
                      <Label>Prix de vente</Label>
                      <Input
                        type="number"
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
      
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Remise (%)</Label>
                      <Input
                        type="number"
                        value={remisePercentage}
                        onChange={(e) => setRemisePercentage(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
      
                    <div className="space-y-2">
                      <Label>TVA (%)</Label>
                      <Input
                        type="number"
                        value={tvaPercentage}
                        onChange={(e) => setTvaPercentage(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
      
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Designation</TableHead>
                        <TableHead>Quantite</TableHead>
                        <TableHead>Prix U HT</TableHead>
                        <TableHead>Prix total HT</TableHead>
                        <TableHead>Groupe d&apos;article</TableHead>
                        <TableHead>Article Remise</TableHead>
                        <TableHead>Article TVA</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addedArticles.map((article, index) => (
                        <TableRow key={index}>
                          <TableCell>{article.designation}</TableCell>
                          <TableCell>{article.quantite}</TableCell>
                          <TableCell>{article.prix} Fcfa</TableCell>
                          <TableCell>
                            {(article.prix * article.quantite).toFixed(2)} Fcfa
                          </TableCell>
                          <TableCell>
                            {types.find(t => t.id === article.typeArticleId)?.nom || 'N/A'}
                          </TableCell>
                          <TableCell>{article.remiseArticle.toFixed(2)} Fcfa</TableCell>
                          <TableCell>{article.tvaArticle.toFixed(2)} Fcfa</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteArticle(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditArticle(index)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
      
              <div className="flex justify-center">
                <div className="w-1/2">
                  <Label>Remise 2 (%)</Label>
                  <Input
                    type="number"
                    value={remiseTotalPourcent}
                    onChange={(e) => setRemiseTotalPourcent(parseFloat(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
      
              <Card>
                <CardHeader className="bg-[#4F46E5] text-white">
                  <h2 className="text-lg font-semibold">Gestion Prix</h2>
                </CardHeader>
                <CardContent className="pt-6">
                  {addedArticles.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Montant HT</TableHead>
                          <TableHead>Total remise</TableHead>
                          <TableHead>Montant TVA ({tvaPercentage}%)</TableHead>
                          <TableHead>Montant net TTC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{montantHorsTaxe.toFixed(2)} Fcfa</TableCell>
                          <TableCell>{totalRemise.toFixed(2)} Fcfa</TableCell>
                          <TableCell>{totalTva.toFixed(2)} Fcfa</TableCell>
                          <TableCell>{montantTotalTTC.toFixed(2)} Fcfa</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Aucun article ajouté pour le moment.
                    </p>
                  )}
                </CardContent>
              </Card>
      
              <div className="flex justify-center">
                <Button type="submit" className="gradient-button w-1/3 bg-[#4F46E5]">
                  Enregistrer
                </Button>
              </div>
            </form>
            <Toaster />
          </div>
        );
      }
