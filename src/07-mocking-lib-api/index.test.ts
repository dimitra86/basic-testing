import { AxiosInstance } from 'axios';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  let axiosClient: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    jest.resetModules();

    axiosClient = {
      get: jest.fn(),
      request: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;
  });

  afterEach(async () => {
    const mod = (await import('./index')) as typeof import('./index');
    mod.throttledGetDataFromApi.cancel?.();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should perform request to correct provided url', async () => {
    const mod = (await import('./index')) as typeof import('./index');
    mod.__setAxiosClientForTest(axiosClient);

    const relativePath = '/posts';
    axiosClient.get.mockResolvedValue({ data: [] });

    await mod.throttledGetDataFromApi(relativePath);

    expect(axiosClient.get).toHaveBeenCalledTimes(1);
    expect(axiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const mod = (await import('./index')) as typeof import('./index');
    mod.__setAxiosClientForTest(axiosClient);

    const relativePath = '/posts';
    const responseData = [{ id: 1, title: 'Post 1' }];

    axiosClient.get.mockResolvedValue({ data: responseData });

    const result = await mod.throttledGetDataFromApi(relativePath);
    expect(result).toEqual(responseData);
  });

  test('should throttle requests (second call executed after THROTTLE_TIME)', async () => {
    jest.useFakeTimers();
    const mod = (await import('./index')) as typeof import('./index');
    mod.__setAxiosClientForTest(axiosClient);

    const relativePath = '/posts';
    axiosClient.get.mockResolvedValue({ data: [] });

    const p1 = mod.throttledGetDataFromApi(relativePath);

    const p2 = mod.throttledGetDataFromApi(relativePath);

    await Promise.resolve();

    expect(axiosClient.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(mod.THROTTLE_TIME);

    await Promise.resolve();

    await Promise.all([p1, p2]);

    expect(axiosClient.get).toHaveBeenCalledTimes(2);
  });
});
