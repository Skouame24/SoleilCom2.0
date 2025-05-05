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
import { Search, Plus, ChevronLeft, ChevronRight, Building2, MapPin, Mail, Phone, User, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: "",
    prenom: "",
    email: "",
    contact: "",
    adresse: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get("http://localhost:5001/api/clients")
      .then(response => {
        const data = response.data.clients || [];
        setClients(data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des clients :", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/clients", newClient);
      setIsOpen(false);
      fetchClients();
      setNewClient({
        nom: "",
        prenom: "",
        email: "",
        contact: "",
        adresse: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du client :", error);
    }
  };

  const filteredClients = clients.filter(client =>
    Object.values(client).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-7 w-7 text-yellow-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
            Base des clients
          </h1>
        </div>
        <p className="text-primary-600 ml-9">Gérez efficacement votre réseau de clients et leurs informations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-yellow-200/50 transition-all duration-300">
        {/* Action Bar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow transition-all duration-300 rounded-full px-6 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
                  Nouveau Client
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Ajoutez un nouveau client à votre base de données
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nom"
                        className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                        value={newClient.nom}
                        onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Prénom"
                        className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                        value={newClient.prenom}
                        onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Numéro de téléphone"
                      className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      value={newClient.contact}
                      onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Adresse"
                      className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      value={newClient.adresse}
                      onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-gray-200 hover:bg-gray-50/75 transition-all duration-300"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow transition-all duration-300"
                  >
                    Ajouter le client
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
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
                <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                  <TableHead className="font-semibold text-blue-900">Nom</TableHead>
                  <TableHead className="font-semibold text-blue-900">Prénom</TableHead>
                  <TableHead className="font-semibold text-blue-900">Email</TableHead>
                  <TableHead className="font-semibold text-blue-900">Contact</TableHead>
                  <TableHead className="font-semibold text-blue-900">Adresse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Aucun client trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedClients.map((client, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-yellow-50/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {client.nom}
                      </TableCell>
                      <TableCell className="text-gray-700">{client.prenom}</TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 hover:from-blue-200 hover:to-blue-100 transition-colors duration-200">
                          {client.email}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-sm">
                          {client.contact}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{client.adresse}</TableCell>
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
                className="text-gray-600 hover:bg-gray-50 border-gray-200 transition-all duration-300"
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
                    className={`px-4 min-w-[40px] transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow"
                        : "text-gray-600 hover:bg-gray-50 border-gray-200"
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
                className="text-gray-600 hover:bg-gray-50 border-gray-200 transition-all duration-300"
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