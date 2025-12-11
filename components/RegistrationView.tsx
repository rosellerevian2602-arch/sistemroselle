import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Phone, MapPin, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Patient, Doctor, Poli, Registration } from '../types';
import { MOCK_PATIENTS, MOCK_DOCTORS, MOCK_POLIS } from '../constants';

interface RegistrationViewProps {
  onRegister: (reg: Registration) => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ onRegister }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchNik, setSearchNik] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatientMode, setNewPatientMode] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '', nik: '', dob: '', address: '', phone: '', gender: 'L', insuranceType: 'UMUM'
  });
  
  const [selectedPoli, setSelectedPoli] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UMUM');
  
  // Derived state
  const availableDoctors = MOCK_DOCTORS.filter(d => d.poliId === selectedPoli);
  const currentPoli = MOCK_POLIS.find(p => p.id === selectedPoli);

  const handleSearch = () => {
    const found = MOCK_PATIENTS.find(p => p.nik === searchNik || p.mrNumber === searchNik);
    if (found) {
      setSelectedPatient(found);
      setNewPatientMode(false);
      setFormData(found);
    } else {
      setSelectedPatient(null);
      setNewPatientMode(true);
      setFormData({ nik: searchNik }); // Pre-fill NIK
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient && !newPatientMode) return;
    if (!selectedPoli || !selectedDoctor) return;

    const patientName = selectedPatient ? selectedPatient.name : formData.name!;
    const patientMr = selectedPatient ? selectedPatient.mrNumber : `NEW-${Date.now().toString().slice(-4)}`;
    
    // Generate Queue Number (Mock Logic)
    const poliCode = currentPoli?.code || 'X';
    const queueNum = `${poliCode}-${Math.floor(Math.random() * 20) + 1}`;

    const newReg: Registration = {
      id: Date.now().toString(),
      patientId: selectedPatient?.id || 'new',
      patientName: patientName,
      patientMr: patientMr,
      poliId: selectedPoli,
      poliName: currentPoli?.name || '',
      doctorId: selectedDoctor,
      doctorName: MOCK_DOCTORS.find(d => d.id === selectedDoctor)?.name || '',
      queueNumber: queueNum,
      visitDate: new Date().toISOString(),
      paymentMethod: paymentMethod,
      status: 'WAITING',
      timestamp: Date.now()
    };

    onRegister(newReg);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Pendaftaran Pasien Baru</h2>
        <p className="text-slate-500">Silakan cari data pasien atau isi formulir pendaftaran.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Step 1: Patient Data */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              1. Identitas Pasien
            </h3>
            
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchNik}
                  onChange={(e) => setSearchNik(e.target.value)}
                  placeholder="Cari NIK atau No. RM" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Cari
              </button>
            </div>

            {(selectedPatient || newPatientMode) && (
              <div className="space-y-4 animate-fade-in">
                {selectedPatient && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-sm">Pasien Ditemukan</p>
                      <p className="text-xs">{selectedPatient.name} - {selectedPatient.mrNumber}</p>
                    </div>
                  </div>
                )}
                {newPatientMode && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">Pasien baru. Silakan lengkapi data.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={selectedPatient?.name || formData.name}
                      onChange={e => !selectedPatient && setFormData({...formData, name: e.target.value})}
                      disabled={!!selectedPatient}
                      className="w-full p-2 border border-slate-200 rounded-md bg-white disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={selectedPatient?.dob || formData.dob}
                      onChange={e => !selectedPatient && setFormData({...formData, dob: e.target.value})}
                      disabled={!!selectedPatient}
                      className="w-full p-2 border border-slate-200 rounded-md bg-white disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Alamat</label>
                    <input 
                      type="text" 
                      value={selectedPatient?.address || formData.address}
                      onChange={e => !selectedPatient && setFormData({...formData, address: e.target.value})}
                      disabled={!!selectedPatient}
                      className="w-full p-2 border border-slate-200 rounded-md bg-white disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-opacity ${!selectedPatient && !newPatientMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              2. Data Kunjungan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Poli Tujuan</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MOCK_POLIS.map(poli => (
                    <div 
                      key={poli.id}
                      onClick={() => { setSelectedPoli(poli.id); setSelectedDoctor(''); }}
                      className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${
                        selectedPoli === poli.id 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' 
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-xs text-slate-500 mb-1">{poli.code}</div>
                      {poli.name}
                    </div>
                  ))}
                </div>
              </div>

              {selectedPoli && (
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Dokter</label>
                   <select 
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                   >
                     <option value="">-- Pilih Dokter --</option>
                     {availableDoctors.map(doc => (
                       <option key={doc.id} value={doc.id} disabled={doc.status !== 'AVAILABLE'}>
                         {doc.name} {doc.status !== 'AVAILABLE' ? `(${doc.status})` : ''}
                       </option>
                     ))}
                   </select>
                   {selectedDoctor && (
                     <p className="text-xs text-slate-500 mt-2">
                       Jadwal: {availableDoctors.find(d => d.id === selectedDoctor)?.schedule}
                     </p>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Payment & Summary */}
        <div className="md:col-span-1">
          <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6 ${!selectedDoctor ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
             <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              3. Pembayaran
            </h3>
            
            <div className="space-y-3 mb-6">
              {['UMUM', 'BPJS', 'ASURANSI_LAIN'].map(method => (
                <label key={method} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">
                    {method === 'ASURANSI_LAIN' ? 'Asuransi Lain' : method}
                  </span>
                </label>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 mb-6">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Ringkasan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Poli</span>
                  <span className="font-medium">{currentPoli?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dokter</span>
                  <span className="font-medium text-right line-clamp-1 w-32">{availableDoctors.find(d => d.id === selectedDoctor)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pasien</span>
                  <span className="font-medium text-right line-clamp-1 w-32">{selectedPatient?.name || formData.name}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Daftarkan Pasien <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
