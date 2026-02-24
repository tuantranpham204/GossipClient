import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, X, Save, User, Heart, Users, Mars, Venus, Mail } from 'lucide-react';
import { RELATIONSHIP_STATUS, GENDER } from '../../utils/enum';

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (data: any) => void;
    isUpdating: boolean;
    initialData: any;
}

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <div 
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-700'}`}
    >
        <div 
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
        />
    </div>
);

const GlowWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        {children}
    </div>
);

const RadioOption = ({ 
    selected, 
    onClick, 
    label, 
    icon: Icon 
}: { 
    selected: boolean; 
    onClick: () => void; 
    label: string; 
    icon: any 
}) => (
    <GlowWrapper>
        <div 
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200 h-full ${
                selected 
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                    : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/5'
            }`}
        >
            <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-indigo-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        </div>
    </GlowWrapper>
);

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, onUpdate, isUpdating, initialData }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            surname: '',
            bio: '',
            dob: '',
            gender: GENDER.MALE,
            relationship_status: RELATIONSHIP_STATUS.SINGLE,
            is_email_public: false,
            is_gender_public: true,
            is_rel_status_public: true
        }
    });

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                name: initialData.name || '',
                surname: initialData.surname || '',
                bio: initialData.bio || '',
                dob: initialData.dob || '',
                gender: initialData.gender || GENDER.MALE,
                relationship_status: initialData.relationship_status || RELATIONSHIP_STATUS.SINGLE,
                is_email_public: initialData.is_email_public || false,
                is_gender_public: initialData.is_gender_public || true,
                is_rel_status_public: initialData.is_rel_status_public || true
            });
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = (data: any) => {
        if (!data.name.trim() || !data.surname.trim()) {
            return;
        }
        onUpdate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-xl font-bold text-white tracking-tight">Edit Profile</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        disabled={isUpdating}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    <form id="update-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-300 ml-1">Name</label>
                                <GlowWrapper>
                                    <input 
                                        {...register("name", { required: "Name is required" })}
                                        className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                        placeholder="Enter your name"
                                    />
                                </GlowWrapper>
                                {errors.name && <span className="text-xs text-red-400 ml-1">{errors.name.message as string}</span>}
                            </div>
                            
                            {/* Surname */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-300 ml-1">Surname</label>
                                <GlowWrapper>
                                    <input 
                                        {...register("surname", { required: "Surname is required" })}
                                        className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                        placeholder="Enter your surname"
                                    />
                                </GlowWrapper>
                                {errors.surname && <span className="text-xs text-red-400 ml-1">{errors.surname.message as string}</span>}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-300 ml-1">Bio</label>
                            <GlowWrapper>
                                <textarea 
                                    {...register("bio")}
                                    className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all min-h-[100px] resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </GlowWrapper>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* DOB */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-300 ml-1">Date of Birth</label>
                                <GlowWrapper>
                                    <input 
                                        type="date"
                                        {...register("dob")}
                                        className="relative w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all scheme-dark"
                                    />
                                </GlowWrapper>
                            </div>

                             {/* Gender */}
                             <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-300 ml-1">Gender</label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-2 gap-3">
                                            <RadioOption
                                                label="Male"
                                                icon={Mars}
                                                selected={field.value === GENDER.MALE}
                                                onClick={() => field.onChange(GENDER.MALE)}
                                            />
                                            <RadioOption
                                                label="Female"
                                                icon={Venus} 
                                                selected={field.value === GENDER.FEMALE}
                                                onClick={() => field.onChange(GENDER.FEMALE)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Relationship Status */}
                         <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-300 ml-1">Relationship Status</label>
                            <Controller
                                name="relationship_status"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-3 gap-3">
                                        <RadioOption
                                            label="Single"
                                            icon={User}
                                            selected={field.value === RELATIONSHIP_STATUS.SINGLE}
                                            onClick={() => field.onChange(RELATIONSHIP_STATUS.SINGLE)}
                                        />
                                        <RadioOption
                                            label="Taken"
                                            icon={Heart}
                                            selected={field.value === RELATIONSHIP_STATUS.IN_A_RELATIONSHIP}
                                            onClick={() => field.onChange(RELATIONSHIP_STATUS.IN_A_RELATIONSHIP)}
                                        />
                                        <RadioOption
                                            label="Married"
                                            icon={Users}
                                            selected={field.value === RELATIONSHIP_STATUS.MARRIED}
                                            onClick={() => field.onChange(RELATIONSHIP_STATUS.MARRIED)}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Privacy Settings */}
                        <div className="space-y-4 pt-6 mt-2 border-t border-white/5">
                            <h4 className="text-sm font-bold text-white mb-2">Privacy Settings</h4>
                            
                            <GlowWrapper>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Public Email</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Allow others to see your email address</p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_email_public"
                                        control={control}
                                        render={({ field }) => (
                                            <ToggleSwitch 
                                                checked={field.value} 
                                                onChange={field.onChange} 
                                            />
                                        )}
                                    />
                                </div>
                            </GlowWrapper>

                            <GlowWrapper>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Public Gender</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Show your gender on your profile</p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_gender_public"
                                        control={control}
                                        render={({ field }) => (
                                            <ToggleSwitch 
                                                checked={field.value} 
                                                onChange={field.onChange} 
                                            />
                                        )}
                                    />
                                </div>
                            </GlowWrapper>

                            <GlowWrapper>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <Heart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Public Relationship Status</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Display your relationship status</p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_rel_status_public"
                                        control={control}
                                        render={({ field }) => (
                                            <ToggleSwitch 
                                                checked={field.value} 
                                                onChange={field.onChange} 
                                            />
                                        )}
                                    />
                                </div>
                            </GlowWrapper>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-white/[0.02]">
                    <GlowWrapper>
                        <button 
                            onClick={onClose}
                            className="relative px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all w-full"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                    </GlowWrapper>
                    <GlowWrapper>
                        <button 
                            form="update-profile-form"
                            type="submit"
                            disabled={isUpdating}
                            className="relative px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </GlowWrapper>
                </div>

            </div>
        </div>
    );
};

export default UpdateProfileModal;
