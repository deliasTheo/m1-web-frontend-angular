import { Son } from './son.model';

export interface Preset {
  nom: string;
  type: string;
  sons: Son[];
}
