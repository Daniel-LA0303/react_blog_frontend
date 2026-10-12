import { useEffect, useState } from "react";
import UIModal from "../../Global/UIModal";
import UITextField from "../../Global/UITextField";
import UIButton from "../../Global/UIButton";
import ColorPicker from "../ColorPicker";
import { CategoryFormValues, ICategoryInfo } from "../../../interfaces/admin.interfaces";

const EMPTY_FORM: CategoryFormValues = {
  name: '', color: '#2563EB', desc: '', longDesc: '',
}

const CategoryFormModal = ({
  open, onClose, dark, editing, onSubmit, submitting,
}: {
  open: boolean
  onClose: () => void
  dark: boolean
  editing: ICategoryInfo | null // null = create mode, ICategory = edit mode
  onSubmit: (values: CategoryFormValues) => Promise<void>
  submitting: boolean
}) => {
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_FORM)

  // Reset form each time the modal opens, pre-filling when editing
  useEffect(() => {
    if (!open) return
    if (editing) {
      setForm({
        name: editing.name,
        color: editing.color,
        desc: editing.desc,
        longDesc: editing.longDesc,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, editing])

  const isValid = Boolean(form.name.trim() && form.desc.trim())

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    await onSubmit(form)
  }

  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={440}>
      <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto p-6">
        <h2 className={`text-base font-semibold ${dark ? 'text-white' : 'text-neutral-900'}`}>
          {editing ? 'Edit category' : 'New category'}
        </h2>

        <UITextField
          label="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
          <p className={`mb-1 text-[13px] ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>Color</p>
          <ColorPicker
            value={form.color}
            onChange={color => setForm(f => ({ ...f, color }))}
            dark={dark}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <UIButton variant="secondary" size="small" dark={dark} onClick={onClose} disabled={submitting}>
            Cancel
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            dark={dark}
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            loading={submitting}
          >
            {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
          </UIButton>
        </div>
      </div>
    </UIModal>
  )
}

export default CategoryFormModal