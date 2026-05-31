import { createBrowserClient } from '@supabase/ssr'
import { SB_URL, SB_KEY } from './config'

export const createClient = () => createBrowserClient(SB_URL, SB_KEY)

export type Therapist = {
  id: string; email: string; nom?: string; prenom?: string; specialite?: string; created_at?: string;
}
export type Patient = {
  id: string; therapist_id: string; nom: string; prenom: string; email?: string; telephone?: string;
  date_naissance?: string; sexe?: string; profil?: string; notes?: string; created_at?: string;
}
export type Consultation = {
  id: string; therapist_id: string; patient_id: string; titre?: string; type_consultation?: string;
  profil_patient?: string; motif?: string; antecedents?: string; medicaments?: string; allergies?: string;
  objectifs?: string; notes?: string; protocole?: any[]; bilan?: any; alimentation?: any;
  date_consultation?: string; created_at?: string;
}
