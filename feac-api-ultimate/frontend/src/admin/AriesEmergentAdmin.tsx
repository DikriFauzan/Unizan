import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AriesEmergentAdmin() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/emer/status");
        setStatus(r.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <h2>Aries Emergent Engine — Status</h2>
      <div>
        <h3>Short-term (recent events)</h3>
        <pre style={{background:"#111", color:"#dcdcdc", padding:12}}>
          {JSON.stringify(status?.shortTerm || [], null, 2)}
        </pre>
        <h3>Long-term count</h3>
        <div>{status?.longTermCount ?? "n/a"}</div>
      </div>
    </div>
  );
}
