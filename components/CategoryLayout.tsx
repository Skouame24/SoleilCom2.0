import { Loader2 } from "lucide-react";

interface CategoryLayoutProps {
  icon: React.ReactNode;
  title: string;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  children: React.ReactNode;
}

export function CategoryLayout({
  icon,
  title,
  isLoading,
  error,
  isEmpty,
  children
}: CategoryLayoutProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#4763E4]" />
        <p className="text-lg text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{error}</h3>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#4763E4] text-white rounded-md hover:bg-[#3b52c4] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#4763E4]/10 text-[#4763E4] rounded-lg">
          {icon}
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4763E4] to-[#3b52c4] bg-clip-text text-transparent">
          {title}
        </h1>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 bg-muted/30 rounded-lg">
          <div className="p-4 bg-muted rounded-full">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">Aucun article disponible</h3>
          <p className="text-muted-foreground">
            Il n'y a actuellement aucun article dans cette catégorie.
          </p>
        </div>
      ) : children}
    </div>
  );
}