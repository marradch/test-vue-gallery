<template>

  <div class="carousel-wrapper">
    <button v-show="hasPrev" class="nav prev" @click="prev">&#10094;</button>

    <div class="carousel" ref="carouselRef">
      <div
          v-for="image in images"
          :key="image.id"
          class="carousel-item"
      >
        <img :src="image.download_url" :alt="image.author" />
      </div>
    </div>

    <button v-show="hasNext" class="nav next" @click="next">&#10095;</button>
  </div>

</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted, onUnmounted } from 'vue'
import type { ImageItem } from '@/types'

const props = defineProps<{
  images: ImageItem[]
}>()

const carouselRef = ref<HTMLDivElement | null>(null)
const currentIndex = ref(0)

onMounted(() => {
  window.addEventListener('resize', scrollToIndex)
})

onUnmounted(() => {
  window.removeEventListener('resize', scrollToIndex)
})

const hasPrev = computed(() => currentIndex.value !== 0)
const hasNext = computed(() => currentIndex.value + 1 !== props.images.length)

function scrollToIndex() {
  if (!carouselRef.value) return

  const items = carouselRef.value.querySelectorAll<HTMLElement>('.carousel-item')
  const currentItem = items[currentIndex.value]

  if (currentItem) {
    carouselRef.value.scrollLeft = currentItem.offsetLeft
  }
}

function next() {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
  scrollToIndex()
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
  scrollToIndex()
}
</script>

<style scoped lang="scss">
  .carousel-wrapper {
    position: relative;
    overflow: hidden;
    margin: auto;
    width: 100%;
  }

  .carousel {
    display: flex;
    gap: 10px;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  .carousel-item {
    flex: 0 0 auto;
    width: 200px;
    height: 150px;
    border-radius: 10px;
    overflow: hidden;

    @media (max-width: 768px) {
      width: 100%;
      height: 300px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }
  }
</style>