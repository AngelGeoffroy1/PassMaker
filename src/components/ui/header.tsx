"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Accueil",
    href: "#hero",
  },
  {
    title: "Comment ça marche",
    href: "#process",
  },
  {
    title: "Témoignages", 
    href: "#testimonials",
  },
  {
    title: "Pourquoi nous",
    href: "#features",
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Gérer la visibilité du header au scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas - cacher le header
        setIsVisible(false)
      } else {
        // Scroll vers le haut - montrer le header
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Scroll fluide vers la section
  const scrollToSection = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <motion.header 
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Navigation Links - Alignés à gauche */}
          <div className="hidden md:flex items-center space-x-12">
            {navigationItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600/80 dark:text-slate-300/80 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-medium text-sm tracking-wide"
              >
                {item.title}
              </motion.button>
            ))}
          </div>

          {/* Espace vide pour centrer si nécessaire */}
          <div className="flex-1 md:hidden"></div>

          {/* CTA Buttons - Alignés à droite */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              className="text-slate-600/80 dark:text-slate-300/80 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/20 backdrop-blur-sm transition-all duration-300"
            >
              Se connecter
            </Button>
            <Button className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700 hover:to-purple-700 text-white backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105">
              Commencer
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600/80 dark:text-slate-300/80 hover:bg-white/10 dark:hover:bg-slate-800/20 backdrop-blur-sm"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl mt-2 border border-white/20 dark:border-slate-700/20"
          >
            <div className="flex flex-col space-y-3 px-4">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-3 text-left border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                >
                  {item.title}
                </button>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Button 
                  variant="ghost" 
                  className="text-slate-600 dark:text-slate-300 justify-start hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Se connecter
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-start">
                  Commencer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
} 