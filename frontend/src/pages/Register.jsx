import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout, Input } from "./Login";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" }); const [error, setError] = useState("");
  const submit = async (event) => { event.preventDefault(); try { await register(values); navigate("/dashboard"); } catch (err) { setError(err.message); } };
  return <AuthLayout title="CREATE OPERATOR" subtitle="Initialize your profile. Every session will sharpen the model."><form onSubmit={submit} className="mt-7 space-y-4"><Input label="CODENAME" value={values.name} onChange={(name) => setValues({ ...values, name })}/><Input label="EMAIL" type="email" value={values.email} onChange={(email) => setValues({ ...values, email })}/><Input label="PASSWORD (6+ CHARACTERS)" type="password" minLength="6" value={values.password} onChange={(password) => setValues({ ...values, password })}/>{error && <p className="text-xs text-red-400">{error}</p>}<button className="w-full bg-cyan-300 py-3 text-xs font-extrabold tracking-[.2em] text-slate-950">INITIALIZE</button><p className="text-center text-xs text-slate-600">Already registered? <Link to="/login" className="text-cyan-300">Log in</Link></p></form></AuthLayout>;
}
