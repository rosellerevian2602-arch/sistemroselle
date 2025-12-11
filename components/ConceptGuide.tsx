import React from 'react';
import { Database, Box, Tag, Share2, ArrowRight } from 'lucide-react';
import { EDUCATIONAL_CONTENT } from '../constants';

interface ConceptGuideProps {
  onStartGenerator: () => void;
}

const ConceptGuide: React.FC<ConceptGuideProps> = ({ onStartGenerator }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in pb-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Database className="w-8 h-8" />
          Arsitektur Data SIMRS
        </h1>
        <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
          {EDUCATIONAL_CONTENT.intro}
        </p>
        <button 
          onClick={onStartGenerator}
          className="mt-6 bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Mulai Desain Model <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Core Components */}
      <div className="grid md:grid-cols-3 gap-6">
        {EDUCATIONAL_CONTENT.components.map((item, idx) => {
          const Icon = item.icon === 'Box' ? Box : item.icon === 'Tag' ? Tag : Share2;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Entitas Kunci SIMRS</h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-6">
            Sistem ini memiliki modul aplikasi utama yang saling terintegrasi. Untuk implementasi basis data relasional yang kuat, perhatikan entitas berikut:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Pasien', desc: 'Menyimpan data demografi dan identitas unik.' },
              { name: 'Pendaftaran', desc: 'Mencatat kunjungan (Rawat Jalan/Inap).' },
              { name: 'Rekam_Medis', desc: 'Diagnosis, tindakan, dan riwayat klinis.' },
              { name: 'Transaksi', desc: 'Detail tagihan, pembayaran, dan asuransi.' },
              { name: 'Dokter', desc: 'Data tenaga medis, spesialisasi, dan jadwal.' },
              { name: 'Obat/Resep', desc: 'Manajemen stok farmasi dan peresepan.' },
            ].map((ent, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 block">{ent.name}</span>
                  <span className="text-slate-500 text-sm">{ent.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* Notation Note */}
       <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-900">
          <div className="flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm">{EDUCATIONAL_CONTENT.notations}</p>
        </div>
    </div>
  );
};

export default ConceptGuide;
