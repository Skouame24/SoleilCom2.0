'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sun, Moon, User, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import axios from 'axios';
import Image from 'next/image';
import logo from '@/assets/logo.jpeg';


export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    login: '',
    motdepasse: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.login || !loginData.motdepasse) {
      toast({
        variant: 'destructive',
        title: 'Erreur de validation',
        description: 'Tous les champs sont requis.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/login', loginData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast({
          title: 'Connexion réussie',
          description: 'Redirection vers le tableau de bord...',
        });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erreur lors de la connexion';
        toast({
          variant: 'destructive',
          title: 'Échec de connexion',
          description: message,
        });
      }
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Background with warm gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-slate-900 dark:via-amber-950 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,182,71,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,182,71,0.05),transparent_50%)]" />
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-amber-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-amber-400 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </div>

      {/* Login form container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col justify-center w-full max-w-md mx-auto px-8"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 rounded-2xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg dark:border-slate-800"
        >
          {/* Logo and header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
              <div className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <Image
              src={logo}
              alt="Logo"
              className="object-contain"
              priority
              
              style={{
                position: 'absolute',
    height:' 22%',
    width: '100%',
    inset:' 0px',
    color: 'transparent',
    top: '8px'
              }}
            />
          
            <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-2">
              Accédez à votre espace de travail
            </p>
          </div>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username input */}
              <div className="relative">
                <div className={cn(
                  "absolute left-3 top-3 transition-colors",
                  focused === 'login' ? "text-amber-600 dark:text-amber-400" : "text-amber-400/60 dark:text-amber-500/40"
                )}>
                  <User className="h-5 w-5" />
                </div>
                <Input
                  name="login"
                  type="text"
                  value={loginData.login}
                  onChange={(e) => setLoginData(prev => ({ ...prev, login: e.target.value }))}
                  onFocus={() => setFocused('login')}
                  onBlur={() => setFocused(null)}
                  className={cn(
                    "pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-amber-200 dark:border-amber-900/30",
                    focused === 'login' && "ring-2 ring-amber-500/20 border-amber-400 dark:border-amber-700"
                  )}
                  placeholder="Identifiant"
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <div className={cn(
                  "absolute left-3 top-3 transition-colors",
                  focused === 'password' ? "text-amber-600 dark:text-amber-400" : "text-amber-400/60 dark:text-amber-500/40"
                )}>
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  name="motdepasse"
                  type="password"
                  value={loginData.motdepasse}
                  onChange={(e) => setLoginData(prev => ({ ...prev, motdepasse: e.target.value }))}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className={cn(
                    "pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-amber-200 dark:border-amber-900/30",
                    focused === 'password' && "ring-2 ring-amber-500/20 border-amber-400 dark:border-amber-700"
                  )}
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <Button
                variant="link"
                className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 p-0 h-auto font-normal"
                onClick={() => router.push('/forgot-password')}
              >
                Mot de passe oublié ?
              </Button>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-amber-600 dark:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 text-white"
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
      </motion.div>
    </div>
  );
}