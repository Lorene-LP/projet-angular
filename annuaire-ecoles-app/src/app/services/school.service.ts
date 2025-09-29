import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { School } from '../models/school.model';

interface EducationApiRecord {
  recordid: string;
  geometry?: { coordinates: [number, number] };
  fields: {
    nom_etablissement?: string;
    adresse?: string;
    adresse_1?: string;
    code_postal?: string;
    nom_commune?: string;
    type_etablissement?: string;
    statut?: string;
    nature?: string;
    secteur?: string;
    telephone?: string;
    email?: string;
  };
}

interface EducationApiResponse {
  records: EducationApiRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-annuaire-education';

  constructor(private http: HttpClient) {}

  getSchoolsByCity(city: string): Observable<School[]> {
    const url = `${this.apiUrl}&q=nom_commune:${encodeURIComponent(city)}&rows=100`;
    return this.http.get<EducationApiResponse>(url).pipe(
      map(response => {
        if (!response.records) throw new Error('Format de réponse API invalide');
        return response.records
          .map(r => this.mapToSchool(r))
          .filter(s => s.latitude && s.longitude);
      }),
      catchError(err => {
        console.error('Erreur lors de la récupération des écoles:', err);
        return of([]);
      })
    );
  }

  private mapToSchool(record: EducationApiRecord): School {
    const f = record.fields;
    return {
      id: record.recordid,
      nom_etablissement: f.nom_etablissement ?? '',
      adresse: f.adresse ?? f.adresse_1 ?? '',
      code_postal: f.code_postal ?? '',
      commune: f.nom_commune ?? '',
      type_etablissement: f.type_etablissement ?? '',
      statut: f.statut ?? '',
      telephone: f.telephone,
      email: f.email,
      latitude: record.geometry?.coordinates[1],
      longitude: record.geometry?.coordinates[0]
    };
  }
}