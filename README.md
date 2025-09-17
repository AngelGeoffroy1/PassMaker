# 🎫 PassMaker - Générateur de Bracelets Événementiels

Une web app Next.js moderne pour générer des bracelets événementiels prêts à imprimer en un clic ! Parfait pour les soirées étudiantes, festivals et événements.

## ✨ Fonctionnalités

### MVP Actuel
- **Formulaire intuitif** avec upload de logo (PNG/SVG/JPG)
- **Génération IA** via prompt personnalisé (Nano Banana)
- **Normalisation print automatique** : Format Tyvek 14×150mm, 300 DPI
- **Zones techniques optionnelles** : QR Code 20×20mm, Numérotation 10×5mm
- **Aperçu en temps réel** avec tabs (Aperçu/Spécifications)
- **Exports multiples** : PNG 300 DPI et PDF prêt impression
- **Interface moderne** avec shadcn/ui et dark mode
- **Responsive design** et accessibilité optimisée

### Spécifications Techniques
- **Format** : Tyvek 14×150mm (optimal pour bracelets événementiels)
- **Résolution** : 300 DPI (qualité impression professionnelle)  
- **Exports** : PNG haute définition + PDF vectoriel
- **Zones techniques** : QR codes, numérotation, repères de coupe
- **Palettes prédéfinies** : Électrique, Néon, Pastel, Sombre, Vintage, Océan

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Clé API Nano Banana (optionnelle pour tests)

### Installation
```bash
# Cloner le projet
git clone <url-du-repo>
cd passmaker

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

### Configuration API
```bash
# .env.local
NANO_BANANA_API_KEY=votre_clé_google_ai_studio
NANO_BANANA_API_URL=https://generativelanguage.googleapis.com/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛠️ Architecture

### Structure du projet
```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/generate/       # API route de génération
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Page d'accueil
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   └── bracelet/           # Composants métier
│       ├── bracelet-form.tsx
│       └── bracelet-preview.tsx
├── lib/
│   ├── constants.ts        # Constantes (palettes, specs)
│   ├── nano-banana.ts      # Service IA
│   └── image-processor.ts  # Normalisation print
└── types/
    └── bracelet.ts         # Types TypeScript
```

### Stack Technique
- **Frontend** : Next.js 14, React, TypeScript
- **UI** : shadcn/ui, Tailwind CSS, Lucide Icons
- **Forms** : React Hook Form + Zod validation
- **IA** : Google AI Studio (Gemini 2.0 Flash avec génération d'images)
- **Export** : Canvas API + jsPDF
- **Notifications** : Sonner toasts

## 🎨 Utilisation

1. **Saisie des informations** : Nom d'asso, soirée, date, palette
2. **Upload du logo** : PNG/SVG/JPG, max 5MB
3. **Configuration technique** : QR code, numérotation (optionnel)
4. **Génération IA** : Un clic pour créer le visuel
5. **Prévisualisation** : Aperçu temps réel + spécifications
6. **Téléchargement** : PNG 300 DPI + PDF prêt impression

## 🔮 Roadmap v2

### Fonctionnalités prévues
- **Historique des rendus** avec système de sauvegarde
- **Templates prédéfinis** (variants de designs)
- **Palettes personnalisées** avec color picker
- **Multi-formats** : Vinyle 25mm, autres dimensions
- **Numérotation automatique** par batch
- **Intégration imprimeurs** (APIs partenaires)
- **Collaboration** : partage et modification d'équipe
- **Analytics** : stats d'utilisation et performance

### Améliorations techniques
- **Storage cloud** (AWS S3/Cloudinary)
- **Rate limiting avancé** (Redis)
- **Cache intelligent** pour optimiser les rendus
- **PWA** : installation mobile
- **Tests automatisés** (Jest, Cypress)

## 📐 Spécifications Print

### Format Tyvek Standard
- **Dimensions** : 150×14mm (ratio 10.7:1)
- **Résolution** : 300 DPI (1772×165 px)
- **Support** : Tyvek (résistant eau/déchirures)
- **Impression** : Numérique, encres UV recommandées

### Zones Techniques
- **QR Code** : 20×20mm, positionnement gauche/droite
- **Numérotation** : 10×5mm, format #001-999
- **Repères de coupe** : Traits 1px noir aux angles
- **Marges de sécurité** : 2mm mini du bord

## 🤝 Contribution

1. Fork du projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalité`)
3. Commit des changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalité`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier `LICENSE` pour les détails.

---

<div align="center">
  <p><strong>Fait avec ❤️ pour les associations étudiantes</strong></p>
  <p><em>PassMaker v1.0 - Générez, Imprimez, Célébrez ! 🎉</em></p>
</div>
