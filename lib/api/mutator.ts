import { AxiosRequestConfig } from 'axios';

import axiosInstance from './axios-instance';

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};
