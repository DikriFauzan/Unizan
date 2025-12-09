import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleGate({ role, children }: any) {
    const { user } = useContext(AuthContext);

    if (!user) return <div>Not logged in.</div>;
    if (user.role !== role) return <div>Access denied.</div>;

    return children;
}
