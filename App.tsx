import React, { useState } from 'react';
import Header from './components/Header';
import RegistrationView from './components/RegistrationView';
import QueueView from './components/QueueView';
import Assistant from './components/Assistant';
import { Registration, ViewState } from './types';
import { Printer, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('registration');
  const [showAssistant, setShowAssistant] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [lastRegistration, setLastRegistration] = useState<Registration | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = (newReg: Registration) => {
    setRegistrations(prev => [...prev, newReg]);
    setLastRegistration(newReg);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setView('queue'); // Auto redirect to queue view
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Header 
        currentView={currentView} 
        setView={setView} 
        toggleAssistant={() => setShowAssistant(!showAssistant)}
        showAssistant={showAssistant}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${showAssistant ? 'mr-0 md:mr-96' : ''}`}>
          
          {currentView === 'registration' && (
            <div className="animate-fade-in">
              <RegistrationView onRegister={handleRegister} />
            </div>
          )}
          
          {currentView === 'queue' && (
            <div className="animate-fade-in">
              <QueueView registrations={registrations} />
            </div>
          )}

        </main>

        {/* Sliding Assistant Panel */}
        <div className={`fixed right-0 top-16 bottom-0 w-full md:w-96 transform transition-transform duration-300 ease-in-out z-30 ${showAssistant ? 'translate-x-0' : 'translate-x-full'}`}>
           <Assistant onClose={() => setShowAssistant(false)} />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && lastRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
            <div className="bg-green-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Pendaftaran Berhasil!</h3>
              <p className="text-green-100 text-sm mt-1">Data pasien telah tersimpan di sistem.</p>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 text-center mb-6">
                 <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nomor Antrian Anda</p>
                 <p className="text-4xl font-bold text-slate-800">{lastRegistration.queueNumber}</p>
                 <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="font-semibold text-indigo-700">{lastRegistration.poliName}</p>
                    <p className="text-sm text-slate-600">{lastRegistration.doctorName}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={closeSuccessModal}
                  className="py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button className="py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
