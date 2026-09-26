import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge, BadgeStatus } from '../../../interfaces/badges.interfaces'
import { useSwal } from '../../../hooks/useSwal'
import useUserAuthContext from '../../../context/hooks/useUserAuthContext'
import { CloseIcon, ShieldIcon } from '../../../utils/iconsUtils'
import UISelect from '../../Global/UISelect'
import { createBadge, updateBadge, uploadBadgeImage } from '../../../utils/badgesUtils'
import UISelect2 from '../../Global/UISelect2'
import { createPortal } from 'react-dom'
import UIInputNumber from '../../Global/UIInputNumber'

const CONDITION_TYPES = [
  { value: 'BLOG_COUNT', label: 'Blog count' },
  { value: 'COMMENT_COUNT', label: 'Comment count' },
  { value: 'QUIZ_COUNT', label: 'Quiz count' },
  { value: 'FOLLOWER_COUNT', label: 'Follower count' },
  { value: 'QUIZ_SCORE', label: 'Quiz score' },
]

interface BadgeFormModalProps {
  badge: Badge | null // null = create mode
  dark: boolean
  onClose: () => void
  onSaved: () => void
}

const BadgeFormModal = ({ badge, dark, onClose, onSaved }: BadgeFormModalProps) => {
  const { showConfirmSwal } = useSwal()
  const { userAuth } = useUserAuthContext()

  const isEditMode = !!badge

  const [name, setName] = useState(badge?.name ?? '')
  const [description, setDescription] = useState(badge?.description ?? '')
  const [conditionType, setConditionType] = useState(badge?.condition.type ?? '')
  const [conditionValue, setConditionValue] = useState(badge?.condition.value ?? 1)
  const [status, setStatus] = useState<BadgeStatus>(badge?.status ?? 'ACTIVE')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(badge?.img || null)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // if the badge being edited has a condition type outside our known list,
  // keep it selectable instead of silently dropping it
  const conditionOptions = CONDITION_TYPES.some((c) => c.value === conditionType) || !conditionType
    ? CONDITION_TYPES
    : [{ value: conditionType, label: conditionType }, ...CONDITION_TYPES]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      showConfirmSwal({ message: 'Give the badge a name', status: 'error', confirmButton: true, cancelButton: false })
      return
    }
    if (!conditionType.trim()) {
      showConfirmSwal({ message: 'Set a condition type (e.g. BLOG_COUNT)', status: 'error', confirmButton: true, cancelButton: false })
      return
    }
    if (!imageFile && !badge?.img) {
      showConfirmSwal({ message: 'Upload an image for the badge', status: 'error', confirmButton: true, cancelButton: false })
      return
    }

    setSaving(true)
    try {
      // 1. upload the image first (only if a new file was picked)
      let imgUrl = badge?.img ?? ''
      if (imageFile) {
        setUploading(true)
        const uploaded = await uploadBadgeImage(imageFile)
        imgUrl = uploaded.secure_url
        setUploading(false)
      }

      const conditionPayload = { type: conditionType.trim().toUpperCase(), value: Number(conditionValue) || 0 }

      // 2. now send the badge json, with the uploaded image url included
      if (isEditMode && badge) {
        await updateBadge(badge._id, {
          name: name.trim(),
          description: description.trim(),
          img: imgUrl,
          status,
          condition: conditionPayload,
        })
      } else {
        await createBadge({
          name: name.trim(),
          description: description.trim(),
          img: imgUrl,
          condition: conditionPayload,
          createdBy: userAuth.userId as string,
        })
      }

      showConfirmSwal({ message: isEditMode ? 'Badge updated' : 'Badge created', status: 'success', confirmButton: true, cancelButton: false })
      onSaved()
    } catch (error: any) {
      showConfirmSwal({ message: error?.response?.data?.message || 'Could not save the badge', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(false)
      setUploading(false)
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
          style={{ width: '100%', maxWidth: 440, borderRadius: 16, padding: 20, maxHeight: '85vh', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: dark ? '#fff' : '#111' }}>
              {isEditMode ? 'Edit badge' : 'Create badge'}
            </p>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', display: 'flex' }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* image */}
            <div>
              <span style={labelStyle}>Image</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Badge preview" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <span
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                    }}
                  >
                    <ShieldIcon size={22} />
                  </span>
                )}
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: 8,
                    cursor: uploading || saving ? 'default' : 'pointer',
                    opacity: uploading || saving ? 0.6 : 1,
                    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    color: dark ? '#fff' : '#333',
                  }}
                >
                  {uploading ? 'Uploading...' : previewUrl ? 'Change image' : 'Upload image'}
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading || saving} />
                </label>
              </div>
            </div>

            <div>
              <span style={labelStyle}>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First post" style={inputStyle} />
            </div>

            <div>
              <span style={labelStyle}>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Create your first post"
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            <div
              className='flex justify-between gap-10'
            >
              <div>
                <span style={labelStyle}>Value</span>
                <UISelect2
                  dark={dark}
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                  icon={<ShieldIcon size={14} />}
                >
                  <option value="" disabled>
                    Select a condition
                  </option>

                  {conditionOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </UISelect2>
              </div>

              <UIInputNumber
                dark={dark}
                label="Value"
                min={1}
                value={conditionValue}
                onChange={(e) =>
                  setConditionValue(
                    Math.max(1, Number(e.target.value) || 1)
                  )
                }
                className="w-[100px]"
              />
            </div>
            <p style={{ margin: '-8px 0 0', fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
              This determines which user stat has to reach the value below to unlock the badge.
            </p>

            {isEditMode && (
              <div>
                <span style={labelStyle}>Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as BadgeStatus)} style={inputStyle}>
                  <option value="ACTIVE">Active</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
            )}
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
              disabled={saving || uploading}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#2563EB',
                color: '#fff',
                opacity: saving || uploading ? 0.6 : 1,
              }}
            >
              {uploading ? 'Uploading image...' : saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create badge'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BadgeFormModal