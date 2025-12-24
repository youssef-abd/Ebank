# 🧠 Documentation Technique Avancée & Analyse Approfondie
**Projet :** eBank Fullstack (Spring Boot / React)
**Usage :** Préparation Entretien Technique (Niveau Confirmé/Junior+)

Ce document décortique chaque brique du projet pour vous permettre de répondre à n'importe quelle question technique ("Pourquoi ?", "Comment ?", "Et si ?").

---

## I. Le Coeur du Backend : Analyse de Spring Security & JWT

C'est souvent là que les recruteurs creusent. Vous devez maîtriser ce flux.

### 1. Le Workflow d'Authentification (Pas à pas)
Le projet n'utilise pas de sessions HTTP classiques (JSESSIONID), mais une architecture **Stateless**.

1.  **Login (`AuthController`)** :
    *   Le client POST `/api/auth/login`.
    *   `AuthenticationManager.authenticate()` vérifie le couple Login/Pass.
    *   Si OK, on appelle `jwtTokenProvider.createToken()`.
    *   **Subtilité technique :** Le token contient des "Claims" (Revendications) : le `sub` (username), le `roles` (exp: AGENT), et `iat`/`exp` (dates).
2.  **Protection des Routes (`JwtAuthenticationFilter`)** :
    *   Ce filtre hérite de `OncePerRequestFilter` (garantit une seule exécution par requête).
    *   Il extrait le header `Authorization: Bearer <token>`.
    *   Il valide la signature (avec la clé secrète).
    *   **Point clé :** Si valide, il crée un objet `UsernamePasswordAuthenticationToken` et le place dans le `SecurityContextHolder`. C'est ça qui dit à Spring "C'est bon, il est connecté".

### 2. Question Piège : "Comment gérez-vous l'expiration ?"
*   **Réponse :** Le token a une durée de vie fixe (1h, définie dans `application.properties`). Une fois expiré, le `JwtAuthenticationFilter` rejette la requête. Le Frontend (Axios) intercepte cette erreur 403/401 et redirige vers `/login` (implémenté dans `api.js` ou effet de bord React).
*   **Amélioration possible (à citer) :** "Actuellement, il faut se reconnecter. Pour aller plus loin, je pourrais implémenter un **Refresh Token** stocké en Cookie HttpOnly pour renouveler silencieusement la session."

---

## II. Gestion des Données et Transactions (JPA)

### 1. Le Modèle de Données (Entity Relationship)
*   `User` (Base) <--- OneToOne ---> `Client`
*   `Client` <--- OneToMany ---> `CompteBancaire`
*   `CompteBancaire` <--- OneToMany ---> `Operation`

### 2. Le Virement : Une "Transaction Atomique"
Le code dans `OperationService.effectuerVirement()` est critique.
*   **Annotation vitale :** `@Transactional`.
*   **Pourquoi ?** Si on débite le compte A, et que le programme plante (ou serveur coupe) AVANT de créditer le compte B :
    *   **Sans @Transactional :** L'argent est perdu (débité mais pas crédité). Incohérence comptable.
    *   **Avec @Transactional :** Tout est annulé (Rollback automatiques). La base revient à l'état initial. C'est le principe ACID.

### 3. Les DTOs (Data Transfer Objects)
*   **Pourquoi j'utilise `ModelMapper` ?** Pour éviter d'écrire manuellement `dto.setNom(entity.getNom())` 50 fois.
*   **Règle d'or :** Jamais d'Entité JPA dans le retour d'un Controller. Cela évite les boucles infinies JSON (références circulaires) et le "Leak" de données sensibles (mot de passe hashé de l'objet User).

---

## III. Le Frontend React : Choix et Patterns

### 1. Pourquoi Vite et pas Create-React-App ?
*   **Vite** utilise ESBuild (Go) pour la compilation, ce qui est 10x à 100x plus rapide que Webpack. Le Hot Module Replacement (HMR) est instantané. C'est le standard 2024.

### 2. Gestion de l'état et Effets
*   **Hooks utilisés :**
    *   `useState` : Pour les données locales (formulaire, liste comptes).
    *   `useEffect` : Pour charger les données au montage du composant (équivalent `componentDidMount`).
    *   `useNavigate` : Pour la redirection programmatique.

### 3. Sécurité côté Client (Axios Interceptors)
Dans `services.js`, l'intercepteur est crucial :
```javascript
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
```
**Explication pour l'entretien :** "Cela permet de ne pas se soucier du token dans chaque appel API. C'est centralisé. Si j'appelle `get('/comptes')`, le token part automatiquement."

---

## IV. Stratégie de Test et Qualité

### 1. Tests Unitaires (`CompteServiceTest`)
*   Utilisation de **Mockito** (`@Mock`, `@InjectMocks`).
*   **Philosophie :** On teste la *logique métier* (ex: est-ce que le compte est bien créé à l'état OUVERT ?) sans toucher à la vraie base de données. On "simule" le repository.

### 2. Gestion des erreurs (GlobalExceptionHandler)
*   Utilisation de `@ControllerAdvice`.
*   Toute exception (ex: `RuntimeException("Solde insuffisant")`) est capturée ici et transformée en une belle réponse JSON `{ "message": "Solde insuffisant" }` avec le code HTTP 400 ou 500 approprié.

---

## V. Pistes d'Améliorations (Si on vous demande "Et la suite ?")

Si on vous demande : "Qu'est-ce qui manque à votre projet ?", répondez ceci :

1.  **Validation Frontend plus poussée :** Utiliser *Formik* ou *React Hook Form* pour gérer les formulaires complexes.
2.  **Sécurité Token :** Stocker le JWT dans un Cookie `HttpOnly` et `Secure` plutôt que dans le `localStorage` (vulnérable aux attaques XSS).
3.  **Logs :** Mettre en place Log4j2 avec rotation de fichiers ou envoi vers ELK (Elasticsearch).
4.  **Docker :** Conteneuriser l'application pour un déploiement Cloud facile.

---

**Conclusion pour l'entretien :**
Ce projet démontre ma capacité à construire une application complète, de la base de données à l'interface utilisateur, en respectant les standards de sécurité et de robustesse attendus en entreprise.
