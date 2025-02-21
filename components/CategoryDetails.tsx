import { Card } from "@/components/ui/card";
import { Laptop, Smartphone, Package } from "lucide-react";
import { useParams } from "next/navigation";

const categoryData = {
  informatique: {
    icon: Laptop,
    items: [
      {
        id: 1,
        name: "MacBook Pro 2023",
        price: "1299€",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        name: "Dell XPS 15",
        price: "1199€",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  smartphones: {
    icon: Smartphone,
    items: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        price: "999€",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        name: "Samsung S24 Ultra",
        price: "1299€",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60"
      }
    ]
  },
  fournitures: {
    icon: Package,
    items: [
      {
        id: 1,
        name: "Pack Papier A4",
        price: "29.99€",
        image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        name: "Set de Stylos",
        price: "19.99€",
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=60"
      }
    ]
  }
};

export function CategoryDetails() {
  const { category } = useParams();
  const categoryInfo = category ? categoryData[category as keyof typeof categoryData] : null;

  if (!categoryInfo) {
    return <div>Catégorie non trouvée</div>;
  }

  const Icon = categoryInfo.icon;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Icon className="w-8 h-8 text-[#4763E4]" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4763E4] to-[#3b52c4] bg-clip-text text-transparent capitalize">
          {category}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryInfo.items.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <p className="text-[#4763E4] font-semibold mt-1">{item.price}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}