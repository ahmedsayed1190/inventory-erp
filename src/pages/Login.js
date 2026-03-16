import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(username, password);
    if (!success) {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320,
          padding: 20,
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 20 }}>
          Inventory ERP
        </h3>

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>
            {error}
          </div>
        )}

        <input
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 15, padding: 8 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#2c3e50",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}

export default Login;