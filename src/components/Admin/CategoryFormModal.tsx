import { useEffect, useState } from "react";
import UIModal from "./UIModal";
import UITextField from "./UITextField";
import UIButton from "./UIButton";
import ColorPicker from "./ColorPicker";
import { toSlug } from "../../utils/adminUtils";

interface ICategory {
  _id: string
  name: string
  color: string
  desc: string
  longDesc: string
}

interface CategoryFormValues {
  name: string
  color: string
  desc: string
  longDesc: string
}

const EMPTY_FORM: CategoryFormValues = {
  name: '', color: '#2563EB', desc: '', longDesc: '',
}

const CategoryFormModal = ({
  open, onClose, dark, editing, onSubmit, submitting,
}: {
  open: boolean
  onClose: () => void
  dark: boolean
  editing: ICategory | null // null = create mode, ICategory = edit mode
  onSubmit: (values: CategoryFormValues) => Promise<void>
  submitting: boolean
}) => {
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_FORM)
  const [autoSlug, setAutoSlug] = useState(true) // keep value/label synced to name until user edits them manually

  // Reset form each time the modal opens, pre-filling when editing
  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          name: editing.name,
          color: editing.color,
          desc: editing.desc,
          longDesc: editing.longDesc,
        })
        setAutoSlug(false) // don't auto-overwrite an existing category's value/label
      } else {
        setForm(EMPTY_FORM)
        setAutoSlug(true)
      }
    }
  }, [open, editing])

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
    }))
  }

  const isValid = form.name.trim() && form.desc.trim()

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    await onSubmit(form)
  }

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', marginBottom: 4,
  }

  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={440}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dark ? '#fff' : '#111' }}>
          {editing ? 'Edit category' : 'New category'}
        </p>

        <UITextField
          label="Name"
          value={form.name}
          onChange={e => handleNameChange(e.target.value)}
          dark={dark}
          placeholder="e.g. Technology"
        />
        
        <UITextField
          label="Short description"
          value={form.desc}
          onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
          dark={dark}
          placeholder="One line summary"
        />

        <UITextField
          label="Long description"
          value={form.longDesc}
          onChange={e => setForm(f => ({ ...f, longDesc: e.target.value }))}
          dark={dark}
          multiline
          rows={3}
          placeholder="Optional, longer explanation"
        />

        <div>
          <p style={fieldLabelStyle}>Color</p>
          <ColorPicker value={form.color} onChange={c => setForm(f => ({ ...f, color: c }))} dark={dark} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <UIButton variant="outline" dark={dark} onClick={onClose} disabled={submitting}>
            Cancel
          </UIButton>
          <UIButton variant="primary" dark={dark} onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
          </UIButton>
        </div>
      </div>
    </UIModal>
  )
}

export default CategoryFormModal
export type { CategoryFormValues, ICategory }