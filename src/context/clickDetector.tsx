import { useEffect, useRef } from 'react'

export function clickDetector(onClose: () => void) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        e.target instanceof Node &&
        !ref.current.contains(e.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])
  return ref
}
