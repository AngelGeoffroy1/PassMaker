import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  console.log('[API] Début de la requête generate-design')
  
  try {
    // Vérifier que la clé API est configurée
    console.log('[API] Vérification de la clé OpenAI...', process.env.OPENAI_API_KEY ? 'Présente' : 'Absente')
    
    if (!openai) {
      console.log('[API] Erreur: Clé API OpenAI non configurée')
      return NextResponse.json(
        { success: false, error: 'Clé API OpenAI non configurée' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('[API] Body reçu:', body)
    
    const { 
      text, 
      textPosition, 
      textSize, 
      primaryColor, 
      secondaryColor, 
      style, 
      brightness, 
      hasQRCode, 
      qrPosition, 
      description 
    } = body

    // Construction du prompt détaillé
    const prompt = `Create a high-quality product mockup of a modern Tyvek wristband/bracelet with the following specifications:

DESIGN REQUIREMENTS:
- Text: "${text}" positioned ${textPosition} on the bracelet in ${textSize} size
- Primary color: ${primaryColor}
- Secondary color: ${secondaryColor} 
- Style: ${style === 'fun' ? 'Fun and playful design with vibrant elements' : 'Professional and minimal design with clean lines'}
- Brightness: ${brightness === 'light' ? 'Light and bright color scheme' : 'Dark and sophisticated color scheme'}
- QR Code: ${hasQRCode ? `Include a small QR code positioned on the ${qrPosition} side` : 'No QR code'}
- Creative elements: ${description || 'Modern and appealing design'}

TECHNICAL SPECIFICATIONS:
- Material: Tyvek (matte finish, slightly textured)
- Shape: Rectangular wristband, approximately 250mm x 19mm
- Closure: Adhesive strip closure
- View: 3/4 angle view showing the full bracelet
- Background: Clean white background with subtle shadow
- Lighting: Professional product photography lighting
- Resolution: High quality, crisp and clear details

STYLE REQUIREMENTS:
- Photorealistic product mockup
- Professional e-commerce product photo quality
- Show the bracelet as if it's a real product ready for sale
- Include subtle depth and shadow for realism
- Ensure all text is clearly readable
- Colors should be vibrant and accurate to specifications

The bracelet should look like a real, high-quality product that customers would want to purchase.`

    // Appel à l'API DALL-E 3
    console.log('[API] Appel à OpenAI DALL-E 3...')
    console.log('[API] Prompt généré:', prompt.substring(0, 100) + '...')
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })
    
    console.log('[API] Réponse OpenAI reçue')

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('Aucune image générée')
    }

    console.log('[API] Succès! Image URL:', imageUrl)
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      prompt: prompt // Pour debug
    })

  } catch (error) {
    console.error('[API] Erreur génération IA:', error)
    console.error('[API] Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace')
    
    // Gestion des erreurs spécifiques d'OpenAI
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'Clé API OpenAI non configurée' },
          { status: 500 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'Quota API dépassé' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération du design' },
      { status: 500 }
    )
  }
} 