export function logJSON(level: string, msg: string, meta: any = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    meta
  };
  // Use console.log (stdout) so docker / journald can capture
  console.log(JSON.stringify(entry));
}
