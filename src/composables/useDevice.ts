import { ref, onMounted, onUnmounted } from 'vue'
import { MOBILE_BREAKPOINT } from '@/constants'

export function useDevice(mobileBreakpoint = MOBILE_BREAKPOINT) {
    const isMobile = ref(window.innerWidth <= mobileBreakpoint)

    function handleResize() {
        isMobile.value = window.innerWidth <= mobileBreakpoint
    }

    onMounted(() => window.addEventListener('resize', handleResize))
    onUnmounted(() => window.removeEventListener('resize', handleResize))

    return { isMobile }
}