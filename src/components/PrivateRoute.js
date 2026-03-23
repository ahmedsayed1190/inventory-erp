import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePermission from "../hooks/usePermission";

function PrivateRoute({ children, module }) {
  const { user } = useAuth();

  const { canView } = usePermission(module || "__public__");

  // ⏳ استنى لحد ما user يتحمل
  if (user === null) {
    return <div>Loading...</div>;
  }

  // ❌ مش مسجل دخول
  if (!user) {
    return <Navigate to="/login" />;
  }

  // صفحات عامة
  if (!module) {
    return children;
  }

  // ❌ مفيش صلاحية
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