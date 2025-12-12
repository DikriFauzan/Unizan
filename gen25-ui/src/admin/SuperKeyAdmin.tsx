import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function SuperKeyAdmin() {
  const [status, setStatus] = useState<any>(null);
  async function fetchStatus() {
    const r = await api.get('/admin/superkey/status');
    setStatus(r.data.superkey);
  }
  useEffect(()=>{ fetchStatus(); }, []);
  return (
    <div style={{padding:20}}>
      <h2>SuperKey Admin</h2>
      <pre style={{background:'#111', color:'#0f0'}}>{JSON.stringify(status, null, 2)}</pre>
      <div style={{marginTop:12}}>
        <button onClick={fetchStatus}>Refresh</button>
      </div>
    </div>
  );
}
