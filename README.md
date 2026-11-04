# Présentations du SIT Pôle Marennes Oléron

Les supports de présentation du service SIT, écrits avec [open-slide](https://www.npmjs.com/package/@open-slide/core) :
une page = un composant React, rendu en 1920 × 1080.

| Deck | Événement |
| --- | --- |
| `slides/geo17-ia/` | Rencontres Géo17, 13 novembre 2026 — usages de l'IA au SIT |

## Lancer

```powershell
npm install
npm run dev -- --port 5181
```

Puis ouvrir http://localhost:5180/. `F` lance le mode présentation, les notes orateur sont dans la vue présentateur.

## Construire une version statique

```powershell
npm run build
```

Le site statique sort dans `dist/` (non versionné).

## Règles

- Un deck = un dossier `slides/<id>/` avec `index.tsx` et ses `assets/`.
- Les notes orateur (export `notes`) sont publiées avec le deck : rien d'interne, aucun nom de collègue
  dans les captures, aucun secret.
- Les polices embarquées sont sous licence libre (OFL).
