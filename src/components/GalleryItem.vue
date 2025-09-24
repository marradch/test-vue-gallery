<template>
  <div
      class="carousel-item"
      @click="toggleSelect"
      :class="{ selected: isSelected }"
  >
    <img :src="image.download_url" :alt="image.author" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { ImageItem } from '@/types'

const props = defineProps<{
  image: ImageItem
  selectedIds: number[]
  selectable?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'deselect', id: number): void
}>()

const isSelected = computed(() => props.selectedIds.includes(props.image.id))

function toggleSelect() {
  if (!props.selectable) return
  if (isSelected.value) {
    emit('deselect', props.image.id)
  } else {
    emit('select', props.image.id)
  }
}
</script>

<style scoped lang="scss">
.carousel-item {
  flex: 0 0 auto;
  width: 200px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.selected {
    width: 182px;
    height: 142px;
    border: 4px solid rgba(255, 0, 0, 0.6);
    border-radius: 10px;

    @media (max-width: 768px) {
      width: calc(100% - 8px);
      height: 292px;
    }
  }
}
</style>