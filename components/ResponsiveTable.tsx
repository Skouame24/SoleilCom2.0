"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

const ResponsiveTable = () => {
  const [topThreeSuppliers, setTopThreeSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5001/api/achats');
        const sortedAchats = response.data.achats;

        const supplierContactCount = {};
        sortedAchats.forEach(achat => {
          const supplierId = achat.fournisseurId;
          supplierContactCount[supplierId] = (supplierContactCount[supplierId] || 0) + 1;
        });

        const topThreeSupplierIds = Object.entries(supplierContactCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([id]) => id);

        const suppliersData = await Promise.all(
          topThreeSupplierIds.map(id => 
            axios.get(`http://localhost:5001/api/fournisseur/${id}`)
              .then(res => res.data.fournisseur)
          )
        );

        setTopThreeSuppliers(suppliersData);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Erreur lors du chargement des fournisseurs</p>
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
          <Users className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Fournisseurs récents</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#4F46E5]/5">
            <TableRow>
              <TableHead className="w-24 text-[#4F46E5]">Classement</TableHead>
              <TableHead className="text-[#4F46E5]">Nom</TableHead>
              <TableHead className="text-[#4F46E5]">Email</TableHead>
              <TableHead className="text-[#4F46E5]">Téléphone</TableHead>
              <TableHead className="text-[#4F46E5]">Adresse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(null).map((_, index) => (
                <TableRow key={index}>
                  {Array(5).fill(null).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : topThreeSuppliers.length > 0 ? (
              topThreeSuppliers.map((supplier, index) => (
                <TableRow key={supplier.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{supplier.nom} {supplier.prenom}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.localisation}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  Aucun fournisseur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResponsiveTable;