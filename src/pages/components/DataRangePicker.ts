import moment from 'moment';
export const rangesOption: any[] = {
  今天: [moment(), moment()],
  最近7天: [moment().subtract(6, 'days'), moment()],
  最近30天: [moment().subtract(29, 'days'), moment()],
  最近三个月: [moment().subtract(3, 'month'), moment()],
  本周: [moment().startOf('week'), moment().endOf('week')],
  本月: [moment().startOf('month'), moment().endOf('month')],
  今年: [moment().startOf('year'), moment().endOf('year')],
};
