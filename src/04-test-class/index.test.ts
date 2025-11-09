import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  BankAccount,
} from '.';

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(100);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const recipientAccount: BankAccount = getBankAccount(0);
    expect(() => account.transfer(200, recipientAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const recipientAccount: BankAccount = getBankAccount(0);
    account.transfer(50, recipientAccount);
    expect(account.getBalance()).toBe(50);
    expect(recipientAccount.getBalance()).toBe(50);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(balance).toBeGreaterThanOrEqual(0);
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = await account.fetchBalance();
    if (newBalance !== null) {
      await account.synchronizeBalance();
      expect(account.getBalance()).toBe(newBalance);
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest
      .spyOn(account, 'fetchBalance')
      .mockImplementationOnce(() => Promise.resolve(null));
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
