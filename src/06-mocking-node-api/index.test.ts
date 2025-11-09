import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(() => Promise.resolve('file content')),
}));

jest.mock('path', () => ({
  join: jest.fn(() => 'path/to/file'),
}));

describe('doStuffByTimeout', () => {
  let callback: () => void;

  beforeAll(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let callback: () => void;

  beforeAll(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    (readFile as unknown as jest.Mock<Promise<string>>).mockResolvedValue(
      'file content',
    );
    (existsSync as jest.Mock<boolean>).mockReturnValue(true);
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'path/to/file';
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledTimes(1);
    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.MockedFunction<typeof existsSync>).mockReturnValueOnce(
      false,
    );
    const result = await readFileAsynchronously('path/to/file');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const result = await readFileAsynchronously('path/to/file');
    expect(result).toBe('file content');
  });
});
