import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'Hello, World!';
    const result = await resolveValue(value);
    expect(result).toBe(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect.assertions(1);
    try {
      throwError('Something went wrong!');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Something went wrong!');
      } else {
        fail('Expected an instance of Error');
      }
    }
  });

  test('should throw error with default message if message is not provided', () => {
    expect.assertions(1);
    try {
      throwError();
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('Oops!');
      } else {
        fail('Expected an instance of Error');
      }
    }
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect.assertions(1);
    try {
      throwCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
