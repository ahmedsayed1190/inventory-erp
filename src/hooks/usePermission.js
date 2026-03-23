import { useAuth } from "../context/AuthContext";

function usePermission(moduleName) {
  const { user } = useAuth();

  // ❌ مش مسجل دخول
  if (!user) {
    return {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false
    };
  }

  // ✅ Admin → كل الصلاحيات
  if (user.isAdmin) {
    return {
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: true
    };
  }

  // ✅ صلاحيات المستخدم
  const modulePermissions = user.permissions?.[moduleName] || {};

  return {
    canView: !!modulePermissions.view,
    canAdd: !!modulePermissions.add,
    canEdit: !!modulePermissions.edit,
    canDelete: !!modulePermissions.delete
  };
}

export default usePermission;