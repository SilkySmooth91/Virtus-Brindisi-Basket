import MarkdownPreview from '@uiw/react-markdown-preview'
import './NewsEditor.css'

export default function NewsContent({ content, className = '' }) {
  if (!content) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        Nessun contenuto disponibile
      </div>
    )
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <MarkdownPreview
        source={content}
        style={{ 
          backgroundColor: 'transparent',
          color: 'inherit'
        }}
        wrapperElement={{
          'data-color-mode': 'light'
        }}
      />
    </div>
  )
}
