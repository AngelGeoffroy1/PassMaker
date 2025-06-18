import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log uniquement les requêtes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API] ${request.method} ${request.nextUrl.pathname}`)
    console.log(`[API] Headers:`, Object.fromEntries(request.headers.entries()))
    
    // Pour les POST, on ne peut pas lire le body ici car il sera consommé
    if (request.method === 'POST') {
      console.log(`[API] POST request detected`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
} 