import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminUser, PostReport, ReportStatus } from "../../../interfaces/admin.interfaces";
import UIAvatar from "../UIAvatar";
import { CloseIcon } from "../../../utils/iconsUtils";
import { avatarColorForRoles, initials } from "../../../utils/adminUtils";
import { useSwal } from "../../../hooks/useSwal";
import ReportStatusSelect from "../AdminPostPanel.tsx/ReportStatusSelect";

// Standardized icons or substitute with your project icons
import {
  VerifiedUserIcon,
  ManageAccountsIcon,
  PersonRemoveIcon,
  BlockIcon,
  CheckCircleIcon,
} from "../../../utils/iconsUtils"; 
import useUserAuthContext from "../../../context/hooks/useUserAuthContext";
import clientAuthAxios from "../../../services/clientAuthAxios";

interface ReportsUserModalProps {
  user: AdminUser;
  dark: boolean;
  onClose: () => void;
  fetchUsers?: () => void; // Optional callback to refresh parent user list
}

const ReportsUserModal = ({
  user,
  dark,
  onClose,
  fetchUsers,
}: ReportsUserModalProps) => {
  const [reports, setReports] = useState<PostReport[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const { showConfirmSwal } = useSwal();
  const { userAuth } = useUserAuthContext();

  useEffect(() => {
    const formattedReports: PostReport[] = user.reports.map((r: any) => ({
      ...r,
      createdAt: r.createdAt || r.created_at || new Date().toISOString(),
      reasonUserType: r.reasonUserType || '',
      reasonUser: r.reasonUser || r.reason || '',
    }));
    setReports(formattedReports);
  }, [user]);

  // Handle report status update locally
  const handleReportStatusChanged = (reportId: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
    );
  };

  // Viewer role checks
  const viewerRoles: string[] = (userAuth?.roles ?? []).map((r: any) =>
    typeof r === "string" ? r : r?.name
  );
  const viewerIsAdmin = viewerRoles.includes("ROLE_ADMIN");
  const viewerIsMod = viewerRoles.includes("ROLE_MOD");

  const canVerify = viewerIsAdmin || viewerIsMod;
  const canBan = viewerIsAdmin;
  const canAddMod = viewerIsAdmin || viewerIsMod;
  const canQuitMod = viewerIsAdmin;
  const canUnban = viewerIsAdmin || viewerIsMod;

  // Target user checks
  const targetIsMod = user?.roles?.map((r: any) => r?.name || r).includes("ROLE_MOD");
  const isBanned = user?.status === "BANNED";

  // Actions list configuration
  const actions: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    disabled: boolean;
    danger?: boolean;
  }[] = [
    {
      key: "verify",
      label: "Verify user",
      icon: <VerifiedUserIcon size={16} />,
      disabled: Boolean(user?.confirm) || !canVerify,
    },
    {
      key: "makeMod",
      label: "Make moderator",
      icon: <ManageAccountsIcon size={16} />,
      disabled: targetIsMod || !canAddMod,
    },
    {
      key: "removeRole",
      label: "Remove role",
      icon: <PersonRemoveIcon size={16} />,
      disabled: !targetIsMod || !canQuitMod,
    },
    {
      key: "ban",
      label: "Ban user",
      icon: <BlockIcon size={16} />,
      disabled: isBanned || !canBan,
      danger: true,
    },
    {
      key: "unban",
      label: "Unban user",
      icon: <CheckCircleIcon size={16} />,
      disabled: !isBanned || !canUnban,
    },
  ];

  // Execute admin action on the current modal user
  const handleAction = async (actionKey: string, userId: string) => {
    const endpoints: Record<string, string> = {
      verify: "/users/verify-user",
      makeMod: "/users/create-mod",
      removeRole: "/users/remove-mod",
      ban: "/users/ban-user",
      unban: "/users/unban-user",
    };

    const endpoint = endpoints[actionKey];
    if (!endpoint) return;

    try {
      setLoadingAction(actionKey);
      await clientAuthAxios.post(endpoint, { userId });
      
      showConfirmSwal({
        message: "Action applied successfully",
        status: "success",
        confirmButton: true,
        cancelButton: false,
      });

      onClose();
      if (fetchUsers) fetchUsers();
    } catch (err: any) {
      showConfirmSwal({
        message: err?.response?.data?.message || "Error applying action",
        status: "error",
        confirmButton: true,
        cancelButton: false,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className={dark ? "bg-[#1c1c1e]" : "bg-white"}
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 16,
            padding: 20,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <UIAvatar
                src={user.profilePicture?.secure_url || undefined}
                name={initials(user.name)}
                bg={avatarColorForRoles(user.roles.map((r) => r.name))}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 500,
                    color: dark ? "#fff" : "#111",
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                  }}
                >
                  {user.reportsCount} report{user.reportsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Action Buttons Toolbar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: dark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {actions.map((act) => (
              <button
                key={act.key}
                disabled={act.disabled || loadingAction === act.key}
                onClick={() => handleAction(act.key, user._id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: act.disabled ? "not-allowed" : "pointer",
                  opacity: act.disabled ? 0.4 : 1,
                  border: "none",
                  background: act.danger
                    ? "rgba(220, 38, 38, 0.12)"
                    : dark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  color: act.danger
                    ? "#ef4444"
                    : dark
                    ? "#fff"
                    : "#333",
                  transition: "background 0.2s ease",
                }}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            ))}
          </div>

          {/* Reports List */}
          <div
            className="reports-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {reports.length > 0 ? (
              <div
                style={{
                  borderRadius: 10,
                  border: "0.5px solid rgba(239,68,68,0.2)",
                  background: "rgba(239,68,68,0.05)",
                  padding: 12,
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#dc2626",
                  }}
                >
                  Reports received
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {reports.map((r) => (
                    <div
                      key={r._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        borderRadius: 8,
                        padding: "6px 8px",
                        background: dark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 500,
                            color: dark ? "#fff" : "#111",
                          }}
                        >
                          {r.reason}
                        </p>

                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: dark
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(0,0,0,0.4)",
                          }}
                        >
                          Reported by: {r.reportedBy}
                        </p>

                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: dark
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(0,0,0,0.4)",
                          }}
                        >
                          Type: {r.reasonUserType}
                        </p>

                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 11,
                            color: dark
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(0,0,0,0.4)",
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
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                No active reports found for this user.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportsUserModal;