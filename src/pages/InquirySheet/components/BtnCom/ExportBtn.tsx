import React from 'react';
import { Button, Modal } from 'antd';
import { useLocation } from 'umi';
import { exportToAssortment, exportInqLnExcel } from '@/services/InquirySheet';
const ExportBtn: React.FC<{
  selectedRow: any;
  recall?: any;
  inquiryId?: any;
  ExportInquiryCode?: any;
}> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const onExport = () => {
    Modal.confirm({
      title: '确定导出数据？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const inquiryId: any = props.inquiryId;
        const sidList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
        let res = null;
        const path: any = pathParams?.sorurceType || location.pathname.split('/').pop();
        if (path === 'createsku') {
          res = await exportToAssortment({ inquiryId, sidList });
        } else {
          res = await exportInqLnExcel(path, { inquiryId, sidList });
        }
        if (res) {
          const { data, response } = res;
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
              if (resContent.statusCode) {
                Modal.error(resContent.errMsg);
              }
            } catch {
              const el = document.createElement('a');
              el.style.display = 'none';
              el.href = URL.createObjectURL(data);
              console.log(response.headers?.get('content-disposition'), 'filename====');
              // const filename =
              //   response.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1] || '';
              // const path: any = pathParams?.sorurceType || location.pathname.split('/').pop();
              // el.download = path === 'createsku' ? '明细行导出.xlsx' : '明细行导出.xlsx';
              if (['aepcm', 'tepcm', 'ae', 'te'].includes(path)) {
                el.download = `${props.ExportInquiryCode}_AETE选配.xlsx`;
              } else if (['quote', 'sourcing-pcm'].includes(path)) {
                el.download = `${props.ExportInquiryCode}_Sourcing报价.xlsx`;
              } else if (['RFQquote', 'allRFQ'].includes(path)) {
                el.download = `${props.ExportInquiryCode}_实时询价报价.xlsx`;
              } else {
                el.download = '明细行导出.xlsx';
              }
              document.body.append(el);
              el.click();
              window.URL.revokeObjectURL(el.href);
              document.body.removeChild(el);
            }
          };
          reader.readAsText(data);
        }
      },
    });
  };
  return (
    <div>
      <Button size="small" onClick={onExport}>
        导出
      </Button>
    </div>
  );
};
export default ExportBtn;
