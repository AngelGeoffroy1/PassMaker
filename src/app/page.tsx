"use client"

import React from "react"
import { motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { TestimonialsSection } from "@/components/ui/testimonials"
import { 
  Sparkles, 
  Palette, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Wand2,
  Clock,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const braceletTypes = [
    "festivaux 🎪",
    "concerts 🎵",
    "mariages 💒",
    "soirées 🎉",
    "événements 🎭",
    "festivals 🌟"
  ]

  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "IA Créative",
      description: "Designs uniques générés par intelligence artificielle"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Livraison Rapide",
      description: "À temps pour votre événement, livraison express"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Personnalisation",
      description: "Couleurs, logos, QR codes et styles sur mesure"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Qualité Premium",
      description: "Matériaux Tyvek résistants et durables"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Choisir le type",
      description: "Sélectionnez votre modèle de bracelet préféré"
    },
    {
      number: "02", 
      title: "Design IA",
      description: "Notre IA crée un design unique selon vos goûts"
    },
    {
      number: "03",
      title: "Validation",
      description: "Prévisualisez et validez votre création en 3D"
    },
    {
      number: "04",
      title: "Livraison",
      description: "Recevez vos bracelets à temps pour l'événement"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <Header />
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-32 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Badge animé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-800 mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Propulsé par l'IA générative
              </span>
            </motion.div>

            {/* Titre principal avec animation */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            >
              Créez des bracelets{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-move">
                magiques
              </span>{" "}
              pour vos{" "}
              <TextRotate
                texts={braceletTypes}
                mainClassName="inline-block text-blue-600 dark:text-blue-400"
                rotationInterval={3000}
                staggerDuration={0.03}
                staggerFrom="last"
              />
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transformez vos idées en bracelets personnalisés uniques grâce à notre IA. 
              Design automatique, aperçu 3D, et livraison express pour tous vos événements.
            </motion.p>

            {/* Boutons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 animate-pulse-glow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer à créer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-2 hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm"
              >
                Voir des exemples
              </Button>
            </motion.div>

            {/* Preview bracelets flottants */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 2, 0, -2, 0]
                    }}
                    transition={{ 
                      duration: 4 + index,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="relative"
                  >
                    <div className="aspect-video bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-4">
                      <div className="w-full h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-2" />
                      <div className="w-3/4 h-3 bg-gray-300 dark:bg-slate-600 rounded mb-1" />
                      <div className="w-1/2 h-3 bg-gray-200 dark:bg-slate-700 rounded" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              ✨ Innovation
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Pourquoi choisir PassMaker ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              L'alliance parfaite entre technologie et créativité
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-6 auto-rows-[280px]">
            
            {/* Feature 1 - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:col-span-3 lg:col-span-3 group relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl p-8 overflow-hidden cursor-pointer"
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    IA Créative
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Designs uniques générés par intelligence artificielle avec une personnalisation infinie
                  </p>
                </div>
                
                {/* Interactive preview */}
                <div className="mt-6">
                  <div className="flex space-x-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.3 
                        }}
                        className="w-16 h-10 bg-white/20 rounded-lg backdrop-blur-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-3 lg:col-span-3 group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                    Livraison Rapide
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    À temps pour votre événement, production et expédition ultra-rapides
                  </p>
                </div>
                
                {/* Progress animation */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Production</span>
                    <span>24h</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-2 group bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 cursor-pointer overflow-hidden relative"
            >
              {/* Floating icon */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full group-hover:scale-150 group-hover:rotate-45 transition-all duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Qualité Premium
                  </h3>
                  <p className="text-white/90 text-sm">
                    Matériaux haut de gamme résistants
                  </p>
                </div>
                
                {/* Rating stars */}
                <div className="flex space-x-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                      className="w-4 h-4 bg-white rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature 4 - Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-2 group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                    Personnalisation
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    Couleurs, logos, textes - tout est personnalisable
                  </p>
                </div>
                
                {/* Color palette */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'].map((color, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className={`h-8 ${color} rounded-lg cursor-pointer`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature 5 - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-2 group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 cursor-pointer overflow-hidden relative"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Support 24/7
                </h3>
                <p className="text-white/90 text-sm">
                  Équipe dédiée à votre service
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Process Section - Creative Timeline */}
      <section id="process" className="py-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Un processus simple en 4 étapes pour des résultats extraordinaires
            </p>
          </motion.div>

          {/* Interactive Timeline */}
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-purple-400 to-pink-200 rounded-full hidden lg:block"></div>
            
            {/* Progress Line Animation */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500 rounded-full hidden lg:block z-10"
            />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 group cursor-pointer"
                    >
                      {/* Step Icon & Visual */}
                      <div className="flex items-center mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/20">
                            {step.number}
                          </div>
                          {/* Floating emoji based on step */}
                          <div className="absolute -top-1 -right-1 text-lg animate-bounce">
                            {index === 0 && "🎯"}
                            {index === 1 && "🎨"}
                            {index === 2 && "✨"}
                            {index === 3 && "🚀"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {step.title}
                          </h3>
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1"></div>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Interactive Preview */}
                      <div className="relative h-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-3 overflow-hidden group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/20 transition-all duration-500">
                        {/* Step-specific preview */}
                        {index === 0 && (
                          <div className="flex items-center justify-center h-full space-x-2">
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-12 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-md"
                            />
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                              className="w-12 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-md"
                            />
                          </div>
                        )}
                        {index === 1 && (
                          <div className="flex items-center justify-center h-full">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center"
                            >
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                                <Wand2 className="w-4 h-4 text-purple-600" />
                              </div>
                            </motion.div>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="flex items-center justify-center h-full">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-16 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                            >
                              <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                          </div>
                        )}
                        {index === 3 && (
                          <div className="flex items-center justify-center h-full space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  delay: i * 0.2 
                                }}
                                className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Central Dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full border-2 border-blue-500 shadow-lg z-20 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Timeline number (opposite side) */}
                  <div className={`hidden lg:flex w-5/12 ${index % 2 === 0 ? 'justify-start pl-12' : 'justify-end pr-12'}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      {/* Shadow/outline effect */}
                      <div className="absolute inset-0 text-6xl font-bold text-slate-300/40 dark:text-slate-600/40 select-none">
                        {step.number}
                      </div>
                      {/* Main number */}
                      <div className="relative text-6xl font-bold text-transparent bg-gradient-to-r from-blue-500/80 to-purple-600/80 bg-clip-text select-none">
                        {step.number}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à créer quelque chose d'unique ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'organisateurs qui font confiance à PassMaker pour leurs événements
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
} 