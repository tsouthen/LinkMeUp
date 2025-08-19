import { useEffect, useState } from 'react'
import './App.css'

// Add type for chrome global and tabs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    chrome?: typeof chrome;
  }
}

function getCopyFormats(url: string, title: string) {
  return {
    html: `<a href="${url}">${title}</a>`,
    markdown: `[${title}](${url})`,
    text: `${title} - ${url}`,
  }
}

function App() {
  const [tab, setTab] = useState<{ url: string; title: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Get current tab info using Chrome extension API
    if (window.chrome && window.chrome.tabs) {
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs: Array<{ url?: string; title?: string }>) => {
        const t = tabs[0]
        if (t && t.url && t.title) setTab({ url: t.url, title: t.title })
      })
    }
  }, [])

  const handleCopy = (type: 'html' | 'markdown' | 'text') => {
    if (!tab) return
    const formats = getCopyFormats(tab.url, tab.title)
    navigator.clipboard.writeText(formats[type])
      .then(() => setCopied(type))
      .then(() => setTimeout(() => setCopied(null), 1200))
  }


  return (
    <div className="popup">
      <h2 style={{ marginBottom: 8 }}>Copy Link As...</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => handleCopy('html')}>{copied === 'html' ? 'Copied!' : 'HTML'}</button>
        <button onClick={() => handleCopy('markdown')}>{copied === 'markdown' ? 'Copied!' : 'Markdown'}</button>
        <button onClick={() => handleCopy('text')}>{copied === 'text' ? 'Copied!' : 'Plain Text'}</button>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        {tab ? <span>Page: {tab.title}</span> : <span>Loading tab info...</span>}
      </div>
    </div>
  )
}

export default App
