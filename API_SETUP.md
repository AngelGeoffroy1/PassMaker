# Configuration de l'API OpenAI pour PassMaker

## 🔧 Configuration requise

Pour utiliser la génération de designs par IA, vous devez configurer votre clé API OpenAI.

### Sur Netlify (Production)
1. Allez dans votre tableau de bord Netlify
2. Sélectionnez votre site PassMaker
3. Allez dans **Site settings** > **Environment variables**
4. Ajoutez une nouvelle variable :
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Votre clé API OpenAI

### En local (Développement)
1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez la ligne suivante :
   ```
   OPENAI_API_KEY=votre_clé_api_openai_ici
   ```

## 🔑 Obtenir une clé API OpenAI

1. Rendez-vous sur [OpenAI Platform](https://platform.openai.com/api-keys)
2. Connectez-vous ou créez un compte
3. Cliquez sur "Create new secret key"
4. Copiez la clé générée (elle ne sera plus visible après)
5. Ajoutez des crédits à votre compte OpenAI si nécessaire

## 💰 Coûts estimés

- **DALL-E 3 (1024x1024, HD)**: ~0.08$ par image
- **Usage typique**: 1-5 générations par design
- **Coût par bracelet personnalisé**: ~0.08$ - 0.40$

## 🛡️ Sécurité

- ⚠️ Ne jamais exposer votre clé API dans le code
- ✅ Utilisez toujours les variables d'environnement
- 🔄 Régénérez votre clé si elle est compromise

## 🚀 Test de l'intégration

Une fois configuré, testez la génération :
1. Allez sur `/create`
2. Choisissez un modèle de bracelet
3. Configurez votre design
4. Cliquez sur "Générer le design IA"
5. Attendez ~10-30 secondes pour la génération 