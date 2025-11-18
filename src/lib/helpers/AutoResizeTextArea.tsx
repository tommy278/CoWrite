import { useRef, useEffect } from 'react'

interface AutoResizeTextAreaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className: string
}

export default function AutoResizeTextArea({
  value,
  onChange,
  className,
}: AutoResizeTextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      style={{
        overflow: 'hidden',
        resize: 'none',
        minHeight: '90vh',
        lineHeight: '1.5rem',
        padding: '1rem',
        width: '80%',
        outline: 'none',
      }}
      className={className}
      rows={1}
    />
  )
}
