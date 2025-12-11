import { FEACRuntimeBridge } from './feac_runtime_bridge';

async function main() {
  const url = process.env.SUPERKEY_URL || '';
  const token = process.env.SUPERKEY_TOKEN || '';

  if (!url || !token) {
    console.error('Missing SUPERKEY_URL or SUPERKEY_TOKEN');
    process.exit(1);
  }

  const feac = new FEACRuntimeBridge(url, token);

  // Test call
  const resp = await feac.call('owner.bypass', [], { test: true });
  console.log(JSON.stringify(resp, null, 2));
}

main();
