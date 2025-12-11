export interface Patient {
  id: string;
  mrNumber: string; // Medical Record Number (No. RM)
  nik: string;
  name: string;
  dob: string;
  gender: 'L' | 'P';
  address: string;
  phone: string;
  insuranceType: 'UMUM' | 'BPJS' | 'ASURANSI_LAIN';
}

export interface Doctor {
  id: string;
  name: string;
  poliId: string;
  schedule: string; // Simple string for demo, e.g., "Senin - Jumat, 08:00 - 14:00"
  status: 'AVAILABLE' | 'ON_LEAVE' | 'BUSY';
}

export interface Poli {
  id: string;
  name: string;
  code: string;
  icon: string;
}

export interface Registration {
  id: string;
  patientId: string;
  patientName: string;
  patientMr: string;
  poliId: string;
  poliName: string;
  doctorId: string;
  doctorName: string;
  queueNumber: string;
  visitDate: string;
  paymentMethod: string;
  status: 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELLED';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'registration' | 'queue' | 'dashboard';

export interface SimrsModule {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export interface Attribute {
  name: string;
  dataType: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface Entity {
  name: string;
  description: string;
  attributes: Attribute[];
}

export interface Relationship {
  source: string;
  target: string;
  cardinality: string;
  description: string;
}

export interface ERDModel {
  entities: Entity[];
  relationships: Relationship[];
}