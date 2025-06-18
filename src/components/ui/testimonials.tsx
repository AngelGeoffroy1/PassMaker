"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Créatrice de mode",
    company: "Atelier Marie",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&h=200&auto=format&fit=crop",
    text: "PassMaker a révolutionné ma création de bijoux ! L'IA comprend parfaitement mes envies et propose des designs que je n'aurais jamais imaginés. Mes clientes sont enchantées !",
    rating: 5,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 2,
    name: "Lucas Martin",
    role: "Influenceur lifestyle",
    company: "@lucas_style",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    text: "Incroyable ! J'ai créé un bracelet totalement unique en quelques minutes. La qualité est exceptionnelle et le processus est si fluide. Je recommande à 100% !",
    rating: 5,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Sophie Chen",
    role: "Directrice artistique",
    company: "Studio Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    text: "L'attention aux détails est remarquable. Chaque bracelet est une œuvre d'art unique. PassMaker comprend vraiment l'essence de la personnalisation haut de gamme.",
    rating: 5,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 4,
    name: "Antoine Rousseau",
    role: "Entrepreneur",
    company: "Tech Innovations",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
    text: "Je cherchais un cadeau unique pour ma partenaire. PassMaker a créé exactement ce que j'imaginais, mais en mieux ! Le service client est également exceptionnel.",
    rating: 5,
    color: "from-emerald-500 to-teal-500"
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-rotation des témoignages
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
            <Star className="w-4 h-4 text-amber-500 mr-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Témoignages clients
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Ils nous font{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              confiance
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Découvrez pourquoi nos clients adorent créer leurs bracelets uniques avec PassMaker
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Background Animated Elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-96 h-96 rounded-full border border-blue-200/30 dark:border-blue-700/30"
            />
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1.1, 1, 1.1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-80 h-80 rounded-full border border-purple-200/30 dark:border-purple-700/30"
            />
          </div>

          {/* Main Testimonial Card */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6 }}
                className="relative"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
              >
                <div className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 overflow-hidden`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.color} opacity-5`} />
                  
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="absolute top-6 right-6"
                  >
                    <Quote className="w-12 h-12 text-slate-200 dark:text-slate-700 fill-current" />
                  </motion.div>

                  <div className="relative z-10">
                    {/* Stars */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center mb-6"
                    >
                      {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-amber-400 fill-current mr-1" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Testimonial Text */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed italic"
                    >
                      "{currentTestimonial.text}"
                    </motion.p>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center"
                    >
                      <div className="relative">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={currentTestimonial.avatar}
                          alt={currentTestimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-lg"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute -inset-1 rounded-full bg-gradient-to-r ${currentTestimonial.color} opacity-20 blur-sm`}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {currentTestimonial.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {currentTestimonial.role} • {currentTestimonial.company}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? `bg-gradient-to-r ${currentTestimonial.color} shadow-lg`
                        : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Side Testimonials Preview */}
          <div className="hidden lg:block">
            {/* Left Preview */}
            <motion.div
              key={`left-${currentIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-64"
            >
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center mb-3">
                  <img
                    src={testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].avatar}
                    alt="Previous testimonial"
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].name}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length].text}
                </p>
              </div>
            </motion.div>

            {/* Right Preview */}
            <motion.div
              key={`right-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-64"
            >
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center mb-3">
                  <img
                    src={testimonials[(currentIndex + 1) % testimonials.length].avatar}
                    alt="Next testimonial"
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {testimonials[(currentIndex + 1) % testimonials.length].name}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {testimonials[(currentIndex + 1) % testimonials.length].text}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 