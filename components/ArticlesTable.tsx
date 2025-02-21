import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  
  interface Article {
    id: number;
    designation: string;
    caracteristique: string;
    quantite: number;
    typeArticleId: number;
  }
  
  interface ArticlesTableProps {
    articles: Article[];
    typeArticles: Record<number, string>;
  }
  
  export function ArticlesTable({ articles, typeArticles }: ArticlesTableProps) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Désignation</TableHead>
              <TableHead className="font-semibold">Caractéristique</TableHead>
              <TableHead className="font-semibold">Quantité</TableHead>
              <TableHead className="font-semibold">Type d'article</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.designation}</TableCell>
                <TableCell>{article.caracteristique}</TableCell>
                <TableCell>
                  <Badge variant={article.quantite > 0 ? "default" : "destructive"}>
                    {article.quantite}
                  </Badge>
                </TableCell>
                <TableCell>{typeArticles[article.typeArticleId] || "Type inconnu"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }