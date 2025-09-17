import type { BraceletForm, LogoOptions, TechnicalZones } from '@/types/bracelet'
import { COLOR_PALETTES } from '@/lib/constants'
import { generateQRCodeDataURL } from '@/lib/qr-generator'

export interface DesignTemplate {
  id: string
  name: string
  description: string
  category: string
  preview?: string
  generator: (formData: BraceletForm, technicalZones?: TechnicalZones) => Promise<string>
}

export class DesignGenerator {
  private templates: DesignTemplate[]

  constructor() {
    this.templates = [
      {
        id: 'festival',
        name: 'Festival Pro',
        description: 'Style événementiel avec typographie bold et éléments techniques',
        category: 'Événementiel',
        generator: this.generateFestivalDesign.bind(this)
      },
      {
        id: 'gradient-modern',
        name: 'Gradient Modern',
        description: 'Dégradés colorés avec typographie clean et structure moderne',
        category: 'Moderne',
        generator: this.generateGradientModernDesign.bind(this)
      },
      {
        id: 'pattern-brand',
        name: 'Pattern Branding',
        description: 'Répétition du nom avec branding fort et dégradés subtils',
        category: 'Branding',
        generator: this.generatePatternBrandDesign.bind(this)
      },
      {
        id: 'minimalist-pro',
        name: 'Minimalist Pro',
        description: 'Typographie fine avec espaces blancs et design élégant',
        category: 'Élégant',
        generator: this.generateMinimalistProDesign.bind(this)
      },
      {
        id: 'retro-wave',
        name: 'Retro Wave',
        description: 'Style années 80 avec néons et typographies futuristes',
        category: 'Rétro',
        generator: this.generateRetroWaveDesign.bind(this)
      },
      {
        id: 'tech-industrial',
        name: 'Tech Industrial',
        description: 'Style industriel avec codes-barres et éléments techniques',
        category: 'Tech',
        generator: this.generateTechIndustrialDesign.bind(this)
      }
    ]
  }

  async generateBracelet(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    // Utilise le template spécifié ou sélectionne automatiquement
    const template = formData.templateId 
      ? this.getTemplateById(formData.templateId) || this.selectTemplateForPalette(formData.colorPalette)
      : this.selectTemplateForPalette(formData.colorPalette)
    
    const svgContent = await template.generator(formData, technicalZones)
    
    // Validation du SVG généré
    console.log('Generated SVG for', formData.eventName, '- Template:', template.id)
    return svgContent
  }

  getAllTemplates(): DesignTemplate[] {
    return this.templates
  }

  getTemplateById(id: string): DesignTemplate | null {
    return this.templates.find(t => t.id === id) || null
  }

  private selectTemplateForPalette(palette: string): DesignTemplate {
    const templateMap: { [key: string]: string } = {
      'electric': 'retro-wave',
      'neon': 'festival',
      'pastel': 'minimalist-pro',
      'dark': 'tech-industrial',
      'vintage': 'pattern-brand',
      'ocean': 'gradient-modern'
    }

    const templateId = templateMap[palette] || 'gradient-modern'
    return this.templates.find(t => t.id === templateId) || this.templates[0]
  }

  private getPaletteColors(palette: string, customColors?: string[]): string[] {
    if (palette === 'custom' && customColors && customColors.length === 3) {
      return customColors
    }
    const paletteData = COLOR_PALETTES.find(p => p.value === palette)
    return paletteData ? [...paletteData.colors] : ['#FF0080', '#00FFFF', '#FFFF00']
  }

  private async generateLogoElement(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    if (!formData.logoOptions || !formData.logoOptions.base64Data) return ''
    
    const { position, size, style, base64Data } = formData.logoOptions
    
    // Positions et tailles
    const positions = {
      'left': { x: 80, y: 28 },  // Décalé pour éviter les conflits avec QR code
      'right': { x: 520, y: 28 }, // Décalé pour éviter les zones techniques
      'center': { x: 300, y: 28 },
      'top-left': { x: 80, y: 15 },
      'top-right': { x: 520, y: 15 }
    }
    
    const sizes = {
      'small': { width: 20, height: 20 },
      'medium': { width: 30, height: 30 },
      'large': { width: 40, height: 40 }
    }
    
    const pos = positions[position]
    const logoSize = sizes[size]
    
    // Style d'intégration
    let logoElement = ''
    
    if (style === 'background') {
      // Logo en arrière-plan avec opacité réduite
      logoElement = `
        <image x="${pos.x - logoSize.width/2}" y="${pos.y - logoSize.height/2}" 
               width="${logoSize.width}" height="${logoSize.height}" 
               href="${base64Data}" opacity="0.3" />
      `
    } else if (style === 'overlay') {
      // Logo en superposition avec fond
      logoElement = `
        <circle cx="${pos.x}" cy="${pos.y}" r="${Math.max(logoSize.width, logoSize.height)/2 + 3}" 
                fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <image x="${pos.x - logoSize.width/2}" y="${pos.y - logoSize.height/2}" 
               width="${logoSize.width}" height="${logoSize.height}" 
               href="${base64Data}" />
      `
    } else {
      // Style intégré par défaut
      logoElement = `
        <image x="${pos.x - logoSize.width/2}" y="${pos.y - logoSize.height/2}" 
               width="${logoSize.width}" height="${logoSize.height}" 
               href="${base64Data}" />
      `
    }
    
    return logoElement
  }

  private async generateQRElement(technicalZones?: TechnicalZones): Promise<string> {
    if (!technicalZones?.qrCode.enabled || !technicalZones.qrCode.url) return ''
    
    try {
      // Génère le QR code en data URL
      const qrDataURL = await generateQRCodeDataURL(technicalZones.qrCode.url, 56)
      
      // Position du QR code (toujours à gauche, pleine hauteur)
      const qrWidth = 56 // Même hauteur que le bracelet
      const qrHeight = 56
      const qrX = technicalZones.qrCode.position === 'left' ? 0 : 600 - qrWidth
      
      return `
        <!-- QR Code Zone -->
        <rect x="${qrX}" y="0" width="${qrWidth}" height="${qrHeight}" fill="rgba(0,0,0,0.1)"/>
        <image x="${qrX + 2}" y="2" width="${qrWidth - 4}" height="${qrHeight - 4}" 
               href="${qrDataURL}" />
      `
    } catch (error) {
      console.error('Error generating QR code element:', error)
      return ''
    }
  }

  private async generateFestivalDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="festivalBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="50%" stop-color="${colors[1]}" />
            <stop offset="100%" stop-color="${colors[2]}" />
          </linearGradient>
          <pattern id="barcode" patternUnits="userSpaceOnUse" width="2" height="56">
            <rect width="1" height="56" fill="rgba(0,0,0,0.1)"/>
          </pattern>
        </defs>
        
        <!-- Fond principal -->
        <rect width="600" height="56" fill="url(#festivalBg)" />
        
        ${qrElement}
        
        <!-- Zone technique gauche (si pas de QR code) -->
        ${!technicalZones?.qrCode.enabled ? `
        <rect x="0" y="0" width="60" height="56" fill="rgba(0,0,0,0.1)"/>
        <rect x="5" y="5" width="50" height="46" fill="url(#barcode)" opacity="0.3"/>
        <text x="30" y="15" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">EVENT</text>
        <text x="30" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="6">#003</text>
        <text x="30" y="35" text-anchor="middle" fill="white" font-family="Arial" font-size="6">STAFF</text>
        <text x="30" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="6">${formData.eventDate}</text>
        ` : ''}
        
        <!-- Zone technique droite -->
        <rect x="540" y="0" width="60" height="56" fill="rgba(0,0,0,0.1)"/>
        <rect x="545" y="15" width="50" height="4" fill="rgba(255,255,255,0.8)"/>
        <rect x="545" y="22" width="40" height="4" fill="rgba(255,255,255,0.6)"/>
        <rect x="545" y="29" width="45" height="4" fill="rgba(255,255,255,0.4)"/>
        <rect x="545" y="36" width="35" height="4" fill="rgba(255,255,255,0.3)"/>
        
        <!-- Titre principal -->
        <text x="300" y="25" text-anchor="middle" fill="white" 
              font-family="Arial Black, Arial" font-size="24" font-weight="900" 
              letter-spacing="2px">${formData.eventName.toUpperCase()}</text>
        
        <!-- Association -->
        <text x="300" y="42" text-anchor="middle" fill="rgba(255,255,255,0.9)" 
              font-family="Arial" font-size="10" font-weight="bold" 
              letter-spacing="1px">${formData.associationName.toUpperCase()}</text>
        
        <!-- Date -->
        <text x="300" y="52" text-anchor="middle" fill="rgba(255,255,255,0.7)" 
              font-family="Arial" font-size="8">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateGradientModernDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="33%" stop-color="${colors[1]}" />
            <stop offset="66%" stop-color="${colors[2]}" />
            <stop offset="100%" stop-color="${colors[0]}" />
          </linearGradient>
          <filter id="modernShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Fond dégradé -->
        <rect width="600" height="56" fill="url(#modernGrad)" />
        
        ${qrElement}
        
        <!-- Overlay texture -->
        <rect width="600" height="56" fill="rgba(255,255,255,0.05)" />
        
        <!-- Zone information -->
        <rect x="480" y="5" width="115" height="46" fill="rgba(0,0,0,0.2)" rx="3"/>
        <text x="537" y="18" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">GENERAL FULL ACCESS</text>
        <text x="537" y="28" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial" font-size="6">${formData.eventDate}</text>
        <text x="537" y="38" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial" font-size="6">${formData.associationName}</text>
        <text x="537" y="47" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial" font-size="5">NIGHTMARKET</text>
        
        <!-- Titre principal -->
        <text x="80" y="35" fill="white" 
              font-family="Arial Black, Arial" font-size="28" font-weight="900" 
              letter-spacing="1px" filter="url(#modernShadow)">${formData.eventName.toUpperCase()}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generatePatternBrandDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="patternGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="50%" stop-color="${colors[1]}" />
            <stop offset="100%" stop-color="${colors[2]}" />
          </linearGradient>
        </defs>
        
        <!-- Fond dégradé -->
        <rect width="600" height="56" fill="url(#patternGrad)" />
        
        ${qrElement}
        
        <!-- Pattern de noms répétés -->
        <text x="50" y="20" fill="rgba(255,255,255,0.3)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        <text x="200" y="20" fill="rgba(255,255,255,0.4)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        <text x="350" y="20" fill="rgba(255,255,255,0.3)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        <text x="500" y="20" fill="rgba(255,255,255,0.4)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        
        <text x="100" y="45" fill="rgba(255,255,255,0.25)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        <text x="250" y="45" fill="rgba(255,255,255,0.35)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        <text x="400" y="45" fill="rgba(255,255,255,0.25)" font-family="Arial Black" font-size="12" font-weight="900">${formData.eventName.toUpperCase()}</text>
        
        <!-- Titre principal centré -->
        <rect x="150" y="22" width="300" height="12" fill="rgba(0,0,0,0.6)"/>
        <text x="300" y="32" text-anchor="middle" fill="white" 
              font-family="Arial Black, Arial" font-size="16" font-weight="900" 
              letter-spacing="3px">${formData.eventName.toUpperCase()}</text>
        
        <!-- Info supplémentaire -->
        <text x="300" y="45" text-anchor="middle" fill="rgba(255,255,255,0.8)" 
              font-family="Arial" font-size="8" letter-spacing="1px">${formData.associationName} • ${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateMinimalistProDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minimalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
          </linearGradient>
        </defs>
        
        <!-- Fond épuré -->
        <rect width="600" height="56" fill="url(#minimalGrad)" />
        
        ${qrElement}
        
        <!-- Ligne décorative -->
        <line x1="80" y1="28" x2="520" y2="28" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        
        <!-- Points décoratifs -->
        <circle cx="90" cy="28" r="1.5" fill="rgba(255,255,255,0.6)"/>
        <circle cx="510" cy="28" r="1.5" fill="rgba(255,255,255,0.6)"/>
        
        <!-- Titre élégant -->
        <text x="300" y="22" text-anchor="middle" fill="white" 
              font-family="Arial" font-size="18" font-weight="300" 
              letter-spacing="2px">${formData.eventName}</text>
        
        <!-- Association -->
        <text x="300" y="38" text-anchor="middle" fill="rgba(255,255,255,0.8)" 
              font-family="Arial" font-size="9" font-weight="300" 
              letter-spacing="1px">${formData.associationName.toUpperCase()}</text>
        
        <!-- Date -->
        <text x="300" y="48" text-anchor="middle" fill="rgba(255,255,255,0.6)" 
              font-family="Arial" font-size="7">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateRetroWaveDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="retroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="50%" stop-color="${colors[1]}" />
            <stop offset="100%" stop-color="${colors[2]}" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Fond rétro -->
        <rect width="600" height="56" fill="url(#retroGrad)" />
        
        ${qrElement}
        
        <!-- Grille rétro -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="600" height="56" fill="url(#grid)" />
        
        <!-- Formes géométriques rétro -->
        <polygon points="50,10 70,10 60,28" fill="rgba(255,255,255,0.2)"/>
        <polygon points="550,10 570,10 560,28" fill="rgba(255,255,255,0.2)"/>
        
        <!-- Titre néon -->
        <text x="300" y="30" text-anchor="middle" fill="white" 
              font-family="Arial Black, Arial" font-size="20" font-weight="900" 
              letter-spacing="3px" filter="url(#neonGlow)"
              style="text-transform: uppercase;">${formData.eventName}</text>
        
        <!-- Association -->
        <text x="300" y="45" text-anchor="middle" fill="rgba(255,255,255,0.8)" 
              font-family="Arial" font-size="8" font-weight="bold" 
              letter-spacing="2px">${formData.associationName} • ${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateTechIndustrialDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
          </linearGradient>
          <pattern id="techPattern" patternUnits="userSpaceOnUse" width="1" height="56">
            <rect width="0.5" height="56" fill="rgba(255,255,255,0.1)"/>
          </pattern>
        </defs>
        
        <!-- Fond industriel -->
        <rect width="600" height="56" fill="url(#techGrad)" />
        
        ${qrElement}
        
        <!-- Code-barres côtés -->
        <rect x="10" y="0" width="30" height="56" fill="url(#techPattern)"/>
        <rect x="560" y="0" width="30" height="56" fill="url(#techPattern)"/>
        
        <!-- Éléments techniques -->
        <rect x="50" y="5" width="40" height="8" fill="rgba(255,255,255,0.8)" rx="1"/>
        <text x="70" y="11" text-anchor="middle" fill="black" font-family="Arial" font-size="5" font-weight="bold">TECH-001</text>
        
        <rect x="50" y="43" width="40" height="8" fill="rgba(255,255,255,0.6)" rx="1"/>
        <text x="70" y="49" text-anchor="middle" fill="black" font-family="Arial" font-size="5">AUTHORIZED</text>
        
        <!-- Titre technique -->
        <text x="300" y="25" text-anchor="middle" fill="white" 
              font-family="Arial" font-size="16" font-weight="bold" 
              letter-spacing="1px" style="text-transform: uppercase;">${formData.eventName}</text>
        
        <!-- Info technique -->
        <text x="300" y="38" text-anchor="middle" fill="rgba(255,255,255,0.9)" 
              font-family="Arial" font-size="8" letter-spacing="0.5px">${formData.associationName}</text>
        <text x="300" y="48" text-anchor="middle" fill="rgba(255,255,255,0.7)" 
              font-family="Arial" font-size="6">${formData.eventDate} • SECURITY CLEARED</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  // Anciens templates (gardés pour compatibilité)
  private async generateGradientDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="50%" stop-color="${colors[1]}" />
            <stop offset="100%" stop-color="${colors[2]}" />
          </linearGradient>
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3" flood-color="#000000"/>
          </filter>
        </defs>
        
        <!-- Fond principal -->
        <rect width="600" height="56" fill="url(#mainGrad)" rx="8" />
        
        ${qrElement}
        
        <!-- Overlay subtil -->
        <rect width="600" height="56" fill="rgba(255,255,255,0.05)" rx="8" />
        
        <!-- Texte événement -->
        <text x="300" y="22" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
              filter="url(#textShadow)">${formData.eventName}</text>
        
        <!-- Texte association -->
        <text x="300" y="38" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="11" opacity="0.9"
              filter="url(#textShadow)">${formData.associationName}</text>
        
        <!-- Date -->
        <text x="300" y="50" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="9" opacity="0.8"
              filter="url(#textShadow)">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateGeometricDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Fond -->
        <rect width="600" height="56" fill="url(#bgGrad)" />
        
        ${qrElement}
        
        <!-- Formes géométriques -->
        <polygon points="50,10 70,10 60,28 40,28" fill="${colors[2]}" opacity="0.7"/>
        <circle cx="100" cy="20" r="6" fill="${colors[2]}" opacity="0.6"/>
        <rect x="130" y="15" width="10" height="10" fill="${colors[2]}" opacity="0.5" transform="rotate(45 135 20)"/>
        
        <polygon points="550,10 570,10 560,28 540,28" fill="${colors[2]}" opacity="0.7"/>
        <circle cx="500" cy="20" r="6" fill="${colors[2]}" opacity="0.6"/>
        <rect x="460" y="15" width="10" height="10" fill="${colors[2]}" opacity="0.5" transform="rotate(45 465 20)"/>
        
        <!-- Lignes décoratives -->
        <line x1="160" y1="28" x2="440" y2="28" stroke="${colors[2]}" stroke-width="1" opacity="0.4"/>
        <line x1="160" y1="30" x2="440" y2="30" stroke="white" stroke-width="1" opacity="0.2"/>
        
        <!-- Texte -->
        <text x="300" y="22" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="15" font-weight="bold" 
              filter="url(#glow)">${formData.eventName}</text>
        <text x="300" y="40" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="10" opacity="0.9">${formData.associationName}</text>
        <text x="300" y="51" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="8" opacity="0.8">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateMinimalDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minimalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
          </linearGradient>
        </defs>
        
        <!-- Fond -->
        <rect width="600" height="56" fill="url(#minimalGrad)" />
        
        ${qrElement}
        
        <!-- Ligne décorative fine -->
        <line x1="80" y1="28" x2="520" y2="28" stroke="white" stroke-width="1" opacity="0.3"/>
        
        <!-- Points décoratifs -->
        <circle cx="100" cy="28" r="2" fill="white" opacity="0.6"/>
        <circle cx="500" cy="28" r="2" fill="white" opacity="0.6"/>
        
        <!-- Texte épuré -->
        <text x="300" y="20" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="14" font-weight="300">${formData.eventName}</text>
        <text x="300" y="36" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="10" opacity="0.8">${formData.associationName}</text>
        <text x="300" y="48" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="8" opacity="0.7">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }

  private async generateFestiveDesign(formData: BraceletForm, technicalZones?: TechnicalZones): Promise<string> {
    const colors = this.getPaletteColors(formData.colorPalette, formData.customColors)
    const logoElement = this.generateLogoElement(formData)
    const qrElement = await this.generateQRElement(technicalZones)
    
    const svg = `
      <svg width="600" height="56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="festiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="25%" stop-color="${colors[1]}" />
            <stop offset="50%" stop-color="${colors[2]}" />
            <stop offset="75%" stop-color="${colors[1]}" />
            <stop offset="100%" stop-color="${colors[0]}" />
          </linearGradient>
          <filter id="party-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Fond festif -->
        <rect width="600" height="56" fill="url(#festiveGrad)" />
        
        ${qrElement}
        
        <!-- Étoiles -->
        <polygon points="60,12 63,19 70,19 65,24 67,31 60,27 53,31 55,24 50,19 57,19" fill="white" opacity="0.8"/>
        <polygon points="540,12 543,19 550,19 545,24 547,31 540,27 533,31 535,24 530,19 537,19" fill="white" opacity="0.8"/>
        
        <!-- Confettis -->
        <rect x="120" y="8" width="4" height="4" fill="${colors[2]}" opacity="0.9" transform="rotate(45 122 10)"/>
        <rect x="150" y="45" width="3" height="3" fill="${colors[1]}" opacity="0.8" transform="rotate(30 151.5 46.5)"/>
        <rect x="420" y="12" width="4" height="4" fill="${colors[2]}" opacity="0.9" transform="rotate(45 422 14)"/>
        <rect x="450" y="42" width="3" height="3" fill="${colors[1]}" opacity="0.8" transform="rotate(30 451.5 43.5)"/>
        
        <!-- Cercles lumineux -->
        <circle cx="180" cy="28" r="3" fill="white" opacity="0.6"/>
        <circle cx="420" cy="28" r="3" fill="white" opacity="0.6"/>
        
        <!-- Texte avec effet lumineux -->
        <text x="300" y="22" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
              filter="url(#party-glow)">${formData.eventName}</text>
        <text x="300" y="38" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="11" opacity="0.9">${formData.associationName}</text>
        <text x="300" y="50" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="9" opacity="0.8">${formData.eventDate}</text>
              
        ${logoElement}
      </svg>
    `
    
    // Retourne le SVG brut (sans encodage) pour éviter le double encodage
    return svg
  }
}