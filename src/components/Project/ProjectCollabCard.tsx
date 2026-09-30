import { useNavigate } from 'react-router-dom'
import { ProjectCollabItem } from '../../interfaces/projects.interfaces'

interface ProjectCollabCardProps {
  project: ProjectCollabItem
  dark: boolean
}

const ProjectCollabCard = ({ project, dark }: ProjectCollabCardProps) => {
  const navigate = useNavigate()
  const { name, description, owner, status, updatedAt } = project

  const isActive = status === 'ACTIVE'

  return (
    <div
      className={`group rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
        }`}
    >
      {/* label + status */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          Collaborating
        </span>
        <span className={`flex items-center gap-1.5 text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : dark ? 'bg-gray-600' : 'bg-gray-300'}`} />
          {isActive ? 'Active' : 'Archived'}
        </span>
      </div>

      {/* name + description */}
      <div>
        <h3 className={`text-sm font-bold leading-snug line-clamp-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
        {description && (
          <p className={`text-xs mt-1 line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        )}
      </div>

      <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* owner + action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`flex-shrink-0 border w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold uppercase ${dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
          >
            {owner?.name?.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className={`text-xs font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{owner.name}</p>
            <p className={`text-[10px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Updated {new Date(updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/project/${project._id}`)} // adjust to your real route
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dark
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
          Open
        </button>
      </div>
    </div>
  )
}

export default ProjectCollabCard