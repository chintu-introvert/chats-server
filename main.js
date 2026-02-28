import logger from './src/utils/logger.js';

import('./src/server.js').catch(err => {
  logger.error('Failed to boot server process', String(err));
  process.exit(1);
});
