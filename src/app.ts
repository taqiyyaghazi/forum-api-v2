import config from './Commons/config.js';
import container from './Infrastructures/container.js';
import createServer from './Infrastructures/http/createServer.js';

const start = async (): Promise<void> => {
  const app = await createServer(container);
  const { host, port } = config.app;

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
};

start();
