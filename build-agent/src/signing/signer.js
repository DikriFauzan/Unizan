/**
 * signer.js - placeholder signing logic
 * Real signing requires Android sdk build-tools (apksigner/jarsigner) and JKS keystore.
 * This is a stub that copies the unsigned APK to a signed filename for pipeline testing.
 * Marked: butuh riset lanjutan.
 */
const fs = require("fs");
const path = require("path");

exports.signApk = async function(apkPath, keystoreData, alias) {
  const signed = apkPath.replace(".apk", "_signed.apk");
  fs.copyFileSync(apkPath, signed);
  return signed;
};
