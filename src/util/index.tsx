// 自定义校验数值（>0）
export function validatePriceBase(record: any, value: any) {
  if (!value && value !== 0 && record.required) {
    return Promise.reject(`${record.message}必填`);
  }
  if (value < 0 || value === 0) {
    return Promise.reject(`${record.message}不能等于或者小于0`);
  } else {
    return Promise.resolve();
  }
}
// 自定义校验税收分类编码
export function validateTaxNo(record: any, value: string) {
  if (!value) {
    return Promise.resolve();
  }
  if (value.length !== 19 || !/^[0-9]*$/g.test(value)) {
    return Promise.reject(`${record.message}只能包含19位数字`);
  } else {
    return Promise.resolve();
  }
}
