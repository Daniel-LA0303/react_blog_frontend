import { motion } from 'framer-motion'
import { Icons, NAV_ITEMS } from '../../utils/adminUtils';
import { fadeUp, stagger } from '../../utils/animationsUtils';
import { Link } from 'react-router-dom';

const AdminOverview = ({ dark, userAuth }: { dark: boolean; userAuth: any }) => {

  const currentUserRoles: string[] = (userAuth?.roles ?? []).map((role: any) =>
    typeof role === "string" ? role : role?.name
  );

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.requiredRole || currentUserRoles.includes(item.requiredRole)
  );
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 space-y-8">

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[#2563EB] ${dark ? 'bg-[#2563EB]/15' : 'bg-[#2563EB]/10'}`}>
            {Icons.shield}
          </div>
          <div>
            <h1 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
              Admin panel
            </h1>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Signed in as <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{userAuth?.username}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleNavItems.map((item, i) => (
          <motion.div key={item.to} variants={fadeUp} custom={i}>
            <Link
              to={item.to}
              className={`
                group flex items-start gap-4 p-5 rounded-2xl border
                transition-all duration-200
                ${dark
                  ? 'bg-[#27272A] border-gray-800 hover:border-gray-600'
                  : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${dark ? item.color.dark : item.color.light}`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className={`mt-0.5 text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.desc}
                </p>
              </div>
              <span className={`ml-auto flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5 ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
export default AdminOverview;
