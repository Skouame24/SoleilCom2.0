"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function FinancePage() {
    const [totalAchats, setTotalAchats] = useState(0);
    const [totalVentes, setTotalVentes] = useState(0);
    const [totalBenefice, setTotalBenefice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [articles, setArticles] = useState([]); 
    const [salesData, setSalesData] = useState([]);
    const [achats, setAchats] = useState([]); 
    const [dailyData, setDailyData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    // Fonction pour formater la date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Récupérer les achats
                const achatsResponse = await axios.get('http://localhost:5001/api/achats');
                const achatsData = achatsResponse.data.achats;
                setAchats(achatsData);
                
                // Récupérer les ventes
                const ventesResponse = await axios.get('http://localhost:5001/api/ventes');
                const ventesData = ventesResponse.data.ventes;
                setSalesData(ventesData);

                // Combiner et trier les transactions récentes
                const allTransactions = [
                    ...achatsData.map((achat: any) => ({
                        time: formatDate(achat.dateAchat),
                        type: 'Achat',
                        description: `Achat de ${achat.articlesData.length} articles`,
                        amount: achat.montantTotal
                    })),
                    ...ventesData.map((vente: any) => ({
                        time: formatDate(vente.dateVente),
                        type: 'Vente',
                        description: `Vente de ${vente.articleData.length} articles`,
                        amount: vente.montantTotal
                    }))
                ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 5); // Garder seulement les 5 dernières transactions

                setRecentTransactions(allTransactions);

                // Calculer les totaux
                const sumMontantTotalAchats = achatsData.reduce((total: number, achat: any) => total + achat.montantTotal, 0);
                const sumMontantTotalVentes = ventesData.reduce((total: number, vente: any) => total + vente.montantTotal, 0);
                
                setTotalAchats(sumMontantTotalAchats);
                setTotalVentes(sumMontantTotalVentes);

                // Préparer les données pour le graphique
                const achatsByDay: { [key: string]: number } = {};
                const ventesByDay: { [key: string]: number } = {};

                achatsData.forEach((achat: any) => {
                    const date = new Date(achat.dateAchat).toLocaleDateString();
                    achatsByDay[date] = (achatsByDay[date] || 0) + achat.montantTotal;
                });

                ventesData.forEach((vente: any) => {
                    const date = new Date(vente.dateVente).toLocaleDateString();
                    ventesByDay[date] = (ventesByDay[date] || 0) + vente.montantTotal;
                });

                const combinedData = Object.keys({ ...achatsByDay, ...ventesByDay })
                    .map(date => ({
                        day: date,
                        achats: achatsByDay[date] || 0,
                        ventes: ventesByDay[date] || 0,
                    }))
                    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

                setDailyData(combinedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        // Fetch articles data
        axios.get('http://localhost:5001/api/articles')
            .then(response => {
                const articlesData = response.data.articles;
                setArticles(articlesData);
                const sumTotalQuantity = articlesData.reduce((total: number, article: any) => total + article.quantite, 0);
                setTotalQuantity(sumTotalQuantity);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des articles:', error);
            });
    }, []);

    useEffect(() => {
        const calculateSalesBenefit = () => {
            let sumBenefice = 0;
            for (const vente of salesData) {
                for (const articleVente of vente.articleData) {
                    const achatCorrespondant = achats.find((achat: any) => {
                        return achat.articlesData.some((articleAchat: any) => 
                            articleAchat.articleId === articleVente.articleId
                        );
                    });
            
                    if (achatCorrespondant) {
                        const prixAchatArticle = achatCorrespondant.articlesData.find(
                            (articleAchat: any) => articleAchat.articleId === articleVente.articleId
                        ).prix;
                        sumBenefice += articleVente.prixVente - prixAchatArticle;
                    }
                }
            }
            return sumBenefice;
        };
        
        const totalSalesBenefit = calculateSalesBenefit();
        setTotalBenefice(totalSalesBenefit);
    }, [salesData, achats]);

    return (
        <div className="p-2 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gérer mes finances</h1>
                <Button className="bg-[#4763E4] hover:bg-[#3651C9]">
                    <FileText className="mr-2 h-4 w-4" />
                    Générer un rapport
                </Button>
            </div>

            <Tabs defaultValue="jour" className="space-y-6">
                <div className="flex justify-between items-center">
                    <TabsList className="bg-muted/50">
                        <TabsTrigger value="jour">Aujourd'hui</TabsTrigger>
                        <TabsTrigger value="mois">Ce mois</TabsTrigger>
                        <TabsTrigger value="annee">Cette année</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date().toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}</span>
                    </div>
                </div>

                <TabsContent value="jour" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="relative overflow-hidden p-6 transition-all hover:shadow-lg">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500/20 to-red-500/40" />
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Achats</span>
                                    <span className="text-sm text-red-500 flex items-center gap-1">
                                        <ArrowDownRight className="h-4 w-4" />
                                        Total
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold">FCFA {totalAchats.toLocaleString()}</span>
                                    <p className="text-xs text-muted-foreground mt-1">{achats.length} transactions</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="relative overflow-hidden p-6 transition-all hover:shadow-lg">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500/20 to-green-500/40" />
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Ventes</span>
                                    <span className="text-sm text-green-500 flex items-center gap-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                        Total
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold">FCFA {totalVentes.toLocaleString()}</span>
                                    <p className="text-xs text-muted-foreground mt-1">{salesData.length} transactions</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="relative overflow-hidden p-6 transition-all hover:shadow-lg">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500/20 to-blue-500/40" />
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Stock</span>
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                    <span className="text-2xl font-bold">{totalQuantity}</span>
                                    <p className="text-xs text-muted-foreground mt-1">Articles disponibles</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="relative overflow-hidden p-6 transition-all hover:shadow-lg">
                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500/20 to-green-500/40" />
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Bénéfice</span>
                                    <span className="text-sm text-green-500 flex items-center gap-1">
                                        <ArrowUpRight className="h-4 w-4" />
                                        Marge
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold">FCFA {totalBenefice.toLocaleString()}</span>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Marge {totalVentes > 0 ? ((totalBenefice / totalVentes) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium">Aperçu des transactions</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#4763E4]/60" />
                                        Achats
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                        Ventes
                                    </span>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="achatsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4763E4" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4763E4" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="ventesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="achats"
                                            stroke="#4763E4"
                                            fillOpacity={1}
                                            fill="url(#achatsGradient)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="ventes"
                                            stroke="#10B981"
                                            fillOpacity={1}
                                            fill="url(#ventesGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium">Transactions récentes</h3>
                                <Button variant="outline" size="sm">
                                    Voir tout
                                </Button>
                            </div>
                            <div className="rounded-lg border bg-card">
                                <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-muted-foreground">
                                    <div>Heure</div>
                                    <div>Type</div>
                                    <div>Description</div>
                                    <div>Montant</div>
                                </div>
                                <div className="divide-y divide-muted/10">
                                    {recentTransactions.map((transaction, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 p-4 text-sm items-center hover:bg-muted/5 transition-colors">
                                            <div>{transaction.time}</div>
                                            <div>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                                    transaction.type === 'Achat' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {transaction.type}
                                                </span>
                                            </div>
                                            <div>{transaction.description}</div>
                                            <div className="font-medium">FCFA {transaction.amount.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="mois" className="text-sm text-muted-foreground">
                    Chargement des données mensuelles...
                </TabsContent>

                <TabsContent value="annee" className="text-sm text-muted-foreground">
                    Chargement des données annuelles...
                </TabsContent>
            </Tabs>
        </div>
    );
}