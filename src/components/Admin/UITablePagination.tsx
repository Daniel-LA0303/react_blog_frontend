import { ChevronLeftIcon, ChevronRightIcon } from "../../utils/iconsUtils";
import UIIconButtonComplex from "./UIIconButtonComplex";

const UITablePagination = ({
  count, page, rowsPerPage, onPageChange, dark,
}: {
  count: number; page: number; rowsPerPage: number; onPageChange: (p: number) => void; dark: boolean
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))
  const from = count === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(count, (page + 1) * rowsPerPage)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}>
        {from}–{to} of {count}
      </span>
      <UIIconButtonComplex
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        color={dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
        hoverBg={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
      >
        <ChevronLeftIcon size={18} />
      </UIIconButtonComplex>
      <UIIconButtonComplex
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        color={dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
        hoverBg={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
      >
        <ChevronRightIcon size={18} />
      </UIIconButtonComplex>
    </div>
  )
}

export default UITablePagination;