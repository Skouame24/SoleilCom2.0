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
  Building2,
  User,
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

export default function StockOutputsTable() {
  const [outputs, setOutputs] = useState([]);
  const [typeArticles, setTypeArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDirectOpen, setIsDirectOpen] = useState(false);
  const [isIndirectOpen, setIsIndirectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("direct");
  const [newDirectOutput, setNewDirectOutput] = useState({
    designation: "",
    caracteristique: "",
    quantite: "",
    typeArticleId: "",
    sortieDirecte: true,
    motif: "",
    service: "",
  });
  const [newIndirectOutput, setNewIndirectOutput] = useState({
    designation: "",
    caracteristique: "",
    quantite: "",
    typeArticleId: "",
    sortieDirecte: false,
    destinataire: "",
    numeroBonSortie: "",
    dateSortie: "",
    departement: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    fetchOutputs();
    fetchTypeArticles();
  }, [activeTab]);

  const fetchOutputs = () => {
    axios.get("http://localhost:5001/api/sorties")
      .then(response => {
        const filteredOutputs = response.data.sorties.filter(sortie => 
          activeTab === "direct" ? sortie.sortieDirecte : !sortie.sortieDirecte
        );
        setOutputs(filteredOutputs);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des sorties :", error);
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
      await axios.post("http://localhost:5001/api/sorties", newDirectOutput);
      setIsDirectOpen(false);
      fetchOutputs();
      setNewDirectOutput({
        designation: "",
        caracteristique: "",
        quantite: "",
        typeArticleId: "",
        sortieDirecte: true,
        motif: "",
        service: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la sortie directe :", error);
    }
  };

  const handleIndirectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/sorties", newIndirectOutput);
      setIsIndirectOpen(false);
      fetchOutputs();
      setNewIndirectOutput({
        designation: "",
        caracteristique: "",
        quantite: "",
        typeArticleId: "",
        sortieDirecte: false,
        destinataire: "",
        numeroBonSortie: "",
        dateSortie: "",
        departement: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la sortie indirecte :", error);
    }
  };

  const filteredOutputs = outputs.filter(output =>
    Object.values(output).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredOutputs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOutputs = filteredOutputs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-[#4169E1]" />
          <h1 className="text-3xl font-bold text-gray-800">Sorties de Stock</h1>
        </div>
        <p className="text-gray-600 ml-11">Gérez les sorties de stock et leur distribution</p>
      </div>

      <Tabs defaultValue="direct" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="direct" className="text-base">
            <Box className="w-4 h-4 mr-2" />
            Sorties Directes
          </TabsTrigger>
          <TabsTrigger value="indirect" className="text-base">
            <Building2 className="w-4 h-4 mr-2" />
            Sorties Indirectes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="direct">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
              <Dialog open={isDirectOpen} onOpenChange={setIsDirectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4169E1] hover:bg-[#3154b3] text-white rounded-full px-6 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle sortie directe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Nouvelle Sortie Directe</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enregistrez une nouvelle sortie directe de stock
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
                          value={newDirectOutput.designation}
                          onChange={(e) => setNewDirectOutput({ ...newDirectOutput, designation: e.target.value })}
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
                          value={newDirectOutput.caracteristique}
                          onChange={(e) => setNewDirectOutput({ ...newDirectOutput, caracteristique: e.target.value })}
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
                            value={newDirectOutput.quantite}
                            onChange={(e) => setNewDirectOutput({ ...newDirectOutput, quantite: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeArticle">Groupe d'article</Label>
                        <Select
                          value={newDirectOutput.typeArticleId}
                          onValueChange={(value) => setNewDirectOutput({ ...newDirectOutput, typeArticleId: value })}
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
                      <Label htmlFor="motif">Motif de sortie</Label>
                      <div className="relative">
                        <FileDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="motif"
                          placeholder="Raison de la sortie"
                          className="pl-10"
                          value={newDirectOutput.motif}
                          onChange={(e) => setNewDirectOutput({ ...newDirectOutput, motif: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="service"
                          placeholder="Service demandeur"
                          className="pl-10"
                          value={newDirectOutput.service}
                          onChange={(e) => setNewDirectOutput({ ...newDirectOutput, service: e.target.value })}
                          required
                        />
                      </div>
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
                        Enregistrer la sortie
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une sortie..."
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
                      <TableHead className="text-gray-700 font-semibold">Date de sortie</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Désignation</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Caractéristiques</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Quantité</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Service</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Motif</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedOutputs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400 mb-2" />
                            <p>Aucune sortie trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedOutputs.map((output, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50/75 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {new Date(output.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-700">{output.designation}</TableCell>
                          <TableCell className="text-gray-600">{output.caracteristique}</TableCell>
                          <TableCell className="text-gray-700">{output.quantite}</TableCell>
                          <TableCell className="text-gray-700">{output.service}</TableCell>
                          <TableCell className="text-gray-700">{output.motif}</TableCell>
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
                    Nouvelle sortie indirecte
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Nouvelle Sortie Indirecte</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enregistrez une nouvelle sortie indirecte de stock
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
                          value={newIndirectOutput.designation}
                          onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, designation: e.target.value })}
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
                          value={newIndirectOutput.caracteristique}
                          onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, caracteristique: e.target.value })}
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
                            value={newIndirectOutput.quantite}
                            onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, quantite: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeArticle">Groupe d'article</Label>
                        <Select
                          value={newIndirectOutput.typeArticleId}
                          onValueChange={(value) => setNewIndirectOutput({ ...newIndirectOutput, typeArticleId: value })}
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
                      <Label htmlFor="destinataire">Destinataire</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="destinataire"
                          placeholder="Nom du destinataire"
                          className="pl-10"
                          value={newIndirectOutput.destinataire}
                          onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, destinataire: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numeroBonSortie">N° Bon de sortie</Label>
                        <div className="relative">
                          <FileDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="numeroBonSortie"
                            placeholder="Numéro"
                            className="pl-10"
                            value={newIndirectOutput.numeroBonSortie}
                            onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, numeroBonSortie: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateSortie">Date de sortie</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="dateSortie"
                            type="date"
                            className="pl-10"
                            value={newIndirectOutput.dateSortie}
                            onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, dateSortie: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departement">Département</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="departement"
                          placeholder="Département destinataire"
                          className="pl-10"
                          value={newIndirectOutput.departement}
                          onChange={(e) => setNewIndirectOutput({ ...newIndirectOutput, departement: e.target.value })}
                          required
                        />
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
                        Enregistrer la sortie
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une sortie..."
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
                      <TableHead className="text-gray-700 font-semibold">Date de sortie</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Désignation</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Caractéristiques</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Quantité</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Destinataire</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Département</TableHead>
                      <TableHead className="text-gray-700 font-semibold">N° Bon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedOutputs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-32 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400 mb-2" />
                            <p>Aucune sortie trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedOutputs.map((output, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50/75 transition-colors cursor-pointer"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {new Date(output.dateSortie).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-700">{output.designation}</TableCell>
                          <TableCell className="text-gray-600">{output.caracteristique}</TableCell>
                          <TableCell className="text-gray-700">{output.quantite}</TableCell>
                          <TableCell className="text-gray-700">{output.destinataire}</TableCell>
                          <TableCell className="text-gray-700">{output.departement}</TableCell>
                          <TableCell className="text-gray-700">{output.numeroBonSortie}</TableCell>
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