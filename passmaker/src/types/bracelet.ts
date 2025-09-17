export interface LogoOptions {
  position: 'left' | 'right' | 'center' | 'top-left' | 'top-right'
  size: 'small' | 'medium' | 'large'
  style: 'overlay' | 'integrated' | 'background'
  base64Data?: string // Image convertie en base64 pour l'intégration SVG
}

export interface BraceletForm {
  associationName: string
  eventName: string
  eventDate: string
  colorPalette: string
  customColors?: string[]
  templateId?: string
  logoFile?: File
  logoOptions?: LogoOptions
}

export interface PrintSpecs {
  width: number // mm
  height: number // mm
  dpi: number
  format: 'tyvek' | 'vinyl'
}

export interface TechnicalZones {
  qrCode: {
    enabled: boolean
    url: string
    position: 'left' | 'right'
  }
}

export interface BraceletResult {
  id: string
  imageUrl: string
  pngUrl: string
  pdfUrl: string
  specs: PrintSpecs
  metadata: {
    dimensions: { width: number; height: number }
    dpi: number
    zones: TechnicalZones
  }
  createdAt: string
  shareUrl?: string
}

export interface GenerationStatus {
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'error'
  progress: number
  message?: string
}