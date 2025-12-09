exports.logJSON = function(level, msg, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    meta
  };
  console.log(JSON.stringify(entry));
};
