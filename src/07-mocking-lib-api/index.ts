import axios, { AxiosInstance } from 'axios';
import { throttle } from 'lodash';

export const THROTTLE_TIME = 5000;

let axiosClient: AxiosInstance | null = null;
export const __setAxiosClientForTest = (client: AxiosInstance) => {
  axiosClient = client;
};

const getClient = (): AxiosInstance => {
  if (!axiosClient) {
    axiosClient = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  }
  return axiosClient;
};

const getDataFromApi = async (relativePath: string) => {
  const client = getClient();
  const response = await client.get(relativePath);
  return response.data;
};

export const throttledGetDataFromApi = throttle(getDataFromApi, THROTTLE_TIME, {
  leading: true,
  trailing: true,
});
