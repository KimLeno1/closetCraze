import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Trophy, Gem, Activity, ShieldCheck, Zap, Cpu, ArrowUpRight, 
  Clock, Fingerprint, Loader2, Sparkles, Award, ChevronRight, 
  Target, Layers, Hexagon, BarChart3, Globe, Command
} from 'lucide-react';
import { UserStatus } from '../types';
import { STATUS_PROGRESSION } from '../constants';
import { getProfileIdentityBrief } from '../services/geminiService';

interface ProfilePanelProps {
  user: any;
  points: number;
  diamonds: number;
  userStatus: UserStatus;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, points, diamonds, userStatus }) => {
  const [identityBrief, setIdentityBrief] = useState<string | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);

  const currentStatusData = STATUS_PROGRESSION[userStatus];
  
  const statusHierarchy = [UserStatus.OBSERVER, UserStatus.INSIDER, UserStatus.TRENDSETTER, UserStatus.ICON];
  const nextStatusIndex = statusHierarchy.indexOf(userStatus) + 1;
  const nextStatus = nextStatusIndex < statusHierarchy.length ? statusHierarchy[nextStatusIndex] : null;
  const nextStatusData = nextStatus ? (STATUS_PROGRESSION as any)[nextStatus] : null;
  
  const progress = useMemo(() => {
    if (!nextStatusData) return 100;
    const range = nextStatusData.min - currentStatusData.min;
    const currentProgress = points - currentStatusData.min;
    return Math.min(100, Math.max(0, (currentProgress / range) * 100));
  }, [points, userStatus, nextStatusData, currentStatusData]);

  useEffect(() => {
    const fetchBrief = async () => {
      setIsLoadingBrief(true);
      const brief = await getProfileIdentityBrief(userStatus, points);
      setIdentityBrief(brief);
      setIsLoadingBrief(false);
    };
    fetchBrief();
  }, [userStatus, points]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-40 px-6 md:px-12 lg:px-24 page-transition overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
        
        {/* Dossier Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12 md:pb-16">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-3">
              <Fingerprint size={16} className="text-amber-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-700">Identity_Registry // 0x99A-4</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif text-white tracking-tighter leading-none break-words">
              {user?.username || 'GHOST'}<span className="italic text-stone-600 font-light">_CORE</span>
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-stone-800">
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500/40 rounded-full" /> Node: ALPHA-V1</span>
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full" /> Sync: OPTIMIZED</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
            <div className="p-8 md:p-10 bg-[#0A0A0A] border border-white/5 rounded-sm relative group cursor-default w-full md:w-auto overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 text-white">
                <Command size={40} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-800 mb-2 md:text-right">Current Tier</p>
              <p className={`text-4xl sm:text-5xl font-serif italic ${currentStatusData.color} tracking-tighter text-left md:text-right`}>
                {userStatus.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-stone-600 hover:text-white hover:border-white transition-all">Verify Key</button>
              <button className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-stone-600 hover:text-white hover:border-white transition-all">Eject Profile</button>
            </div>
          </div>
        </header>

        {/* Status Mechanics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Progression Card */}
          <div className="lg:col-span-2 p-8 md:p-12 bg-[#0A0A0C] border border-white/5 rounded-sm space-y-12 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-12 pointer-events-none">
               <Activity size={300} />
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Status Ascension</h3>
                <p className="text-[9px] text-stone-800 uppercase tracking-[0.2em] font-bold">Targeting: {nextStatus ? nextStatus.toUpperCase() : 'PEAK IDENTITY'}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-serif text-white font-black italic">{Math.floor(progress)}%</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="h-0.5 w-full bg-white/5 relative overflow-hidden rounded-full">
                <div 
                  className="h-full bg-white transition-all duration-[2.5s] ease-out shadow-[0_0_20px_#fff]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between font-mono text-[7px] font-black uppercase text-stone-900 tracking-[0.3em]">
                <span>{currentStatusData.min} PTS</span>
                <span>{nextStatusData ? `${nextStatusData.min} PTS` : 'TRANSCENDED'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/5 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-amber-500/80">
                  <Trophy size={14} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Network Points</span>
                </div>
                <p className="text-2xl md:text-3xl font-mono text-white tracking-tighter">{points.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-indigo-400/80">
                  <Gem size={14} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural Shards</span>
                </div>
                <p className="text-2xl md:text-3xl font-mono text-white tracking-tighter">{diamonds.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-green-500/80">
                  <ShieldCheck size={14} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Integrity Check</span>
                </div>
                <p className="text-2xl md:text-3xl font-mono text-white tracking-tighter">98.4%</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Rack */}
          <div className="grid grid-cols-1 gap-4">
             {[
               { label: 'Acquisitions', value: '14 Units', icon: Award },
               { label: 'Influence', value: 'Top 2%', icon: Globe },
               { label: 'Depth', value: '942 Hz', icon: Target }
             ].map((stat, i) => (
               <div key={i} className="p-6 md:p-8 bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-between group cursor-default hover:bg-white/[0.03] transition-all">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase text-stone-800 tracking-widest">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-serif text-stone-200 italic">{stat.value}</p>
                  </div>
                  <stat.icon size={18} className="text-stone-900 group-hover:text-amber-500 transition-colors" />
               </div>
             ))}
          </div>
        </div>

        {/* AI Synthetic Brief */}
        <section className="bg-[#080808] border border-white/5 p-8 sm:p-16 md:p-24 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="absolute -top-20 -left-20 p-20 opacity-[0.02] text-white pointer-events-none">
            <Cpu size={320} />
          </div>
          
          <div className="relative z-10 max-w-4xl space-y-10 md:space-y-12">
            <div className="flex items-center gap-4">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.6em] text-white">Neural Identity Synthesis</h2>
            </div>

            {isLoadingBrief ? (
              <div className="py-12 flex items-center gap-6">
                <Loader2 size={24} className="animate-spin text-stone-800" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-800 animate-pulse">Syncing status metrics across global sectors...</p>
              </div>
            ) : (
              <div className="space-y-10">
                <p className="text-2xl sm:text-4xl md:text-6xl font-serif italic leading-[1.1] text-stone-200">
                  "{identityBrief}"
                </p>
                <div className="flex flex-wrap gap-x-12 gap-y-8 pt-4">
                  {[
                    { label: 'Alignment', val: 'OPTIMIZED', color: 'bg-green-500' },
                    { label: 'Velocity', val: 'HIGH_RES', color: 'bg-amber-500' },
                    { label: 'Authority', val: 'TIER_1', color: 'bg-blue-500' },
                  ].map(m => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 ${m.color} rounded-full`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-700">{m.label} Index</span>
                      </div>
                      <p className="text-sm md:text-xl font-mono text-white tracking-widest">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Identity Milestone Map */}
        <section className="space-y-12 md:space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-8 gap-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600 flex items-center gap-3">
                <Clock size={16} /> Temporal Trajectory
              </h3>
              <p className="text-[8px] uppercase tracking-widest text-stone-800 font-bold">Chronological list of status-defining events</p>
            </div>
            <button className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-700 hover:text-white transition-colors flex items-center gap-3 self-start sm:self-auto">
               Download Logs <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-sm">
            {[
              { date: 'OCT 24', label: 'Archival Seed', desc: 'First acquisition committed to local stock.', pts: '+890', icon: Hexagon },
              { date: 'NOV 02', label: 'Sector Upgrade', desc: 'Access granted to Restricted Insider drops.', pts: 'LVL UP', icon: Zap },
              { date: 'NOV 12', label: 'Neural Link', desc: 'Optical biometric scan verified profile fit.', pts: '+250', icon: Cpu },
              { date: 'DEC 01', label: 'Consensus Gain', desc: 'Silhouette cited in 42 global snapshots.', pts: '+1,200', icon: Globe },
            ].map((m, i) => (
              <div key={i} className="p-8 md:p-10 bg-[#050505] space-y-8 group hover:bg-white/[0.02] transition-all cursor-default relative">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-black text-stone-900 tracking-[0.3em]">{m.date} // 2024</span>
                  <div className={`p-2 rounded border border-white/5 text-stone-900 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all`}>
                     <m.icon size={12} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-serif text-white group-hover:italic tracking-tight transition-all">{m.label}</h4>
                  <p className="text-[10px] text-stone-700 font-light italic leading-relaxed sm:h-12">{m.desc}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                   <span className="text-[9px] font-mono text-amber-500/60 font-black">{m.pts}</span>
                   <ChevronRight size={14} className="text-stone-900 group-hover:text-stone-700 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Audit */}
        <footer className="pt-24 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 opacity-10 hover:opacity-40 transition-opacity duration-700 pb-12">
           <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12 text-[7px] font-mono uppercase tracking-[0.5em]">
              <span className="flex items-center gap-3"><div className="w-1 h-1 bg-white rounded-full" /> System_Registry: Secure</span>
              <span className="flex items-center gap-3"><div className="w-1 h-1 bg-white rounded-full" /> Temporal_Node: Sync</span>
           </div>
           <p className="text-[8px] font-mono tracking-tighter uppercase text-center md:text-right">Checksum: {Math.random().toString(16).substring(2, 10).toUpperCase()} // v4.2.1-STABLE</p>
        </footer>
      </div>
    </div>
  );
};