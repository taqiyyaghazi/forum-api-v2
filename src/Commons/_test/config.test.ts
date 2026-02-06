import dotenv from 'dotenv';
import { describe, expect, it, vi } from 'vitest';
import config from '../config.js';

describe('config', () => {
  it('should verify config variables', () => {
    // Assert
    expect(config.app.host).toBeDefined();
    expect(config.app.port).toBeDefined();
    expect(config.app.debug).toBeDefined();

    expect(config.database.host).toBeDefined();
    expect(config.database.port).toBeDefined();
    expect(config.database.user).toBeDefined();
    expect(config.database.password).toBeDefined();
    expect(config.database.database).toBeDefined();

    expect(config.auth.jwtStrategy).toBe('forumapi');
    expect(config.auth.accessTokenKey).toBeDefined();
    expect(config.auth.refreshTokenKey).toBeDefined();
    expect(config.auth.accessTokenAge).toBeDefined();
  });

  it('should load default .env when NODE_ENV is not test', async () => {
    // Arrange
    const spy = vi.spyOn(dotenv, 'config');
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    vi.resetModules();

    // Action
    await import('../config.js');

    // Assert
    expect(spy).toHaveBeenCalledWith();

    // Cleanup
    process.env.NODE_ENV = originalEnv;
    spy.mockRestore();
  });

  it('should use correct host and default port when in production and PORT is undefined', async () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    const originalPort = process.env.PORT;

    process.env.NODE_ENV = 'production';
    delete process.env.PORT;

    vi.resetModules();

    // Action
    const { default: configProd } = await import('../config.js');

    // Assert
    expect(configProd.app.host).toBe('0.0.0.0');
    expect(configProd.app.port).toBe(5000);

    // Cleanup
    process.env.NODE_ENV = originalEnv;
    process.env.PORT = originalPort;
  });

  it('should use custom port when PORT is defined', async () => {
    // Arrange
    const originalPort = process.env.PORT;
    process.env.PORT = '3000';
    vi.resetModules();

    // Action
    const { default: configCustomPort } = await import('../config.js');

    // Assert
    expect(configCustomPort.app.port).toBe(3000);

    // Cleanup
    process.env.PORT = originalPort;
  });
});
