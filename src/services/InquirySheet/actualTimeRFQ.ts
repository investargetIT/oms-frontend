import request from '../request';
//实时询价价格计算
export async function RFQgetCalculatePrice(data: any) {
  return request<any>('/omsapi/inqLn/RTQQuote/getCalculatePrice', {
    method: 'POST',
    data,
  });
}

//实时询价批量提交
export async function RFQsubmitCheckList(data: any) {
  return request<any>('/omsapi/inqLn/RTQQuote/submitCheckList', {
    method: 'POST',
    data,
  });
}

//实时询价报价提交
export async function RFQsubmitCheck(data: any) {
  return request<any>('/omsapi/inqLn/RTQQuote/submitCheck', {
    method: 'POST',
    data,
  });
}

//实时询价报价保存
export async function RFQsaveCheck(data: any) {
  return request<any>('/omsapi/inqLn/RTQQuote/save', {
    method: 'POST',
    data,
  });
}
