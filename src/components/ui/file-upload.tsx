'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Check } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File | null, url?: string) => void
  accept?: string
  maxSize?: number // en MB
  className?: string
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5,
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `Le fichier est trop volumineux. Taille maximum: ${maxSize}MB`
    }
    
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return 'Type de fichier non supporté'
    }
    
    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError('')
    setUploadedFile(file)
    
    // Créer une URL pour l'aperçu
    const url = URL.createObjectURL(file)
    onFileSelect(file, url)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError('')
    onFileSelect(null)
  }

  return (
    <div className={className}>
      {!uploadedFile ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <motion.div
            animate={{ 
              y: isDragOver ? -5 : 0,
              scale: isDragOver ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {isDragOver ? 'Déposez votre fichier ici' : 'Glissez votre logo ici'}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            ou cliquez pour parcourir vos fichiers
          </p>
          <p className="text-sm text-slate-500">
            {accept.includes('image') ? 'PNG, JPG, GIF' : accept} jusqu'à {maxSize}MB
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="w-8 h-8 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}
    </div>
  )
} 