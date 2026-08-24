import { Activity, LogOut, Menu, Shield, Swords, X, Zap } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) => `text-xs font-bold uppercase tracking-[.18em] transition ${isActive ? "text-cyan-300" : "text-slate-500 hover:text-slate-200"}`;
export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-[#05080f]/85 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-[.18em] text-cyan-300"><Zap size={17}/> TYPOTOXIC</Link>
      <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={`${open ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-5 border-b border-cyan-400/10 bg-[#070c15] p-5 md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}>
        <NavLink className={navClass} to="/training" onClick={() => setOpen(false)}><span className="flex items-center gap-2"><Swords size={14}/>Training</span></NavLink>
        {user && <NavLink className={navClass} to="/dashboard" onClick={() => setOpen(false)}><span className="flex items-center gap-2"><Activity size={14}/>Command Center</span></NavLink>}
        {user ? <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-slate-500 hover:text-red-300" onClick={logout}><LogOut size={14}/>Logout</button> :
          <NavLink className={navClass} to="/login"><span className="flex items-center gap-2"><Shield size={14}/>Login</span></NavLink>}
      </nav>
    </div>
  </header>;
}
