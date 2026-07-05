# Script PowerShell pour générer les Issues GitHub - Frontend
# Nécessite GitHub CLI (gh) installé et authentifié (`gh auth login`)

Write-Host "Vérification de l'authentification GitHub CLI..."
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Veuillez vous connecter avec 'gh auth login' avant d'exécuter ce script." -ForegroundColor Red
    exit
}

$labels = @(
    @{name="Critique"; color="b60205"; description="Priorité critique"},
    @{name="Haute"; color="d93f0b"; description="Priorité haute"},
    @{name="Moyenne"; color="fbca04"; description="Priorité moyenne"},
    @{name="Faible"; color="0e8a16"; description="Priorité faible"},
    @{name="UI/UX"; color="c2e0c6"; description="Design et expérience utilisateur"},
    @{name="Admin"; color="1d76db"; description="Interface d'administration"},
    @{name="Formulaires"; color="5319e7"; description="Composants de formulaires"},
    @{name="Performance"; color="0052cc"; description="Amélioration des performances"},
    @{name="Paramètres"; color="bfdadc"; description="Configuration et paramètres système"}
)

Write-Host "Création des labels..."
foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description --force | Out-Null
}

Write-Host "Création des Issues pour le Frontend..."

$body1 = @'
## Contexte métier
Le tableau de bord admin charge actuellement 7 requêtes parallèles. Le backend disposera bientôt d'un endpoint unifié `/api/v1/stats/dashboard`.

## Description
Mettre à jour la page `admin/page.tsx` pour utiliser la nouvelle route et afficher les statistiques globales en une seule requête.

## Critères d'acceptation
- [ ] Suppression des appels multiples `listProjects`, `listTeam`, etc., dans le dashboard.
- [ ] Intégration de la requête unique.
- [ ] Typage correct de la réponse.

## Complexité estimée
Faible

## Dépendances
- Requiert l'implémentation de la route côté Backend.
'@

gh issue create --title '[UI/UX] Intégrer le nouvel endpoint de Dashboard Stats' --label 'Performance,Admin,Critique' --body $body1

$body2 = @'
## Contexte métier
L'Admin Tech doit pouvoir configurer les différents motifs de contact proposés aux utilisateurs publics.

## Description
Créer une vue dans le panel d'administration pour lister, ajouter et supprimer des sujets de contact (`MessageSubject`). Mettre également à jour le formulaire de contact public pour récupérer cette liste.

## Critères d'acceptation
- [ ] Une page `/admin/messages/sujets` est créée pour la gestion CRUD.
- [ ] Le formulaire de contact public `/contact` récupère dynamiquement les options du menu déroulant.

## Complexité estimée
Moyenne
'@

gh issue create --title '[UI/UX] Interface de gestion des Sujets de Contact (Admin Tech)' --label 'UI/UX,Admin,Haute' --body $body2

$body3 = @'
## Contexte métier
Le profil RH doit pouvoir définir quels départements existent au sein de l'ONG (Logistique, RH, Opérations...).

## Description
Créer une vue CRUD pour l'Admin RH permettant la gestion de l'entité `Department`.

## Critères d'acceptation
- [ ] Page `/admin/equipe/departements` créée et protégée par le rôle.
- [ ] Le formulaire de création/édition d'un expert (`TeamMember`) utilise un `<Select>` alimenté par l'API.

## Complexité estimée
Moyenne
'@

gh issue create --title '[UI/UX] Interface de gestion des Départements (Admin RH)' --label 'UI/UX,Admin,Haute' --body $body3

$body4 = @'
## Contexte métier
L'adresse email qui reçoit les requêtes de la page contact doit être modifiable dans l'UI.

## Description
Ajouter un champ dans le module existant "Paramètres" (`/admin/parametres`) pour définir `emailSupport`.

## Critères d'acceptation
- [ ] Ajout d'un champ "Email de réception (Contact)" dans l'onglet approprié des paramètres.
- [ ] Le champ est relié au endpoint de mise à jour des `Settings`.

## Complexité estimée
Faible
'@

gh issue create --title '[UI/UX] Paramétrage de l email de contact (MAIL_TO)' --label 'Paramètres,Admin,Haute' --body $body4

$body5 = @'
## Contexte métier
Les types de contrats et candidatures ne doivent plus être statiques.

## Description
Créer l'interface de gestion de l'entité `CareerType` et mettre à jour les formulaires liés.

## Critères d'acceptation
- [ ] Page CRUD `/admin/emplois/types` créée pour les Admin RH.
- [ ] Les formulaires de création d'offres d'emploi utilisent la liste dynamique.
- [ ] Le formulaire public de candidature utilise les options dynamiques.

## Complexité estimée
Haute
'@

gh issue create --title '[Formulaires] Intégration des Types de Contrats et Candidatures' --label 'Formulaires,Admin,Moyenne' --body $body5

$body6 = @'
## Contexte métier
Actuellement les couleurs de services (rouge, bleu) sont des classes Tailwind saisies à la main en base de données.

## Description
Ajouter un composant visuel (Color Picker) et un sélecteur d'icônes Lucide dans le formulaire de Service.

## Critères d'acceptation
- [ ] Le formulaire utilise un input color (`#HEX`) au lieu de texte.
- [ ] Mise à jour du frontend public pour injecter ces styles en `style={{ backgroundColor: colorHex }}` au lieu des classes Tailwind statiques.

## Complexité estimée
Moyenne
'@

gh issue create --title '[UI/UX] Sélecteur de couleurs et d icônes pour les Services' --label 'UI/UX,Admin,Faible' --body $body6

Write-Host "✅ Création des Issues Frontend terminée !" -ForegroundColor Green
