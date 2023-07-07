export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/_reset.scss"; @import "@/assets/scss/_reset.scss";'
        }
      }
    }
  }
})
