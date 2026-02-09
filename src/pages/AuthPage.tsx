import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSignUpMutation, useSignInMutation } from '../services/auth.service';
import { Chrome, Sparkles, Mail, Lock, User, CheckCircle, XCircle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { GENDER } from '../utils/enum';
import backgroundGif from '../assets/background.gif';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Custom styles for React Day Picker in dark mode
const datePickerStyles = `
  .rdp-dropdown_year, .rdp-dropdown_month {
    background-color: #111827; /* gray-900 */
    color: white;
    border: 1px solid #374151; /* gray-700 */
    border-radius: 0.5rem;
    padding: 0.25rem;
    cursor: pointer;
    outline: none;
  }
  .rdp-dropdown_year:focus, .rdp-dropdown_month:focus {
    border-color: #4f46e5; /* indigo-600 */
  }
  /* Style the options within the select */
  option {
    background-color: #111827;
    color: white;
  }
  /* Remove default select styling if needed or enhance it */
  .rdp-caption_dropdowns {
    display: flex;
    gap: 0.5rem;
  }
`;

// --- Types ---

interface SignInFormValues {
  email?: string;
  password?: string;
}

interface SignUpFormValues {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  surname?: string;
  gender?: number;
  dob?: Date | string; // Allow Date object for Controller
}

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { mutate: signUp, isPending: isSignUpPending } = useSignUpMutation();
  const { mutate: signIn, isPending: isSignInPending } = useSignInMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const activationStatus = searchParams.get('activation_status');
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // --- Forms ---
  
  const signInForm = useForm<SignInFormValues>();
  const signUpForm = useForm<SignUpFormValues>({
    defaultValues: {
      gender: GENDER.MALE,
    }
  });

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---

  const onSignInSubmit = (data: SignInFormValues) => {
    signIn(data, {
      onSuccess: (data: any) => {
        toast.success(
            data.message || t("toast.welcome_back")
        );
        navigate('/messages');
      }
    });
  };

  const onSignUpSubmit = (data: SignUpFormValues) => {
    // Basic structural validation can be done here if needed, but we rely on server for logic
    if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }

    // Transform Date object to yyyy-mm-dd string
    const formattedData = {
        ...data,
        dob: data.dob instanceof Date ? format(data.dob, 'yyyy-MM-dd') : data.dob
    };

    console.log("Submitting sign up data:", formattedData);

    signUp(formattedData, {
      onSuccess: (data: any) => {
        setIsSignUpSuccess(true);
        if (data?.message) {
            toast.success(data.message);
        }
      }
    });
  };

  const renderActivationStatus = () => {
      let icon = null;
      let title = "";
      let description = "";

      if (activationStatus === 'confirmed') {
          icon = <CheckCircle className="w-16 h-16 text-green-500 mb-4" />;
          title = t('auth.activation_success_title', 'Account Activated');
          description = t('auth.activation_success_desc', 'Your account has been successfully activated! You can now sign in.');
      } else if (activationStatus === 'invalid') {
          icon = <XCircle className="w-16 h-16 text-red-500 mb-4" />;
          title = t('auth.activation_invalid_title', 'Invalid Token');
          description = t('auth.activation_invalid_desc', 'The activation token is invalid or has expired. Please try signing up again.');
      } else if (activationStatus === 'already') {
          icon = <AlertCircle className="w-16 h-16 text-blue-500 mb-4" />;
          title = t('auth.activation_already_title', 'Already Activated');
          description = t('auth.activation_already_desc', 'Your account is already activated. Please sign in.');
      }

      return (
          <div className="flex flex-col items-center justify-center text-center h-full">
              {icon}
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400 mb-6 max-w-xs">{description}</p>
              <button 
                  onClick={() => {
                       setSearchParams({});
                       setIsSignIn(true);
                  }}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                  {t('auth.back_to_signin', 'Back to Sign In')}
              </button>
          </div>
      );
  };

  const renderSuccessMessage = () => {
      return (
          <div className="flex flex-col items-center justify-center text-center h-full">
               <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-indigo-400" />
               </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('auth.activation_email_sent_title', 'Check Your Email')}</h2>
              <p className="text-gray-400 mb-6 max-w-sm">
                  {t('auth.activation_email_sent_desc', 'We have sent an activation link to your email address. Please check your inbox (and spam folder) to activate your account.')}
              </p>
              <button 
                  onClick={() => setIsSignUpSuccess(false)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors cursor-pointer"
              >
                   {t('auth.back_to_signin', 'Back to Sign In')}
              </button>
          </div>
      );
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      <style>{datePickerStyles}</style>
      {/* Background elements */}
      <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
            style={{ backgroundImage: `url(${backgroundGif})` }}
        ></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <main className="w-full max-w-5xl h-[85vh] glass-panel rounded-3xl overflow-hidden flex shadow-2xl relative z-10 my-auto">
        
        {/* Left Side: Form Area */}
        <div className="w-full lg:w-1/2 p-5 md:p-6 flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
            
            {/* Logo Header */}
            <div className="absolute top-6 left-8 flex items-center gap-3">
                {/* <img src="/assets/logo.png" alt="Gossip Logo" className="w-8 h-8 object-contain brightness-110" /> */}
                <span className="text-xl font-bold tracking-tight text-white">Gossip</span>
            </div>

            <div className="max-w-md mx-auto w-full mt-16 lg:mt-0">
                
                {activationStatus ? (
                    renderActivationStatus()
                ) : isSignUpSuccess ? (
                    renderSuccessMessage()
                ) : (
                    <>
                        <div className="mb-2 text-center">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {isSignIn ? t('auth.welcome_back') : t('auth.create_account')}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {isSignIn ? t('auth.signin_subtitle') : t('auth.signup_subtitle')}
                            </p>
                        </div>
                        {/* Toggle */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-3 relative">
                            <div 
                                className={`w-1/2 h-full absolute left-0 top-0 bg-white/10 rounded-xl transition-all duration-300 ${isSignIn ? 'translate-x-0' : 'translate-x-full'}`}
                            ></div>
                            <button 
                                onClick={() => {
                                    setIsSignIn(true);
                                    signInForm.reset();
                                }}
                                className={`flex-1 py-2 text-sm font-medium relative z-10 transition-colors ${isSignIn ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t('auth.tab_signin')}
                            </button>
                            <button 
                                onClick={() => setIsSignIn(false)}
                                className={`flex-1 py-2 text-sm font-medium relative z-10 transition-colors ${!isSignIn ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t('auth.tab_signup')}
                            </button>
                        </div>

                        {isSignIn ? (
                            // --- SIGN IN FORM ---
                            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-xs font-medium text-gray-300">{t('auth.label_email')}</label>
                                        {signInForm.formState.errors.email && <span className="text-red-400 text-[10px]">{t('auth.validation_email_required')}</span>}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                        <input 
                                            {...signInForm.register("email", { required: t('auth.validation_email_required') })}
                                            type="email" 
                                            className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all" 
                                            placeholder={t('auth.placeholder_email')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-xs font-medium text-gray-300">{t('auth.label_password')}</label>
                                        {signInForm.formState.errors.password ? (
                                            <span className="text-red-400 text-[10px]">{signInForm.formState.errors.password.message}</span>
                                        ) : (
                                            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">{t('auth.forgot_password')}</a>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                        <input 
                                            {...signInForm.register("password", { required: t('auth.validation_password_required') })}
                                            type="password" 
                                            className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all" 
                                            placeholder={t('auth.placeholder_password')}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 text-sm cursor-pointer">
                                    {t('auth.btn_signin')}
                                </button>
                        </form>
                        ) : (
                            // --- SIGN UP FORM ---
                            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-gray-300">{t('auth.label_name')}</label>
                                            {signUpForm.formState.errors.name && <span className="text-red-400 text-[10px]">{t('auth.validation_name_required')}</span>}
                                        </div>
                                        <input {...signUpForm.register("name", { required: t('auth.validation_name_required') })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t('auth.placeholder_name')} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-gray-300">{t('auth.label_surname')}</label>
                                            {signUpForm.formState.errors.surname && <span className="text-red-400 text-[10px]">{t('auth.validation_surname_required')}</span>}
                                        </div>
                                        <input {...signUpForm.register("surname", { required: t('auth.validation_surname_required') })} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t('auth.placeholder_surname')} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-medium text-gray-300">Username</label>
                                        {signUpForm.formState.errors.username && <span className="text-red-400 text-[10px]">{signUpForm.formState.errors.username.message}</span>}
                                    </div>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3 top-3 text-gray-500" />
                                        <input {...signUpForm.register("username", { required: "Username is required" })} className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t("auth.placeholder_username")} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-medium text-gray-300">Email</label>
                                        {signUpForm.formState.errors.email && <span className="text-red-400 text-[10px]">{signUpForm.formState.errors.email.message}</span>}
                                    </div>
                                    <div className="relative">
                                        <Mail size={14} className="absolute left-3 top-3 text-gray-500" />
                                        <input {...signUpForm.register("email", { required: "Email is required" })} type="email" className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t("auth.placeholder_email")} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">{t('auth.label_gender')}</label>
                                        <select {...signUpForm.register("gender")} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none">
                                            <option value={GENDER.MALE}>{t('auth.gender_male')}</option>
                                            <option value={GENDER.FEMALE}>{t('auth.gender_female')}</option>
                                        </select>
                                    </div>
                                    <div className="relative" ref={datePickerRef}   >
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-gray-300">{t('auth.label_dob')}</label>
                                            {signUpForm.formState.errors.dob && <span className="text-red-400 text-[10px]">Required</span>}
                                        </div>
                                        <Controller
                                            control={signUpForm.control}
                                            name="dob"
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <>
                                                    <div 
                                                        className="relative cursor-pointer" 
                                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                                    >
                                                        <CalendarIcon size={14} className="absolute left-3 top-3 text-gray-500" />
                                                        <input 
                                                            readOnly
                                                            value={field.value ? format(field.value as Date, 'yyyy-MM-dd') : ''}
                                                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer"
                                                            placeholder={t('auth.placeholder_dob')}
                                                        />
                                                    </div>
                                                    {showDatePicker && (
                                                        <div className="absolute z-50 mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-2 right-0">
                                                            <DayPicker
                                                                mode="single"
                                                                selected={field.value as Date}
                                                                onSelect={(date) => {
                                                                    field.onChange(date);
                                                                    setShowDatePicker(false);
                                                                }}
                                                                captionLayout="dropdown"
                                                                fromYear={1900}
                                                                toYear={new Date().getFullYear()}
                                                                className="rdp-root text-white"
                                                                modifiersClassNames={{
                                                                    selected: 'bg-indigo-600 text-white rounded-full'
                                                                }}
                                                                styles={{
                                                                    caption: { color: 'white' },
                                                                    head_cell: { color: '#9ca3af' },
                                                                    day: { color: 'white' },
                                                                }}

                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-gray-300">{t('auth.label_password')}</label>
                                            {signUpForm.formState.errors.password && <span className="text-red-400 text-[10px]">Required</span>}
                                        </div>
                                        <div className="relative">
                                            <Lock size={14} className="absolute left-3 top-3 text-gray-500" />
                                            <input {...signUpForm.register("password", { required: t('auth.validation_password_required') })} type="password" className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t('auth.placeholder_password')} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs font-medium text-gray-300">{t('auth.label_confirm_password')}</label>
                                            {signUpForm.formState.errors.confirmPassword && <span className="text-red-400 text-[10px]">Required</span>}
                                        </div>
                                        <div className="relative">
                                            <Lock size={14} className="absolute left-3 top-3 text-gray-500" />
                                            <input {...signUpForm.register("confirmPassword", { required: "Confirm Password is required" })} type="password" className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={t('auth.placeholder_password')} />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSignUpPending}
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSignUpPending ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>
                        )}

                        <div className="mt-3 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-black text-gray-500">{t('auth.or_continue')}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-center">
                            <button className="flex items-center justify-center gap-3 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer group">
                                <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{t('auth.btn_google')}</span>
                            </button>
                        </div>
                    </>
                )}

            </div>
            
            <div className="mt-4 lg:absolute lg:bottom-4 lg:left-0 w-full text-center text-xs text-gray-600">
                {t('common.footer_terms')}
            </div>
        </div>

        {/* Right Side: Image Area */}
        <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
             
             {/* Language Switcher */}
             <div className="absolute top-6 right-6 z-30">
                <LanguageSwitcher className="bg-black/40 backdrop-blur-md border-white/20 hover:bg-black/60 text-white" />
             </div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10 opacity-80"></div>
            {/* Using a placeholder image or the one from the template if available */}
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 hover:scale-105 transition-transform duration-[2s] ease-in-out"
                style={{ backgroundImage: `url('/assets/download.png')` }}
             ></div>
            
            <div className="absolute bottom-12 left-12 z-20 max-w-sm">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{t('auth.hero_title')}</h3>
                <p className="text-gray-300 font-light leading-relaxed">
                    {t('auth.hero_subtitle')}
                </p>
            </div>
        </div>

      </main>
    </div>
  );
}
