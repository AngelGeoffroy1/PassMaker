'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Sparkles, Loader2 } from 'lucide-react'
import { DesignGenerator } from '@/lib/design-generator'
import type { DesignTemplate } from '@/lib/design-generator'

interface TemplateGalleryProps {
  onTemplateSelect?: (templateId: string) => void
  selectedTemplateId?: string
}

export function TemplateGallery({ onTemplateSelect, selectedTemplateId }: TemplateGalleryProps) {
  const [generator] = useState(() => new DesignGenerator())
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [loadingPreviews, setLoadingPreviews] = useState<Set<string>>(new Set())
  const templates = generator.getAllTemplates()

  const generatePreview = async (template: DesignTemplate): Promise<string> => {
    // Génère un aperçu avec des données d'exemple
    const previewData = {
      associationName: 'BDE Example',
      eventName: 'Preview',
      eventDate: '2024',
      colorPalette: 'neon',
      templateId: template.id
    }
    // Pas de zones techniques pour les aperçus
    const svgContent = await template.generator(previewData)
    // Convertit le SVG en Data URL pour l'affichage
    const svgBase64 = Buffer.from(svgContent).toString('base64')
    return `data:image/svg+xml;base64,${svgBase64}`
  }

  useEffect(() => {
    // Génère tous les aperçus de templates de manière asynchrone
    const generateAllPreviews = async () => {
      const previewPromises = templates.map(async (template) => {
        setLoadingPreviews(prev => new Set(prev).add(template.id))
        try {
          const previewUrl = await generatePreview(template)
          setPreviews(prev => ({ ...prev, [template.id]: previewUrl }))
        } catch (error) {
          console.error(`Error generating preview for ${template.id}:`, error)
          // Fallback en cas d'erreur
          setPreviews(prev => ({ ...prev, [template.id]: '' }))
        } finally {
          setLoadingPreviews(prev => {
            const newSet = new Set(prev)
            newSet.delete(template.id)
            return newSet
          })
        }
      })
      
      await Promise.all(previewPromises)
    }

    generateAllPreviews()
  }, [templates])

  return (
    <Card className="w-full card-glow neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Templates Disponibles
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Choisissez le style parfait pour votre événement. Chaque template s'adapte à votre palette de couleurs.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedTemplateId === template.id 
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' 
                  : 'hover:shadow-lg hover:shadow-primary/20'
              }`}
              onClick={() => onTemplateSelect?.(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Aperçu du template */}
                <div className="relative mb-4 bg-muted/20 rounded border" 
                     style={{ aspectRatio: '600/56' }}>
                  {loadingPreviews.has(template.id) ? (
                    <div className="w-full h-full flex items-center justify-center rounded bg-muted/50">
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
                        <p className="text-xs">Génération...</p>
                      </div>
                    </div>
                  ) : previews[template.id] ? (
                    <img 
                      src={previews[template.id]} 
                      alt={`Aperçu ${template.name}`}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded bg-muted/50">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-xs">Aperçu indisponible</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay hover (seulement si l'aperçu est chargé) */}
                  {!loadingPreviews.has(template.id) && previews[template.id] && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                      <div className="text-center text-white">
                        <Eye className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">Cliquer pour sélectionner</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedTemplateId === template.id && (
                  <Button 
                    size="sm" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled
                  >
                    ✓ Sélectionné
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Astuce :</strong> Les templates s'adaptent automatiquement à votre palette de couleurs et intègrent votre logo selon vos préférences.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}