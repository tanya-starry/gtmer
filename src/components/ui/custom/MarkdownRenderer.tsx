interface Props {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: Props) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
    />
  )
}

export default MarkdownRenderer
