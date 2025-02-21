'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sun } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';  // Import du hook useToast

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    login: '',
    motdepasse: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();  // Initialisation du toast

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.login || !loginData.motdepasse) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
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
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erreur lors de la connexion';
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: message,
        });
      }
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#4e73df] to-[#6f42c1] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 mb-6 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Soleil Communication</h1>
          <p className="text-[#bfdbfe]">MultiService</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-white mb-2">
                Login
              </label>
              <input
                id="login"
                type="text"
                name="login"
                value={loginData.login}
                onChange={handleChange}
                placeholder="Votre identifiant"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="motdepasse" className="block text-sm font-medium text-white mb-2">
                Mot de passe
              </label>
              <input
                id="motdepasse"
                type="password"
                name="motdepasse"
                value={loginData.motdepasse}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
