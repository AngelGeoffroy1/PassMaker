'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Upload, Palette, Calendar, Building2, Zap, HelpCircle } from 'lucide-react'
import { COLOR_PALETTES, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/lib/constants'
import type { BraceletForm, GenerationStatus, TechnicalZones, LogoOptions } from '@/types/bracelet'

const formSchema = z.object({
  associationName: z.string().min(1, 'Le nom de l\'association est requis'),
  eventName: z.string().min(1, 'Le nom de la soirée est requis'), 
  eventDate: z.string().min(1, 'La date est requise'),
  colorPalette: z.string().min(1, 'Veuillez sélectionner une palette'),
  logoFile: z.instanceof(File).optional()
})

interface BraceletFormProps {
  onSubmit: (data: BraceletForm, zones: TechnicalZones) => void
  status: GenerationStatus
}

export function BraceletForm({ onSubmit, status }: BraceletFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoOptions, setLogoOptions] = useState<LogoOptions>({
    position: 'right',
    size: 'medium',
    style: 'integrated'
  })
  const [technicalZones, setTechnicalZones] = useState<TechnicalZones>({
    qrCode: { enabled: false, url: '', position: 'right' },
    numbering: { enabled: false, width: 10, height: 5, position: 'left' },
    cutMarks: false
  })
  const [customColors, setCustomColors] = useState<string[]>(['#FF0080', '#00FFFF', '#FFFF00'])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associationName: '',
      eventName: '',
      eventDate: '',
      colorPalette: '',
    }
  })

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError('logoFile', { message: 'Le fichier doit faire moins de 5MB' })
        return
      }
      
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
        form.setError('logoFile', { message: 'Format non supporté. Utilisez PNG, SVG ou JPG.' })
        return
      }

      form.setValue('logoFile', file)
      form.clearErrors('logoFile')
      
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const braceletData: BraceletForm = {
      ...data,
      logoOptions: data.logoFile ? { ...logoOptions, base64Data: logoPreview || undefined } : undefined,
      customColors: data.colorPalette === 'custom' ? customColors : undefined
    }
    onSubmit(braceletData, technicalZones)
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto card-glow neon-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            PassMaker - Générateur de Bracelets
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Créez vos bracelets événementiels instantanément. Choisissez votre style, remplissez les infos et générez !
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Logo Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <label className="font-medium">Logo de l'association</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>PNG, SVG ou JPG - Max 5MB</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    {logoPreview ? (
                      <div className="space-y-2">
                        <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-contain mx-auto rounded" />
                        <p className="text-sm text-muted-foreground">Cliquez pour changer</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium">Glissez votre logo ou cliquez ici</p>
                        <p className="text-xs text-muted-foreground">PNG, SVG ou JPG - Max 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
                {form.formState.errors.logoFile && (
                  <p className="text-sm text-destructive">{form.formState.errors.logoFile.message}</p>
                )}
              </div>

              {/* Options de logo (affichées seulement si un logo est uploadé) */}
              {logoPreview && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Options du logo
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Position du logo */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Position</label>
                      <Select 
                        value={logoOptions.position} 
                        onValueChange={(value: LogoOptions['position']) => 
                          setLogoOptions(prev => ({ ...prev, position: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Gauche</SelectItem>
                          <SelectItem value="right">Droite</SelectItem>
                          <SelectItem value="center">Centre</SelectItem>
                          <SelectItem value="top-left">Haut gauche</SelectItem>
                          <SelectItem value="top-right">Haut droite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Taille du logo */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Taille</label>
                      <Select 
                        value={logoOptions.size} 
                        onValueChange={(value: LogoOptions['size']) => 
                          setLogoOptions(prev => ({ ...prev, size: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Petit (20px)</SelectItem>
                          <SelectItem value="medium">Moyen (30px)</SelectItem>
                          <SelectItem value="large">Grand (40px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Style d'intégration */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Style</label>
                      <Select 
                        value={logoOptions.style} 
                        onValueChange={(value: LogoOptions['style']) => 
                          setLogoOptions(prev => ({ ...prev, style: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overlay">Superposition</SelectItem>
                          <SelectItem value="integrated">Intégré</SelectItem>
                          <SelectItem value="background">Arrière-plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="associationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Nom de l'association
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="BDE SUPINFO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la soirée</FormLabel>
                      <FormControl>
                        <Input placeholder="Soirée Neon Party" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date de l'événement
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorPalette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Palette de couleurs
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une palette" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COLOR_PALETTES.map((palette) => (
                            <SelectItem key={palette.value} value={palette.value}>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {palette.colors.map((color, index) => (
                                    <div
                                      key={index}
                                      className="w-3 h-3 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                {palette.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sélecteurs de couleurs personnalisées */}
              {form.watch('colorPalette') === 'custom' && (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Palette personnalisée
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {customColors.map((color, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-sm font-medium block">
                          Couleur {index + 1}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...customColors]
                              newColors[index] = e.target.value
                              setCustomColors(newColors)
                            }}
                            className="w-12 h-8 border border-border rounded cursor-pointer bg-background"
                          />
                          <Input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...customColors]
                              newColors[index] = e.target.value
                              setCustomColors(newColors)
                            }}
                            className="flex-1 font-mono text-sm"
                            placeholder="#FF0080"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="flex gap-1 items-center">
                      <span className="text-xs text-muted-foreground mr-2">Aperçu:</span>
                      {customColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Zones */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-sm">Zone technique (optionnelle)</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={technicalZones.qrCode.enabled}
                      onCheckedChange={(checked) =>
                        setTechnicalZones(prev => ({
                          ...prev,
                          qrCode: { ...prev.qrCode, enabled: checked }
                        }))
                      }
                    />
                    <label className="text-sm">QR Code (toute hauteur)</label>
                  </div>

                  {technicalZones.qrCode.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">URL de destination</label>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={technicalZones.qrCode.url}
                          onChange={(e) =>
                            setTechnicalZones(prev => ({
                              ...prev,
                              qrCode: { ...prev.qrCode, url: e.target.value }
                            }))
                          }
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Position</label>
                        <Select 
                          value={technicalZones.qrCode.position}
                          onValueChange={(value: 'left' | 'right') =>
                            setTechnicalZones(prev => ({
                              ...prev,
                              qrCode: { ...prev.qrCode, position: value }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Gauche</SelectItem>
                            <SelectItem value="right">Droite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Progress */}
              {status.status !== 'idle' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{status.message || 'En cours...'}</span>
                    <span>{status.progress}%</span>
                  </div>
                  <Progress value={status.progress} />
                </div>
              )}

              {status.status === 'error' && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Une erreur est survenue lors de la génération. Veuillez réessayer.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full neon-glow bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 text-primary-foreground font-semibold" 
                disabled={status.status === 'generating' || status.status === 'processing'}
              >
                {status.status === 'generating' || status.status === 'processing' 
                  ? 'Création en cours...' 
                  : 'Créer le bracelet 🚀'
                }
              </Button>
            </form>
          </Form>

          <Alert>
            <AlertDescription className="text-xs">
              ✅ Format Tyvek 14×150mm • 300 DPI • Export PNG & PDF • Prêt impression
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}