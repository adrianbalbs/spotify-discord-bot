import { AxiosRequestConfig } from "axios";

export interface AxiosRequestRetryConfig extends AxiosRequestConfig {
  retry: boolean;
}
