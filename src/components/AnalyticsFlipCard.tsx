import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { motion } from 'framer-motion'
import { Check, PencilLine } from 'lucide-react'

type Props<T extends object> = {
  name: string
  storageKey: string
  defaults: T
  renderPreview: (data: T) => ReactNode
  renderEditor: (draft: T, setDraft: Dispatch<SetStateAction<T>>) => ReactNode
}

function readSaved<T extends object>(storageKey: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return defaults
    return { ...defaults, ...(JSON.parse(raw) as Partial<T>) }
  } catch {
    return defaults
  }
}

export default function AnalyticsFlipCard<T extends object>({
  name, storageKey, defaults, renderPreview, renderEditor
}: Props<T>) {
  const [saved, setSaved] = useState<T>(() => readSaved(storageKey, defaults))
  const [draft, setDraft] = useState<T>(() => readSaved(storageKey, defaults))
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('Changes are only applied when you confirm.')

  const openEditor = () => {
    setDraft(saved)
    setMessage('Review your values, then confirm to update the preview.')
    setEditing(true)
  }
  const confirm = () => {
    setSaved(draft)
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft))
      setMessage('Saved in this browser.')
    } catch {
      setMessage('Preview updated. Browser storage is unavailable, so values may not persist after refresh.')
    }
    setEditing(false)
  }

  return <div className={`analytics-flip-card ${editing ? 'is-editing' : ''}`} aria-label={name}>
    <motion.div className="analytics-flip-inner" animate={{ rotateY: editing ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 19, mass: 0.9 }}>
      <div className="analytics-flip-face analytics-flip-front">
        <div className="afc-toolbar"><div><span>LIVE COMPONENT</span><b>{name}</b></div><button type="button" onClick={openEditor} aria-label={`Edit data for ${name}`}><PencilLine size={13}/> Edit data</button></div>
        <div className="afc-preview-content">{renderPreview(saved)}</div>
      </div>
      <div className="analytics-flip-face analytics-flip-back">
        <div className="afc-editor-head"><span>COMPONENT DATA</span><h3>Edit {name}</h3><p>Adjust the demo values. Confirm to update the preview and save them in this browser.</p></div>
        <div className="afc-editor-body">{renderEditor(draft, setDraft)}</div>
        <div className="afc-editor-footer"><span>{message}</span><button type="button" onClick={confirm}><Check size={14}/> Confirm &amp; preview</button></div>
      </div>
    </motion.div>
  </div>
}
