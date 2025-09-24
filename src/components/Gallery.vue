<template>

  <div class="carousel-wrapper">
    <button v-show="hasPrev" class="nav prev" @click="prev">&#10094;</button>

    <div class="carousel" ref="carouselRef">
      <GalleryItem
          v-for="image in images"
          :key="image.id"
          :image="image"
          :selected-ids="localSelected"
          :selectable="selectable"
          @select="toggleSelect"
          @deselect="toggleSelect"
      />
    </div>

    <button v-show="hasNext" class="nav next" @click="next">&#10095;</button>
  </div>

</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted, onUnmounted, defineEmits, watch } from 'vue'
import type { ImageItem } from '@/types'
import GalleryItem from '@/components/GalleryItem.vue'

const props = defineProps<{
  images: ImageItem[],
  selectable?: boolean
}>()

const carouselRef = ref<HTMLDivElement | null>(null)
const currentIndex = ref(0)

watch(props.images, () => {
  currentIndex.value = 0
  carouselRef.value.scrollLeft = 0
})

function onResize() {
  currentIndex.value = 0
  carouselRef.value.scrollLeft = 0
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const hasPrev = computed(() => currentIndex.value !== 0)
const hasNext = computed(() => currentIndex.value + 1 !== props.images.length)

function scrollToIndex() {
  if (!carouselRef.value) return

  const items = carouselRef.value.querySelectorAll<HTMLElement>('.carousel-item')
  const currentItem = items[currentIndex.value]

  if (currentItem) {
    carouselRef.value.scrollTo({
      left: currentItem.offsetLeft,
      behavior: 'smooth'
    })
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

const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'deselect', id: number): void
}>()

const localSelected = ref<number[]>([])

function toggleSelect(id: number) {
  if (!props.selectable) return

  const index = localSelected.value.indexOf(id)
  if (index !== -1) {
    localSelected.value.splice(index, 1)
    emit('deselect', id)
  } else {
    localSelected.value.push(id)
    emit('select', id)
  }
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
    overflow-x: hidden;
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