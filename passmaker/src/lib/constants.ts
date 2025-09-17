export const PRINT_SPECS = {
  TYVEK: {
    width: 150, // mm
    height: 14, // mm
    dpi: 300
  },
  VINYL: {
    width: 150, // mm 
    height: 25, // mm
    dpi: 300
  }
} as const

export const TECHNICAL_ZONES = {
  QR_CODE: {
    width: 20, // mm
    height: 20, // mm
  },
  NUMBERING: {
    width: 10, // mm
    height: 5, // mm
  }
} as const

export const COLOR_PALETTES = [
  { name: 'Électrique', value: 'electric', colors: ['#FF0080', '#00FFFF', '#FFFF00'] },
  { name: 'Néon', value: 'neon', colors: ['#FF073A', '#39FF14', '#BF00FF'] },
  { name: 'Pastel', value: 'pastel', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF'] },
  { name: 'Sombre', value: 'dark', colors: ['#1a1a1a', '#333333', '#666666'] },
  { name: 'Vintage', value: 'vintage', colors: ['#D4A574', '#E8C5A0', '#F4E4BC'] },
  { name: 'Océan', value: 'ocean', colors: ['#006994', '#13A5C4', '#7DD3FC'] },
  { name: 'Personnalisée', value: 'custom', colors: ['#FF0080', '#00FFFF', '#FFFF00'] }, // Couleurs par défaut
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/svg+xml', 'image/jpeg'] as const