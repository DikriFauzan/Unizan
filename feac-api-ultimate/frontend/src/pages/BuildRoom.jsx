import RAGHitsPanel from '../components/rag/RAGHitsPanel';
import React, { useEffect, useState } from "react";
import { connectBuildWS, onBuildEvent, disconnectBuildWS } from "../ws/buildWsClient";
import api from "../api/client";

export default function BuildRoom({ jobId: propJobId }) {
  const [job, setJob] = useState(null);
  const [events, setEvents] = useState([]);

  const jobId = propJobId || new URLSearchParams(location.search).get("jobId");

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      const r = await api.get(`/build/status/${jobId}`);
      setJob(r.data);
    })();

    connectBuildWS(jobId);
    onBuildEvent((ev) => {
      setEvents(prev => [...prev, ev]);
      if (ev.type === "job:progress") setJob(j => ({...j, progress: ev.progress, status: ev.status}));
    });

    return () => disconnectBuildWS();
  }, [jobId]);

  if (!job) return <div>Loading...</div>;

  return (
    <div style={{display:'flex', gap:20, padding:20}}>
      <div style={{flex:1}}>
        <h2>Build: {job.projectName || job.id}</h2>
        <div>Progress: {job.progress}% — Status: {job.status}</div>
        <div style={{marginTop:12}}>
          <div style={{background:'#222', padding:12, borderRadius:8, minHeight:200}}>
            {events.map((e, i) => <div key={i}><small>{e.type}</small> — {JSON.stringify(e.payload)}</div>)}
          </div>
        </div>
      </div>

      <div style={{width:360}}>
        <h3>Files</h3>
        <div style={{background:'#111', padding:12, borderRadius:8}}>
          {job.files?.length ? job.files.map(f => (
            <div key={f.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
              <div>{f.path}</div>
              <div>{f.status === 'done' ? '✅' : (f.status==='running'?'⏳':'◻️')}</div>
            </div>
          )) : <div>No files yet</div>}
        </div>
      </div>
    </div>
  );
}
