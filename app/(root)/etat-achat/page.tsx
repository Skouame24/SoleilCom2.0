'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Activity, Clock, Calendar, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ResponsiveTable from '@/components/ResponsiveTable';
import AchatTable from '@/components/AchatTable';

const StatCard = ({ title, value, icon: Icon, isLoading }) => (
  <Card className="bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-300/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
              {value}
            </p>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 rounded-xl">
          <Icon className="h-6 w-6 text-yellow-600" />
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
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 bg-gradient-to-br from-gray-50 to-yellow-50/20 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 text-white border-b-4 border-yellow-400/20">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Activity className="h-7 w-7 text-yellow-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-yellow-100/90 to-white bg-clip-text text-transparent">
                  États des achats
                </h1>
              </div>
              <p className="text-blue-100">Supervision et analyse des transactions d'achat</p>
            </div>
            <Button
              onClick={printPage}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm"
            >
              <Printer className="h-4 w-4 mr-2" />
              Générer un rapport
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total des achats"
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
            title="Fournisseurs actifs"
            value={stats.fournisseurs.length}
            icon={Users}
            isLoading={isLoading}
          />
        </div>

        {/* Tables */}
        <div className="mt-12 space-y-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-900" />
                <h3 className="font-semibold text-lg  from-blue-900 via-blue-800 to-blue-900 bg-clip-text">
                  Fournisseurs récents
                </h3>
              </div> */}
                <ResponsiveTable />
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                <AchatTable />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EtatAchat;