export function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    dev: false,
    app: false,
    logPath: null,
  };

  for (const arg of argv) {
    if (arg === '--dev') options.dev = true;
    else if (arg === '--app') options.app = true;
    else if (!arg.startsWith('--') && !options.logPath) options.logPath = arg;
 }

  return options;
}
