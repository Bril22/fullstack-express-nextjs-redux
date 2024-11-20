export interface ResponseDataInterface<DATA> {
    datas?: DATA[];
    data?: DATA;
  }

export interface ResponseInterface<DATA> {
    statusCode: number;
    message: string;
    data?: ResponseDataInterface<DATA>;
  }