import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // <-- Import the new plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
    , basicSsl() // <-- Add the new plugin here
  ],
  server: {
    host: true, // exposes to LAN so you can open on phone
  
  }

})
