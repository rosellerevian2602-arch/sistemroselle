import { Doctor, Patient, Poli, SimrsModule } from "./types";

export const MOCK_POLIS: Poli[] = [
  { id: 'poli-um', name: 'Poli Umum', code: 'A', icon: 'Stethoscope' },
  { id: 'poli-gigi', name: 'Poli Gigi', code: 'B', icon: 'Smile' },
  { id: 'poli-pd', name: 'Poli Penyakit Dalam', code: 'C', icon: 'Activity' },
  { id: 'poli-anak', name: 'Poli Anak', code: 'D', icon: 'Baby' },
  { id: 'poli-obs', name: 'Poli Kandungan (Obgyn)', code: 'E', icon: 'Heart' },
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'dr-1', name: 'dr. Andi Pratama', poliId: 'poli-um', schedule: 'Senin - Jumat, 08:00 - 14:00', status: 'AVAILABLE' },
  { id: 'dr-2', name: 'dr. Budi Santoso', poliId: 'poli-um', schedule: 'Senin - Sabtu, 14:00 - 20:00', status: 'BUSY' },
  { id: 'dr-3', name: 'drg. Citra Dewi', poliId: 'poli-gigi', schedule: 'Senin, Rabu, Jumat, 09:00 - 15:00', status: 'AVAILABLE' },
  { id: 'dr-4', name: 'dr. Dedi Sp.PD', poliId: 'poli-pd', schedule: 'Selasa, Kamis, 10:00 - 16:00', status: 'AVAILABLE' },
  { id: 'dr-5', name: 'dr. Eka Sp.A', poliId: 'poli-anak', schedule: 'Senin - Jumat, 08:00 - 12:00', status: 'ON_LEAVE' },
  { id: 'dr-6', name: 'dr. Fani Sp.OG', poliId: 'poli-obs', schedule: 'Senin - Jumat, 09:00 - 13:00', status: 'AVAILABLE' },
];

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'p-1', mrNumber: 'RM-001234', nik: '3201010101010001', name: 'Siti Aminah', 
    dob: '1985-05-15', gender: 'P', address: 'Jl. Merdeka No. 10', phone: '08123456789', insuranceType: 'BPJS' 
  },
  { 
    id: 'p-2', mrNumber: 'RM-001235', nik: '3201010101010002', name: 'Budi Hartono', 
    dob: '1990-10-20', gender: 'L', address: 'Jl. Sudirman No. 5', phone: '08129876543', insuranceType: 'UMUM' 
  },
];

export const HOSPITAL_SYSTEM_PROMPT = `
Anda adalah Asisten Virtual Cerdas untuk bagian Pendaftaran Rumah Sakit (Admission Desk).
Tugas Anda adalah membantu petugas pendaftaran dengan informasi yang cepat dan akurat.

Berikut adalah data operasional rumah sakit saat ini (Konteks):
1. **Daftar Poli**: ${MOCK_POLIS.map(p => p.name).join(', ')}.
2. **Daftar Dokter dan Jadwal**:
${MOCK_DOCTORS.map(d => `- ${d.name} (${MOCK_POLIS.find(p => p.id === d.poliId)?.name}): ${d.schedule}. Status: ${d.status}`).join('\n')}

**Aturan & Prosedur**:
- Pasien BPJS wajib membawa kartu BPJS dan KTP. Rujukan diperlukan untuk poli spesialis.
- Pendaftaran tutup 30 menit sebelum jadwal dokter berakhir.
- Biaya pendaftaran pasien umum adalah Rp 50.000.
- Pasien gawat darurat harus langsung diarahkan ke IGD, bukan poli rawat jalan.

**Gaya Komunikasi**:
- Profesional, singkat, dan membantu.
- Gunakan Bahasa Indonesia yang baik.
- Jika ditanya tentang jadwal dokter, jawab berdasarkan data di atas.
- Jika ditanya hal medis spesifik, ingatkan bahwa Anda hanya asisten administrasi dan sarankan konsultasi ke dokter/perawat.
`;

export const EDUCATIONAL_CONTENT = {
  intro: "Sistem Informasi Manajemen Rumah Sakit (SIMRS) adalah sistem terintegrasi yang menangani seluruh proses manajemen rumah sakit, mulai dari pelayanan diagnosa dan tindakan untuk pasien, medical record, apotek, gudang farmasi, penagihan, database personalia, penggajian karyawan, proses akuntansi sampai dengan pengendalian oleh manajemen.",
  components: [
    { icon: 'Box', title: 'Modul Pelayanan', content: 'Mencakup pendaftaran, rawat jalan, rawat inap, IGD, dan penunjang medis.' },
    { icon: 'Tag', title: 'Modul Keuangan', content: 'Menangani billing, kasir, akuntansi, dan klaim asuransi/BPJS.' },
    { icon: 'Share2', title: 'Modul Penunjang', content: 'Manajemen farmasi, logistik, gizi, dan rekam medis elektronik.' }
  ],
  notations: "Notasi ERD menggunakan standar Crow's Foot untuk menggambarkan kardinalitas antar entitas."
};

export const INITIAL_MODULES: SimrsModule[] = [
  { id: 'm1', name: 'Pendaftaran & Admisi', description: 'Manajemen antrian, pendaftaran pasien baru/lama, dan penjadwalan.', selected: true },
  { id: 'm2', name: 'Rekam Medis Elektronik', description: 'Riwayat klinis, diagnosa (ICD-10), dan tindakan (ICD-9CM).', selected: true },
  { id: 'm3', name: 'Farmasi & Resep', description: 'E-Prescribing, stok obat, dan dispensing.', selected: false },
  { id: 'm4', name: 'Kasir & Billing', description: 'Perhitungan biaya, invoice, dan pembayaran.', selected: false },
  { id: 'm5', name: 'Laboratorium', description: 'Order lab, hasil pemeriksaan, dan integrasi LIS.', selected: false },
];

export const RAW_PROMPT_TEMPLATE = `
Bertindaklah sebagai Senior Database Architect. Tugas Anda adalah merancang ERD (Entity Relationship Diagram) untuk Sistem Rumah Sakit (SIMRS).
Fokus pada modul-modul berikut:
{{MODULES_LIST}}

Instruksi:
1. Identifikasi Entitas utama yang diperlukan.
2. Tentukan Atribut untuk setiap entitas, termasuk Primary Key (PK) dan Foreign Key (FK).
3. Tentukan Relasi antar entitas beserta kardinalitasnya (1:1, 1:N, N:M).

Format Output (WAJIB JSON):
{
  "entities": [
    {
      "name": "NamaEntitas",
      "description": "Deskripsi singkat",
      "attributes": [
        { "name": "id", "dataType": "UUID", "isPrimaryKey": true, "isForeignKey": false },
        ...
      ]
    }
  ],
  "relationships": [
    {
      "source": "EntitasAsal",
      "target": "EntitasTujuan",
      "cardinality": "One-to-Many",
      "description": "Penjelasan relasi"
    }
  ]
}
`;