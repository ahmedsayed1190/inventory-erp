import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePermission from "../hooks/usePermission";

function PrivateRoute({ children, module }) {
  const { user } = useAuth();

  // ننادي الهوك دايمًا
  const { canView } = usePermission(module || "__public__");

  // مش مسجل دخول
  if (!user) {
    return <Navigate to="/login" />;
  }

  // لو صفحة عامة بعد تسجيل الدخول
  if (!module) {
    return children;
  }

  // فحص الصلاحية
  if (!canView) {
    return (
      <div className="alert alert-danger">
        🚫 ليس لديك صلاحية دخول هذه الصفحة
      </div>
    );
  }

  return children;
}

export default PrivateRoute;