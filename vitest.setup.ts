import 'dotenv/config';
import 'reflect-metadata';
import { afterEach, beforeAll, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01:T00:00:00Z'));
});
