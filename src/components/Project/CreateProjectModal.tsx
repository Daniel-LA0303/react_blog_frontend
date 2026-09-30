import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import { createProject } from '../../utils/projectUtils'
import UIModal from '../Global/UIModal'
import Field from '../Global/Field'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  dark: boolean
}

const NAME_MAX = 60
const DESC_MAX = 200

const CreateProjectModal = ({ open, onClose, dark }: CreateProjectModalProps) => {
  const navigate = useNavigate()
  const { userAuth } = useUserAuthContext()
  const { showConfirmSwal } = useSwal()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')
  const [saving, setSaving] = useState(false)

  const inputClass = `w-full text-sm rounded-lg px-3 py-2 outline-none border transition-colors ${
    dark
      ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600 focus:border-gray-500'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400'
  }`

  const reset = () => {
    setName('')
    setDescription('')
    setNameError('')
  }

  const handleClose = () => {
    if (saving) return // don't close while the request is in flight
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setNameError('Give your project a name')
      return
    }

    setSaving(true)
    try {
      const res = await createProject({
        name: name.trim(),
        description: description.trim(),
        owner: userAuth.userId as string,
      })
      console.log(res.projectId);
      

      reset()
      onClose()

      await showConfirmSwal({ message: 'Project created successfully', status: 'success', confirmButton: true, cancelButton: false })

      navigate(`/project/${res.projectId}`)
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not create the project', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(false)
    }
  }

  return (
    <UIModal open={open} onClose={handleClose} dark={dark} maxWidth={440}>
      <form onSubmit={handleSubmit}>
        {/* header */}
        <div className={`px-5 pt-5 pb-4 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>New project</h2>
          <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Create a board and invite others to collaborate.
          </p>
        </div>

        {/* body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <Field label="Name" htmlFor="project-name" error={nameError} dark={dark}>
            <input
              id="project-name"
              autoFocus
              value={name}
              maxLength={NAME_MAX}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
              }}
              placeholder="e.g. Website redesign"
              className={inputClass}
            />
          </Field>

          <Field label="Description (optional)" htmlFor="project-desc" dark={dark}>
            <textarea
              id="project-desc"
              value={description}
              maxLength={DESC_MAX}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              className={`${inputClass} resize-none`}
            />
            <p className={`text-[10px] text-right mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {description.length}/{DESC_MAX}
            </p>
          </Field>
        </div>

        {/* footer */}
        <div className={`px-5 py-3 flex items-center justify-end gap-2 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
              dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating...' : 'Create project'}
          </button>
        </div>
      </form>
    </UIModal>
  )
}

export default CreateProjectModal