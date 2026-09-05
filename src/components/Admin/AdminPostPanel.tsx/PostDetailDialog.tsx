import { useEffect, useState } from "react";
import { AdminPost, PostReport, PostStatus, ReportStatus } from "../../../interfaces/admin.interfaces";
import UIActionButtonModal from "./UIActionButtonModal";
import { useSwal } from "../../../hooks/useSwal";
import clientAuthAxios from "../../../services/clientAuthAxios";
import { CheckCircleIcon, CloseIcon, DeleteIcon, FileBanIcon, FlagIcon, VisibilityOffIcon } from "../../../utils/iconsUtils";
import UIModal from "../../Global/UIModal";
import UIIconButtonComplex from "../UIIconButtonComplex";
import UIAvatar from "../UIAvatar";
import ReportStatusSelect from "./ReportStatusSelect";
import { avatarBg } from "../../../utils/adminUtils";


const PostDetailDialog = ({
  post,
  dark,
  open,
  onClose,
  onAction,
}: {
  post: AdminPost | null;
  dark: boolean;
  open: boolean;
  onClose: () => void
  onAction: (key: string, postId: string) => void
}) => {
  // copia local de reports para reflejar el cambio de status al instante sin esperar al padre
  const [reports, setReports] = useState<PostReport[]>([])
  const [applyingStatus, setApplyingStatus] = useState<string | null>(null);

  const { showConfirmSwal } = useSwal()

  useEffect(() => {
    setReports(post?.reports ?? [])
  }, [post])

  if (!post) return null


  // change status in local status when success in backend
  const handleReportStatusChanged = (reportId: string, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r))
  }

  // change status and save in db
  const handlePostAction = async (key: string) => {
    setApplyingStatus(key)
    try {
      onAction(key, post._id)
      try {
        await clientAuthAxios.post("/posts/change-post-status", {
          postId: post._id,
          status: key,
        });
        showConfirmSwal({ message: 'Action applied successfully', status: 'success', confirmButton: true, cancelButton: false, });
      } catch (err: any) {
        showConfirmSwal({
          message: err?.response?.data?.message || 'Error applying action',
          status: 'error',
          confirmButton: true,
          cancelButton: false,
        });
      }
      onClose()
    } catch (err) {
      console.log('error cambiando el status del post', err)
    } finally {
      setApplyingStatus(null)
    }
  }

  const TERMINAL_STATUSES: PostStatus[] = ['DELETED', 'DELETED_BY_ADMIN']
  const RECOVERABLE_STATUSES: PostStatus[] = ['HIDDEN', 'HIDDEN_BY_ADMIN', 'BANNED']
  const ACTIONS_POST_MODAL: {
    id: string; // identificador único para el key de React, separado del status
    key: string; // status destino que se manda al servicio
    label: string;
    icon: React.ReactNode;
    disabled: (p: AdminPost) => boolean;
    danger?: boolean
  }[] = [
      {
        id: 'hide',
        key: 'HIDDEN_BY_ADMIN',
        label: 'Hide post',
        icon: <VisibilityOffIcon size={16} />,
        disabled: p => TERMINAL_STATUSES.includes(p.status) || p.status === 'HIDDEN' || p.status === 'HIDDEN_BY_ADMIN' || p.status === 'BANNED',
      },
      {
        id: 'ban',
        key: 'BANNED',
        label: 'Ban post',
        icon: <FileBanIcon size={16} />,
        disabled: p => TERMINAL_STATUSES.includes(p.status) || p.status === 'BANNED',
        danger: true,
      },
      {
        id: 'recuperate',
        key: 'PUBLISHED',
        label: 'Recuperate post',
        icon: <CheckCircleIcon size={16} />,
        disabled: p => TERMINAL_STATUSES.includes(p.status) || !RECOVERABLE_STATUSES.includes(p.status),
      },
      {
        id: 'delete',
        key: 'DELETED_BY_ADMIN',
        label: 'Delete post',
        icon: <DeleteIcon size={16} />,
        disabled: p => TERMINAL_STATUSES.includes(p.status), // ya cubre DELETED y DELETED_BY_ADMIN
        danger: true,
      },
    ];

  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={480}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.4 }}>
            {post.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {post.flagged && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 99, padding: '3px 10px', background: 'rgba(239,68,68,0.1)' }}>
                <span style={{ color: '#dc2626', display: 'flex' }}><FlagIcon size={11} /></span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#dc2626', lineHeight: 1 }}>Flagged</span>
              </span>
            )}
          </div>
        </div>
        <UIIconButtonComplex onClick={onClose} color={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}>
          <CloseIcon size={18} />
        </UIIconButtonComplex>
      </div>

      {/* área con scroll: crece con el contenido, pero no revienta el modal si hay muchos reportes */}
      {/* Contenedor general */}
      <div
        style={{
          padding: '16px 24px 8px',
          maxHeight: '55vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Stats fijos */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 10,
              background: dark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
              padding: 12,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 500,
              }}
            >
              Likes
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 500,
                color: dark ? '#fff' : '#111',
              }}
            >
              {post.likePost.users.length}
            </p>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 10,
              background: dark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,0,0,0.03)',
              padding: 12,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 500,
              }}
            >
              Reports
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 500,
                color: reports.length > 0
                  ? '#dc2626'
                  : dark
                    ? '#fff'
                    : '#111',
              }}
            >
              {reports.length}
            </p>
          </div>
        </div>

        {/* Autor fijo */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <UIAvatar
            name={post.author.name}
            bg={avatarBg(post.author.name)}
            size={28}
            fontSize={12}
          />

          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: dark ? '#fff' : '#111',
              }}
            >
              {post.author.name}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: dark
                  ? 'rgba(255,255,255,0.35)'
                  : 'rgba(0,0,0,0.4)',
              }}
            >
              Author
            </p>
          </div>
        </div>

        <div
          className="reports-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            paddingRight: 4,
          }}
        >
          {reports.length > 0 && (
            <div
              style={{
                borderRadius: 10,
                border: '0.5px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.05)',
                padding: 12,
              }}
            >
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#dc2626',
                }}
              >
                Reports received
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {reports.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      borderRadius: 8,
                      padding: '6px 8px',
                      background: dark
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 500,
                          color: dark ? '#fff' : '#111',
                        }}
                      >
                        {r.reason}
                      </p>

                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: 11,
                          color: dark
                            ? 'rgba(255,255,255,0.35)'
                            : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        Reported by: {r.reportedBy}
                      </p>

                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: 11,
                          color: dark
                            ? 'rgba(255,255,255,0.35)'
                            : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        Type: {r.reasonUserType}
                      </p>

                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: 11,
                          color: dark
                            ? 'rgba(255,255,255,0.35)'
                            : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        Reason: {r.reasonUser}
                      </p>
                    </div>

                    <ReportStatusSelect
                      reportId={r._id}
                      status={r.status}
                      onChanged={handleReportStatusChanged}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
        {ACTIONS_POST_MODAL.filter(a => !a.disabled(post)).map(a => (
          <UIActionButtonModal
            key={a.key}
            icon={a.icon}
            label={a.label}
            danger={a.danger}
            dark={dark}
            onClick={() => handlePostAction(a.key)}
          />
        ))}
      </div>
    </UIModal>
  )
}

export default PostDetailDialog;