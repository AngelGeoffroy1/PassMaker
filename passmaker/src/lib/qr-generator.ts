import QRCode from 'qrcode'

export async function generateQRCodeSVG(url: string, size: number = 56): Promise<string> {
  try {
    // Génère le QR code en format SVG
    const qrSvg = await QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    return qrSvg
  } catch (error) {
    console.error('Error generating QR code:', error)
    
    // Fallback : QR code simple en SVG
    return `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        <rect x="4" y="4" width="${size-8}" height="${size-8}" fill="none" stroke="black" stroke-width="1"/>
        <text x="${size/2}" y="${size/2}" text-anchor="middle" font-family="Arial" font-size="8" fill="black">QR</text>
      </svg>
    `
  }
}

export async function generateQRCodeDataURL(url: string, size: number = 56): Promise<string> {
  try {
    // Génère le QR code en format Data URL
    const qrDataURL = await QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    return qrDataURL
  } catch (error) {
    console.error('Error generating QR code data URL:', error)
    return ''
  }
}