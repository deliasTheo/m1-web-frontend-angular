import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PresetService } from '../../services/preset.service';
import { Preset } from '../../models/preset.model';
import { Son } from '../../models/son.model';
import { AddPresetModal } from '../add-preset-modal/add-preset-modal';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, AddPresetModal],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  presets: Preset[] = [];
  expandedPresets: Set<number> = new Set();
  editingPreset: number | null = null;
  editingSon: { presetIndex: number; sonIndex: number } | null = null;
  tempPresetName: string = '';
  tempSonName: string = '';
  showAddPresetModal: boolean = false;
  showDeletePresetConfirmation: number | null = null;
  showDeleteSonConfirmation: { presetIndex: number; sonIndex: number } | null = null;
  showAddSonForm: number | null = null;
  newSon: { nom: string; url: string } = { nom: '', url: '' };


  constructor(private presetService: PresetService, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.presetService.loadPresets();
    this.presetService.getPresets().subscribe(presets => {
      this.presets = presets;
      this.cdr.detectChanges();
    });
  }

  togglePreset(index: number): void {
    if (this.expandedPresets.has(index)) {
      this.expandedPresets.delete(index);
    } else {
      this.expandedPresets.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedPresets.has(index);
  }

  startEditingPresetName(index: number): void {
    this.editingPreset = index;
    this.tempPresetName = this.presets[index].nom;
    this.cancelEditingSon(); // Annuler l'édition de son si en cours
  }

  startEditingSonName(presetIndex: number, sonIndex: number): void {
    this.editingSon = { presetIndex, sonIndex };
    this.tempSonName = this.presets[presetIndex].sons[sonIndex].nom;
    this.cancelEditingPreset(); // Annuler l'édition de preset si en cours
  }

  cancelEditingPreset(): void {
    this.editingPreset = null;
    this.tempPresetName = '';
  }

  cancelEditingSon(): void {
    this.editingSon = null;
    this.tempSonName = '';
  }

  validatePresetName(): void {
    if (this.editingPreset !== null && this.tempPresetName.trim() !== '') {
      this.presetService.updatePresetName(this.editingPreset, this.tempPresetName.trim());
      this.cancelEditingPreset();
    }
  }

  validateSonName(): void {
    if (
      this.editingSon !== null &&
      this.tempSonName.trim() !== '' &&
      this.editingSon.presetIndex >= 0 &&
      this.editingSon.sonIndex >= 0
    ) {
      this.presetService.updateSonName(
        this.editingSon.presetIndex,
        this.editingSon.sonIndex,
        this.tempSonName.trim()
      );
      this.cancelEditingSon();
    }
  }

  openAddPresetModal(): void {
    this.showAddPresetModal = true;
  }

  closeAddPresetModal(): void {
    this.showAddPresetModal = false;
  }

  confirmDeletePreset(index: number): void {
    this.showDeletePresetConfirmation = index;
  }

  cancelDeletePreset(): void {
    this.showDeletePresetConfirmation = null;
  }

  deletePreset(index: number): void {
    this.presetService.deletePreset(index);
    this.cancelDeletePreset();
    // Réajuster les indices des presets déroulés
    const newExpanded = new Set<number>();
    this.expandedPresets.forEach(expandedIndex => {
      if (expandedIndex < index) {
        newExpanded.add(expandedIndex);
      } else if (expandedIndex > index) {
        newExpanded.add(expandedIndex - 1);
      }
    });
    this.expandedPresets = newExpanded;
  }

  confirmDeleteSon(presetIndex: number, sonIndex: number): void {
    this.showDeleteSonConfirmation = { presetIndex, sonIndex };
  }

  cancelDeleteSon(): void {
    this.showDeleteSonConfirmation = null;
  }

  deleteSon(presetIndex: number, sonIndex: number): void {
    this.presetService.deleteSonFromPreset(presetIndex, sonIndex);
    this.cancelDeleteSon();
  }

  openAddSonForm(presetIndex: number): void {
    this.showAddSonForm = presetIndex;
    this.newSon = { nom: '', url: '' };
  }

  cancelAddSon(): void {
    this.showAddSonForm = null;
    this.newSon = { nom: '', url: '' };
  }

  saveSon(presetIndex: number): void {
    if (this.newSon.nom.trim() !== '' && this.newSon.url.trim() !== '') {
      this.presetService.addSonToPreset(presetIndex, {
        nom: this.newSon.nom.trim(),
        url: this.newSon.url.trim()
      });
      this.cancelAddSon();
    }
  }
}
