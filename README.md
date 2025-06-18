# PassMaker 🎫

Une application SaaS moderne pour créer des bracelets personnalisés avec l'intelligence artificielle.

## ✨ Fonctionnalités

- 🎨 **Design assisté par IA** : Génération automatique de designs avec DALL-E 3
- 🖼️ **Upload de logos** : Système de drag & drop pour vos logos
- 🎯 **Personnalisation complète** : Couleurs, texte, QR codes, styles
- 📱 **Interface responsive** : Design moderne et animations fluides
- ⚡ **Aperçu temps réel** : Visualisation 3D du bracelet

## 🚀 Technologies

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS, Framer Motion
- **IA** : OpenAI DALL-E 3
- **Déploiement** : Netlify, Vercel compatible

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone https://github.com/AngelGeoffroy1/PassMaker.git
cd PassMaker
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.local.example .env.local
```
Éditez `.env.local` et ajoutez votre clé API OpenAI :
```env
OPENAI_API_KEY=sk-proj-votre_cle_api_ici
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🔑 Configuration OpenAI

1. Créez un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Générez une clé API dans la section API Keys
3. Ajoutez la clé dans votre fichier `.env.local`
4. Assurez-vous d'avoir des crédits pour utiliser DALL-E 3

## 🌐 Déploiement

### Netlify
1. Connectez votre repository GitHub à Netlify
2. Configurez la variable d'environnement `OPENAI_API_KEY` dans les settings Netlify
3. Le déploiement se fait automatiquement

### Vercel
1. Importez votre projet sur Vercel
2. Ajoutez `OPENAI_API_KEY` dans les variables d'environnement
3. Déployez

## 📁 Structure du projet

```
PassMaker/
├── src/
│   ├── app/
│   │   ├── api/generate-design/    # API route pour l'IA
│   │   ├── create/                 # Page de création
│   │   └── page.tsx               # Landing page
│   ├── components/ui/             # Composants UI réutilisables
│   └── lib/                       # Utilitaires
├── .env.local.example            # Template variables d'environnement
├── netlify.toml                  # Configuration Netlify
└── README.md
```

## 🎨 API IA

L'endpoint `/api/generate-design` accepte les paramètres suivants :

```typescript
{
  text: string,
  primaryColor: string,
  secondaryColor: string,
  style: 'fun' | 'professional',
  brightness: 'light' | 'dark',
  hasQRCode: boolean,
  qrPosition: 'left' | 'right',
  textPosition: 'left' | 'center' | 'right',
  textSize: 'small' | 'medium' | 'large',
  description: string,
  braceletSize: string
}
```

## 📝 License

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ en France** 🇫🇷 