import React from 'react';
import { Registration } from '../types';
import { MOCK_POLIS } from '../constants';
import { Clock, CheckCircle, Users } from 'lucide-react';

interface QueueViewProps {
  registrations: Registration[];
}

const QueueView: React.FC<QueueViewProps> = ({ registrations }) => {
  const getQueueForPoli = (poliId: string) => {
    return registrations.filter(r => r.poliId === poliId && r.status === 'WAITING');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Monitor Antrian</h2>
           <p className="text-slate-500">Status antrian real-time per poliklinik.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
          Total Pasien Hari Ini: <span className="text-indigo-600 font-bold text-lg ml-1">{registrations.length}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {MOCK_POLIS.map(poli => {
          const queue = getQueueForPoli(poli.id);
          const current = queue.length > 0 ? queue[0] : null;
          const waitingCount = Math.max(0, queue.length - 1);

          return (
            <div key={poli.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="font-bold text-indigo-900">{poli.name}</h3>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded text-indigo-600 border border-indigo-200">{poli.code}</span>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Nomor Antrian Saat Ini</p>
                <div className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
                  {current ? current.queueNumber : '-'}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>Menunggu: {waitingCount} orang</span>
                </div>
              </div>
              {current && (
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                   <span>Pasien: {current.patientName}</span>
                   <span className="font-medium text-slate-700">{current.paymentMethod}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Riwayat Pendaftaran Terkini</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3">No. Antrian</th>
                <th className="px-6 py-3">Nama Pasien</th>
                <th className="px-6 py-3">Poli Tujuan</th>
                <th className="px-6 py-3">Dokter</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada pendaftaran hari ini.</td>
                </tr>
              ) : (
                [...registrations].reverse().map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(reg.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-indigo-600">{reg.queueNumber}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{reg.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.poliName}</td>
                    <td className="px-6 py-4 text-slate-600">{reg.doctorName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reg.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {reg.status === 'WAITING' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueueView;
