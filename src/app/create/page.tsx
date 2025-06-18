'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Palette, Wand2, Eye, ShoppingCart, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import Link from 'next/link'

// Types
interface BraceletModel {
  id: string
  name: string
  material: string
  sizes: { size: string; price: number }[]
  description: string
}

interface DesignData {
  logo?: File
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  text: string
  textPosition: 'center' | 'left' | 'right'
  textSize: 'small' | 'medium' | 'large'
  prompt: string
  style: 'fun' | 'professional'
  brightness: 'light' | 'dark'
  qrCode: boolean
  qrPosition: 'left' | 'right'
}

const braceletModels: BraceletModel[] = [
  {
    id: 'tyvek-classic',
    name: 'Tyvek Classic',
    material: 'Tyvek résistant à l\'eau',
    sizes: [
      { size: 'Enfant', price: 0.85 },
      { size: 'Adulte', price: 1.20 },
      { size: 'Large', price: 1.50 }
    ],
    description: 'Le bracelet événementiel par excellence, résistant et personnalisable'
  }
]

const steps = [
  { id: 'catalog', title: 'Catalogue', icon: Eye },
  { id: 'design', title: 'Design', icon: Palette },
  { id: 'preview', title: 'Aperçu', icon: Wand2 },
  { id: 'order', title: 'Commande', icon: ShoppingCart }
]

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState('catalog')
  const [selectedModel, setSelectedModel] = useState<BraceletModel | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [designData, setDesignData] = useState<DesignData>({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    text: '',
    textPosition: 'center',
    textSize: 'medium',
    prompt: '',
    style: 'professional',
    brightness: 'light',
    qrCode: false,
    qrPosition: 'right'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null)

  const handleModelSelect = (model: BraceletModel) => {
    setSelectedModel(model)
    setSelectedSize(model.sizes[0].size)
  }

  const handleNextStep = () => {
    const stepOrder = ['catalog', 'design', 'preview', 'order']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handleGenerateDesign = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: designData.text,
          textPosition: designData.textPosition,
          textSize: designData.textSize,
          primaryColor: designData.primaryColor,
          secondaryColor: designData.secondaryColor,
          style: designData.style,
          brightness: designData.brightness,
          hasQRCode: designData.qrCode,
          qrPosition: designData.qrPosition,
          description: designData.prompt
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedDesign(data.imageUrl)
        handleNextStep()
      } else {
        console.error('Erreur:', data.error)
        alert(`Erreur lors de la génération: ${data.error}`)
      }
    } catch (error) {
      console.error('Erreur réseau:', error)
      alert('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = index < getCurrentStepIndex()
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? '#10B981' : isActive ? '#3B82F6' : '#E5E7EB'
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'text-white' : isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mx-4" />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Catalog Step */}
          {currentStep === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Choisissez votre modèle
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Sélectionnez le type de bracelet parfait pour votre événement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {braceletModels.map((model) => (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                      selectedModel?.id === model.id
                        ? 'border-blue-500 ring-4 ring-blue-500/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl mb-6 flex items-center justify-center">
                      <div className="w-32 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {model.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {model.description}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {model.material}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Tailles et prix :</h4>
                      {model.sizes.map((size) => (
                        <div key={size.size} className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-300">{size.size}</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {size.price}€ / unité
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedModel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Choisissez la taille
                    </h3>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {selectedModel.sizes.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => setSelectedSize(size.size)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedSize === size.size
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-sm font-medium">{size.size}</div>
                          <div className="text-xs text-slate-500">{size.price}€</div>
                        </button>
                      ))}
                    </div>
                    <Button 
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Continuer vers le design
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Design Step */}
          {currentStep === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Créez votre design
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Personnalisez votre bracelet avec notre IA créative
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Design Controls */}
                <div className="space-y-8">
                  {/* Logo Upload */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Logo (optionnel)
                    </h3>
                    <FileUpload
                      onFileSelect={(file, url) => setDesignData({...designData, logo: file || undefined, logoUrl: url})}
                      accept="image/*"
                      maxSize={5}
                    />
                  </div>

                  {/* Colors */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Couleurs
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Couleur principale
                        </label>
                        <input
                          type="color"
                          value={designData.primaryColor}
                          onChange={(e) => setDesignData({...designData, primaryColor: e.target.value})}
                          className="w-full h-12 rounded-lg border border-gray-300 dark:border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Couleur secondaire
                        </label>
                        <input
                          type="color"
                          value={designData.secondaryColor}
                          onChange={(e) => setDesignData({...designData, secondaryColor: e.target.value})}
                          className="w-full h-12 rounded-lg border border-gray-300 dark:border-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Controls */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <span className="text-xl mr-2">📝</span>
                      Texte sur le bracelet
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Votre texte
                        </label>
                        <input
                          type="text"
                          value={designData.text}
                          onChange={(e) => setDesignData({...designData, text: e.target.value})}
                          placeholder="Ex: Festival 2024, Mon Événement..."
                          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={30}
                        />
                        <p className="text-xs text-slate-500 mt-1">{designData.text.length}/30 caractères</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Position du texte
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'left', label: '← Gauche' },
                            { value: 'center', label: '⬤ Centre' },
                            { value: 'right', label: 'Droite →' }
                          ].map((position) => (
                            <button
                              key={position.value}
                              onClick={() => setDesignData({...designData, textPosition: position.value as 'left' | 'center' | 'right'})}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                designData.textPosition === position.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                              }`}
                            >
                              {position.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Taille du texte
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'small', label: 'Petit', size: 'text-xs' },
                            { value: 'medium', label: 'Moyen', size: 'text-sm' },
                            { value: 'large', label: 'Grand', size: 'text-base' }
                          ].map((size) => (
                            <button
                              key={size.value}
                              onClick={() => setDesignData({...designData, textSize: size.value as 'small' | 'medium' | 'large'})}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                designData.textSize === size.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                              }`}
                            >
                              <span className={size.size}>{size.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Style Questions */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Questions de style
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Style général
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['fun', 'professional'].map((style) => (
                            <button
                              key={style}
                              onClick={() => setDesignData({...designData, style: style as 'fun' | 'professional'})}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                designData.style === style
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                              }`}
                            >
                              {style === 'fun' ? '🎉 Fun' : '💼 Professionnel'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Luminosité
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['light', 'dark'].map((brightness) => (
                            <button
                              key={brightness}
                              onClick={() => setDesignData({...designData, brightness: brightness as 'light' | 'dark'})}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                designData.brightness === brightness
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                              }`}
                            >
                              {brightness === 'light' ? '☀️ Clair' : '🌙 Sombre'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={designData.qrCode}
                            onChange={(e) => setDesignData({...designData, qrCode: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Ajouter un QR code</span>
                        </label>
                        {designData.qrCode && (
                          <div className="mt-2 grid grid-cols-2 gap-3">
                            {['left', 'right'].map((position) => (
                              <button
                                key={position}
                                onClick={() => setDesignData({...designData, qrPosition: position as 'left' | 'right'})}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  designData.qrPosition === position
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                                }`}
                              >
                                {position === 'left' ? '← Gauche' : 'Droite →'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Wand2 className="w-5 h-5 mr-2" />
                      Description créative
                    </h3>
                    <textarea
                      value={designData.prompt}
                      onChange={(e) => setDesignData({...designData, prompt: e.target.value})}
                      placeholder="Décrivez votre vision... Ex: Design minimal avec QR à droite et fond sombre"
                      className="w-full h-32 p-4 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Preview Area */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Aperçu en temps réel
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  </div>
                  
                  {/* 3D Bracelet Container */}
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border border-gray-200 dark:border-slate-700">
                    {/* Lighting effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
                    
                    {/* Main Bracelet */}
                    <motion.div 
                      animate={{ 
                        rotateY: [0, 8, 0, -8, 0],
                        rotateX: [0, 2, 0, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative w-96 h-24 rounded-xl shadow-2xl overflow-hidden transform-gpu"
                      style={{ 
                        background: designData.brightness === 'dark' 
                          ? `linear-gradient(135deg, ${designData.primaryColor}ee, ${designData.secondaryColor}ee, #374151)`
                          : `linear-gradient(135deg, ${designData.primaryColor}, ${designData.secondaryColor}, #f8fafc)`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Bracelet texture overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                      
                      {/* Text on bracelet */}
                      {designData.text && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute top-1/2 transform -translate-y-1/2 font-bold text-white drop-shadow-lg ${
                            designData.textSize === 'small' ? 'text-xs' : 
                            designData.textSize === 'medium' ? 'text-sm' : 'text-base'
                          } ${
                            designData.textPosition === 'left' ? 'left-4' :
                            designData.textPosition === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'
                          }`}
                          style={{
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            filter: designData.brightness === 'dark' ? 'brightness(1.2)' : 'brightness(0.9)'
                          }}
                        >
                          {designData.text.toUpperCase()}
                        </motion.div>
                      )}
                      
                      {/* Logo display */}
                      {designData.logoUrl && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute top-1/2 transform -translate-y-1/2 ${
                            designData.text ? (
                              designData.textPosition === 'center' ? 'top-2 left-2' : 
                              designData.textPosition === 'left' ? 'right-4' : 'left-4'
                            ) : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          <div className="w-12 h-8 bg-white/90 rounded-md p-1 shadow-lg backdrop-blur-sm">
                            <img 
                              src={designData.logoUrl} 
                              alt="Logo" 
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        </motion.div>
                      )}
                      
                      {/* QR Code */}
                      {designData.qrCode && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute top-2 ${designData.qrPosition === 'left' ? 'left-2' : 'right-2'} w-14 h-14 bg-white rounded-lg p-1 shadow-lg`}
                        >
                          <div className="w-full h-full bg-black rounded grid grid-cols-8 gap-px p-1">
                            {Array.from({length: 64}).map((_, i) => (
                              <div 
                                key={i} 
                                className={`bg-white ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'} rounded-sm`} 
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Bracelet clasp simulation */}
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-16 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-l-lg shadow-inner" />
                      
                      {/* Animated shine effect */}
                      <motion.div
                        animate={{ x: [-120, 500] }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 w-24 blur-sm"
                      />
                      
                      {/* Edge highlights */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                    </motion.div>
                    
                    {/* Floating elements around bracelet */}
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({length: 8}).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -30, 0],
                            x: [0, Math.sin(i) * 10, 0],
                            opacity: [0.2, 0.8, 0.2],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                          style={{
                            left: `${15 + i * 10}%`,
                            top: `${25 + (i % 3) * 25}%`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Reflection effect */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-12 bg-gradient-to-t from-black/10 to-transparent rounded-full blur-xl" />
                  </div>
                  
                  {/* Preview Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Qualité d'aperçu</span>
                      <span className="text-green-600 font-medium">HD</span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Matériau:</span>
                        <span>Tyvek Premium</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Finition:</span>
                        <span>{designData.brightness === 'dark' ? 'Mat' : 'Brillant'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Style:</span>
                        <span className="capitalize">{designData.style}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateDesign}
                    disabled={isGenerating}
                    className={`w-full transition-all duration-300 ${
                      isGenerating 
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-pulse' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="w-4 h-4 mr-2"
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          IA en action... ✨
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Générer le design IA
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && generatedDesign && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Votre bracelet est prêt !
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Découvrez le rendu final de votre création
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* IA Generated Design */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Design généré par IA ✨
                      </h3>
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                        {generatedDesign && generatedDesign !== 'generated' ? (
                          <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            src={generatedDesign}
                            alt="Design généré par IA"
                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                          />
                        ) : (
                          <motion.div
                            animate={{ rotateY: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-48 h-12 rounded-lg shadow-2xl"
                            style={{ 
                              background: `linear-gradient(45deg, ${designData.primaryColor}, ${designData.secondaryColor})` 
                            }}
                          />
                        )}
                      </div>
                      {generatedDesign && generatedDesign !== 'generated' && (
                        <div className="text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            Design créé avec DALL-E 3
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = generatedDesign
                              link.download = 'bracelet-design-passmaker.png'
                              link.click()
                            }}
                            className="text-xs"
                          >
                            📥 Télécharger l'image
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Détails de votre commande
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Modèle :</span>
                          <span className="font-semibold">{selectedModel?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Taille :</span>
                          <span className="font-semibold">{selectedSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Style :</span>
                          <span className="font-semibold capitalize">{designData.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Texte :</span>
                          <span className="font-semibold">{designData.text || 'Aucun'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Logo :</span>
                          <span className="font-semibold">{designData.logo ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">QR Code :</span>
                          <span className="font-semibold">{designData.qrCode ? 'Oui' : 'Non'}</span>
                        </div>
                        <hr className="border-gray-200 dark:border-slate-600" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Prix unitaire :</span>
                          <span className="text-blue-600">
                            {selectedModel?.sizes.find(s => s.size === selectedSize)?.price}€
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button 
                          onClick={handleNextStep}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Passer commande
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep('design')}
                          className="w-full"
                        >
                          Modifier le design
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Step */}
          {currentStep === 'order' && (
            <motion.div
              key="order"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Félicitations !
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Votre design est prêt. Dans la version complète, vous pourriez maintenant passer commande !
                </p>
              </div>

              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Prochaines étapes
                </h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span>Intégration du système de paiement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span>Gestion des comptes utilisateurs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span>Suivi de commande en temps réel</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <span>Intégration IA de génération d'images</span>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button 
                    onClick={() => {
                      setCurrentStep('catalog')
                      setSelectedModel(null)
                      setGeneratedDesign(null)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Créer un nouveau bracelet
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Retour à l'accueil
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 