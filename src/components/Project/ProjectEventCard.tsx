import { Link } from 'react-router-dom'

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

export enum ActionProject {
  CREATE_PROJECT = "CREATE_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  CREATE_TASK = "CREATE_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  DELETE_TASK = "DELETE_TASK",
  CREATE_LIST = "CREATE_LIST",
  UPDATE_LIST = "UPDATE_LIST",
  ASSING_USER = "ASSING_USER",
}

export type ProjectEventEntity = 'ProjectList' | 'Project' | 'ProjectTask' | 'ProjectMember';

/** Lo que guardas con CreateEventI + lo que agrega Mongo al leerlo */
export interface ProjectEventI {
  _id: string;
  project: string;
  user?: string;
  description: string;
  type: ActionProject;
  entity: ProjectEventEntity;
  entityId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectEventCardProps {
  event: ProjectEventI;
  /** Si lo pasas, el card muestra el enlace al proyecto */
  showProjectLink?: boolean;
}

/** Color y texto por tipo de acción: create = verde, update = azul, delete = rojo, assign = violeta */
const EVENT_META: Record<ActionProject, { label: string; light: string; dark: string; dot: string }> = {
  [ActionProject.CREATE_PROJECT]: { label: 'Project created', light: 'bg-green-50 text-green-700 border-green-200', dark: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-500' },
  [ActionProject.CREATE_TASK]:    { label: 'Task created',    light: 'bg-green-50 text-green-700 border-green-200', dark: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-500' },
  [ActionProject.CREATE_LIST]:    { label: 'List created',    light: 'bg-green-50 text-green-700 border-green-200', dark: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-500' },
  [ActionProject.UPDATE_PROJECT]: { label: 'Project updated', light: 'bg-sky-50 text-sky-700 border-sky-200',       dark: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       dot: 'bg-sky-500' },
  [ActionProject.UPDATE_TASK]:    { label: 'Task updated',    light: 'bg-sky-50 text-sky-700 border-sky-200',       dark: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       dot: 'bg-sky-500' },
  [ActionProject.UPDATE_LIST]:    { label: 'List updated',   light: 'bg-sky-50 text-sky-700 border-sky-200',       dark: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       dot: 'bg-sky-500' },
  [ActionProject.DELETE_TASK]:    { label: 'Task deleted',    light: 'bg-rose-50 text-rose-700 border-rose-200',    dark: 'bg-rose-500/10 text-rose-400 border-rose-500/20',    dot: 'bg-rose-500' },
  [ActionProject.ASSING_USER]:    { label: 'User assigned',   light: 'bg-violet-50 text-violet-700 border-violet-200', dark: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-500' },
};

const DEFAULT_META = {
  label: 'Activity',
  light: 'bg-gray-100 text-gray-600 border-gray-200',
  dark: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  dot: 'bg-gray-400',
};

/** "5 min ago", "2 h ago", o fecha corta si pasó más de una semana */
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ProjectEventCard = ({ event, showProjectLink = false }: ProjectEventCardProps) => {

  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  const meta = EVENT_META[event.type] ?? DEFAULT_META;
  const fullDate = new Date(event.createdAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <article
      className={`w-full rounded-xl border px-3 py-2 mt-2 flex items-center gap-2.5 transition-colors duration-200
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
          : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
    >
      <span
        className={`h-2 w-2 rounded-full flex-shrink-0 ${meta.dot}`}
        title={meta.label}
        aria-label={meta.label}
      />

      <p className={`flex-1 min-w-0 truncate text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
        {event.description}
      </p>

      {showProjectLink && (
        <Link
          to={`/project/${event.project}`}
          className={`text-xs flex-shrink-0 underline-offset-2 hover:underline
            ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          View
        </Link>
      )}

      <time
        dateTime={event.createdAt}
        title={fullDate}
        className={`text-xs flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}
      >
        {timeAgo(event.createdAt)}
      </time>
    </article>
  );
};

export default ProjectEventCard;