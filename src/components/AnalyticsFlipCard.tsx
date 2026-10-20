import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    <div className="analytics-flip-inner">
      <AnimatePresence mode="wait" initial={false}>
        {!editing ? (
          <motion.div
            key="preview-face"
            className="analytics-flip-face analytics-flip-front"
            initial={{ rotateY: -82, opacity: 0, scale: 0.97 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 82, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ transformOrigin: 'center center' }}
          >
            <div className="afc-toolbar"><div><span>LIVE COMPONENT</span><b>{name}</b></div><button type="button" onClick={openEditor} aria-label={`Edit data for ${name}`}><PencilLine size={13}/> Edit data</button></div>
            <div className="afc-preview-content">{renderPreview(saved)}</div>
          </motion.div>
        ) : (
          <motion.div
            key="editor-face"
            className="analytics-flip-face analytics-flip-back"
            initial={{ rotateY: 82, opacity: 0, scale: 0.97 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -82, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ transformOrigin: 'center center' }}
          >
            <div className="afc-editor-head"><span>COMPONENT DATA</span><h3>Edit {name}</h3><p>Adjust the demo values. Confirm to update the preview and save them in this browser.</p></div>
            <div className="afc-editor-body">{renderEditor(draft, setDraft)}</div>
            <div className="afc-editor-footer"><span>{message}</span><button type="button" onClick={confirm}><Check size={14}/> Confirm &amp; preview</button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
}
