# Déploiement de 9boutiques

Ce guide explique comment publier 9boutiques sur GitHub puis le déployer sur Render avec une base PostgreSQL.

## Pré-requis

- Node.js 18.17 ou supérieur
- npm
- Git installé et configuré
- Un compte GitHub
- Un compte Render
- Une base PostgreSQL Render créée dans la même région que le Web Service

Depuis la racine du projet :

```powershell
cd "C:\Users\OUATTARA CLEMENT\9boutiques"
npm install
npm run build
```

Le build utilise le script suivant :

```json
"build": "next build && npx prisma migrate deploy"
```

Cela compile Next.js puis applique les migrations présentes dans `prisma/migrations`.

## 1. Créer et pousser le dépôt GitHub

### Créer le dépôt

1. Ouvrez GitHub et cliquez sur **New repository**.
2. Donnez-lui un nom, par exemple `9boutiques`.
3. Choisissez `Private` ou `Public` selon votre besoin.
4. Ne cochez pas l’ajout automatique d'un README, d'un `.gitignore` ou d'une licence : le projet possède déjà ses fichiers.
5. Cliquez sur **Create repository**.

### Initialiser Git localement

Dans PowerShell, à la racine du projet :

```powershell
cd "C:\Users\OUATTARA CLEMENT\9boutiques"
git init
git branch -M main
git add .
git commit -m "Initialise 9boutiques"
```

Le fichier `.gitignore` exclut notamment `node_modules`, `.next`, `.env` et les autres fichiers sensibles. Vérifiez avant le premier push :

```powershell
git status
git check-ignore .env node_modules .next
```

`.env` doit rester ignoré. Ne publiez jamais les mots de passe PostgreSQL, les secrets NextAuth ou les clés Cloudinary dans GitHub.

### Relier le dépôt local à GitHub

Remplacez `VOTRE_COMPTE` par votre identifiant GitHub :

```powershell
git remote add origin https://github.com/VOTRE_COMPTE/9boutiques.git
git remote -v
git push -u origin main
```

Avec GitHub CLI, la création et le push peuvent aussi être faits ainsi :

```powershell
gh repo create 9boutiques --private --source=. --remote=origin --push
```

## 2. Créer le Web Service sur Render

### Créer la base PostgreSQL

1. Connectez-vous à [Render](https://dashboard.render.com/).
2. Cliquez sur **New +**, puis **PostgreSQL**.
3. Donnez à la base le nom `9boutiques-db`.
4. Choisissez une région.
5. Créez la base et attendez son statut **Available**.
6. Copiez la **External Database URL** pour un déploiement lancé sur Render, ou utilisez la connexion interne Render si elle est disponible pour votre service dans la même région.

L'URL doit avoir cette forme :

```text
postgresql://utilisateur:mot_de_passe@hote-render/base?sslmode=require
```

Le paramètre `sslmode=require` est nécessaire pour la connexion PostgreSQL Render.

### Créer le service web

1. Dans Render, cliquez sur **New +** puis **Web Service**.
2. Choisissez **Build and deploy from a Git repository**.
3. Connectez GitHub à Render si nécessaire.
4. Sélectionnez le dépôt `9boutiques`.
5. Configurez le service :

| Paramètre | Valeur |
|---|---|
| Name | `9boutiques` |
| Runtime | `Node` |
| Branch | `main` |
| Region | La même région que PostgreSQL |
| Root Directory | Laisser vide |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Auto-Deploy | `Yes` |

6. Cliquez sur **Create Web Service**.

Le `npm run build` exécute automatiquement `prisma migrate deploy` après la compilation Next.js. Les migrations doivent donc être commitées dans `prisma/migrations`.

## 3. Commandes Render

Utilisez exactement :

### Build command

```bash
npm ci && npm run build
```

Cette commande :

1. installe les versions verrouillées dans `package-lock.json` ;
2. compile l'application Next.js ;
3. exécute `npx prisma migrate deploy` ;
4. échoue si une migration ne peut pas être appliquée.

### Start command

```bash
npm start
```

Le script `start` lance le serveur Next.js en mode production.

## 4. Variables d'environnement Render

Dans le Web Service Render, ouvrez **Environment**, puis ajoutez les variables suivantes. Ne copiez pas les valeurs de développement du fichier `.env` local.

| Variable | Valeur à fournir | Obligatoire |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL Render avec `?sslmode=require` | Oui |
| `NEXTAUTH_SECRET` | Secret aléatoire long, différent en production | Oui |
| `NEXTAUTH_URL` | URL publique Render, par exemple `https://9boutiques.onrender.com` | Oui |
| `UPLOAD_PROVIDER` | `cloudinary` en production recommandée | Oui |
| `UPLOAD_CLOUDINARY_CLOUD_NAME` | Cloud name Cloudinary | Si Cloudinary |
| `UPLOAD_CLOUDINARY_API_KEY` | API key Cloudinary | Si Cloudinary |
| `UPLOAD_CLOUDINARY_API_SECRET` | API secret Cloudinary | Si Cloudinary |

La liste correspond à [.env.example](.env.example) :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/9boutiques?schema=public"
NEXTAUTH_SECRET="change-me-please"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
UPLOAD_PROVIDER="local"
UPLOAD_CLOUDINARY_CLOUD_NAME=""
UPLOAD_CLOUDINARY_API_KEY=""
UPLOAD_CLOUDINARY_API_SECRET=""
```

En production, configurez plutôt :

```env
DATABASE_URL="postgresql://UTILISATEUR:MOT_DE_PASSE@HOTE_RENDER/db_9boutiques_db?sslmode=require"
NEXTAUTH_SECRET="un-secret-aleatoire-long-et-unique"
NEXTAUTH_URL="https://VOTRE_SERVICE.onrender.com"
UPLOAD_PROVIDER="cloudinary"
UPLOAD_CLOUDINARY_CLOUD_NAME="votre-cloud-name"
UPLOAD_CLOUDINARY_API_KEY="votre-api-key"
UPLOAD_CLOUDINARY_API_SECRET="votre-api-secret"
```

`ADMIN_EMAIL` et `ADMIN_PASSWORD` sont optionnelles. Pour créer ou mettre à jour
un compte administrateur sans inscription publique, définissez-les temporairement
dans l’environnement puis lancez :

```powershell
$env:ADMIN_EMAIL="admin@9boutiques.fr"
$env:ADMIN_PASSWORD="un-mot-de-passe-fort"
npx prisma db seed
```

Le compte developer de seed est `developer@9boutiques.fr`. Changez son mot de
passe dans `prisma/seed.ts` avant toute utilisation en production.

### Générer un secret NextAuth

PowerShell :

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Ou avec Node.js :

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Copiez le résultat dans la variable Render `NEXTAUTH_SECRET`. Ne le commitez pas.

## 5. Vérifier le déploiement

### Vérifier le build Render

Dans Render, ouvrez les logs du déploiement et vérifiez la présence de messages similaires :

```text
Compiled successfully
No pending migrations to apply.
```

Une migration appliquée pour la première fois peut apparaître avec son nom, par exemple :

```text
Applying migration `20260922180000_init_schema`
```

Le déploiement est considéré comme réussi lorsque le service passe à l'état **Live**.

### Vérifier le site

Ouvrez l'URL publique Render :

```text
https://VOTRE_SERVICE.onrender.com
```

Testez au minimum :

- `/` : page d'accueil et boutiques ;
- `/boutiques` : liste des boutiques ;
- `/panier` : panier ;
- `/login` : page de connexion ;
- `/admin` : accès protégé ;
- `/dev` : accès réservé au rôle `developer`.

### Vérifier l'API

Depuis PowerShell :

```powershell
$base = "https://VOTRE_SERVICE.onrender.com"
Invoke-RestMethod "$base/api/boutiques"
Invoke-RestMethod "$base/api/produits"
Invoke-RestMethod "$base/api/commandes"
```

Les réponses doivent être du JSON. Une réponse `500` doit être analysée dans les logs Render.

### Vérifier Prisma depuis le projet

Avec la `DATABASE_URL` Render présente temporairement dans votre environnement local :

```powershell
npx prisma migrate status
npx prisma migrate deploy
```

La sortie attendue est :

```text
Database schema is up to date!
No pending migrations to apply.
```

## En cas de problème

### Migration échouée

**Symptôme :** le build échoue sur `prisma migrate deploy` ou affiche `P1001`.

**Vérifications :**

1. Vérifiez que `DATABASE_URL` est présente dans Render.
2. Vérifiez l'hôte, la base, l'utilisateur et le mot de passe.
3. Ajoutez `?sslmode=require` à l'URL PostgreSQL Render.
4. Vérifiez que la base Render est à l'état **Available**.
5. Vérifiez que les fichiers de `prisma/migrations` sont bien commités et poussés sur GitHub.
6. Lancez localement :

```powershell
npx prisma migrate status
npx prisma validate
```

Ne lancez pas `prisma migrate dev` sur la base de production : cette commande est prévue pour le développement et peut demander un reset. Sur Render, utilisez `prisma migrate deploy`.

### Variable manquante

**Symptôme :** `Environment variable not found` ou erreur NextAuth au démarrage.

Vérifiez une par une les variables suivantes dans Render :

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
UPLOAD_PROVIDER
UPLOAD_CLOUDINARY_CLOUD_NAME
UPLOAD_CLOUDINARY_API_KEY
UPLOAD_CLOUDINARY_API_SECRET
```

Après modification d'une variable, déclenchez un nouveau déploiement. Les variables locales du fichier `.env` ne sont pas envoyées automatiquement à Render.

### Build qui casse

**Symptôme :** `npm run build` échoue.

Exécutez localement :

```powershell
npm ci
npx prisma generate
npx tsc --noEmit
npm run build
```

Causes courantes :

- dépendance absente du `package.json` ;
- `package-lock.json` non synchronisé avec `package.json` ;
- erreur TypeScript ;
- variable d'environnement nécessaire pendant le build absente ;
- migration Prisma invalide ou non commitée ;
- import avec une casse différente du nom de fichier ;
- utilisation d'une API serveur dans un composant client.

### Site accessible mais erreur 500

1. Ouvrez les logs du Web Service Render.
2. Vérifiez la première erreur, avant les erreurs en cascade.
3. Vérifiez `DATABASE_URL` et `NEXTAUTH_SECRET`.
4. Testez l'endpoint concerné avec `Invoke-RestMethod`.
5. Redéployez après correction :

```powershell
git add .
git commit -m "Corrige la configuration de production"
git push origin main
```

### Images qui ne s'affichent pas

Le mode `local` ou les `data URL` sont adaptés aux tests, mais pas à un stockage durable sur Render. Configurez Cloudinary :

1. créez un compte Cloudinary ;
2. récupérez le cloud name, l'API key et l'API secret ;
3. ajoutez les trois variables dans Render ;
4. définissez `UPLOAD_PROVIDER=cloudinary` ;
5. redéployez le service.

Ne placez jamais l'API secret dans le code ou dans GitHub.

## Mise à jour ultérieure

Pour publier une nouvelle version :

```powershell
cd "C:\Users\OUATTARA CLEMENT\9boutiques"
git pull origin main
npm install
npx prisma migrate dev --name description_de_la_migration
npm run build
git add prisma/migrations package.json package-lock.json .
git commit -m "Ajoute une migration et met à jour l'application"
git push origin main
```

Render détecte le push GitHub et relance automatiquement le build. En production, la nouvelle migration est appliquée par `prisma migrate deploy` pendant ce build.
