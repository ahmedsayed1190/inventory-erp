import { useAuth } from "../context/AuthContext";

function usePermission(moduleName) {
  const auth = useAuth();

  if (!auth || !auth.user) {
    return {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false
    };
  }

  const { user } = auth;

  // Admin → كل الصلاحيات
  if (user.isAdmin) {
    return {
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: true
    };
  }

  // تأمين ضد أي شكل داتا غلط
  const permissions =
    user.permissions ||
    JSON.parse(localStorage.getItem("permissions")) ||
    {};

  const modulePermissions = permissions[moduleName] || {};

  return {
    canView: !!modulePermissions.view,
    canAdd: !!modulePermissions.add,
    canEdit: !!modulePermissions.edit,
    canDelete: !!modulePermissions.delete
  };
}

export default usePermission;