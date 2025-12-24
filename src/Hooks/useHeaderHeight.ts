import { useEffect } from 'react'

export function useHeaderHeight() {
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${header.offsetHeight}px`
        )
      }
    }

    updateHeaderHeight()

    const handleResize = () => {
      requestAnimationFrame(updateHeaderHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}
