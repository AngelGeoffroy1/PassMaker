const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

exports.handler = async (event, context) => {
  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Gérer les requêtes OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    }
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Corps de la requête manquant' }),
      }
    }

    const { 
      text, 
      primaryColor, 
      secondaryColor, 
      style, 
      brightness, 
      hasQRCode, 
      qrPosition, 
      textPosition, 
      textSize, 
      description,
      braceletSize 
    } = JSON.parse(event.body)

    // Nettoyage et validation du texte utilisateur
    const cleanText = (text || 'EVENT').replace(/[^a-zA-Z0-9\s\-_]/g, '').substring(0, 50)

    // Construction du prompt simplifié et conforme aux politiques OpenAI
    const styleText = style === 'fun' ? 'colorful and playful' : 'professional and elegant'
    const brightnessText = brightness === 'light' ? 'bright' : 'dark'
    const colorScheme = `primary color ${primaryColor || 'blue'}, secondary color ${secondaryColor || 'purple'}`
    
    const prompt = `A high-quality ${styleText} Tyvek wristband with ${colorScheme} and ${brightnessText} tones. The wristband displays "${cleanText}" text in ${textPosition || 'center'} position with ${textSize || 'medium'} size. ${hasQRCode ? `Include a QR code on the ${qrPosition || 'right'} side.` : ''} Professional product photography style with clean white background, soft lighting, and sharp details. Modern design suitable for events and marketing.`

    console.log('Génération d\'image avec OpenAI DALL-E 3...')

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('Aucune image générée')
    }

    console.log('Image générée avec succès:', imageUrl)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        imageUrl,
        prompt: prompt.substring(0, 200) + '...' // Aperçu du prompt
      }),
    }

  } catch (error) {
    console.error('Erreur lors de la génération:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur lors de la génération de l\'image',
        details: error.message || 'Erreur inconnue'
      }),
    }
  }
} 