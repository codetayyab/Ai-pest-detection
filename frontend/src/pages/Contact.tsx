import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, User } from 'lucide-react';
import { Language, translations } from '../translations';

interface ContactProps {
  lang: Language;
}

export const Contact: React.FC<ContactProps> = ({ lang }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{t.contactTitle}</h1>
        <p className="text-emerald-100/50 text-sm sm:text-base">{t.contactSubtitle}</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/5 shadow-xl">
        {isSuccess ? (
          <div className="text-center py-8 flex flex-col items-center animate-fade-in">
            <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 mb-4 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-sm text-emerald-100/60 leading-relaxed max-w-sm">
              {t.contactSuccess}
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-emerald-100/50 uppercase tracking-wider mb-2">
                {t.fullName}
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'John Doe' : 'صارف کا نام'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-emerald-100 placeholder-emerald-100/30"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-100/30" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-emerald-100/50 uppercase tracking-wider mb-2">
                {t.email}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-emerald-100 placeholder-emerald-100/30"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-100/30" />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-emerald-100/50 uppercase tracking-wider mb-2">
                {t.message}
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder={lang === 'en' ? 'Type your message here...' : 'اپنا پیغام یہاں ٹائپ کریں...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-emerald-100 placeholder-emerald-100/30 min-h-[100px]"
                />
                <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-100/30" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  <span>{t.sendMessage}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
