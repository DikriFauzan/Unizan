import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminBilling() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        const res = await api.get("/admin/billing/users");
        setUsers(res.data.users);
    };

    const updateQuota = async (id: string) => {
        const amount = prompt("Set new quota:");
        if (!amount) return;
        await api.post("/admin/billing/quota/adjust", { userId: id, amount: Number(amount) });
        loadUsers();
    };

    const topup = async (id: string) => {
        const amount = prompt("Topup amount:");
        if (!amount) return;
        await api.post("/admin/billing/topup", { userId: id, amount: Number(amount) });
        loadUsers();
    };

    useEffect(() => { loadUsers(); }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Billing Dashboard</h2>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Quota</th>
                        <th>Used</th>
                        <th>Tier</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id}>
                            <td>{u.email}</td>
                            <td>{u.quota}</td>
                            <td>{u.used}</td>
                            <td>{u.tier}</td>
                            <td>
                                <button onClick={() => updateQuota(u.id)}>Set Quota</button>
                                <button onClick={() => topup(u.id)} style={{ marginLeft: 10 }}>
                                    Top Up
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
