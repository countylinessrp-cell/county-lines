import { useEffect, useState } from 'react';
import { supabase, TeamMember } from '../lib/supabase';
import { Crown, Shield, Code, Headphones, Users } from 'lucide-react';

const roleIcons: Record<string, typeof Crown> = {
  'Owner': Crown,
  'Admin': Shield,
  'Developer': Code,
  'Support': Headphones,
};

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const Icon = roleIcons[role] || Shield;
    return Icon;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Owner': 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
      'Admin': 'text-red-400 border-red-400/20 bg-red-400/5',
      'Developer': 'text-blue-400 border-blue-400/20 bg-blue-400/5',
      'Support': 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    };
    return colors[role] || 'text-gray-400 border-gray-400/20 bg-gray-400/5';
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">Loading team members...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Meet The Team
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our dedicated staff team works tirelessly to provide you with the best roleplay experience
          </p>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>Team members coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => {
              const Icon = getRoleIcon(member.role);
              const roleColorClass = getRoleColor(member.role);

              return (
                <div
                  key={member.id}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1 group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full border ${roleColorClass} text-xs font-semibold`}>
                      <Icon className="w-3 h-3" />
                      {member.role}
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    {member.discord_tag && (
                      <p className="text-sm text-gray-400 mb-3 font-mono">{member.discord_tag}</p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>
                    )}
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
