#!/usr/bin/env node
import { getContainer } from './services/container.js';
import { startServer } from './server.js';

async function main(): Promise<void> {
  const container = getContainer();
  container.initialize();
  await startServer(container);
}

main().catch((error: unknown) => {
  console.error('Failed to start VRChat Udon MCP server:', error);
  process.exit(1);
});
