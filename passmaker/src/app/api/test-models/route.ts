import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NANO_BANANA_API_KEY || ''
  const baseUrl = process.env.NANO_BANANA_API_URL || 'https://generativelanguage.googleapis.com/v1'

  try {
    const response = await fetch(`${baseUrl}/models?key=${apiKey}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText }, { status: response.status })
    }

    const result = await response.json()
    
    // Filtre les modèles supportant generateContent
    const availableModels = result.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ).map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedMethods: model.supportedGenerationMethods
    }))

    return NextResponse.json({ 
      total: availableModels?.length || 0,
      models: availableModels || []
    })

  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}