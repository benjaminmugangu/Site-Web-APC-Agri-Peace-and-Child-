# AI Project Handover Documentation

## 1. Executive Summary

- **Project Name:** Agri-Peace and Child (APC) Web Site
- **Core Objective:** Développer une plateforme web vitrine interactive doublée d'un CMS métier sur-mesure pour une ONG basée en République Démocratique du Congo (RDC).
- **Business Problem Solved:** L'ONG avait besoin d'un moyen de centraliser sa communication publique (actualités, projets, appels d'offres) et ses processus internes (recrutement, gestion des partenariats, collecte de dons virtuels) via une interface unifiée gérée par des non-développeurs, tout en affichant une image hautement professionnelle pour attirer des donateurs internationaux.
- **Target Users:** 
  - *Public :* Donateurs potentiels, candidats aux offres d'emploi, partenaires institutionnels, grand public.
  - *Internes :* Administrateurs de la plateforme (Direction APC) et Administrateurs RH (pour le recrutement).
- **Current Project Status:** Le projet est en phase finale. Toute l'architecture de base, la base de données, l'API backend et les interfaces frontend (publiques et admin) sont construites et fonctionnelles. Les récentes mises à jour ont rendu les textes des pages publiques 100% dynamiques et éditables via l'interface d'administration.

---

## 2. Business Context

- **Business Needs:** 
  - Mettre en valeur l'impact de l'ONG (projets, bénéficiaires).
  - Faciliter la publication d'appels d'offres locaux.
  - Permettre le recrutement fluide avec un ATS (Applicant Tracking System) intégré.
- **Main Actors & Roles:**
  - `ADMIN`: Accès total à la plateforme (paramètres du site, création des utilisateurs, édition de tous les contenus).
  - `ADMIN_RH`: Accès restreint à la gestion des carrières (Emplois, Départements) et aux candidatures. Accès refusé aux paramètres globaux.
- **Critical Workflows:**
  - *Candidatures :* Un visiteur postule à un poste. L'ADMIN_RH reçoit la candidature, la passe en statut "REVIEWING", puis "ACCEPTED" ou "REJECTED".
  - *Paramétrage dynamique :* L'ADMIN met à jour le texte "Notre Histoire" ou les "Statistiques" via le CMS. Le Frontend Next.js reflète ces changements immédiatement.

---

## 3. Technical Architecture

### Frontend
- **Technologies:** Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript, Framer Motion, Leaflet.
- **Folder Structure:** `/src/app` (Routes), `/src/components` (UI & Forms), `/src/lib` (API clients & utils).
- **Component Architecture:** Composants UI réutilisables basés sur Radix UI (`@radix-ui/react-slot`) dans `/components/ui`.
- **State Management:** Hooks React natifs (`useState`, `useEffect`).
- **Routing:** App Router Next.js avec `middleware.ts` pour la protection des routes `/admin`.
- **Important Pages:** `/page.tsx` (Accueil public dynamique), `/admin/parametres/page.tsx` (CMS des paramètres globaux).

### Backend
- **Technologies:** Node.js, Express, TypeScript, TypeORM, MySQL 8, JSONWebToken, Swagger.
- **Architecture Globale:** Architecture multicouche (Routes → Controller → Service → Entity).
- **Services:** Logique métier encapsulée dans des classes de service (ex: `AuthService`, `ProjectService`).
- **Middleware:** `auth.middleware.ts` (vérification JWT), `error.middleware.ts` (interception globale), validation avec `class-validator`.

### Infrastructure
- **Hosting:** 
  - Frontend : Vercel (CI/CD via GitHub).
  - Backend : cPanel (Phusion Passenger / Node.js App) sur le domaine `api.agri-peaceandchild.org`.
- **Database:** MySQL hébergée sur cPanel.
- **Third-Party Services:** Cloudinary (stockage d'images).

```ascii
+----------------+        +-------------------+        +----------------+
|                |        |                   |        |                |
|  Vercel (CDN)  | <----> |  cPanel Backend   | <----> | MySQL Database |
|  Next.js 14    |        |  Node.js/Express  |        | (TypeORM)      |
|                |        |                   |        |                |
+----------------+        +-------------------+        +----------------+
      ^                          |
      |                          v
      +---------------->  Cloudinary (Images)
```

---

## 4. Database Architecture

- **RDBMS:** MySQL.
- **ORM:** TypeORM (mode "synchronize: false" en production, migrations manuelles / scripts requis pour altérer la BD).
- **Main Models:** `User`, `Settings`, `Project`, `News`, `Career`, `Application`, `Message`, `Partner`.
- **Constraints & Indexes:** Utilisation de clés primaires UUID pour la majorité des tables. Clés uniques sur `slug` (News, Project).

### Schema (Simplified)
```text
[User] 1 ----- * [News] (Author)
[Department] 1 ----- * [TeamMember]
[ProjectCategory] 1 ----- * [Project]
[NewsCategory] 1 ----- * [News]
[PartnerCategory] 1 ----- * [Partner]
[CareerType] 1 ----- * [Career]
[Career] 1 ----- * [Application]
[MessageSubject] 1 ----- * [Message]
[Settings] (Single Row CMS configuration)
```

---

## 5. Authentication & Authorization

- **System:** Authentification basée sur JWT (JSON Web Tokens).
- **Providers:** Auth locale par email/mot de passe (hashé avec bcrypt).
- **Roles:** `UserRole.ADMIN`, `UserRole.ADMIN_RH`.
- **Permissions:** 
  - L'accès aux routes API `/api/v1/...` est protégé par le `authMiddleware`.
  - Le frontend intercepte l'accès au back-office (`/admin/*`) via le fichier `middleware.ts`.
- **CRITICAL (DO NOT TOUCH):** Le middleware frontend `src/middleware.ts` gère la ségrégation des accès. La logique de décodage manuel en base64 du JWT ne doit pas être altérée, sauf remplacement par une librairie robuste.

---

## 6. Completed Features

| Module | Feature | Status | Fichiers clés |
| :--- | :--- | :--- | :--- |
| **Auth** | Login & JWT | ✔️ Terminé | `auth.service.ts`, `middleware.ts` |
| **Settings** | CMS dynamique (Hero, Histoire, etc.) | ✔️ Terminé | `settings.entity.ts`, `/admin/parametres/page.tsx` |
| **Projects** | CRUD Projets et Catégories | ✔️ Terminé | `project.entity.ts`, `project.service.ts` |
| **Careers** | Offres d'emploi & ATS Candidatures | ✔️ Terminé | `career.entity.ts`, `application.entity.ts` |
| **News** | Blog & Articles | ✔️ Terminé | `news.entity.ts` |
| **Team** | Équipe et Départements | ✔️ Terminé | `team-member.entity.ts`, `department.entity.ts` |
| **Partners** | Partenaires & Catégories | ✔️ Terminé | `partner.entity.ts` |
| **Dashboard** | Statistiques unifiées | ✔️ Terminé | `dashboard.service.ts` |

---

## 7. Current Development Status

- **Ce qui est terminé :** La totalité des CRUD majeurs et la dynamisation des pages frontend (`/page.tsx`, `/a-propos`, `/nous-rejoindre`, `/faire-un-don`) qui étaient autrefois codées en dur.
- **Ce qui est en cours :** L'interface utilisateur est entièrement déployée et le backend a été migré avec succès sur cPanel.
- **Bloquants :** Aucun.
- **Dernier changement :** J'ai restauré l'intégrité de `page.tsx` et `a-propos/page.tsx` (des erreurs de syntaxe introduites par des essais précédents bloquaient le build Vercel). Les données du module `Settings` (historySection, supportSection, etc.) sont 100% connectées.

---

## 8. Open Issues & Roadmap

*(Note : De nombreuses issues listées dans le `github_issues_inventory.md` obsolète ont été traitées)*

### Priorities
1. **Tests E2E & Stabilité :** S'assurer que le flow de soumission des formulaires avec pièces jointes (ex: candidatures CV) fonctionne sans problème de taille (CORS / Payload limit) sur le serveur cPanel.
2. **SEO & Sitemap :** Implémenter ou vérifier la génération dynamique de `sitemap.xml` et `robots.txt` depuis les slugs du CMS.
3. **Optimisation des Images :** Vérifier que les images provenant de Cloudinary utilisent correctement le composant `next/image` de Next.js pour réduire la bande passante.

---

## 9. Critical Architectural Decisions

- **Séparation Stricte Front/Back :** Next.js fonctionne en mode App Router mais consomme une API Express (pas de Server Actions pour les mutations de base de données). *Pourquoi ?* Pour permettre l'hébergement du backend Node.js sur cPanel. Ne jamais transformer le backend Express en Next.js Server Actions.
- **TypeORM sans `synchronize: true` :** Le backend en production DOIT éviter `synchronize: true`. Toute modification de schéma doit s'accompagner de scripts de migration ou d'instructions SQL précises à exécuter sur cPanel.
- **Objet Unique `Settings` :** La configuration du site est une table avec une seule ligne ID=1 contenant du JSON complexe. Ne pas créer de multiples tables pour "Hero", "Contact", "Footer".

---

## 10. Coding Standards

- **Backend :**
  - Utiliser le pattern Controller/Service.
  - Décorateurs TypeORM pour les entités.
  - Toutes les routes API dans `/api/v1/...`
- **Frontend :**
  - Next.js App Router (Server Components par défaut, utiliser `"use client"` uniquement lorsque nécessaire pour l'interactivité).
  - Nommer les variables proprement en anglais (camelCase), bien que le contenu de l'UI soit en français.
  - L'upload d'images passe obligatoirement par Cloudinary (API backend `/media`).

---

## 11. Known Risks & Technical Debt

- **Upload Limits :** cPanel limite souvent la taille du corps de requête. `express.json({ limit: '10mb' })` est défini, mais cela dépend aussi des paramètres Nginx/Apache du cPanel (`LimitRequestBody`).
- **Middleware Frontend JWT :** Le frontend utilise une méthode artisanale `atob` pour lire le rôle dans le JWT. C'est robuste, mais sujet aux erreurs de padding base64. Ne le cassez pas.
- **Donation Payment Gateway :** Actuellement, le don est un simple message d'information. Pas d'intégration Stripe ou PayPal (choix métier).

---

## 12. AI Working Instructions

### DO NOT
- **Ne pas altérer `src/middleware.ts` dans le Frontend** sans comprendre parfaitement le flux de redirection et la logique des rôles (ADMIN vs ADMIN_RH).
- **Ne pas utiliser de commandes destructrices** (ex: `rm -rf src/app`, `drop database`).
- **Ne pas modifier le port du backend (5000)** ou l'URL de l'API dans le frontend (`api.agri-peaceandchild.org/api/v1`), car l'architecture cPanel dépend de ces routes fixes.

### ALWAYS
- **Vérifier le `.env` backend** si vous ajoutez un module d'email (utilise Resend / SMTP).
- **Toujours interroger les bases d'URL** avec `apiClient.get(...)` ou `apiClient.post(...)` pour préserver le passage du Token JWT.
- **Réfléchir à l'impact SSR vs CSR :** Avant d'ajouter un hook (`useEffect`, `useState`) dans une page `page.tsx` du frontend, demandez-vous s'il faut ajouter `"use client"`.

### BEFORE ANY REFACTOR
- [ ] Le code actuel compile-t-il (`npm run build`) ?
- [ ] Le changement affecte-t-il la base de données ? Si oui, ai-je un plan de migration ?
- [ ] Ai-je vérifié le composant UI dans `/src/components/ui/` avant d'en créer un nouveau ?

---

## 13. Project Knowledge Base

- **APC :** Agri-Peace and Child (L'ONG cliente).
- **ATS :** Applicant Tracking System (Système de gestion des candidatures intégré).
- **Cloudinary :** Fournisseur externe obligatoire pour le stockage d'images. Pas d'upload local sur cPanel.
- **Passenger :** L'outil cPanel qui fait tourner l'application Node.js. Redémarrage via `touch tmp/restart.txt`.

---

## 14. Resume Point For Next AI

**Où nous sommes :** 
L'ensemble du back-office (CMS) est opérationnel. Le module `Settings` gère toutes les pages statiques dynamisées (Accueil, À Propos, Faire un don, Nous rejoindre). Les modifications des textes dans le back-office se répercutent correctement sur le frontend public grâce au build réussi sur Vercel. 

**Ce qui vient d'être terminé :**
L'interface `/admin/parametres` (Issue 47) a été créée et reliée à la base de données. Les fichiers `page.tsx` et `a-propos/page.tsx` ont été débogués pour assurer un build de production sans erreurs. 

**Prochaine Tâche Potentielle :**
1. L'utilisateur (le client) effectue actuellement des tests finaux sur le site (modification des contenus, vérification de la publication).
2. Si le client signale des bugs sur les "Types de Contrats", les "Sujets de contact" ou les "Couleurs de Services", vous devrez corriger les formulaires frontend associés.
3. Attendez les instructions de l'utilisateur. Si une erreur de base de données survient en production, pensez à vérifier que les colonnes ont bien été ajoutées (via les scripts `backend/migrate_*.js`).
