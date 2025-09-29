export interface School {
  id: string;
  nom_etablissement: string;
  adresse: string;
  code_postal: string;
  commune: string;
  type_etablissement: string;
  statut: string;
  telephone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
}