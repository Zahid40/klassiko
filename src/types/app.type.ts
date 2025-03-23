export type ApiResponseType = {
  success: boolean;
  status: number;
  message: string;
  data?: any;
  page?: {
    total: number;
    current: number;
    size: number;
  };
};
