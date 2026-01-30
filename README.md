# m1-web-frontend-angular

Application Angular de gestion des presets pour l’Audio Sampler Web. Affiche la liste des presets et de leurs sons, communique avec le même backend que le sampler (API REST).

## Prérequis

- Node.js 18+
- Backend (m1-web-backend) accessible (local ou déployé)

## Installation

```bash
npm install
```

## Lancer l’application en local

```bash
ng serve
```

Puis ouvrir **http://localhost:4200/** dans le navigateur. L’app se recharge automatiquement lors des modifications du code.

## Configuration du backend

L’URL de l’API est définie dans `src/app/config/api.config.ts`. Par défaut elle pointe vers le backend déployé (Render). Pour un backend local, modifier par exemple en `http://localhost:3000`.

## Fonctionnalités implémentées

- **Liste des presets** : affichage des presets depuis le backend, avec déroulement pour voir les sons de chaque preset
- **Renommage** : modification du nom d’un preset ou d’un son (avec validation), synchronisé avec le backend
- **Suppression** : suppression d’un preset ou d’un son, avec boîte de confirmation, synchronisée avec le backend
- **Ajout de preset** : formulaire modal pour créer un nouveau preset (nom, type) ; enregistrement via le backend (sans liste de sons côté API)
- **Ajout de son (interface uniquement)** : bouton « + Ajouter un son » et formulaire (nom + URL) dans un preset ; la donnée est mise à jour uniquement en local, **pas d’endpoint addSound côté backend** — les sons ajoutés ici ne sont pas persistés en base

## Ce qui n’est pas fait

- **addSound** : le backend ne propose pas d’endpoint pour ajouter un son à un preset. L’UI Angular permet de saisir un nom et une URL et met à jour la liste en mémoire, mais ces ajouts ne sont pas enregistrés côté serveur.

## Commandes utiles

- `ng build` : build de production (dossier `dist/`)
- `ng test` : lancer les tests (Vitest)
- `ng generate component nom-composant` : générer un composant
