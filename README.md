# 🏦 eBank - Plateforme Bancaire Digitale (Spring Boot & React)

![Status](https://img.shields.io/badge/Status-Completed-success) ![Java](https://img.shields.io/badge/Backend-Spring%20Boot%203-green) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue) ![Database](https://img.shields.io/badge/Database-MySQL-orange)

## 📋 Présentation du Projet
eBank est une application bancaire "Full Stack" robuste et sécurisée. Elle permet à une banque de digitaliser ses services via deux interfaces distinctes : un **Portail Agent** pour la gestion de la clientèle et des comptes, et un **Espace Client** pour la consultation de solde et les virements.

Le projet a été conçu en respectant les principes d'architecture logicielle modernes (Architecture en couches, principes SOLID, Sécurité Stateless).

### 🌟 Fonctionnalités Clés

#### 👨‍💼 Espace Agent (Back-Office)
*   **Authentification Sécurisée** : Accès réservé aux agents.
*   **Création de Clients** : Formulaire dynamique avec validation métier.
    *   *Feature Spéciale :* Génération automatique des identifiants et **envoi par Email** au client.
*   **Gestion des Comptes** : Création de comptes bancaires avec attribution de RIB et solde initial (3000 MAD).
*   **Vue Globale** : Tableaux de bord pour lister et rechercher clients et comptes.

#### 👤 Espace Client (Banque en ligne)
*   **Tableau de Bord Personnel** :
    *   Visualisation du Solde en temps réel.
    *   Historique des dernières opérations (Débit/Crédit) avec pagination.
*   **Virements Internes/Externes** : Module de virement sécurisé avec vérification de provision atomique.
*   **Sécurité** : Gestion de session JWT avec expiration automatique (1h).

---

## 🛠️ Architecture Technique

### Backend (`ebank-backend`)
*   **Core :** Java 17, Spring Boot 3.2.0
*   **Sécurité :** Spring Security 6, JJWT (JSON Web Token) 0.12.3
*   **Data :** Spring Data JPA, Hibernate, MySQL 8
*   **Outils :** Lombok (Boilerplate reduction), ModelMapper (DTO Mapping)
*   **Tests :** JUnit 5, Mockito

### Frontend (`ebank-frontend`)
*   **Core :** React 18, Vite (Build tool ultra-rapide)
*   **Navigation :** React Router DOM v6 (Protection des routes par Rôle)
*   **HTTP Client :** Axios (avec Interceptors pour l'injection du Token)
*   **Styling :** CSS Modules avec variables CSS modernes (Glassmorphism layout).

---

## 🚀 Installation et Lancement

### Prérequis
*   **Java JDK 17+**
*   **Node.js 18+**
*   **MySQL Server 8+**
*   **Git**

### 1. Cloner le Projet
```bash
git clone https://github.com/youssef-abd/Ebank.git
cd Ebank
```

### 2. Configuration de la Base de Données MySQL
Créez une base de données vide nommée `ebank_db` :
```sql
CREATE DATABASE ebank_db;
```

### 3. Configuration des Variables d'Environnement (Backend)

⚠️ **IMPORTANT** : Le projet utilise des variables d'environnement pour protéger les informations sensibles.

#### Étape 3.1 : Créer le fichier `.env`
Naviguez vers le dossier backend et créez un fichier `.env` à partir du template :
```bash
cd ebank-backend
cp .env.example .env
```

#### Étape 3.2 : Remplir le fichier `.env`
Ouvrez le fichier `.env` et remplissez-le avec **VOS** informations :

```properties
# Configuration MySQL
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe_mysql

# Configuration SMTP (Optionnel pour les tests)
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_application_gmail

# Configuration JWT (Générez une clé aléatoire de 64 caractères minimum)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

**Notes :**
*   Pour `MAIL_PASSWORD`, vous devez générer un **"Mot de passe d'application"** depuis votre compte Google (Sécurité → Validation en deux étapes → Mots de passe des applications).
*   Si vous ne configurez pas SMTP, les identifiants des nouveaux clients seront affichés dans la console du backend.
*   Pour `JWT_SECRET`, vous pouvez garder la valeur par défaut ou générer une nouvelle clé aléatoire.

### 4. Lancement du Backend
```bash
cd ebank-backend
mvn spring-boot:run
```
*Le backend démarrera sur le port **8080**.*

### 5. Lancement du Frontend
Ouvrez un **nouveau terminal** :
```bash
cd ebank-frontend
npm install
npm run dev
```
*Le frontend sera accessible sur **http://localhost:5173**.*

---

## 🔐 Identifiants de Test (Démarrage Rapide)
Au lancement, l'application crée automatiquement un Agent par défaut :
*   **Login :** `admin`
*   **Password :** `admin`

Connectez-vous avec cet agent pour créer vos premiers clients !

---

## 📚 Documentation Complémentaire
*   **Guide de Présentation** : Consultez `PRESENTATION_ARCHI.md` pour préparer une soutenance.
*   **Documentation Technique Avancée** : Voir `DOCUMENTATION_TECHNIQUE_AVANCEE.md` pour une analyse approfondie du code.

---

## 🧪 Lancer les Tests Unitaires
```bash
cd ebank-backend
mvn test
```

---

## 🤝 Contribution
Ce projet est un projet académique. Les contributions sont les bienvenues pour l'améliorer !

---

## 📄 Licence
Ce projet est sous licence MIT.

---

## 👨‍💻 Auteur
**Youssef Abdellaoui**  
Projet réalisé dans le cadre de la formation en Architecture J2EE / React.
