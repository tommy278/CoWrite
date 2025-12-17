export default function MobileText({
  text,
  onClick,
  className,
  primary,
}: {
  text: string
  onClick?: () => void
  className?: string
  primary?: boolean
}) {
  return (
    <p
      className={`md:sm flex text-xs ${!primary && 'md:hidden'} ${className ? className : ''}`}
      onClick={onClick}
    >
      {text}
    </p>
  )
}
