import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// link previews need absolute URLs: use the production domain Vercel provides, or SITE_URL if set
const siteUrl = () => {
  const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  return host ? (host.startsWith('http') ? host : `https://${host}`).replace(/\/$/, '') : ''
}

export default defineConfig({
  plugins: [react(), tailwindcss(), { name: 'site-url', transformIndexHtml: (html: string) => html.replaceAll('%SITE_URL%', siteUrl()) }],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
