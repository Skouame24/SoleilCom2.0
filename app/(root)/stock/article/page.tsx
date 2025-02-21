"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Package,
  ListPlus,
  Box,
  Tags,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreateArticle() {
  const [formData, setFormData] = useState({
    designation: "",
    caracteristique: "",
    quantite: "",
    categorie: "",
    type: "",
  });
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, typesRes] = await Promise.all([
        axios.get("http://localhost:5001/api/categories"),
        axios.get("http://localhost:5001/api/type"),
      ]);

      setCategories(categoriesRes.data.categories);
      setTypes(typesRes.data.typeArticles);
    } catch (error) {
      toast.error("Erreur lors de la récupération des données");
      console.error("Erreur:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.designation.trim()) {
      toast.warning("Veuillez saisir une désignation");
      return;
    }

    setIsLoading(true);

    const requestData = {
      designation: formData.designation,
      caracteristique: formData.caracteristique,
      quantite: formData.quantite,
      entreeDirecte: true,
      entreeIndirecte: false,
      sortieDirecte: false,
      sortieIndirecte: false,
      prixAchat: null,
      boutiqueId: 1,
      categorieId: parseInt(formData.categorie),
      typeArticleId: parseInt(formData.type),
    };

    try {
      await axios.post("http://localhost:5001/api/articles", requestData);
      toast.success("Article enregistré avec succès");
      setFormData({
        designation: "",
        caracteristique: "",
        quantite: "",
        categorie: "",
        type: "",
      });
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'article");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nouvel Article</h2>
          <p className="text-muted-foreground">
            Créez un nouvel article dans votre inventaire
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-[#4169E1]" />
              <h3 className="text-2xl font-semibold">Détails de l'Article</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Remplissez les informations de l'article
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#4169E1]" />
                Désignation
              </Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Entrez le nom de l'article"
                className="max-w-xl"
                required
              />
            </div>

            {/* Caracteristique & Quantite */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="caracteristique" className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-[#4169E1]" />
                  Caractéristique
                </Label>
                <Input
                  id="caracteristique"
                  name="caracteristique"
                  value={formData.caracteristique}
                  onChange={handleChange}
                  placeholder="Décrivez les caractéristiques"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantite" className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#4169E1]" />
                  Quantité
                </Label>
                <Input
                  id="quantite"
                  name="quantite"
                  type="number"
                  value={formData.quantite}
                  onChange={handleChange}
                  placeholder="Entrez la quantité"
                  required
                />
              </div>
            </div>

            {/* Categorie & Type */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categorie" className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-[#4169E1]" />
                  Catégorie
                </Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(value) => handleSelectChange("categorie", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#4169E1]" />
                  Type d'article
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#4169E1] hover:bg-[#3154b3] text-white"
              disabled={isLoading}
            >
              <ListPlus className="mr-2 h-5 w-5" />
              {isLoading ? "Enregistrement..." : "Enregistrer l'article"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}