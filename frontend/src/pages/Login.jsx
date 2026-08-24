import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" }); const [error, setError] = useState("");
  const submit = async (event) => { event.preventDefault(); try { await login(values); navigate("/dashboard"); } catch (err) { setError(err.message); } };
  return <AuthLayout title="ACCESS TERMINAL" subtitle="Authenticate to resume your forge session."><form onSubmit={submit} className="mt-7 space-y-4"><Input label="EMAIL" type="email" value={values.email} onChange={(email) => setValues({ ...values, email })}/><Input label="PASSWORD" type="password" value={values.password} onChange={(password) => setValues({ ...values, password })}/>{error && <p className="text-xs text-red-400">{error}</p>}<button className="w-full bg-cyan-300 py-3 text-xs font-extrabold tracking-[.2em] text-slate-950">LOGIN</button><p className="text-center text-xs text-slate-600">New operator? <Link to="/register" className="text-cyan-300">Create profile</Link></p></form></AuthLayout>;
}
export const Input = ({ label, ...props }) => <label className="block"><span className="font-mono text-[10px] tracking-[.18em] text-slate-500">{label}</span><input required {...props} onChange={(event) => props.onChange(event.target.value)} className="mt-2 w-full border border-white/10 bg-white/[.025] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"/></label>;
export const AuthLayout = ({ title, subtitle, children }) => <main className="grid min-h-[calc(100vh-65px)] place-items-center px-5"><section className="glass w-full max-w-md p-7 shadow-neon"><LockKeyhole className="text-cyan-300" size={22}/><h1 className="mt-5 font-mono text-xl font-bold tracking-[.1em] text-white">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>{children}</section></main>;
