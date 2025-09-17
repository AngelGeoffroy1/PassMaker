import { PRINT_SPECS, TECHNICAL_ZONES } from './constants'
import type { TechnicalZones, PrintSpecs } from '@/types/bracelet'

export class ImageProcessor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    this.ctx = ctx
  }

  async normalizeForPrint(
    imageUrl: string, 
    technicalZones: TechnicalZones,
    format: 'tyvek' | 'vinyl' = 'tyvek'
  ): Promise<{
    pngBlob: Blob
    pdfBlob: Blob
    specs: PrintSpecs
    metadata: any
  }> {
    const specs = PRINT_SPECS[format.toUpperCase() as keyof typeof PRINT_SPECS]
    
    // Conversion mm vers pixels à 300 DPI
    const dpi = 300
    const mmToPx = (mm: number) => Math.round((mm * dpi) / 25.4)
    
    const canvasWidth = mmToPx(specs.width)
    const canvasHeight = mmToPx(specs.height)
    
    // Configuration du canvas
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    
    // Fond blanc
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Chargement de l'image générée
    const img = await this.loadImage(imageUrl)
    
    // Calcul des zones disponibles
    let availableWidth = canvasWidth
    let xOffset = 0
    
    if (technicalZones.qrCode.enabled) {
      const qrSize = mmToPx(TECHNICAL_ZONES.QR_CODE.width)
      availableWidth -= qrSize
      if (technicalZones.qrCode.position === 'left') {
        xOffset += qrSize
      }
    }
    
    if (technicalZones.numbering.enabled) {
      const numbering = mmToPx(TECHNICAL_ZONES.NUMBERING.width)
      availableWidth -= numbering
      if (technicalZones.numbering.position === 'left') {
        xOffset += numbering
      }
    }
    
    // Dessin de l'image principale redimensionnée
    this.ctx.drawImage(img, xOffset, 0, availableWidth, canvasHeight)
    
    // Ajout des zones techniques
    await this.addTechnicalZones(technicalZones, canvasWidth, canvasHeight, mmToPx)
    
    // Repères de coupe
    if (technicalZones.cutMarks) {
      this.addCutMarks(canvasWidth, canvasHeight)
    }
    
    // Génération des exports
    const pngBlob = await this.generatePNG()
    const pdfBlob = await this.generatePDF(specs)
    
    return {
      pngBlob,
      pdfBlob,
      specs,
      metadata: {
        dimensions: { width: canvasWidth, height: canvasHeight },
        dpi,
        zones: technicalZones,
        activeAreas: {
          main: { x: xOffset, width: availableWidth, height: canvasHeight },
          qr: technicalZones.qrCode.enabled ? { size: mmToPx(TECHNICAL_ZONES.QR_CODE.width) } : null,
          numbering: technicalZones.numbering.enabled ? { 
            width: mmToPx(TECHNICAL_ZONES.NUMBERING.width), 
            height: mmToPx(TECHNICAL_ZONES.NUMBERING.height) 
          } : null
        }
      }
    }
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  private async addTechnicalZones(
    zones: TechnicalZones,
    canvasWidth: number,
    canvasHeight: number,
    mmToPx: (mm: number) => number
  ) {
    // Zone QR Code
    if (zones.qrCode.enabled) {
      const qrSize = mmToPx(TECHNICAL_ZONES.QR_CODE.width)
      const qrX = zones.qrCode.position === 'left' ? 0 : canvasWidth - qrSize
      const qrY = (canvasHeight - qrSize) / 2
      
      // Bordure pour indiquer la zone QR
      this.ctx.strokeStyle = '#cccccc'
      this.ctx.setLineDash([2, 2])
      this.ctx.strokeRect(qrX, qrY, qrSize, qrSize)
      
      // Texte indicatif
      this.ctx.fillStyle = '#999999'
      this.ctx.font = '8px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('QR', qrX + qrSize/2, qrY + qrSize/2)
      
      this.ctx.setLineDash([])
    }
    
    // Zone numérotation
    if (zones.numbering.enabled) {
      const numWidth = mmToPx(TECHNICAL_ZONES.NUMBERING.width)
      const numHeight = mmToPx(TECHNICAL_ZONES.NUMBERING.height)
      const numX = zones.numbering.position === 'left' ? 
        (zones.qrCode.enabled && zones.qrCode.position === 'left' ? mmToPx(TECHNICAL_ZONES.QR_CODE.width) : 0) : 
        canvasWidth - numWidth
      const numY = (canvasHeight - numHeight) / 2
      
      // Bordure pour indiquer la zone numérotation
      this.ctx.strokeStyle = '#cccccc'
      this.ctx.setLineDash([2, 2])
      this.ctx.strokeRect(numX, numY, numWidth, numHeight)
      
      // Texte indicatif
      this.ctx.fillStyle = '#999999'
      this.ctx.font = '6px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('#001', numX + numWidth/2, numY + numHeight/2)
      
      this.ctx.setLineDash([])
    }
  }

  private addCutMarks(canvasWidth: number, canvasHeight: number) {
    const markLength = 10
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 0.5
    this.ctx.setLineDash([])
    
    // Coins
    const corners = [
      [0, 0], [canvasWidth, 0], 
      [0, canvasHeight], [canvasWidth, canvasHeight]
    ]
    
    corners.forEach(([x, y]) => {
      // Marques horizontales
      this.ctx.beginPath()
      this.ctx.moveTo(x + (x === 0 ? -markLength : markLength), y)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      // Marques verticales
      this.ctx.beginPath()
      this.ctx.moveTo(x, y + (y === 0 ? -markLength : markLength))
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    })
  }

  private async generatePNG(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to generate PNG blob'))
        }
      }, 'image/png', 1)
    })
  }

  private async generatePDF(specs: PrintSpecs): Promise<Blob> {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf')
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [specs.height, specs.width]
    })
    
    const imgData = this.canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, specs.width, specs.height)
    
    return new Promise(resolve => {
      const blob = pdf.output('blob')
      resolve(blob)
    })
  }
}