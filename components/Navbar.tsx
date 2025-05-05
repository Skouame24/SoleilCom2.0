'use client';

import { Bell, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="h-16 border-b border-blue-100 bg-white/70 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex-1" />
      <div className="absolute left-1/2 -translate-x-1/2">
        <Button 
          className="bg-gradient-to-r from-blue-800 to-blue-700 text-white hover:from-blue-700 hover:to-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 group"
        >
          <Store className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Boutique
        </Button>
      </div>
      <div className="flex items-center gap-6 ml-6">
        <button className="relative group">
          <Bell className="h-5 w-5 text-blue-800/70 group-hover:text-blue-800 transition-colors" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:from-yellow-500 group-hover:to-yellow-600 rounded-full text-xs text-white flex items-center justify-center transition-all duration-200">
            2
          </span>
        </button>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-medium text-blue-800/80 group-hover:text-blue-800 transition-colors">Karim Silue</p>
            <p className="text-xs text-blue-600/60">Administrateur</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-blue-100 shadow-sm group-hover:shadow-md group-hover:ring-blue-200 transition-all">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=75" />
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}