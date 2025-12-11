import * as fs from "fs";
import * as path from "path";

export function scanAllMemory() {
  const root = process.cwd();
  const runtime = path.join(root, "runtime");
  
  if (!fs.existsSync(runtime)) return { error: "runtime-missing" };
  
  const files = fs.readdirSync(runtime);
  const result = files.map(f => {
    const full = path.join(runtime, f);
    const stat = fs.statSync(full);
    return {
      name: f,
      size: stat.size,
      type: stat.isDirectory() ? "dir" : "file"
    };
  });
  
  return { location: runtime, files: result };
}
