import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, navigate, redirectAfterLogin } = useApp();
  const [email, setEmail] = useState('brunarj51@gmail.com');
  const [password, setPassword] = useState('SenhaForte123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate quick secure auth roundtrip
      await new Promise(r => setTimeout(r, 450));
      
      const userName = email.split('@')[0].replace('.', ' ');
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      
      login(email, formattedName || 'Usuário FindOfertas', undefined, 'email');
    } catch (err) {
      setErrorMessage('Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMessage('Erro ao conectar com Google. Tente novamente.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo size="md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Acesse sua conta
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {redirectAfterLogin 
              ? 'Faça login para continuar para a página solicitada com seus benefícios ativos' 
              : 'Encontre onde realmente vale a pena comprar com seus cartões e benefícios'}
          </p>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-center gap-3 text-xs disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Conectando com o Google...' : 'Continuar com o Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              ou com e-mail
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Senha</label>
              <button
                type="button"
                onClick={() => navigate('forgot-password')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-slate-600 text-[11px] font-medium">Lembrar neste navegador</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2 active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Entrar no FindOfertas</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ambiente seguro e com dados protegidos</span>
        </div>

        {/* Bottom Switch */}
        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          Não possui uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('register')}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Criar conta grátis
          </button>
        </div>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle, navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Você precisa aceitar os Termos de Uso para continuar.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(r => setTimeout(r, 450));
      register(name, email);
    } catch (err) {
      setErrorMessage('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMessage('Erro ao autenticar com o Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <Logo size="md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Crie sua conta grátis
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Cadastre-se para personalizar os cálculos de custo efetivo com seus cartões e milhas
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-center gap-3 text-xs disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Cadastrar com o Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              ou com e-mail
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Criar Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter */}
            {password.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${strength >= 1 ? (strength <= 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength >= 2 ? (strength <= 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength >= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {strength <= 1 ? 'Fraca' : strength <= 2 ? 'Média' : 'Forte'}
                </span>
              </div>
            )}
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-slate-600 text-[11px] leading-tight">
                Concordo com os <span className="text-blue-600 font-bold">Termos de Uso</span> e a <span className="text-blue-600 font-bold">Política de Privacidade</span> do FindOfertas.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2 active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Cadastrar e Começar a Economizar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          Já possui uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('login')}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Fazer login
          </button>
        </div>

      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Informe um e-mail válido para recuperação.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(r => setTimeout(r, 600));
      setIsSubmitted(true);
      setResendCooldown(60);
      showToast('Instruções de recuperação enviadas para o seu e-mail!', 'success');
      
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast('Ocorreu um erro ao solicitar a recuperação.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <button
          type="button"
          onClick={() => navigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao login</span>
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <Logo size="md" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Recuperar Senha
              </h1>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Digite o e-mail cadastrado na sua conta. Enviaremos um link para você redefinir sua senha com segurança.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-2 active:scale-98 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enviar Link de Recuperação</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">Verifique seu e-mail</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Enviamos um link com as instruções para redefinir a senha para <strong className="text-slate-900">{email}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500">
              Não recebeu? Verifique a pasta de spam ou solicite o reenvio.
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleSubmit}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar e-mail'}
              </button>

              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer"
              >
                Retornar ao Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
