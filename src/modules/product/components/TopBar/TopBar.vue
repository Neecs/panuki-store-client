<script setup lang="ts">
import { buildWhatsAppLink } from '../../utils/whatsapp'

const inquiryLink = buildWhatsAppLink(
  'Hola, quiero más información sobre los productos de Panuki Store',
)
</script>

<template>
  <div class="topband">
    <header class="header">
      <div class="brand">
        <span class="name">Panuki</span>
        <span class="dots"><span></span><span></span><span></span></span>
      </div>
      <nav class="nav">
        <a href="#" class="active">Tienda</a>
        <a href="#">Nosotros</a>
        <a href="#">Contacto</a>
      </nav>
      <a
        class="icon-btn"
        :href="inquiryLink"
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path
            d="M12 2C6.48 2 2 6.29 2 11.6c0 1.86.55 3.6 1.5 5.08L2 22l5.5-1.44A10.4 10.4 0 0 0 12 21.2c5.52 0 10-4.29 10-9.6S17.52 2 12 2Zm0 17.4c-1.63 0-3.15-.46-4.44-1.26l-.32-.19-3.27.86.88-3.13-.21-.33A7.86 7.86 0 0 1 3.6 11.6c0-4.3 3.77-7.8 8.4-7.8s8.4 3.5 8.4 7.8-3.77 7.8-8.4 7.8Zm4.6-5.85c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.97-.15.17-.29.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.77-1.83-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z"
          />
        </svg>
      </a>
    </header>
    <svg class="wave" viewBox="0 0 1440 44" preserveAspectRatio="none">
      <path
        d="M0 0 C 240 44, 480 0, 720 22 C 960 44, 1200 0, 1440 22 L1440 44 L0 44 Z"
        fill="var(--bg)"
      ></path>
    </svg>
  </div>
</template>

<style scoped src="./TopBar.css"></style>
