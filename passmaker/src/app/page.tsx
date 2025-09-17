'use client'

import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { BraceletForm } from '@/components/bracelet/bracelet-form'
import { BraceletPreview } from '@/components/bracelet/bracelet-preview'
import { TemplateGallery } from '@/components/bracelet/template-gallery'
import type { BraceletForm as BraceletFormType, BraceletResult, GenerationStatus, TechnicalZones } from '@/types/bracelet'

export default function Home() {
  const [currentForm, setCurrentForm] = useState<BraceletFormType | null>(null)
  const [currentZones, setCurrentZones] = useState<TechnicalZones | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)
  const [result, setResult] = useState<BraceletResult | null>(null)
  const [status, setStatus] = useState<GenerationStatus>({
    status: 'idle',
    progress: 0
  })

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleFormSubmit = async (formData: BraceletFormType, technicalZones: TechnicalZones) => {
    // Ajoute le template sélectionné aux données du formulaire
    const formWithTemplate = { ...formData, templateId: selectedTemplate }
    
    setCurrentForm(formWithTemplate)
    setCurrentZones(technicalZones)
    setResult(null)
    
    setStatus({
      status: 'generating',
      progress: 20,
      message: 'Génération du design...'
    })

    try {
      // Simulation du processus de génération (plus rapide sans IA)
      await new Promise(resolve => setTimeout(resolve, 300))
      setStatus(prev => ({ ...prev, progress: 50, message: 'Création du bracelet...' }))
      
      await new Promise(resolve => setTimeout(resolve, 400))
      setStatus(prev => ({ ...prev, progress: 80, message: 'Finalisation du design...' }))

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formWithTemplate,
          technicalZones: technicalZones
        })
      })

      if (!response.ok) {
        throw new Error('Erreur de génération')
      }

      const data = await response.json()
      
      setStatus(prev => ({ ...prev, progress: 95, message: 'Préparation du rendu...' }))
      await new Promise(resolve => setTimeout(resolve, 200))

      // Utilisation du design généré directement
      const mockResult: BraceletResult = {
        id: data.result.id,
        imageUrl: data.result.imageUrl, // Design généré par le nouveau système
        pngUrl: '',
        pdfUrl: '',
        specs: {
          width: 150,
          height: 14,
          dpi: 300,
          format: 'tyvek'
        },
        metadata: {
          dimensions: { width: 1772, height: 165 },
          dpi: 300,
          zones: technicalZones
        },
        createdAt: data.result.createdAt,
        shareUrl: `${window.location.origin}/share/${data.result.id}`
      }

      setResult(mockResult)
      setStatus({
        status: 'completed',
        progress: 100,
        message: 'Bracelet généré avec succès !'
      })

      toast.success('🎉 Bracelet généré !', {
        description: 'Votre bracelet est prêt à être téléchargé et imprimé.',
      })

    } catch (error) {
      console.error('Generation failed:', error)
      setStatus({
        status: 'error',
        progress: 0,
        message: 'Erreur lors de la génération'
      })

      toast.error('❌ Erreur', {
        description: 'Impossible de générer le bracelet. Veuillez réessayer.',
      })
    }
  }

  const handleRegenerate = () => {
    if (currentForm && currentZones) {
      handleFormSubmit(currentForm, currentZones)
    }
  }

  const handleShare = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('🔗 Lien copié !', {
      description: 'Le lien de partage a été copié dans votre presse-papier.',
    })
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            PassMaker
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Créez des bracelets événementiels professionnels instantanément.
            Parfait pour vos soirées étudiantes, festivals et événements.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Form Section */}
          <div className="space-y-6">
            <BraceletForm
              onSubmit={handleFormSubmit}
              status={status}
            />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {result && currentForm && currentZones ? (
              <BraceletPreview
                result={result}
                formData={currentForm}
                technicalZones={currentZones}
                onRegenerate={handleRegenerate}
                onShare={handleShare}
              />
            ) : (
              <div className="flex items-center justify-center h-96 neon-border rounded-lg card-glow">
                <div className="text-center space-y-2">
                  <p className="text-foreground/70">Votre bracelet apparaîtra ici</p>
                  <p className="text-sm text-muted-foreground">Remplissez le formulaire et cliquez sur &quot;Créer&quot; !</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Gallery Section */}
        <div className="max-w-7xl mx-auto">
          <TemplateGallery 
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplate}
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-12">
          <p>
            Fait avec ❤️ pour les associations étudiantes • 
            <span className="font-mono"> PassMaker v1.0</span>
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  )
}
