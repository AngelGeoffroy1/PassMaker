import { NextRequest, NextResponse } from 'next/server'
import { DesignGenerator } from '@/lib/design-generator'
import type { BraceletForm, TechnicalZones } from '@/types/bracelet'

interface RequestBody {
  formData: BraceletForm
  technicalZones: TechnicalZones
}

export async function POST(request: NextRequest) {
  try {
    const { formData, technicalZones } = await request.json() as RequestBody
    
    // Validation simple
    if (!formData.associationName || !formData.eventName || !formData.eventDate || !formData.colorPalette) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Rate limiting basique (à améliorer en production)  
    // TODO: Implémenter un vrai rate limiting avec Redis ou base de données

    const designGenerator = new DesignGenerator()
    
    // Génération asynchrone du design avec zones techniques
    const svgContent = await designGenerator.generateBracelet(formData, technicalZones)
    
    // Conversion du SVG en Data URL pour affichage navigateur
    const svgBase64 = Buffer.from(svgContent).toString('base64')
    const imageUrl = `data:image/svg+xml;base64,${svgBase64}`

    // Création d'un ID unique pour le résultat
    const resultId = `bracelet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return NextResponse.json({
      success: true,
      result: {
        id: resultId,
        imageUrl,
        createdAt: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du bracelet' },
      { status: 500 }
    )
  }
}