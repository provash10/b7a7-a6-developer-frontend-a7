import type { Schedule } from "./schedule.type";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ONGOING"
  | "COMPLETED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface Payment {
  id: string;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: number | string | null;
  refundReason?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AppointmentPatient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  profilePhoto?: string | null;
}

export interface AppointmentDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  specialization?: string | null;
  designation?: string | null;
}

export interface Appointment {
  id: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  recordUrl?: string | null;
  prescriptionUrl?: string | null;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  createdAt: string;
  updatedAt: string;
  patient?: AppointmentPatient;
  doctor?: AppointmentDoctor;
  schedule?: Schedule;
  payment?: Payment | null;
}

export interface AppointmentParams {
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}

export interface BookAppointmentPayload {
  scheduleId: string;
}

export interface PayAppointmentPayload {
  appointmentId: string;
}

export interface CancelAppointmentPayload {
  appointmentId: string;
}

export interface BookAppointmentResponse {
  paymentUrl: string;
}

export interface BookingConfirmation {
  paymentUrl: string;
  schedule: Schedule;
}
