import React, { useState } from 'react';
import { SimrsModule, ERDModel, Entity } from '../types';
import { generateERD } from '../services/geminiService';
import { Settings, Play, RefreshCw, AlertCircle, Database, Key, Link as LinkIcon } from 'lucide-react';

interface GeneratorProps {
  modules: SimrsModule[];
  setModules: React.Dispatch<React.SetStateAction<SimrsModule[]>>;
}

const Generator: React.FC<GeneratorProps> = ({ modules, setModules }) => {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<ERDModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m));
  };

  const handleGenerate = async () => {
    const selected = modules.filter(m => m.selected);
    if (selected.length === 0) {
      setError("Pilih setidaknya satu modul untuk di-generate.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const moduleNames = selected.map(m => m.name);
      const result = await generateERD(moduleNames);
      setModel(result);
    } catch (err: any) {
      setError(err.message || "Gagal menghasilkan model. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col z-10 shadow-lg md:shadow-none h-auto md:h-full">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Konfigurasi Modul
          </h2>
          <p className="text-xs text-slate-500 mt-1">Pilih cakupan sistem untuk dimodelkan.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {modules.map(mod => (
            <div 
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                mod.selected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  mod.selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                }`}>
                  {mod.selected && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <div>
                  <div className={`font-medium text-sm ${mod.selected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {mod.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {error && (
            <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all ${
              loading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Generate Model
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        {!model && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 min-h-[400px]">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <Database className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-medium">Model Data belum dibuat</p>
            <p className="text-sm max-w-xs text-center">Pilih modul di sebelah kiri dan klik "Generate Model" untuk melihat struktur ERD.</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">Merancang Struktur Data...</h3>
              <p className="text-slate-500 text-sm">AI sedang menganalisis entitas dan relasi untuk modul terpilih.</p>
            </div>
          </div>
        )}

        {model && !loading && (
          <div className="animate-fade-in space-y-10 pb-20">
             
             {/* Header */}
             <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Hasil Desain Logis</h2>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span>{model.entities.length} Entitas</span>
                  <span>•</span>
                  <span>{model.relationships.length} Relasi</span>
                </div>
             </div>

             {/* Entities Grid */}
             <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {model.entities.map((entity, i) => (
                  <EntityCard key={i} entity={entity} />
                ))}
             </div>

             {/* Relationships Table */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-800">Daftar Relasi (Relationships)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Entitas Asal</th>
                        <th className="px-6 py-3 font-medium">Kardinalitas</th>
                        <th className="px-6 py-3 font-medium">Entitas Target</th>
                        <th className="px-6 py-3 font-medium">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.relationships.map((rel, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium text-indigo-700">{rel.source}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono font-bold">
                              {rel.cardinality}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-indigo-700">{rel.target}</td>
                          <td className="px-6 py-4 text-slate-600">{rel.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EntityCard: React.FC<{ entity: Entity }> = ({ entity }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
    <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
      <h3 className="font-bold text-slate-800 text-lg">{entity.name}</h3>
      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{entity.description}</p>
    </div>
    <div className="p-0 flex-1">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-medium">
          <tr>
            <th className="px-5 py-2 text-left w-8">Key</th>
            <th className="px-5 py-2 text-left">Attribute</th>
            <th className="px-5 py-2 text-right">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {entity.attributes.map((attr, idx) => (
            <tr key={idx} className="hover:bg-indigo-50/30">
              <td className="px-5 py-2.5">
                <div className="flex gap-1">
                  {attr.isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-500 fill-amber-500" title="PK" />}
                  {attr.isForeignKey && <Key className="w-3.5 h-3.5 text-slate-400 rotate-180" title="FK" />}
                </div>
              </td>
              <td className={`px-5 py-2.5 ${attr.isPrimaryKey ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
                {attr.name}
              </td>
              <td className="px-5 py-2.5 text-right font-mono text-xs text-slate-500 uppercase">
                {attr.dataType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Generator;
