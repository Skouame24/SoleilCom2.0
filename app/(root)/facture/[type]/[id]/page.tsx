import axios from 'axios';
import { FactureClient } from './FactureClient';

// Cette fonction est requise pour l'export statique
export async function generateStaticParams() {
  try {
    // Récupérer les achats et les ventes
    const [achatsRes, ventesRes] = await Promise.all([
      axios.get('http://localhost:5001/api/achats'),
      axios.get('http://localhost:5001/api/ventes')
    ]);

    const achats = achatsRes.data.achats || [];
    const ventes = ventesRes.data.ventes || [];

    // Générer les paramètres pour les achats et les ventes
    const params = [
      // Paramètres pour les achats
      ...achats.map(achat => ({
        type: 'achat',
        id: achat.id.toString()
      })),
      // Paramètres pour les ventes
      ...ventes.map(vente => ({
        type: 'vente',
        id: vente.id.toString()
      }))
    ];

    return params;
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres:', error);
    // En cas d'erreur, retourner un tableau vide pour éviter de bloquer la génération
    return [];
  }
}

// Marquer le composant comme client
export default function FacturePage({
  params,
}: {
  params: { type: 'achat' | 'vente'; id: string };
}) {
  return <FactureClient id={params.id} type={params.type} />;
}