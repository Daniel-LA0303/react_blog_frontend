import UISkeleton from "./UISkeleton";

const RowSkeleton = ({ dark }: { dark: boolean }) => (
  <tr style={{ borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)' }}>
    {[60, 80, 70, 110, 40, 80].map((w, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <UISkeleton 
          width={i === 0 ? 32 : w} 
          height={i === 0 ? 32 : 16} 
          dark={dark} 
        />
      </td>
    ))}
  </tr>
)

export default RowSkeleton;