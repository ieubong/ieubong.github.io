
import React, { useState } from 'react';
import { ThemePack } from '../types';
import { X, Heart, Send, Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoveLetterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

const LoveLetterGenerator: React.FC<LoveLetterGeneratorProps> = ({ isOpen, onClose, theme }) => {
    const [step, setStep] = useState<'write' | 'preview'>('write');
    const [content, setContent] = useState("");
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handlePreview = () => {
        if (!content.trim() || !email.trim()) return;
        setStep('preview');
    };

    const handleSend = () => {
        setIsSending(true);
        // Simulate API call/Network delay
        setTimeout(() => {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#f472b6'] });
            setIsSending(false);
            
            // Show alert then close
            alert(`💌 Letter sent to ${email} successfully!`);
            onClose();
            
            // Reset for next time
            setTimeout(() => {
                setStep('write');
                setContent("");
                setEmail("");
            }, 500);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

            <div className={`
                relative w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden
                bg-white border-4 border-white/20 animate-pop flex flex-col items-center
                p-6
            `}>
                <div className="w-full flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {step === 'preview' && (
                             <button onClick={() => setStep('write')} className="mr-1 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-500" />
                            </button>
                        )}
                        <div className={`p-2 rounded-full ${theme.colors.primary} text-white`}>
                            <Heart size={20} fill="currentColor" />
                        </div>
                        <h2 className="font-black text-xl text-gray-800">Love Letter</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>

                {step === 'write' ? (
                    <div className="w-full space-y-4 animate-fade-in">
                        <p className="text-sm text-gray-500 mb-2">Write a sweet message to your special someone.</p>
                        
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-400 ml-1">To (Email)</label>
                            <div className="relative mt-1">
                                <div className="absolute top-3.5 left-3 text-gray-400 pointer-events-none">
                                    <Mail size={16} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    className="w-full bg-gray-50 rounded-xl p-3 pl-10 font-bold text-gray-800 border-2 border-transparent focus:border-pink-300 outline-none transition-all placeholder-gray-300" 
                                    placeholder="partner@love.com" 
                                />
                            </div>
                        </div>

                         <div>
                            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Message</label>
                            <textarea 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                className="w-full bg-gray-50 rounded-xl p-3 mt-1 font-medium text-gray-800 border-2 border-transparent focus:border-pink-300 outline-none transition-all min-h-[150px] resize-none placeholder-gray-300 leading-relaxed" 
                                placeholder="Write your heart out..." 
                            />
                        </div>

                        <button 
                            onClick={handlePreview}
                            disabled={!content.trim() || !email.trim()}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg mt-4 transform active:scale-95 transition-all flex items-center justify-center gap-2 ${content.trim() && email.trim() ? theme.colors.primary : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            Preview Letter <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-pop">
                         {/* Preview Card */}
                         <div className="relative bg-[#fff1f2] p-6 rounded-lg shadow-md border border-pink-100 rotate-1 mb-6 w-full">
                            {/* Stamp */}
                            <div className="absolute top-4 right-4 w-12 h-14 bg-white border-2 border-dashed border-pink-300 flex items-center justify-center transform rotate-6 shadow-sm">
                                <Heart size={20} className="text-pink-400" fill="currentColor" />
                            </div>
                            
                            <div className="mb-4 pr-16">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">To:</p>
                                <p className="font-bold text-gray-800 truncate">{email}</p>
                            </div>

                             <div className="w-full h-px bg-pink-200 mb-4"></div>

                             <p className="font-handwriting text-lg text-gray-800 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                                 {content}
                             </p>
                         </div>

                         <button 
                            onClick={handleSend} 
                            disabled={isSending}
                            className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all active:scale-95 ${theme.colors.secondary}`}
                         >
                             {isSending ? 'Sending...' : <><Send size={18} /> Send Love</>}
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoveLetterGenerator;
