import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function WhitelistForm() {
  const [formData, setFormData] = useState({
    discord_username: '',
    in_game_name: '',
    age: '',
    timezone: '',
    experience: '',
    character_story: '',
    why_join: '',
    rules_agreed: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [comingSoon] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rules_agreed) {
      setErrorMessage('You must agree to the server rules to continue');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('whitelist_applications')
        .insert([{
          discord_username: formData.discord_username,
          in_game_name: formData.in_game_name,
          age: parseInt(formData.age),
          timezone: formData.timezone,
          experience: formData.experience,
          character_story: formData.character_story,
          why_join: formData.why_join,
          rules_agreed: formData.rules_agreed,
        }]);

      if (error) throw error;

      setStatus('success');
      setFormData({
        discord_username: '',
        in_game_name: '',
        age: '',
        timezone: '',
        experience: '',
        character_story: '',
        why_join: '',
        rules_agreed: false,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMessage('Failed to submit application. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="whitelist" className="py-20 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Whitelist Application
          </h2>
          <p className="text-xl text-gray-400">
            Apply to join our exclusive roleplay community
          </p>
        </div>

        {comingSoon ? (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
            <Clock className="w-16 h-16 text-emerald-400 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-4">Applications Opening Soon</h3>
            <p className="text-gray-400 text-lg mb-6">
              We're currently preparing to launch. Join our Discord to be notified when applications open!
            </p>
            <a
              href={import.meta.env.VITE_DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join Our Discord
            </a>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-semibold">Application Submitted Successfully!</p>
                  <p className="text-gray-400 text-sm mt-1">
                    We'll review your application and contact you on Discord soon.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">Error</p>
                  <p className="text-gray-400 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="discord_username" className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Username *
                  </label>
                  <input
                    type="text"
                    id="discord_username"
                    name="discord_username"
                    value={formData.discord_username}
                    onChange={handleChange}
                    required
                    placeholder="username#0000"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="in_game_name" className="block text-sm font-medium text-gray-300 mb-2">
                    In-Game Name *
                  </label>
                  <input
                    type="text"
                    id="in_game_name"
                    name="in_game_name"
                    value={formData.in_game_name}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="16"
                    placeholder="18"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone *
                  </label>
                  <input
                    type="text"
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    required
                    placeholder="GMT/BST"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                  Previous Roleplay Experience *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us about your previous roleplay experience..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="character_story" className="block text-sm font-medium text-gray-300 mb-2">
                  Character Backstory *
                </label>
                <textarea
                  id="character_story"
                  name="character_story"
                  value={formData.character_story}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Write your character's backstory..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="why_join" className="block text-sm font-medium text-gray-300 mb-2">
                  Why do you want to join County Lines RP? *
                </label>
                <textarea
                  id="why_join"
                  name="why_join"
                  value={formData.why_join}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us why you want to be part of our community..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="rules_agreed"
                  name="rules_agreed"
                  checked={formData.rules_agreed}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="rules_agreed" className="text-sm text-gray-400">
                  I have read and agree to follow all server rules and understand that breaking them may result in removal from the server *
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg shadow-emerald-500/30 disabled:shadow-none"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
