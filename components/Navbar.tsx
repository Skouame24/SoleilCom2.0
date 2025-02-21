"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white/70 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1" />
      <div className="absolute left-1/2 -translate-x-1/2">
        <Button 
          className="bg-gradient-to-r from-[#4763E4] to-[#3b52c4] text-white hover:from-[#3b52c4] hover:to-[#2e41a3] shadow-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
        >
          Boutique
        </Button>
      </div>
      <div className="flex items-center gap-6 ml-6">
        <button className="relative group">
          <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-400 to-pink-400 group-hover:from-red-500 group-hover:to-pink-500 rounded-full text-xs text-white flex items-center justify-center transition-all duration-200">
            2
          </span>
        </button>
        <div className="flex items-center gap-3 group">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Karim Silue</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm group-hover:shadow-md transition-shadow">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=75" />
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}