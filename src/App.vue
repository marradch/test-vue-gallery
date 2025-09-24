<template>
  <div>
    <h1>Test Gallery</h1>
    <gallery :images="images"/>
  </div>
</template>

<script  setup lang="ts">
import { ref, onMounted } from 'vue'
import Gallery from '@/components/Gallery.vue'
import type { ImageItem } from '@/types'

const images = ref<ImageItem[]>([])

onMounted(async () => {
  try {
    const res = await fetch('https://picsum.photos/v2/list')
    images.value = await res.json() as ImageItem[]
  } catch (err) {
    console.error('Error in loading images:', err)
  }
})
</script>