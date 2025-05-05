'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Store, Users2, Package, Wallet, UserPlus, ClipboardList, Menu, LogOut, ChevronRight, BoxesIcon, PackagePlus, PackageMinus, Database, FileText, CreditCard, PieChart, TrendingUp, DivideIcon as LucideIcon } from "lucide-react";
import logo from '@/assets/logo.jpeg';
import Image from "next/image";

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
        ]
      },
      {
        title: "Ventes",
        href: "/vente",
        icon: Store,
        subitems: [
          { title: "Nouvelle Vente", href: "/vente", icon: CreditCard },
          { title: "Etat des Ventes", href: "/etat-vente", icon: ClipboardList },
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
          { title: "Gestion des Fournisseurs", href: "/fournisseurs", icon: ClipboardList }
        ]
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users2,
        subitems: [
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
    return null;
  }

  const DashboardIcon = dashboardItem.icon;

  return (
    <div className={cn(
      "flex h-screen flex-col fixed left-0 top-0 bg-gradient-to-b from-blue-800 to-blue-900 text-white z-20 transition-all duration-300 shadow-xl",
      isExpanded ? "w-64" : "w-20"
    )}>
      {/* Header avec Logo */}
      <div className="h-24 flex items-center justify-between px-2 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-white/10">
        <div className="flex-1 h-full py-2">
          <div className="relative w-full h-full">
          <Image
              src={logo}
              alt="Logo"
              className="object-contain"
              priority
              
              style={{
                position: 'absolute',
    height:' 100%',
    width: '200%',
    inset:' 0px',
    color: 'transparent',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation avec Scroll */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Dashboard */}
        <Link
          href={dashboardItem.href}
          className={cn(
            "flex items-center mx-2 px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-white/10",
            pathname === dashboardItem.href ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400" : "text-white/80",
            !isExpanded && "justify-center"
          )}
        >
          <DashboardIcon className={cn("h-5 w-5", isExpanded && "mr-3")} />
          {isExpanded && <span className="font-medium">{dashboardItem.title}</span>}
        </Link>

        {/* Sections */}
        {sidebarItems.slice(1).map((section, index) => {
          if (!('section' in section)) return null;
          
          return (
            <div key={section.section} className="pt-4 first:pt-0">
              {isExpanded && (
                <h2 className="px-5 mb-2 text-xs font-semibold text-yellow-400/90 uppercase tracking-wider">
                  {section.section}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pathname === item.href || item.subitems?.some(sub => pathname === sub.href);
                  
                  return (
                    <div key={item.href} className="px-2">
                      <button
                        onClick={() => toggleItem(item.href)}
                        className={cn(
                          "flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                          "hover:bg-white/10",
                          (isActive || expandedItems.includes(item.href)) ? "bg-white/15 text-white" : "text-white/80",
                          !isExpanded && "justify-center"
                        )}
                      >
                        <ItemIcon className={cn("h-5 w-5", isExpanded && "mr-3")} />
                        {isExpanded && (
                          <>
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight 
                              className={cn(
                                "h-4 w-4 ml-auto transition-transform duration-200",
                                expandedItems.includes(item.href) && "rotate-90"
                              )}
                            />
                          </>
                        )}
                      </button>

                      {isExpanded && expandedItems.includes(item.href) && item.subitems && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/10">
                          {item.subitems.map((subItem) => {
                            const SubItemIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;
                            
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                                  "text-white/70 hover:text-white hover:bg-white/10",
                                  isSubActive && "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400"
                                )}
                              >
                                <SubItemIcon className="h-4 w-4 mr-2 opacity-80" />
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            );
                          })}
                        </div>
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
      <div className="p-2 mt-auto border-t border-white/10 bg-gradient-to-r from-blue-900 to-blue-800">
        <Link 
          href="/login" 
          className={cn(
            "flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-white/70 hover:text-yellow-400 hover:bg-white/10",
            !isExpanded && "justify-center"
          )}
        >
          <LogOut className={cn("h-5 w-5", isExpanded && "mr-3")} />
          {isExpanded && <span className="font-medium">Déconnexion</span>}
        </Link>
      </div>
    </div>
  );
}