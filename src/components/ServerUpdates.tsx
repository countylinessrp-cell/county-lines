import { useEffect, useState } from 'react';
import { supabase, ServerUpdate } from '../lib/supabase';
import { Megaphone, Wrench, Bug, AlertCircle } from 'lucide-react';

const updateTypeIcons = {
  feature: Megaphone,
  bugfix: Bug,
  announcement: AlertCircle,
  maintenance: Wrench,
};

const updateTypeColors = {
  feature: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
  bugfix: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
  announcement: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
  maintenance: 'bg-red-500/10 text-red-400 border-red-400/20',
};

export default function ServerUpdates() {
  const [updates, setUpdates] = useState<ServerUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('server_updates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">Loading updates...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="updates" className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Server Updates
          </h2>
          <p className="text-xl text-gray-400">
            Stay up to date with the latest changes and announcements
          </p>
        </div>

        {updates.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>No updates yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updates.map((update) => {
              const Icon = updateTypeIcons[update.update_type as keyof typeof updateTypeIcons] || AlertCircle;
              const colorClass = updateTypeColors[update.update_type as keyof typeof updateTypeColors] || updateTypeColors.announcement;

              return (
                <div
                  key={update.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center border`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {update.title}
                            {update.version && (
                              <span className="ml-2 text-sm font-mono text-emerald-400">
                                v{update.version}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(update.published_at)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} capitalize`}>
                          {update.update_type}
                        </span>
                      </div>

                      <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                        {update.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
