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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Box,
  Tag,
  Hash,
  FileDown,
  Truck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

export default function StockEntriesTable() {
  const [entries, setEntries] = useState([]);
  const [typeArticles, setTypeArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDirectOpen, setIsDirectOpen] = useState(false);
  const [isIndirectOpen, setIsIndirectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("direct");
  const [newDirectEntry, setNewDirectEntry] = useState({
    designation: "",
    caracteristique: "",
    quantite: "",
    typeArticleId: "",
    entreeDirecte: true,
  });
  const [newIndirectEntry, setNewIndirectEntry] = useState({
    designation: "",
    caracteristique: "",
    quantite: "",
    typeArticleId: "",
    entreeDirecte: false,
    fournisseur: "",
    numeroFacture: "",
    dateFacture: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    fetchEntries();
    fetchTypeArticles();
  }, [activeTab]);

  const fetchEntries = () => {
    axios.get("http://localhost:5001/api/articles")
      .then(response => {
        const filteredEntries = response.data.articles.filter(article => 
          activeTab === "direct" ? article.entreeDirecte : !article.entreeDirecte
        );
        setEntries(filteredEntries);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des entrées :", error);
      });
  };

  const fetchTypeArticles = () => {
    axios.get("http://localhost:5001/api/type")
      .then(response => {
        setTypeArticles(response.data.typeArticles);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des types d'articles :", error);
      });
  };

  const handleDirectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/articles", newDirectEntry);
      setIsDirectOpen(false);
      fetchEntries();
      setNewDirectEntry({
        designation: "",
        caracteristique: "",
        quantite: "",
        typeArticleId: "",
        entreeDirecte: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entrée directe :", error);
    }
  };

  const handleIndirectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/articles", newIndirectEntry);
      setIsIndirectOpen(false);
      fetchEntries();
      setNewIndirectEntry({
        designation: "",
        caracteristique: "",
        quantite: "",
        typeArticleId: "",
        entreeDirecte: false,
        fournisseur: "",
        numeroFacture: "",
        dateFacture: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entrée indirecte :", error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    Object.values(entry).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEntries = filteredEntries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-[#4169E1]" />
          <h1 className="text-3xl font-bold text-gray-800">Entrées de Stock</h1>
        </div>
        <p className="text-gray-600 ml-11">Gérez les entrées de stock et suivez leur historique</p>
      </div>

      <Tabs defaultValue="direct" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="direct" className="text-base">
            <Box className="w-4 h-4 mr-2" />
            Entrées Directes
          </TabsTrigger>
          <TabsTrigger value="indirect" className="text-base">
            <Truck className="w-4 h-4 mr-2" />
            Entrées Indirectes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="direct">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
              <Dialog open={isDirectOpen} onOpenChange={setIsDirectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4169E1] hover:bg-[#3154b3] text-white rounded-full px-6 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle entrée directe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Nouvelle Entrée Directe</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Ajoutez une nouvelle entrée directe dans votre inventaire
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDirectSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Désignation</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="designation"
                          placeholder="Nom de l'article"
                          className="pl-10"
                          value={newDirectEntry.designation}
                          onChange={(e) => setNewDirectEntry({ ...newDirectEntry, designation: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caracteristique">Caractéristiques</Label>
                      <div className="relative">
                        <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="caracteristique"
                          placeholder="Spécifications de l'article"
                          className="pl-10"
                          value={newDirectEntry.caracteristique}
                          onChange={(e) => setNewDirectEntry({ ...newDirectEntry, caracteristique: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantite">Quantité</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="quantite"
                          type="number"
                          placeholder="Quantité"
                          className="pl-10"
                          value={newDirectEntry.quantite}
                          onChange={(e) => setNewDirectEntry({ ...newDirectEntry, quantite: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="typeArticle">Groupe d'article</Label>
                      <Select
                        value={newDirectEntry.typeArticleId}
                        onValueChange={(value) => setNewDirectEntry({ ...newDirectEntry, typeArticleId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeArticles.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDirectOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#4169E1] hover:bg-[#3154b3] text-white"
                      >
                        Ajouter l'entrée
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une entrée..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-[#4169E1] focus:ring focus:ring-[#4169E1] focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/75">
                      <TableHead className="text-gray-700 font-semibold">Date d'entrée</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Désignation</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Caractéristiques</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Quantité</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Groupe d'article</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedEntries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400 mb-2" />
                            <p>Aucune entrée trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedEntries.map((entry, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50/75 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-700">{entry.designation}</TableCell>
                          <TableCell className="text-gray-600">{entry.caracteristique}</TableCell>
                          <TableCell className="text-gray-700">{entry.quantite}</TableCell>
                          <TableCell className="text-gray-700">
                            {typeArticles.find(t => t.id === entry.typeArticleId)?.nom}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="indirect">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
              <Dialog open={isIndirectOpen} onOpenChange={setIsIndirectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4169E1] hover:bg-[#3154b3] text-white rounded-full px-6 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle entrée indirecte
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Nouvelle Entrée Indirecte</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Ajoutez une nouvelle entrée indirecte dans votre inventaire
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleIndirectSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Désignation</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="designation"
                          placeholder="Nom de l'article"
                          className="pl-10"
                          value={newIndirectEntry.designation}
                          onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, designation: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caracteristique">Caractéristiques</Label>
                      <div className="relative">
                        <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="caracteristique"
                          placeholder="Spécifications de l'article"
                          className="pl-10"
                          value={newIndirectEntry.caracteristique}
                          onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, caracteristique: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantite">Quantité</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="quantite"
                            type="number"
                            placeholder="Quantité"
                            className="pl-10"
                            value={newIndirectEntry.quantite}
                            onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, quantite: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeArticle">Groupe d'article</Label>
                        <Select
                          value={newIndirectEntry.typeArticleId}
                          onValueChange={(value) => setNewIndirectEntry({ ...newIndirectEntry, typeArticleId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeArticles.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fournisseur">Fournisseur</Label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fournisseur"
                          placeholder="Nom du fournisseur"
                          className="pl-10"
                          value={newIndirectEntry.fournisseur}
                          onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, fournisseur: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroFacture">N° Facture</Label>
                        <div className="relative">
                          <FileDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="numeroFacture"
                            placeholder="Numéro"
                            className="pl-10"
                            value={newIndirectEntry.numeroFacture}
                            onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, numeroFacture: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFacture">Date Facture</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="dateFacture"
                            type="date"
                            className="pl-10"
                            value={newIndirectEntry.dateFacture}
                            onChange={(e) => setNewIndirectEntry({ ...newIndirectEntry, dateFacture: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsIndirectOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#4169E1] hover:bg-[#3154b3] text-white"
                      >
                        Ajouter l'entrée
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une entrée..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-[#4169E1] focus:ring focus:ring-[#4169E1] focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/75">
                      <TableHead className="text-gray-700 font-semibold">Date d'entrée</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Désignation</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Caractéristiques</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Quantité</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Fournisseur</TableHead>
                      <TableHead className="text-gray-700 font-semibold">N° Facture</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedEntries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400 mb-2" />
                            <p>Aucune entrée trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedEntries.map((entry, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50/75 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-700">{entry.designation}</TableCell>
                          <TableCell className="text-gray-600">{entry.caracteristique}</TableCell>
                          <TableCell className="text-gray-700">{entry.quantite}</TableCell>
                          <TableCell className="text-gray-700">{entry.fournisseur}</TableCell>
                          <TableCell className="text-gray-700">{entry.numeroFacture}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-gray-600 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={`px-4 min-w-[40px] ${
                  currentPage === page
                    ? "bg-[#4169E1] text-white hover:bg-[#3154b3]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-gray-600 hover:bg-gray-50"
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}