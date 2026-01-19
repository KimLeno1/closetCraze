import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Zap, Shield, Sparkles, Loader2, X, ShoppingBag, Bookmark, Target, Maximize2 } from 'lucide-react';
import { Product, UserStatus } from '../types';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';
import { GoogleGenAI } from "@google/genai";

interface TryOnPanelProps {
  userStatus: UserStatus;
  onAddToCart: (id: string) => void;
  onAddToVault: (id: string) => void;
  initialProductId?: string;
}

export const TryOnPanel: React.FC<TryOnPanelProps> = ({ userStatus, onAddToCart, onAddToVault, initialProductId }) => {
  const allProducts = [...PRODUCTS, ...ARCHIVE_PRODUCTS];
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    allProducts.find(p => p.id === initialProductId) || allProducts[0]
  );
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const analyzeIdentityFit = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context && videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                text: `Analyze this user's silhouette and posture in relation to the "${selectedProduct.name}". 
                Explain why this piece enhances their "Status Hierarchy" as a ${userStatus}. 
                Mention specific visual alignment like 'architectural shoulder profile' or 'chromatic resonance'.
                Tone: Brutalist, elite, tactical. Max 30 words.`,
              },
            ],
          },
        });
        setAnalysis(response.text);
      } catch (err) {
        setAnalysis("Geometric alignment confirmed. The silhouette reinforces tactical dominance while preserving the mystery of the collective.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-32 px-4 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-8 overflow-x-hidden">
      {/* HUD / Camera Viewport */}
      <div className="flex-1 relative aspect-[4/5] sm:aspect-video lg:aspect-auto bg-stone-900 rounded-sm border border-white/10 overflow-hidden group shadow-2xl min-h-[400px]">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 px-6 text-center">
            <Camera size={48} className="text-stone-800" strokeWidth={1} />
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-600 italic">Optical Feed Offline</h4>
              <p className="text-[10px] text-stone-700 uppercase tracking-widest max-w-[200px]">Allow camera access to synchronize your silhouette.</p>
            </div>
            <button 
              onClick={startCamera}
              className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-500 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Initialize Sensors
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale transition-all duration-1000"
            />
            {/* HUD Overlay Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/50">Rec // Optical Synthesis</span>
              </div>
              
              <div className="absolute inset-4 md:inset-8 border border-white/5 opacity-40">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/10" />
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-white/10" />
                <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-white/10" />
                <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10" />
              </div>

              {/* Tactical Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />
            </div>

            {/* Analysis Result (Float) */}
            {analysis && (
              <div className="absolute bottom-6 left-6 right-6 md:bottom-auto md:top-8 md:right-8 md:left-auto md:w-72 p-6 bg-black/80 backdrop-blur-2xl border border-amber-500/20 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={14} className="text-amber-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Identity Audit</span>
                </div>
                <p className="text-[11px] md:text-xs font-serif italic text-stone-200 leading-relaxed mb-4">
                  "{analysis}"
                </p>
                <div className="h-px w-full bg-white/5 mb-4" />
                <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-stone-700">
                  <span>Hash: 88A-Z01</span>
                  <span className="text-green-500">Verified</span>
                </div>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0 pb-12">
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-700">Tactical Deployment</h2>
            <h3 className="text-2xl sm:text-3xl font-serif italic">Virtual Try-On</h3>
          </div>

          {/* Product Selector */}
          <div className="space-y-4">
            <p className="text-[8px] uppercase tracking-widest text-stone-800 font-black">Selected Silhouette</p>
            <div className="flex items-center gap-4 bg-black border border-white/5 p-3 rounded-sm group hover:border-white/10 transition-all cursor-default">
              <div className="w-14 h-18 bg-stone-900 grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
                <img src={selectedProduct.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-black uppercase tracking-widest text-white truncate">{selectedProduct.name}</h4>
                <p className="text-[8px] uppercase tracking-tighter text-stone-700 mt-1 font-bold">VAL: GH₵{selectedProduct.price} // {selectedProduct.category}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={analyzeIdentityFit}
              disabled={isAnalyzing || !isCameraActive}
              className="w-full bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-30 shadow-2xl"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:fill-current" />}
              {isAnalyzing ? 'Analyzing Core...' : 'Sync Compatibility'}
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(selectedProduct.id)}
                className="flex-1 bg-white/5 border border-white/10 py-5 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={14} />
                Deploy
              </button>
              <button 
                onClick={() => onAddToVault(selectedProduct.id)}
                className="p-5 border border-white/10 hover:bg-white hover:text-black transition-all flex items-center justify-center"
              >
                <Bookmark size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Browser Collection */}
        <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] lg:max-h-none custom-scrollbar pr-2">
          <p className="text-[8px] uppercase tracking-[0.4em] text-stone-800 font-black px-2 mb-4">Rotation Queue</p>
          {allProducts.map(p => (
            <div 
              key={p.id}
              onClick={() => { setSelectedProduct(p); setAnalysis(null); }}
              className={`flex items-center gap-4 p-4 border transition-all cursor-pointer group ${selectedProduct.id === p.id ? 'bg-white/5 border-amber-500/40' : 'bg-transparent border-white/5 hover:border-white/10'}`}
            >
              <div className={`w-10 h-14 bg-stone-900 grayscale group-hover:grayscale-0 transition-all shrink-0 ${selectedProduct.id === p.id ? 'grayscale-0' : ''}`}>
                <img src={p.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h5 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedProduct.id === p.id ? 'text-amber-500' : 'text-stone-500 group-hover:text-white'}`}>{p.name}</h5>
                <p className="text-[7px] text-stone-800 uppercase font-bold mt-1 tracking-tighter">{p.mood} // {p.fitConfidence}% Match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};