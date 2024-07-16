import request from '../request';
export async function approvalProcess(
  body: DataReport.auditFormParams,
  options?: { [key: string]: any },
) {
  return request<DataReport.auditFormResult>('/report/approvalProcess', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}
export async function approvalProcessExcelTemp(body: DataReport.auditFormParams) {
  return request<{ data: Blob; response: Response }>('/report/approvalProcessExcelTemp', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
export async function getDatalist(data: any) {
  return request<any>('/reportapi/openso/getDatalist', {
    method: 'POST',
    data,
  });
}
