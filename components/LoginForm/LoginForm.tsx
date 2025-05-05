'use client';

import { useState } from 'react';
import { Loader2, Moon, Sun, User, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSubmit: (data: { login: string; motdepasse: string }) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [loginData, setLoginData] = useState({
    login: '',
    motdepasse: '',
  });
  const { theme, setTheme } = useTheme();
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(loginData);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent dark:from-white/5" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-soft-light" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center p-12"
      >
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Soleil Communication</h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              Plateforme de gestion multi-services pour développeurs
            </p>
          </motion.div>
          
          <div className="space-y-5">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-5 rounded-xl border bg-card/50 backdrop-blur"
            >
              <h3 className="font-medium">Outils de développement</h3>
              <p className="text-sm text-muted-foreground mt-1">Accédez à notre suite complète d'outils de développement.</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-5 rounded-xl border bg-card/50 backdrop-blur"
            >
              <h3 className="font-medium">API & Intégrations</h3>
              <p className="text-sm text-muted-foreground mt-1">Gérez vos endpoints et connexions tierces en un seul endroit.</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-5 rounded-xl border bg-card/50 backdrop-blur"
            >
              <h3 className="font-medium">Performances & Analytics</h3>
              <p className="text-sm text-muted-foreground mt-1">Suivez et optimisez les performances de vos applications.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center"
      >
        <div className="w-full max-w-md mx-auto px-8 py-12">
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex items-center justify-center p-2 rounded-xl mb-4">
              <Sun className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold">Soleil Communication</h1>
            <p className="text-sm text-muted-foreground mt-1">Plateforme Multi-Services</p>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-2xl border bg-card/80 backdrop-blur shadow-sm"
          >
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold tracking-tight">Connexion Développeur</h2>
              <p className="text-sm text-muted-foreground mt-1">Accédez à votre espace de travail</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <div className={cn(
                    "absolute left-3 top-3 text-muted-foreground transition-all duration-300",
                    focused === 'login' && "text-primary"
                  )}>
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="login"
                    name="login"
                    type="text"
                    value={loginData.login}
                    onChange={handleChange}
                    onFocus={() => setFocused('login')}
                    onBlur={() => setFocused(null)}
                    className={cn(
                      "pl-10 h-12 transition-all duration-200 border-input",
                      focused === 'login' && "border-primary ring-1 ring-primary"
                    )}
                    placeholder="Identifiant"
                  />
                </div>

                <div className="relative">
                  <div className={cn(
                    "absolute left-3 top-3 text-muted-foreground transition-all duration-300",
                    focused === 'password' && "text-primary"
                  )}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="motdepasse"
                    name="motdepasse"
                    type="password"
                    value={loginData.motdepasse}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className={cn(
                      "pl-10 h-12 transition-all duration-200 border-input",
                      focused === 'password' && "border-primary ring-1 ring-primary"
                    )}
                    placeholder="Mot de passe"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}