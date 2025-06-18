"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles, Heart, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-gray-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                PassMaker
              </span>
            </motion.div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
              Créez des bracelets personnalisés uniques grâce à l'intelligence artificielle. 
              Du design à la livraison, nous transformons vos idées en bijoux d'exception.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {["Accueil", "Comment ça marche", "Exemples", "Tarifs"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {["Contact", "FAQ", "Livraison", "Retours"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200/50 dark:border-slate-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {currentYear} PassMaker. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-sm mt-4 md:mt-0">
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>en France</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 