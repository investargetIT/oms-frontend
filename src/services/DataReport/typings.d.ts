// @ts-ignore
/* eslint-disable */

declare namespace DataReport {
  type auditFormParams = {
    type?: string;
    endTime: number;
  };
  type auditFormList = {
    CustomerName?: string;
    name?: string;
    gpRate?: string;
    amount?: string;
    instanceId?: string;
    CustomerCode?: string;
    startUser?: string;
    endTime?: string;
    startTime?: string;
  };
  type auditFormResult = {
    errMsg?: string;
    statusCode?: number;
    data?: { data: Array<auditFormList> };
  };
}
