import { simpleCalculator, Action, RawCalculatorInput } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 4, b: 2, action: Action.Subtract, expected: 2 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 8, b: 2, action: Action.Subtract, expected: 6 },
  { a: 1, b: 2, action: Action.Multiply, expected: 2 },
  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 4, b: 5, action: Action.Multiply, expected: 20 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'simpleCalculator($a, $b, $action) = $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 1, b: 2, action: '%' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({ a: 'one', b: 2, action: Action.Add });
    expect(result).toBeNull();
  });

  test('should handle division by zero', () => {
    const result = simpleCalculator({ a: 10, b: 0, action: Action.Divide });
    expect(result).toBe(Infinity);
  });

  test('should return null for undefined input', () => {
    const result = simpleCalculator(undefined as unknown as RawCalculatorInput);
    expect(result).toBeNull();
  });

  test('should return null for null input', () => {
    const result = simpleCalculator(null as unknown as RawCalculatorInput);
    expect(result).toBeNull();
  });

  test('should return null for empty object input', () => {
    const result = simpleCalculator({
      a: undefined,
      b: undefined,
      action: undefined,
    });
    expect(result).toBeNull();
  });
});
