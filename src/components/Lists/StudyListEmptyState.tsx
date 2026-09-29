import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const StudyListEmptyState = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <div className={`h-full min-h-[60vh] flex flex-col items-center justify-center gap-1.5 p-10 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
      <p className="text-sm font-medium">Select an item from the list</p>
      <p className="text-xs">Pick a post or quiz on the right to view it here.</p>
    </div>
  )
}

export default StudyListEmptyState