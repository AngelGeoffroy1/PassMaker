# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build application with Turbopack
npm run build

# Production server
npm start

# Lint code
npm run lint
```

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture Overview

PassMaker is a Next.js 14 application for generating event bracelets using algorithmic design templates. The application follows a domain-driven structure with the core business logic centered around bracelet generation.

### Core Domain Model

The application revolves around these key interfaces defined in `src/types/bracelet.ts`:
- `BraceletForm`: Input form data (association name, event, date, palette, logo)
- `BraceletResult`: Generated bracelet with metadata and export URLs
- `TechnicalZones`: Optional print zones (QR codes, numbering, cut marks)
- `PrintSpecs`: Print specifications (Tyvek 14×150mm, 300 DPI)

### Data Flow Architecture

1. **Form Input** → `BraceletForm` component collects user data
2. **Design Generation** → `DesignGenerator` creates bracelet design using algorithmic templates
3. **Image Processing** → `ImageProcessor` normalizes for print specifications  
4. **Preview & Export** → `BraceletPreview` shows result with download options

### Key Services

- **DesignGenerator** (`src/lib/design-generator.ts`): Handles algorithmic design generation with multiple templates tailored for each color palette and event style
- **ImageProcessor** (`src/lib/image-processor.ts`): Canvas-based processing for print normalization, technical zones, and export generation (PNG/PDF)
- **API Route** (`src/app/api/generate/route.ts`): Backend endpoint with validation, rate limiting placeholder, and error handling

### Print Specifications

The application targets professional bracelet printing with:
- **Primary Format**: Tyvek 14×150mm at 300 DPI (1772×165 pixels)
- **Technical Zones**: Configurable QR codes (20×20mm) and numbering (10×5mm)
- **Export Formats**: High-res PNG and PDF with proper margins and cut marks
- **Color Palettes**: Six predefined palettes (Électrique, Néon, Pastel, Sombre, Vintage, Océan)

### Component Architecture

Built with shadcn/ui components and follows a two-column layout:
- **Left Column**: Form with dropzone, validation, and technical zone toggles  
- **Right Column**: Preview with tabs (Aperçu/Spécifications) and download buttons

The form uses React Hook Form with Zod validation, and the preview handles real-time Canvas processing for print-ready outputs.

### File Structure Notes

Some source files may be located in `../src/` (parent directory) due to project initialization structure. Key business components are:
- `src/components/bracelet/bracelet-form.tsx`
- `src/components/bracelet/bracelet-preview.tsx`
- `src/lib/constants.ts` - Print specs and palette definitions
- `src/types/bracelet.ts` - Core type definitions

## Design System

The algorithmic design generator includes:
- Multiple design templates (gradient, geometric, minimal, festive)
- Template selection based on color palette choice
- Event details integration (association, name, date)
- Print constraints optimization (150x14mm ratio, Tyvek background)
- Style variations (modern, student-oriented, festive)

Templates are deterministic and provide consistent, professional results.