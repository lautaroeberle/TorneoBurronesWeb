import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [usuario, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === "daniel" && pass === "santi") {
      localStorage.setItem("admin", "true");
      navigate("/admin/panel");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login">
      <h2>Login Administrador</h2>
      <form onSubmit={handleLogin}>
        <input
          type="user"
          placeholder="Usuario"
          value={usuario}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
