import cluster from 'cluster';
import os from 'os';
import logger from './src/utils/logger.js';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  logger.info(`[Master] PID ${process.pid} is running. Forking for ${numCPUs} CPUs...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`[Worker] PID ${worker.process.pid} died. Spinning up a new worker...`);
    cluster.fork();
  });
} else {
  // Workers handle Express initialization via the side-effect of importing server.js
  import('./src/server.js').catch(err => {
    logger.error('Failed to boot Worker process', String(err));
    process.exit(1);
  });
}
