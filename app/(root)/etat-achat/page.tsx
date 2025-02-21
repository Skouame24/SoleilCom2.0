"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Activity, Clock, Calendar, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ResponsiveTable from '@/components/ResponsiveTable';
import AchatTable from '@/components/AchatTable';

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

const EtatAchat = () => {
  const [stats, setStats] = useState({
    totalAchats: 0,
    achatsDuJour: 0,
    achatsDeLaSemaine: 0,
    fournisseurs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const printPage = () => {
    window.print();
  };

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5001/api/achats');
        const achats = response.data.achats;

        const dateDuJour = new Date().toISOString().split('T')[0];
        const dateActuelle = new Date();
        const debutSemaine = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), dateActuelle.getDate() - dateActuelle.getDay());

        const achatsJour = achats.filter(achat => achat.dateAchat === dateDuJour);
        const achatsSemaine = achats.filter(achat => new Date(achat.dateAchat) >= debutSemaine);
        const fournisseursIds = new Set(achats.map(achat => achat.fournisseurId));

        setStats({
          totalAchats: achats.length,
          achatsDuJour: achatsJour.length,
          achatsDeLaSemaine: achatsSemaine.length,
          fournisseurs: Array.from(fournisseursIds),
        });
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des achats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchats();
  }, []);

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-red-600">Une erreur est survenue</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="gradient-button bg-[#4F46E5] from-primary to-primary/80 text-white p-8 rounded-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <h1 className="text-2xl font-bold">États des achats</h1>
              </div>
              <p className="text-white/80">Gérer les espaces liés aux achats</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
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
            title="Total achats"
            value={stats.totalAchats}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title="Achats du jour"
            value={stats.achatsDuJour}
            icon={Clock}
            isLoading={isLoading}
          />
          <StatCard
            title="Achats de la semaine"
            value={stats.achatsDeLaSemaine}
            icon={Calendar}
            isLoading={isLoading}
          />
          <StatCard
            title="Fournisseurs"
            value={stats.fournisseurs.length}
            icon={Users}
            isLoading={isLoading}
          />
        </div>

        {/* Tables */}
        <div className="mt-8 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <>
              <ResponsiveTable />
              <AchatTable />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EtatAchat;