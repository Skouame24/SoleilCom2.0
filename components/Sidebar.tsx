"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Store, Users2, Package, Wallet, UserPlus, ClipboardList, Menu, LogOut, ChevronRight, BoxesIcon, PackagePlus, PackageMinus, Database, FileText, CreditCard, PieChart, TrendingUp, LucideIcon } from "lucide-react";

interface SubItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subitems?: SubItem[];
}

interface Section {
  section: string;
  items: MenuItem[];
}

type SidebarItem = MenuItem | Section;

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    section: "GESTION ACHATS & VENTES",
    items: [
      {
        title: "Achats",
        href: "/achat",
        icon: ShoppingCart,
        subitems: [
          { title: "Nouveau Achat", href: "/achat", icon: PackagePlus },
          { title: "Etat des Achats", href: "/etat-achat", icon: ClipboardList },
          // { title: "Factures Achats", href: "/achats/factures", icon: FileText }
        ]
      },
      {
        title: "Ventes",
        href: "/vente",
        icon: Store,
        subitems: [
          { title: "Nouvelle Vente", href: "/vente", icon: CreditCard },
          { title: "Etat des Ventes", href: "/etat-vente", icon: ClipboardList },
          // { title: "Factures Ventes", href: "/ventes/factures", icon: FileText }
        ]
      }
    ]
  },
  {
    section: "GESTION PARTENAIRE",
    items: [
      {
        title: "Fournisseurs",
        href: "/fournisseurs",
        icon: Users2,
        subitems: [
          // { title: "Nouveau Fournisseur", href: "/fournisseurs/nouveau", icon: UserPlus },
          { title: "Gestion des Fournisseurs", href: "/fournisseurs", icon: ClipboardList }
        ]
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users2,
        subitems: [
          // { title: "Nouveau Client", href: "/clients/nouveau", icon: UserPlus },
          { title: "Gestions des Clients", href: "/clients", icon: ClipboardList }
        ]
      }
    ]
  },
  {
    section: "GESTION STOCK",
    items: [
      {
        title: "Stock",
        href: "/stock",
        icon: Package,
        subitems: [
          { title: "État du Stock", href: "stock/stock-entries", icon: BoxesIcon },
          { title: "Entrées Stock", href: "stock/stock-entries", icon: PackagePlus },
          { title: "Sorties Stock", href: "/stock/stock-sorties", icon: PackageMinus },
          { title: "Inventaire", href: "/stock/inventaire", icon: Database }
        ]
      }
    ]
  },
  {
    section: "FINANCE",
    items: [
      {
        title: "Finance",
        href: "/finance",
        icon: Wallet,
        subitems: [
          { title: "Tableau de Bord", href: "/finance", icon: PieChart },
          { title: "Rapports", href: "/finance/rapports", icon: FileText }
        ]
      }
    ]
  }
];

const isMenuItem = (item: SidebarItem): item is MenuItem => {
  return 'title' in item;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const dashboardItem = sidebarItems[0];
  if (!isMenuItem(dashboardItem)) {
    return null; // ou gérer l'erreur différemment
  }

  const DashboardIcon = dashboardItem.icon;

  return (
    <div className={cn(
      "flex h-screen flex-col fixed left-0 top-0 bg-[#4763E4] text-white z-20 transition-all duration-300",
      isExpanded ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className={cn(
          "text-xl font-semibold ml-3 whitespace-nowrap overflow-hidden transition-all duration-300",
          !isExpanded && "opacity-0 w-0"
        )}>
          SOLEIL<span className="text-white/80">.COM</span>
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-4 overflow-y-auto">
        {/* Dashboard - Single Item */}
        <Link
          href={dashboardItem.href}
          className={cn(
            "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors",
            "text-white/70 hover:text-white hover:bg-white/10",
            pathname === dashboardItem.href && "bg-white/15 text-white",
            !isExpanded && "justify-center"
          )}
        >
          <DashboardIcon className={cn("h-4 w-4", isExpanded && "mr-3")} />
          {isExpanded && <span>{dashboardItem.title}</span>}
        </Link>

        {/* Sections */}
        {sidebarItems.slice(1).map((section, index) => {
          if (!('section' in section)) return null;
          
          return (
            <div key={section.section} className="space-y-2 ">
              {isExpanded && (
                <h2 className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {section.section}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => toggleItem(item.href)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors",
                          "text-white/70 hover:text-white hover:bg-white/10",
                          expandedItems.includes(item.href) && "bg-white/15 text-white",
                          !isExpanded && "justify-center"
                        )}
                      >
                        <ItemIcon className={cn("h-4 w-4", isExpanded && "mr-3")} />
                        {isExpanded && (
                          <>
                            <span>{item.title}</span>
                            <ChevronRight 
                              className={cn(
                                "h-4 w-4 ml-auto transition-transform",
                                expandedItems.includes(item.href) && "rotate-90"
                              )}
                            />
                          </>
                        )}
                      </button>

                      {isExpanded && expandedItems.includes(item.href) && item.subitems && (
                        <Card className="mt-1 mx-2 bg-white/5 border-white/10 overflow-hidden">
                          <div className="p-1 space-y-0.5">
                            {item.subitems.map((subItem) => {
                              const SubItemIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={cn(
                                    "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                                    "text-white/60 hover:text-white hover:bg-white/10",
                                    pathname === subItem.href && "bg-white/15 text-white"
                                  )}
                                >
                                  <SubItemIcon className="h-4 w-4 mr-2 opacity-70" />
                                  {subItem.title}
                                </Link>
                              );
                            })}
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/10">
        <Link href="/logout" className={cn(
          "flex items-center w-full px-3 py-2 text-sm text-white/70 rounded-lg hover:bg-white/10 hover:text-white transition-colors",
          !isExpanded && "justify-center"
        )}>
          <LogOut className={cn("h-4 w-4", isExpanded && "mr-3")} />
          {isExpanded && "Déconnexion"}
        </Link>
      </div>
    </div>
  );
}