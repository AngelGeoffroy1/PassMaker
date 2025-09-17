'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Download, Share2, RefreshCw, Eye, Settings, CheckCircle } from 'lucide-react'
import type { BraceletResult, BraceletForm, TechnicalZones } from '@/types/bracelet'
import { ImageProcessor } from '@/lib/image-processor'

interface BraceletPreviewProps {
  result: BraceletResult | null
  formData: BraceletForm
  technicalZones: TechnicalZones
  onRegenerate: () => void
  onShare?: (url: string) => void
}

export function BraceletPreview({ 
  result, 
  formData, 
  technicalZones, 
  onRegenerate, 
  onShare 
}: BraceletPreviewProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedUrls, setProcessedUrls] = useState<{
    pngUrl?: string
    pdfUrl?: string
  }>({})

  if (!result) return null

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (processedUrls[`${format}Url`]) {
      // Si déjà traité, téléchargement direct
      const link = document.createElement('a')
      link.href = processedUrls[`${format}Url`]!
      link.download = `bracelet-${formData.eventName.replace(/\s+/g, '-').toLowerCase()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    setIsProcessing(true)
    
    try {
      const processor = new ImageProcessor()
      const processed = await processor.normalizeForPrint(
        result.imageUrl,
        technicalZones,
        'tyvek'
      )
      
      const pngUrl = URL.createObjectURL(processed.pngBlob)
      const pdfUrl = URL.createObjectURL(processed.pdfBlob)
      
      setProcessedUrls({ pngUrl, pdfUrl })
      
      // Téléchargement automatique du format demandé
      const targetUrl = format === 'png' ? pngUrl : pdfUrl
      const link = document.createElement('a')
      link.href = targetUrl
      link.download = `bracelet-${formData.eventName.replace(/\s+/g, '-').toLowerCase()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Download processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-4xl mx-auto card-glow neon-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-accent" />
            Bracelet généré avec succès !
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="flex items-center gap-1 neon-border hover:bg-accent/10 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
              Regénérer
            </Button>
            {onShare && result.shareUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(result.shareUrl!)}
                className="flex items-center gap-1 neon-border hover:bg-accent/10 transition-all duration-300"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Votre bracelet pour "{formData.eventName}" est prêt à être téléchargé et imprimé.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Spécifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-6 bg-muted/20 neon-border">
              <div className="mb-4 text-center">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">Format: Tyvek 150×14mm • 300 DPI</Badge>
              </div>
              
              <div className="relative mx-auto bg-card shadow-lg rounded border neon-border" 
                   style={{ 
                     width: '600px', 
                     height: '56px' // Ratio 150:14 maintenu
                   }}>
                
                {/* Image du bracelet */}
                <img 
                  src={result.imageUrl} 
                  alt={`Bracelet ${formData.eventName}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    console.error('Error loading bracelet image:', e)
                    console.error('Image URL:', result.imageUrl)
                    // Fallback en cas d'erreur
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                  onLoad={() => {
                    console.log('Bracelet image loaded successfully')
                  }}
                />
                
                {/* Fallback si l'image ne charge pas */}
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded text-muted-foreground text-sm"
                     style={{ display: 'none' }}
                     id="fallback-message">
                  <div className="text-center">
                    <p>Aperçu indisponible</p>
                    <p className="text-xs">Le design sera disponible au téléchargement</p>
                  </div>
                </div>
                
                {/* QR code déjà intégré dans le SVG généré - plus besoin d'overlay */}
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Aperçu à l'échelle (redimensionné pour l'affichage)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleDownload('png')}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 neon-glow bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'Traitement...' : 'Télécharger PNG (300 DPI)'}
              </Button>
              
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={isProcessing}
                variant="outline"
                className="flex items-center justify-center gap-2 neon-border hover:bg-accent/10 transition-all duration-300"
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'Traitement...' : 'Télécharger PDF'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Spécifications d'impression */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Spécifications d'impression</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-mono">150 × 14 mm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Résolution</span>
                    <span className="font-mono">300 DPI</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Dimensions pixels</span>
                    <span className="font-mono">{Math.round(150 * 300 / 25.4)} × {Math.round(14 * 300 / 25.4)} px</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Support recommandé</span>
                    <span>Tyvek</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Découpe</span>
                    <span>Aucun repère</span>
                  </div>
                </div>
              </div>

              {/* Zones techniques */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Zones techniques</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">QR Code</span>
                    <span className="flex items-center gap-2">
                      {technicalZones.qrCode.enabled ? (
                        <>
                          <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">Toute hauteur</Badge>
                          <span className="text-xs">({technicalZones.qrCode.position})</span>
                        </>
                      ) : (
                        <Badge variant="secondary">Désactivé</Badge>
                      )}
                    </span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    💡 <strong>Conseil impression:</strong> Utilisez du Tyvek pour une résistance optimale à l'eau et aux déchirures.
                    Impression numérique recommandée avec encres UV pour une meilleure tenue des couleurs.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Informations du fichier */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Informations du projet</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Association:</span>
                  <p className="font-medium">{formData.associationName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Événement:</span>
                  <p className="font-medium">{formData.eventName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">{formData.eventDate}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}