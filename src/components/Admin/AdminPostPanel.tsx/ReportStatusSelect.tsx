import { useState } from "react";
import { ReportStatus } from "../../../interfaces/admin.interfaces";
import { REPORT_CHIP_STYLE, REPORT_LABELS_POST, REPORT_STATUS_OPTIONS } from "../../../utils/adminUtils";
import clientAuthAxios from "../../../services/clientAuthAxios";


const ReportStatusSelect = ({
  reportId,
  status,
  onChanged,
}: {
  reportId: string;
  status: ReportStatus;
  onChanged: (reportId: string, newStatus: ReportStatus) => void;
}) => {
  const [current, setCurrent] = useState<ReportStatus>(status)
  const [saving, setSaving] = useState(false)
  const s = REPORT_CHIP_STYLE[current] || REPORT_CHIP_STYLE.PENDING


  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ReportStatus
    const prev = current
    setCurrent(newStatus) // optimistic update, se ve el cambio al instante
    setSaving(true)
    try {
      console.log('cambiando status del reporte', reportId, '->', newStatus)
      await clientAuthAxios.post("/reports/change-status-report", {
          reportId,
          status: newStatus,
      });
      console.log("succesfully change report status");
      
      onChanged(reportId, newStatus)
    } catch (err) {
      setCurrent(prev) // si falla el request, revierte al estado previo
      console.log('error actualizando el reporte', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={saving}
      style={{
        fontSize: 12, fontWeight: 500, borderRadius: 99, padding: '4px 22px 4px 10px',
        background: s.bg, color: s.color, border: `0.5px solid ${s.border}`,
        cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
        outline: 'none', appearance: 'none',
      }}
    >
      {REPORT_STATUS_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{REPORT_LABELS_POST[opt]}</option>
      ))}
    </select>
  )
}

export default ReportStatusSelect;