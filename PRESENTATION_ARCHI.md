# 🎓 Guide de Présentation : eBank Application (Spring Boot 3 + React)

Ce document sert de support pour présenter le projet lors d'une soutenance académique ou d'un entretien technique.

## 1. 🚀 Introduction & Objectif
**Phrase d'accroche :** "J'ai développé eBank, une application bancaire full-stack sécurisée permettant la gestion des comptes par des agents et la consultation/virement par des clients."

**Architecture Globale :**
*   **Architecture :** N-Tiers (Controller, Service, Repository) respectant le principe de séparation des préoccupations.
*   **Communication :** API RESTful (Backend) consommée par le Frontend via Axios.
*   **Sécurité :** Stateless avec JWT (JSON Web Token).

---

## 2. 🛠️ Stack Technique (Pourquoi ces choix ?)

| Technologie | Rôle | Justification pour l'entretien |
|:--- |:--- |:--- |
| **Spring Boot 3.2** | Backend Framework | Rapidité de dev, configuration automatique, standard de l'industrie. |
| **Spring Security 6** | Sécurité | Gestion robuste des rôles (Role-Based Access Control) et filtres HTTP. |
| **JJWT (0.12.3)** | Token Management | Librairie moderne pour signer et parser les tokens JWT de manière sécurisée. |
| **Spring Data JPA** | Accès Données | Abstraction du SQL, utilisation des Interfaces Repository pour gagner du temps. |
| **MySQL 8** | Base de données | SGGBD relationnel robuste et open-source. |
| **React + Vite** | Frontend | Framework moderne, rapide (Vite), gestion efficace du DOM virtuel (SPA). |
| **Axios** | Client HTTP | Gestion des intercepteurs (pour injecter le Token automatiquement). |

---

## 3. 🏗️ Architecture & Design Patterns Clés

Il est crucial de mentionner que vous n'avez pas codé "au hasard", mais en suivant des patterns :

1.  **DTO (Data Transfer Object) :**
    *   *Explication :* J'utilise des objets `ClientRequest`, `CompteResponse` pour ne pas exposer mes Entités JPA directement.
    *   *Avantage :* Sécurité (on ne montre pas le password) et découplage (si la base change, l'API ne casse pas forcément).

2.  **Inversion de Contrôle (IoC) & Injection de Dépendances :**
    *   *Explication :* Utilisation de `@Service` et `@RequiredArgsConstructor` (Lombok) pour injecter les dépendances via le constructeur.
    *   *Avantage :* Rend le code testable (facile à mocker) et modulaire.

3.  **AOP (Aspect Oriented Programming) :**
    *   *Explication :* J'ai créé un `LoggingAspect` pour tracer l'exécution des méthodes sans polluer le code métier.
    *   *Avantage :* Gestion centralisée des logs transverses.

4.  **Repository Pattern :**
    *   *Explication :* Interfaces étendant `JpaRepository`.
    *   *Avantage :* Pas de SQL brut dans le code Java.

---

## 4. 🔒 Sécurité & Flux d'Authentification (Point critique)

Expliquez le flux JWT :
1.  L'utilisateur envoie `login/password`.
2.  Le serveur (AuthenticationManager) vérifie dans la BDD (hash BCrypt).
3.  Si OK, génération du **JWT** (signé avec une clé secrète).
4.  Le Frontend stocke ce JWT (ex: localStorage).
5.  **Interceptor Axios :** Pour chaque requête suivante, le Frontend injecte le header `Authorization: Bearer <token>`.
6.  **Filtre Backend (`JwtAuthenticationFilter`) :** Intercepte chaque requête, valide le token et connecte l'utilisateur dans le contexte Spring Security.

---

## 5. 🧪 Fonctionnalités & Règles Métier (Démonstration)

Mettez en avant les règles métier complexes implémentées :
*   **RG_Mail :** Envoi asynchrone d'email avec les identifiants lors de la création d'un client.
*   **RG_Solde :** Vérification atomique du solde avant virement (Transactionnel : si le crédit échoue, le débit est annulé grâce à `@Transactional`).
*   **RG_Statut :** Initialisation automatique du compte à "OUVERT" et solde à 3000 DH.

---

## 6. ❓ Questions fréquentes (Antisèches)

**Q: Pourquoi Spring Boot 3 et pas 2 ?**
R: Pour bénéficier de Java 17 minimum, des améliorations de performance, et des dernières mises à jour de sécurité de Spring Security 6.

**Q: Comment gérez-vous les erreurs ?**
R: Via un `GlobalExceptionHandler` (`@ControllerAdvice`) qui capture les exceptions et renvoie des réponses JSON standardisées (Code 400, 403, 500).

**Q: Pourquoi React au lieu de Thymeleaf ?**
R: Pour créer une **Single Page Application (SPA)** plus fluide, séparer clairement le Frontend du Backend (API REST), ce qui permettrait demain de créer une appli mobile utilisant le même Backend.
