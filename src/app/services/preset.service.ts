import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preset } from '../models/preset.model';
import { Son } from '../models/son.model';

@Injectable({
  providedIn: 'root'
})
export class PresetService {
  private presetsSubject = new BehaviorSubject<Preset[]>([
    {
      nom: 'Preset 1',
      type: 'Drumkit',
      sons: [
        {
          nom: 'Son 1',
          url: 'https://www.example.com/son1.wav'
        },
        {
          nom: 'Son 2',
          url: 'https://www.example.com/son2.wav'
        },
        {
          nom: 'Son 3',
          url: 'https://www.example.com/son3.wav'
        }
      ]
    },
    {
      nom: 'Preset 2',
      type: 'Drumkit',
      sons: [
        {
          nom: 'Son 1',
          url: 'https://www.example.com/son1.wav'
        },
        {
          nom: 'Son 2',
          url: 'https://www.example.com/son2.wav'
        },
        {
          nom: 'Son 3',
          url: 'https://www.example.com/son3.wav'
        }
      ]
    },
    {
      nom: 'Preset 3',
      type: 'Drumkit',
      sons: [
        {
          nom: 'Son 1',
          url: 'https://www.example.com/son1.wav'
        },
        {
          nom: 'Son 2',
          url: 'https://www.example.com/son2.wav'
        }
      ]
    }
  ]);

  public readonly presets$: Observable<Preset[]> = this.presetsSubject.asObservable();

  constructor() {
    // Liste initialisée avec des exemples
    // Sera remplacée par des appels backend plus tard
  }

  /**
   * Récupère tous les presets (Observable)
   * @returns Observable de la liste des presets
   */
  getPresets(): Observable<Preset[]> {
    return this.presets$;
  }

  /**
   * Récupère la valeur actuelle des presets (synchrone)
   * @returns Liste actuelle des presets
   */
  getPresetsValue(): Preset[] {
    return this.presetsSubject.value;
  }

  /**
   * Met à jour le nom d'un preset
   * @param presetIndex Index du preset à modifier
   * @param nouveauNom Nouveau nom du preset
   */
  updatePresetName(presetIndex: number, nouveauNom: string): void {
    const presets = [...this.presetsSubject.value];
    if (presetIndex >= 0 && presetIndex < presets.length) {
      presets[presetIndex] = { ...presets[presetIndex], nom: nouveauNom };
      this.presetsSubject.next(presets);
      // TODO: Appel backend pour mettre à jour le preset
    }
  }

  /**
   * Met à jour le nom d'un son
   * @param presetIndex Index du preset contenant le son
   * @param sonIndex Index du son à modifier
   * @param nouveauNom Nouveau nom du son
   */
  updateSonName(presetIndex: number, sonIndex: number, nouveauNom: string): void {
    const presets = [...this.presetsSubject.value];
    if (
      presetIndex >= 0 && 
      presetIndex < presets.length &&
      sonIndex >= 0 &&
      sonIndex < presets[presetIndex].sons.length
    ) {
      const updatedSons = [...presets[presetIndex].sons];
      updatedSons[sonIndex] = { ...updatedSons[sonIndex], nom: nouveauNom };
      presets[presetIndex] = { ...presets[presetIndex], sons: updatedSons };
      this.presetsSubject.next(presets);
      // TODO: Appel backend pour mettre à jour le son
    }
  }

  /**
   * Ajoute un nouveau preset
   * @param preset Preset à ajouter
   */
  addPreset(preset: Preset): void {
    const presets = [...this.presetsSubject.value, preset];
    this.presetsSubject.next(presets);
    // TODO: Appel backend pour créer le preset
  }

  /**
   * Supprime un preset
   * @param presetIndex Index du preset à supprimer
   */
  deletePreset(presetIndex: number): void {
    const presets = [...this.presetsSubject.value];
    if (presetIndex >= 0 && presetIndex < presets.length) {
      presets.splice(presetIndex, 1);
      this.presetsSubject.next(presets);
      // TODO: Appel backend pour supprimer le preset
    }
  }

  /**
   * Ajoute un son à un preset existant
   * @param presetIndex Index du preset
   * @param son Son à ajouter
   */
  addSonToPreset(presetIndex: number, son: Son): void {
    const presets = [...this.presetsSubject.value];
    if (presetIndex >= 0 && presetIndex < presets.length) {
      const updatedSons = [...presets[presetIndex].sons, son];
      presets[presetIndex] = { ...presets[presetIndex], sons: updatedSons };
      this.presetsSubject.next(presets);
      // TODO: Appel backend pour ajouter le son au preset
    }
  }

  /**
   * Supprime un son d'un preset
   * @param presetIndex Index du preset
   * @param sonIndex Index du son à supprimer
   */
  deleteSonFromPreset(presetIndex: number, sonIndex: number): void {
    const presets = [...this.presetsSubject.value];
    if (
      presetIndex >= 0 && 
      presetIndex < presets.length &&
      sonIndex >= 0 &&
      sonIndex < presets[presetIndex].sons.length
    ) {
      const updatedSons = [...presets[presetIndex].sons];
      updatedSons.splice(sonIndex, 1);
      presets[presetIndex] = { ...presets[presetIndex], sons: updatedSons };
      this.presetsSubject.next(presets);
      // TODO: Appel backend pour supprimer le son
    }
  }
}
