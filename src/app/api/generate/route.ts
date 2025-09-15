import { NextRequest, NextResponse } from 'next/server'
import { NanoBananaService } from '@/lib/nano-banana'
import type { BraceletForm } from '@/types/bracelet'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json() as BraceletForm
    
    // Validation simple
    if (!formData.associationName || !formData.eventName || !formData.eventDate || !formData.colorPalette) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Rate limiting basique (à améliorer en production)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    // TODO: Implémenter un vrai rate limiting avec Redis ou base de données

    const nanoBanana = new NanoBananaService()
    
    // Génération avec l'IA
    let imageUrl: string
    try {
      imageUrl = await nanoBanana.generateBracelet(formData)
    } catch (error) {
      console.error('Primary AI generation failed, trying fallback:', error)
      imageUrl = await nanoBanana.generateFallbackBracelet(formData)
    }

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