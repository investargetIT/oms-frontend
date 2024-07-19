import React from 'react';
import { Button, Modal, message } from 'antd';
import { completeLetcy } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';
const LectotypeFinishBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const onOperate = (): boolean => {
    const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    let inqLineIdList: any = [];
    if (location.pathname === '/inquiry/ae') {
      props.selectedRow.forEach((e) => {
        inqLineIdList = [...inqLineIdList, ...e.inqLineIds];
      });
    } else {
      inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    }
    Modal.confirm({
      title: '确定配型完成了?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const temp: any = {};
        if (inqLineIdList?.length) {
          temp.inqLineIdList = inqLineIdList;
        }
        // completeLetcy(path, temp).then((resd: any) => {
        //   if (resd.errCode === 200) {
        //     message.success(resd.errMsg);
        //     if (props.recall) {
        //       props.recall();
        //     }
        //   } else {
        //     message.error(resd.errMsg);
        //   }
        // });
      },
    });
    return true;
  };
  return (
    <Button type="primary" size="small" disabled={!props.selectedRow?.length} onClick={onOperate}>
      选配完成
    </Button>
  );
};

export default LectotypeFinishBtn;
