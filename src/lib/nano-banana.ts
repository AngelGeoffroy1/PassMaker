import type { BraceletForm } from '@/types/bracelet'

export class NanoBananaService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NANO_BANANA_API_KEY || ''
    this.baseUrl = process.env.NANO_BANANA_API_URL || 'https://api.nano-banana.com/v1'
  }

  async generateBracelet(formData: BraceletForm): Promise<string> {
    const prompt = this.buildPrompt(formData)
    
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          width: 1772, // 150mm at 300 DPI
          height: 165,  // 14mm at 300 DPI
          style: 'bracelet-event',
          quality: 'high'
        })
      })

      if (!response.ok) {
        throw new Error(`Nano Banana API error: ${response.status}`)
      }

      const result = await response.json()
      return result.image_url
      
    } catch (error) {
      console.error('Nano Banana generation failed:', error)
      throw new Error('Échec de la génération IA')
    }
  }

  private buildPrompt(formData: BraceletForm): string {
    const paletteDescriptions = {
      electric: 'couleurs électriques vives (rose fluo, cyan, jaune)',
      neon: 'couleurs néon brillantes (rouge néon, vert néon, violet néon)',
      pastel: 'couleurs pastel douces (rose pâle, vert pâle, bleu pâle)',
      dark: 'couleurs sombres élégantes (noir, gris foncé, gris)',
      vintage: 'couleurs vintage rétro (beige, crème, marron clair)',
      ocean: 'couleurs océan (bleu profond, turquoise, bleu clair)'
    }

    const paletteDesc = paletteDescriptions[formData.colorPalette as keyof typeof paletteDescriptions] || 'couleurs vives'

    return `
Créer un design de bracelet événementiel moderne et attractif pour une soirée étudiante.

DÉTAILS DE L'ÉVÉNEMENT:
- Association: "${formData.associationName}"
- Soirée: "${formData.eventName}"
- Date: "${formData.eventDate}"
- Palette: ${paletteDesc}

STYLE VISUEL:
- Design moderne, dynamique et festif
- Typography contemporaine et lisible
- Éléments graphiques jeunes et énergiques
- ${paletteDesc} en harmonie
- Composition équilibrée pour un format rectangulaire de bracelet

CONTRAINTES TECHNIQUES:
- Format horizontal 150x14mm (ratio 10.7:1)
- Fond adapté à l'impression sur Tyvek
- Contraste élevé pour une bonne lisibilité
- Espaces réservés sur les côtés pour zones techniques éventuelles

AMBIANCE: 
Soirée étudiante festive, moderne, énergique. Le design doit donner envie de participer à l'événement !
`.trim()
  }

  // Méthode de fallback en cas d'échec de l'API
  async generateFallbackBracelet(formData: BraceletForm): Promise<string> {
    // Ici on pourrait utiliser une API alternative ou générer une image basique avec Canvas
    return '/api/generate-fallback'
  }
}