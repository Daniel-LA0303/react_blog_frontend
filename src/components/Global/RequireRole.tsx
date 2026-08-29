
import { Navigate, Outlet } from "react-router-dom";
import useUserAuthContext from "../../context/hooks/useUserAuthContext";


interface RequireRoleProps {
    allowedRoles: string[];
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
    const { userAuth } = useUserAuthContext();

    const roles: string[] = (userAuth?.roles ?? []).map((role: any) =>
        typeof role === "string" ? role : role?.name
    );

    // No autenticado en absoluto -> a login
    if (!userAuth?.userAuthToken) {
        return <Navigate to="/login" replace />;
    }

    // Autenticado pero sin el rol requerido -> a una página de "no autorizado" (o home)
    const hasAccess = roles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};