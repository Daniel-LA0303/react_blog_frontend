import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwal } from '../../hooks/useSwal'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { CloseIcon } from '../../utils/iconsUtils'
import { StudyList, StudyListStatus } from '../../interfaces/lists.interfaces'
import { updateStudyList } from '../../utils/listsUtils'
import Field from '../Global/Field'

const CONDITION_TYPES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'HIDDEN', label: 'Hidden' },
]

interface StudyListFormModalProps {
  list: StudyList
  dark: boolean
  onClose: () => void
  onSaved: (updated: StudyList) => void
}

const StudyListFormModal = ({ list, dark, onClose, onSaved }: StudyListFormModalProps) => {
  const { showConfirmSwal } = useSwal()
  const { userAuth } = useUserAuthContext()

  const [title, setTitle] = useState(list.title)
  const [description, setDescription] = useState(list.description)
  const [status, setStatus] = useState<StudyListStatus>(list.status)
  const [saving, setSaving] = useState(false)


  const handleSubmit = async () => {
    if (!title.trim()) {
      showConfirmSwal({ message: 'Give the list a title', status: 'error', confirmButton: true, cancelButton: false })
      return
    }
    setSaving(true)
    try {
      const updated = await updateStudyList(list._id, {
        owner: userAuth.userId as string,
        title: title.trim(),
        description: description.trim(),
        status,
      })
      showConfirmSwal({ message: 'List updated', status: 'success', confirmButton: true, cancelButton: false })
      onSaved(updated)
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not update the list', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 13,
    padding: '8px 10px',
    borderRadius: 8,
    border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
    background: dark ? '#1c1c1e' : '#fff',
    color: dark ? '#fff' : '#111',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
    marginBottom: 4,
    display: 'block',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className={dark ? 'bg-[#1c1c1e]' : 'bg-white'}
          style={{ width: '100%', maxWidth: 420, borderRadius: 16, padding: 20 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: dark ? '#fff' : '#111' }}>Edit list</p>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', display: 'flex' }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={labelStyle}>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <span style={labelStyle}>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <Field label="Post Visibility" htmlFor="statusPost" dark={dark}>
              <div className="relative">
                <select
                  id="statusPost"
                  value={status}
                  onChange={e => 
                    setStatus(e.target.value as StudyListStatus)
                  }
                  className={`
                    w-full appearance-none rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 outline-none pr-10 cursor-pointer
                    ${dark
                      ? 'bg-zinc-900/80 text-white border-zinc-800 hover:border-zinc-700 focus:border-zinc-500'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 focus:border-zinc-400'
                    }`}
                >
                  <option value="" disabled hidden className={dark ? 'bg-zinc-900 text-zinc-500' : 'bg-white text-zinc-400'}>
                    Select Post Status
                  </option>
                  <option value="ACTIVE" className={dark ? 'bg-zinc-900 text-emerald-400 font-semibold' : 'bg-white text-emerald-600 font-semibold'}>
                    ● ACTIVE (Visible to public)
                  </option>
                  <option value="HIDDEN" className={dark ? 'bg-zinc-900 text-amber-400 font-semibold' : 'bg-white text-amber-600 font-semibold'}>
                    ● Hidden (Only visible to you)
                  </option>
                </select>

                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </Field>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                color: dark ? '#fff' : '#333',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#2563EB',
                color: '#fff',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StudyListFormModal