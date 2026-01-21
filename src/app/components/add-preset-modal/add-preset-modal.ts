import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresetService } from '../../services/preset.service';
import { Preset } from '../../models/preset.model';
import { Son } from '../../models/son.model';

@Component({
  selector: 'app-add-preset-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-preset-modal.html',
  styleUrl: './add-preset-modal.css',
})
export class AddPresetModal {
  @Output() close = new EventEmitter<void>();

  nom: string = '';
  type: string = '';
  sons: Son[] = [];

  constructor(private presetService: PresetService) {}

  addSon(): void {
    this.sons.push({ nom: '', url: '' });
  }

  removeSon(index: number): void {
    this.sons.splice(index, 1);
  }

  cancel(): void {
    this.close.emit();
  }

  save(): void {
    if (this.nom.trim() === '' || this.type.trim() === '') {
      return; // Validation basique
    }

    const newPreset: Preset = {
      nom: this.nom.trim(),
      type: this.type.trim(),
      sons: this.sons.filter(son => son.nom.trim() !== '' && son.url.trim() !== '')
    };

    this.presetService.addPreset(newPreset);
    this.close.emit();
    this.reset();
  }

  private reset(): void {
    this.nom = '';
    this.type = '';
    this.sons = [];
  }
}
