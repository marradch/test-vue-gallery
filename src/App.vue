<template>
  <div>
    <h1>Main Gallery</h1>
    <gallery
        :images="images"
        selectable
        @select="onSelect"
        @deselect="onDeselect"
    />
    <h1>Selected From First Gallery</h1>
    <gallery :images="selectedImages"/>
  </div>
</template>

<script  setup lang="ts">
import { ref, onMounted } from 'vue'
import Gallery from '@/components/Gallery.vue'
import type { ImageItem } from '@/types'

const images = ref<ImageItem[]>([])
const selectedImages = ref<ImageItem[]>([])

const onSelect = (id: number) => {
  const item = images.value.find(img => img.id === id)
  if (item) selectedImages.value.push(item)
}

const onDeselect = (id: number) => {
  selectedImages.value = selectedImages.value.filter(img => img.id !== id)
}

onMounted(async () => {
  try {
    const res = await fetch('https://picsum.photos/v2/list')
    images.value = await res.json() as ImageItem[]
  } catch (err) {
    console.error('Error in loading images:', err)
  }
})
</script>