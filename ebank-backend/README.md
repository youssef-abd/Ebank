# eBank Backend

Application de gestion bancaire développée avec Spring Boot 3.

## Technologies utilisées

- **Spring Boot 3.2.0**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **MySQL 8**
- **Lombok**
- **ModelMapper** (pour les DTOs)
- **AOP** (Aspect Oriented Programming)

## Architecture

L'application suit une architecture en couches :

```
├── entity/          # Entités JPA
├── repository/      # Repositories Spring Data
├── service/         # Couche métier
├── controller/      # API REST Controllers
├── dto/             # Data Transfer Objects
├── security/        # Configuration JWT et Spring Security
├── aspect/          # Aspects AOP
├── exception/       # Gestion des exceptions
└── config/          # Configuration de l'application
```

## Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- MySQL 8.0+

## Configuration

1. Créer une base de données MySQL :
```sql
CREATE DATABASE ebank_db;
```

2. Configurer les paramètres dans `application.properties` :
   - URL de la base de données
   - Identifiants MySQL
   - Configuration email (optionnel)

## Démarrage

```bash
mvn spring-boot:run
```

L'application démarre sur le port 8080.

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/change-password` - Changer le mot de passe

### Gestion des clients (AGENT_GUICHET)
- `POST /api/client` - Créer un client
- `GET /api/client` - Liste des clients
- `GET /api/client/{id}` - Détails d'un client
- `GET /api/client/numero/{numeroIdentite}` - Client par numéro d'identité

### Gestion des comptes (AGENT_GUICHET)
- `POST /api/compte` - Créer un compte bancaire
- `GET /api/compte` - Liste des comptes
- `GET /api/compte/client/{clientId}` - Comptes d'un client
- `GET /api/compte/rib/{rib}` - Compte par RIB

### Dashboard Client (CLIENT)
- `GET /api/dashboard` - Tableau de bord
- `GET /api/dashboard/compte/{rib}` - Dashboard d'un compte spécifique
- `GET /api/dashboard/operations/top10/{rib}` - 10 dernières opérations

### Virements (CLIENT)
- `POST /api/virement` - Effectuer un virement

## Règles métier implémentées

- **RG_1** : Cryptage des mots de passe (BCrypt)
- **RG_2** : Message d'erreur pour login/mot de passe erronés
- **RG_3** : Token JWT valide 1 heure
- **RG_4** : Unicité du numéro d'identité
- **RG_5** : Champs obligatoires pour le client
- **RG_6** : Unicité de l'email
- **RG_7** : Envoi d'email avec identifiants
- **RG_8** : Vérification de l'existence du client
- **RG_9** : Validation du RIB
- **RG_10** : Compte créé avec statut OUVERT
- **RG_11** : Vérification du statut du compte
- **RG_12** : Vérification du solde
- **RG_13** : Débit du compte source
- **RG_14** : Crédit du compte destinataire
- **RG_15** : Traçabilité des opérations

## Sécurité

- Authentification JWT
- Autorisation par rôles (CLIENT, AGENT_GUICHET)
- CORS configuré pour React
- Cryptage des mots de passe avec BCrypt

## Design Patterns utilisés

- **IoC** (Inversion of Control) via Spring
- **AOP** (Aspect Oriented Programming) pour le logging
- **DTO Pattern** pour la séparation des couches
- **Repository Pattern** avec Spring Data JPA
