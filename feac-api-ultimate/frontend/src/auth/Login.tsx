import React, { useContext, useState } from "react";
import { FEAC } from "../api/feac";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

    async function submit() {
        try {
            const r = await FEAC.auth.login(email, pass);
            login(r.data.token, r.data.user);
            setMsg("Logged in.");
        } catch (e: any) {
            setMsg(e.response?.data?.error || "Login error");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Login</h2>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <br/><br/>
            <input placeholder="password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
            <br/><br/>
            <button onClick={submit}>Login</button>
            <div>{msg}</div>
        </div>
    );
}
