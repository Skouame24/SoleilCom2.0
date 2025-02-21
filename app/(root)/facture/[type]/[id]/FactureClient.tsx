'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';
import Image from 'next/image';
import logo from '@/assets/logo.jpeg';
import './facture.css'


const formatNumeroFacture = (id: string) => {
  return `FACT-${id.padStart(3, '0')}`;
};

interface Article {
  id: number;
  designation: string;
  caracteristique: string;
}

interface ArticleData {
  articleId: number;
  quantite: number;
  prix?: number;
  prixVente?: number;
  remiseArticle: number;
  tvaArticle: number;
}

interface Client {
  nom: string;
  email: string;
  localisation: string;
}

interface Fournisseur {
  nom: string;
  email: string;
  localisation: string;
}

interface BaseTransaction {
  tauxRemise: number;
  montantTVA: number;
  remiseTotalPourcent: number;
  montantTotal: number;
}

interface Achat extends BaseTransaction {
  dateAchat: string;
  fournisseur: Fournisseur;
  articlesData: ArticleData[];
}

interface Vente extends BaseTransaction {
  dateVente: string;
  client: Client;
  articleData: ArticleData[]; // Notez la différence: articleData au lieu de articlesData
}

interface TransactionDetails {
  achat?: Achat;
  vente?: Vente;
}

interface FactureProps {
  id: string;
  type: 'achat' | 'vente';
}

export function FactureClient({ id, type }: FactureProps) {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [numFacture, setNumFacture] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'achat' ? 'achats' : 'ventes';
        const [transactionResponse, articlesResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/${endpoint}/${id}`),
          axios.get("http://localhost:5001/api/articles"),
        ]);
        
        const transactionData = transactionResponse.data;
        const articlesData = articlesResponse.data.articles;
        
        setTransactionDetails(transactionData);
        setArticles(articlesData);
        setNumFacture(formatNumeroFacture(id));
      } catch (err) {
        console.error("Erreur:", err);
      }
    };
    fetchData();
  }, [id, type]);

  const downloadPDF = () => {
    const section = document.getElementById('download_section');
    if (!section) return;
    const pdfOptions = {
      margin: 10,
      filename: `facture_${numFacture}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(section).set(pdfOptions).save();
  };

  if (!transactionDetails) {
    return <div>Chargement en cours...</div>;
  }

  const transaction = type === 'achat' ? transactionDetails.achat : transactionDetails.vente;
  if (!transaction) {
    return <div>Données non trouvées</div>;
  }

  const findArticle = (articleId: number) => {
    return articles.find(article => article.id === articleId);
  };

  const partyInfo = type === 'achat' ? transaction.fournisseur : transaction.client;
  const date = type === 'achat' ? transaction.dateAchat : transaction.dateVente;
  const articlesDataArray = type === 'achat' 
    ? transaction.articlesData 
    : transaction.articleData; // Utiliser la bonne propriété selon le type

  return (
    <div className="cs-container">
      <div className="cs-invoice cs-style1" id="download_section">
        <div className="cs-invoice_in">
          <div className="cs-invoice_head cs-type1 cs-mb25">
            <div className="cs-invoice_left">
              <p className="cs-invoice_number cs-primary_color cs-mb5 cs-f16">
                <b className="cs-primary_color">Facture No: #{numFacture}</b>
              </p>
              <p className="cs-invoice_date cs-primary_color cs-m0">
                <b className="cs-primary_color">Date: </b>
                {format(new Date(date), 'dd-MM-yyyy')}
              </p>
            </div>
            <div className="cs-invoice_right cs-text_right">
              <div className="cs-logo cs-mb5">
                <Image src={logo} alt="Logo" width={150} height={100} />
              </div>
            </div>
          </div>

          <div className="cs-invoice_head cs-mb10">
            <div className="cs-invoice_left">
              <b className="cs-primary_color">{type === 'achat' ? 'Emetteur:' : 'Emetteur:'}</b>
              <p>
                {type === 'achat' ? partyInfo.nom : 'Soleil Communication'}<br />
                {type === 'achat' ? partyInfo.localisation : 'Abidjan, Cocody Angré 22e Arrondissement'}<br />
                {type === 'achat' ? partyInfo.email : null}
              </p>
            </div>
            <div className="cs-invoice_right cs-text_right">
              <b className="cs-primary_color">{type === 'achat' ? 'Adressé à:' : 'Adressé à:'}</b>
              <p>
                {type === 'achat' ? 'Soleil Communication' : partyInfo.nom}<br />
                {type === 'achat' ? 'Abidjan, Cocody Angré 22e Arrondissement' : partyInfo.localisation}<br />
                {type === 'achat' ? null : partyInfo.email}
              </p>
            </div>
          </div>

          <div className="cs-table cs-style1">
            <div className="cs-round_border">
              <div className="cs-table_responsive">
                <table>
                  <thead>
                    <tr>
                      <th className="cs-width_3 cs-semi_bold cs-primary_color cs-focus_bg">Designation</th>
                      <th className="cs-width_4 cs-semi_bold cs-primary_color cs-focus_bg">Description</th>
                      <th className="cs-width_2 cs-semi_bold cs-primary_color cs-focus_bg">Qty</th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color cs-focus_bg">Prix U. HT</th>
                      <th className="cs-width_2 cs-semi_bold cs-primary_color cs-focus_bg cs-text_right">Prix Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articlesDataArray.map((articleData, index) => {
                      const article = findArticle(articleData.articleId);
                      if (!article) return null;
                      
                      const prix = type === 'achat' ? articleData.prix : articleData.prixVente;
                      const total = articleData.quantite * (prix || 0);
                      
                      return (
                        <tr key={index}>
                          <td className="cs-width_3">{article.designation}</td>
                          <td className="cs-width_4">{article.caracteristique}</td>
                          <td className="cs-width_2">{articleData.quantite}</td>
                          <td className="cs-width_1">{prix}</td>
                          <td className="cs-width_2 cs-text_right">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="cs-invoice_footer cs-border_top">
                <div className="cs-left_footer cs-mobile_hide">
                  <p className="cs-mb0">
                    <b className="cs-primary_color">Additional Information:</b>
                  </p>
                  <p className="cs-m0">
                    At check in you may need to present the credit<br />
                    card used for payment of this ticket.
                  </p>
                </div>
                <div className="cs-right_footer">
                  <table>
                    <tbody>
                      <tr className="cs-border_left">
                        <td className="cs-width_3 cs-semi_bold cs-primary_color cs-focus_bg">Total Remise</td>
                        <td className="cs-width_3 cs-semi_bold cs-focus_bg cs-primary_color cs-text_right">
                          {transaction.tauxRemise} Fcfa
                        </td>
                      </tr>
                      <tr className="cs-border_left">
                        <td className="cs-width_3 cs-semi_bold cs-primary_color cs-focus_bg">Montant TVA (18%)</td>
                        <td className="cs-width_3 cs-semi_bold cs-focus_bg cs-primary_color cs-text_right">
                          {transaction.montantTVA} Fcfa
                        </td>
                      </tr>
                      <tr className="cs-border_left">
                        <td className="cs-width_3 cs-semi_bold cs-primary_color cs-focus_bg">Remise TTC</td>
                        <td className="cs-width_3 cs-semi_bold cs-focus_bg cs-primary_color cs-text_right">
                          {transaction.remiseTotalPourcent} Fcfa
                        </td>
                      </tr>
                      <tr className="cs-border_left">
                        <td className="cs-width_3 cs-semi_bold cs-primary_color cs-focus_bg">Montant Net TTC</td>
                        <td className="cs-width_3 cs-semi_bold cs-focus_bg cs-primary_color cs-text_right">
                          {transaction.montantTotal} Fcfa
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="cs-invoice_head cs-mb4">
            <div className="cs-invoice_left">
              <div>
                <b className="cs-primary_color">Condition de paiement:</b>
                <p>100%</p>
              </div>
              <div>
                <b className="cs-primary_color">Moyen de paiement:</b>
                <p>Cheque/Espece</p>
              </div>
            </div>
            <div className="cs-invoice_right cs-text_right">
              <b className="cs-primary_color">Signature:</b>
            </div>
          </div>

          <div className="cs-note">
            <div className="cs-note_left"></div>
            <div className="cs-note_right">
              <hr />
              <p className="cs-m0">
                SARL au Capital de 1.000.000 FCFA - Siège social : Abidjan, Cocody Angré 22e Arrondissement, Cité Manguier, EPP
                Résidences Latrilles.02 BP 55 CIDEX 02 - SAV : (+225) 0769008426 / (225) 0101939558 Régime : TEE - NO CC 2055361 F
                R.C.NO CI-ABJ-2020-B-17877 Coris Bank Internationale : C116 6060 0800 6761 8241 0167
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cs-invoice_btns cs-hide_print">
        <a href="#" className="cs-invoice_btn cs-color1" onClick={() => window.print()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <path
              d="M384 368h24a40.12 40.12 0 0040-40V168a40.12 40.12 0 00-40-40H104a40.12 40.12 0 00-40 40v160a40.12 40.12 0 0040 40h24"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth={32}
            />
            <rect
              x={128}
              y={240}
              width={256}
              height={208}
              rx="24.32"
              ry="24.32"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth={32}
            />
            <path
              d="M384 128v-24a40.12 40.12 0 00-40-40H168a40.12 40.12 0 00-40 40v24"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth={32}
            />
            <circle cx={392} cy={184} r={24} />
          </svg>
          <span>Imprimer</span>
        </a>
        <button className="cs-invoice_btn cs-color2" onClick={downloadPDF}>
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <title>Telecharger</title>
            <path
              d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M176 272l80 80 80-80M256 48v288"
            />
          </svg>
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}