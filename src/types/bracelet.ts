export interface BraceletForm {
  associationName: string
  eventName: string
  eventDate: string
  colorPalette: string
  logoFile?: File
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
    size: number // mm
    position: 'left' | 'right'
  }
  numbering: {
    enabled: boolean
    width: number // mm
    height: number // mm
    position: 'left' | 'right'
  }
  cutMarks: boolean
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