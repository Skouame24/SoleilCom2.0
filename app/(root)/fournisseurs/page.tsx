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
  Building2,
  MapPin,
  Mail,
  Phone,
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
import axios from "axios";

export default function FournisseursTable() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [newFournisseur, setNewFournisseur] = useState({
    nom: "",
    prenom: "",
    email: "",
    contact: "",
    localisation: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = () => {
    axios.get("http://localhost:5001/api/fournisseur")
      .then(response => {
        setFournisseurs(response.data.fournisseurs);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des fournisseurs :", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/fournisseur", newFournisseur);
      setIsOpen(false);
      fetchFournisseurs();
      setNewFournisseur({
        nom: "",
        prenom: "",
        email: "",
        contact: "",
        localisation: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur :", error);
    }
  };

  const filteredFournisseurs = fournisseurs.filter(fournisseur =>
    Object.values(fournisseur).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredFournisseurs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFournisseurs = filteredFournisseurs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {/* <Building2 className="h-8 w-8 text-[#4169E1]" /> */}
          <h1 className="text-3xl font-bold text-gray-800">Base des fournisseurs</h1>
        </div>
        <p className="text-gray-600 ml-11">Gérez efficacement votre réseau de fournisseurs et leurs informations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Action Bar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4169E1] hover:bg-[#3154b3] text-white rounded-full px-6 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un fournisseur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">Nouveau Fournisseur</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Ajoutez un nouveau fournisseur à votre base de données
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="nom"
                        placeholder="Nom"
                        className="pl-10"
                        value={newFournisseur.nom}
                        onChange={(e) => setNewFournisseur({ ...newFournisseur, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="prenom"
                        placeholder="Prénom"
                        className="pl-10"
                        value={newFournisseur.prenom}
                        onChange={(e) => setNewFournisseur({ ...newFournisseur, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={newFournisseur.email}
                      onChange={(e) => setNewFournisseur({ ...newFournisseur, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contact"
                      placeholder="Numéro de téléphone"
                      className="pl-10"
                      value={newFournisseur.contact}
                      onChange={(e) => setNewFournisseur({ ...newFournisseur, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localisation">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="localisation"
                      placeholder="Adresse"
                      className="pl-10"
                      value={newFournisseur.localisation}
                      onChange={(e) => setNewFournisseur({ ...newFournisseur, localisation: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#4169E1] hover:bg-[#3154b3] text-white"
                  >
                    Ajouter le fournisseur
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un fournisseur..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-[#4169E1] focus:ring focus:ring-[#4169E1] focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/75">
                  <TableHead className="text-gray-700 font-semibold">Nom</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Prénom</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Localisation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedFournisseurs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Aucun fournisseur trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedFournisseurs.map((fournisseur, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50/75 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {fournisseur.nom}
                      </TableCell>
                      <TableCell className="text-gray-700">{fournisseur.prenom}</TableCell>
                      <TableCell className="text-gray-600">
                        {fournisseur.email}
                      </TableCell>
                      <TableCell className="text-gray-700">{fournisseur.contact}</TableCell>
                      <TableCell className="text-gray-700">{fournisseur.localisation}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

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
      </div>
    </div>
  );
}