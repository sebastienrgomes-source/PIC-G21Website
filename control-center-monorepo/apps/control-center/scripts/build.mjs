import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');

const child = spawn(process.execPath, [nextCli, 'build', '--no-lint'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_IGNORE_INCORRECT_LOCKFILE: '1',
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
