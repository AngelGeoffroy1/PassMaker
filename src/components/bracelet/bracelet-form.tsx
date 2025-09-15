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
import type { BraceletForm, GenerationStatus, TechnicalZones } from '@/types/bracelet'

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
  const [technicalZones, setTechnicalZones] = useState<TechnicalZones>({
    qrCode: { enabled: false, size: 20, position: 'right' },
    numbering: { enabled: false, width: 10, height: 5, position: 'left' },
    cutMarks: true
  })

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
    onSubmit(data as BraceletForm, technicalZones)
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            PassMaker - Générateur de Bracelets
          </CardTitle>
          <CardDescription>
            Créez vos bracelets événementiels en un clic. Ajoutez votre logo, remplissez les infos et générez !
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
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
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

              {/* Technical Zones */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-sm">Zones techniques (optionnelles)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="text-sm">QR Code (20×20mm)</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={technicalZones.numbering.enabled}
                      onCheckedChange={(checked) =>
                        setTechnicalZones(prev => ({
                          ...prev,
                          numbering: { ...prev.numbering, enabled: checked }
                        }))
                      }
                    />
                    <label className="text-sm">Numérotation (10×5mm)</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={technicalZones.cutMarks}
                      onCheckedChange={(checked) =>
                        setTechnicalZones(prev => ({
                          ...prev,
                          cutMarks: !!checked
                        }))
                      }
                    />
                    <label className="text-sm">Repères de coupe</label>
                  </div>
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
                className="w-full" 
                disabled={status.status === 'generating' || status.status === 'processing'}
              >
                {status.status === 'generating' || status.status === 'processing' 
                  ? 'Génération en cours...' 
                  : 'Générer le bracelet 🚀'
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