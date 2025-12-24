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
*   Java JDK 17+
*   Node.js 18+
*   MySQL Server

### 1. Configuration Base de Données
Créez une base de données vide nommée `ebank_db`.
```sql
CREATE DATABASE ebank_db;
```

### 2. Configuration Backend
Ouvrez `ebank-backend/src/main/resources/application.properties` et configurez vos accès MySQL et Email :
```properties
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE

# Config Email (Optionnel pour test, Recommandé pour prod)
spring.mail.username=votre.email@gmail.com
spring.mail.password=votre_app_password
```

### 3. Lancement
**Backend :**
```bash
cd ebank-backend
mvn spring-boot:run
```
*Le backend démarrera sur le port 8080.*

**Frontend :**
```bash
cd ebank-frontend
npm install
npm run dev
```
*Le frontend sera accessible sur http://localhost:5173.*

---

## 🔐 Identifiants de Test (Démarrage Rapide)
Au lancement, l'application crée automatiquement un Agent par défaut :
*   **Login :** `admin`
*   **Password :** `admin`

Connectez-vous avec cet agent pour créer vos premiers clients !
