# NOTE EXPLICATIVE

## Objectif
Application Angular permettant d'afficher les établissements scolaires d'une ville (exemple ici : Lyon) via l'API publique data.education.gouv.fr, avec visualisation cartographique (OpenLayers) et panneau de contact simulé.

## Périmètre fonctionnel
- Affichage géolocalisé des établissements (markers sur carte)
- Popup + panneau latéral avec détails
- Page de contact simulée
- Design responsive (mobile → desktop)

## Stack
- Angular standalone components + SSR
- OpenLayers pour la carte
- HTTPClient pour consommation API
- Express pour serveur SSR

## Lancement
1. npm install
2. npm start (ou ng serve)
3. Ouvrir http://localhost:4200

> **NB :** Le dossier `node_modules` n'est pas inclus. Il sera généré lors du `npm install`.

## Structure clé
- src/app/components : composants UI (header, footer, map)
- src/app/home : page d’accueil
- src/app/contact : formulaire de contact simulé
- src/app/services : accès API
- src/app/models : types métier