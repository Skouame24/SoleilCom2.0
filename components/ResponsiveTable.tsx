'use client';

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
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Erreur lors du chargement des fournisseurs</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Fournisseurs les plus actifs</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
              <TableHead className="text-white font-semibold py-4">Classement</TableHead>
              <TableHead className="text-white font-semibold py-4">Nom</TableHead>
              <TableHead className="text-white font-semibold py-4">Email</TableHead>
              <TableHead className="text-white font-semibold py-4">Téléphone</TableHead>
              <TableHead className="text-white font-semibold py-4">Adresse</TableHead>
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
                <TableRow 
                  key={supplier.id} 
                  className="border-b hover:bg-gradient-to-r hover:from-yellow-50/20 hover:to-transparent transition-colors duration-200"
                >
                  <TableCell className="font-medium text-blue-900">{index + 1}</TableCell>
                  <TableCell className="text-gray-600">{supplier.nom} {supplier.prenom}</TableCell>
                  <TableCell className="text-gray-600">{supplier.email}</TableCell>
                  <TableCell>
                    <span className="text-gray-600 bg-yellow-50/50 px-2 py-1 rounded-full text-sm">
                      {supplier.contact}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{supplier.localisation}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-600 h-24">
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