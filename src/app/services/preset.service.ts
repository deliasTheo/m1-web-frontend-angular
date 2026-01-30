import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Preset } from '../models/preset.model';
import { Son } from '../models/son.model';
import { API_URL } from '../config/api.config';

/** Réponse API preset (backend) */
interface PresetApi {
  name: string;
  type: string;
  isFactoryPresets?: boolean;
  samples: { name: string; url: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PresetService {
  private presetsSubject = new BehaviorSubject<Preset[]>([]);
  public readonly presets$: Observable<Preset[]> = this.presetsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPresets();
  }

  private mapApiToPreset(api: PresetApi): Preset {
    return {
      nom: api.name,
      type: api.type,
      sons: (api.samples || []).map(s => ({ nom: s.name, url: s.url }))
    };
  }

  /**
   * Charge la liste des presets depuis le backend.
   */
  loadPresets(): void {
    this.http
      .get<PresetApi[]>(`${API_URL}/api/presets`)
      .pipe(
        tap(presets => this.presetsSubject.next(presets.map(p => this.mapApiToPreset(p)))),
        catchError(err => {
          console.error('Erreur chargement presets:', err);
          return of([]);
        })
      )
      .subscribe();
  }

  getPresets(): Observable<Preset[]> {
    return this.presets$;
  }

  getPresetsValue(): Preset[] {
    return this.presetsSubject.value;
  }

  /**
   * Met à jour le nom d'un preset (appel backend puis rechargement).
   */
  updatePresetName(presetIndex: number, nouveauNom: string): void {
    const presets = this.presetsSubject.value;
    if (presetIndex < 0 || presetIndex >= presets.length) return;
    const presetName = presets[presetIndex].nom;

    this.http
      .put(`${API_URL}/api/preset/${encodeURIComponent(presetName)}/modifyName`, {
        newName: nouveauNom
      })
      .pipe(
        tap(() => this.loadPresets()),
        catchError(err => {
          console.error('Erreur modification nom preset:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Met à jour le nom d'un son (appel backend puis rechargement).
   */
  updateSonName(presetIndex: number, sonIndex: number, nouveauNom: string): void {
    const presets = this.presetsSubject.value;
    if (
      presetIndex < 0 ||
      presetIndex >= presets.length ||
      sonIndex < 0 ||
      sonIndex >= presets[presetIndex].sons.length
    )
      return;
    const presetName = presets[presetIndex].nom;
    const soundName = presets[presetIndex].sons[sonIndex].nom;

    this.http
      .put(`${API_URL}/api/sound/${encodeURIComponent(soundName)}/modifyName`, {
        newName: nouveauNom,
        presetName
      })
      .pipe(
        tap(() => this.loadPresets()),
        catchError(err => {
          console.error('Erreur modification nom son:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Ajoute un nouveau preset (appel backend puis rechargement).
   * Les sons du preset ne sont pas envoyés pour l'instant (add sound à venir).
   */
  addPreset(preset: Preset): void {
    this.http
      .post(`${API_URL}/api/preset/addPreset`, {
        name: preset.nom,
        type: preset.type,
        isFactoryPreset: false
      })
      .pipe(
        tap(() => this.loadPresets()),
        catchError(err => {
          console.error('Erreur ajout preset:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Supprime un preset (appel backend puis rechargement).
   */
  deletePreset(presetIndex: number): void {
    const presets = this.presetsSubject.value;
    if (presetIndex < 0 || presetIndex >= presets.length) return;
    const presetName = presets[presetIndex].nom;

    this.http
      .delete(`${API_URL}/api/preset/${encodeURIComponent(presetName)}`)
      .pipe(
        tap(() => this.loadPresets()),
        catchError(err => {
          console.error('Erreur suppression preset:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Ajoute un son à un preset existant (local uniquement pour l'instant, add sound à venir).
   */
  addSonToPreset(presetIndex: number, son: Son): void {
    const presets = [...this.presetsSubject.value];
    if (presetIndex >= 0 && presetIndex < presets.length) {
      const updatedSons = [...presets[presetIndex].sons, son];
      presets[presetIndex] = { ...presets[presetIndex], sons: updatedSons };
      this.presetsSubject.next(presets);
      // TODO: Appel backend quand l'endpoint add sound sera disponible
    }
  }

  /**
   * Supprime un son d'un preset (appel backend puis rechargement).
   */
  deleteSonFromPreset(presetIndex: number, sonIndex: number): void {
    const presets = this.presetsSubject.value;
    if (
      presetIndex < 0 ||
      presetIndex >= presets.length ||
      sonIndex < 0 ||
      sonIndex >= presets[presetIndex].sons.length
    )
      return;
    const presetName = presets[presetIndex].nom;
    const soundName = presets[presetIndex].sons[sonIndex].nom;

    this.http
      .delete(`${API_URL}/api/sound/${encodeURIComponent(soundName)}`, {
        body: { presetName }
      })
      .pipe(
        tap(() => this.loadPresets()),
        catchError(err => {
          console.error('Erreur suppression son:', err);
          return of(null);
        })
      )
      .subscribe();
  }
}
