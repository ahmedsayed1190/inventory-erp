import usePermission from "../hooks/usePermission";

function PermissionRoute({ module, children }) {
  const { canView } = usePermission(module);

  if (!canView) {
    return (
      <div className="alert alert-danger">
        🚫 ليس لديك صلاحية الدخول إلى هذه الصفحة
      </div>
    );
  }

  return children;
}

export default PermissionRoute;