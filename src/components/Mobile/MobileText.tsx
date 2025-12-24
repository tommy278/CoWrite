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
      className={`flex text-xs sm:text-sm md:text-sm ${!primary && 'md:hidden'} ${className ? className : ''}`}
      onClick={onClick}
    >
      {text}
    </p>
  )
}
