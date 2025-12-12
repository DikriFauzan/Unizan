import React, { useState } from "react";
import { FEAC } from "../api/feac";

export default function Register() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

    async function submit() {
        try {
            const r = await FEAC.auth.register(email, pass);
            setMsg("Registered.");
        } catch (e: any) {
            setMsg(e.response?.data?.error || "Register error");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Register</h2>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <br/><br/>
            <input placeholder="password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
            <br/><br/>
            <button onClick={submit}>Register</button>
            <div>{msg}</div>
        </div>
    );
}
