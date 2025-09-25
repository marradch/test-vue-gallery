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
import { defineProps, ref, computed, onMounted, onUnmounted, onBeforeUnmount, defineEmits, watch, nextTick } from 'vue'
import type { ImageItem } from '@/types'
import GalleryItem from '@/components/GalleryItem.vue'
import  { useDevice } from '@/composables/useDevice'

const { isMobile } = useDevice();

const props = defineProps<{
  images: ImageItem[],
  selectable?: boolean
}>()

const carouselRef = ref<HTMLDivElement | null>(null)
const currentIndex = ref(0)

watch(
    () => props.images,
    async () => {
      currentIndex.value = 0
      if (carouselRef.value) carouselRef.value.scrollLeft = 0
      await nextTick()

      // ждём загрузки всех изображений внутри карусели (если нужно)
      const imgs = carouselRef.value?.querySelectorAll('img') ?? []
      await Promise.all(Array.from(imgs).map(img => {
        if ((img as HTMLImageElement).complete) return Promise.resolve()
        return new Promise(resolve => (img as HTMLImageElement).addEventListener('load', resolve, { once: true }))
      }))

      setHasPrev()
      setHasNext()
    },
    { deep: true }
)

function onResize() {
  currentIndex.value = 0
  carouselRef.value.scrollLeft = 0
  setHasNext()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const hasPrevByScroll = ref(false);
const hasNextByScroll = ref(true);

const hasPrev = computed(() => isMobile.value ? (currentIndex.value !== 0) : hasPrevByScroll.value)
const hasNext = computed(() => isMobile.value ? (currentIndex.value + 1 !== props.images.length) : hasNextByScroll.value)

function setHasPrev() {
  if (isMobile.value || !carouselRef.value) return

  const items = carouselRef.value.querySelectorAll<HTMLElement>('.carousel-item')
  if (!items.length) return

  console.log('detect prev', carouselRef.value.scrollLeft);

  hasPrevByScroll.value = carouselRef.value.scrollLeft > 0
}

function setHasNext() {
  if (isMobile.value || !carouselRef.value) return

  const items = carouselRef.value.querySelectorAll<HTMLElement>('.carousel-item')
  if (!items.length) return

  const lastItem = items[items.length - 1]
  const carouselRect = carouselRef.value.getBoundingClientRect()
  const lastItemRect = lastItem.getBoundingClientRect()

  console.log(lastItemRect.right, carouselRect.right)

  // Если правый край последнего элемента выходит за пределы контейнера → значит есть "следующий"
  hasNextByScroll.value = lastItemRect.right > carouselRect.right
}


let scrollTimeout: number | null = null
let scrollHandler: (() => void) | null = null

onMounted(() => {
  if (!carouselRef.value) return

  scrollHandler = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = window.setTimeout(() => {
      setHasPrev()
      setHasNext()
      scrollTimeout = null
    }, 120)
  }

  carouselRef.value.addEventListener('scroll', scrollHandler, { passive: true })
})

onBeforeUnmount(() => {
  if (carouselRef.value && scrollHandler) {
    carouselRef.value.removeEventListener('scroll', scrollHandler)
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
})

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
    align-items: center;
  }

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