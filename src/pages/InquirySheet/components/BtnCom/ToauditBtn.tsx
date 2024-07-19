import React, { useRef, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { searchFaTransAstSku, submitCheck } from '@/services/InquirySheet';
import { useLocation } from 'umi';
import ReplaceModal from '../ReplaceModal';
const ToauditBtn: React.FC<{
  inquiryId?: any;
  selectedRow?: any;
  recall?: any;
}> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [repalceList, setRepalceList] = useState<any>([]);
  const replaceModalRef = useRef({} as any);

  const handleOk = () => {
    const inquiryId: any = props.inquiryId;
    // const inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    const path: any = pathParams?.sorurceType || location.pathname.split('/').pop();
    let inqLineIdList: any = [];
    if (location.pathname === '/inquiry/ae') {
      props.selectedRow.forEach((e) => {
        inqLineIdList = [...inqLineIdList, ...e.inqLineIds];
      });
    } else {
      inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    }
    Modal.confirm({
      title: '确定提交审核?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        // 判断接口
        // await searchFaTransAstSku(path, {
        //   inquiryId: inquiryId,
        //   inqLineIdList,
        //   button: 'xuanpei-tijiaoshenhe',
        // }).then(async (res: any) => {
        //   if (res?.errCode == 200) {
        //     if (res?.data?.dataList?.length > 0) {
        //       //接下来做是否替换操作
        //       setRepalceList(res?.data?.dataList);
        //       replaceModalRef?.current?.open();
        //     } else {
        //       //原来逻辑
        //       const resd = await submitCheck(path, { inquiryId: inquiryId, inqLineIdList });
        //       if (resd.errCode === 200) {
        //         message.success(resd.data);
        //         if (props?.recall) props?.recall();
        //       } else {
        //         message.error(resd.errMsg);
        //       }
        //     }
        //   } else {
        //     message.error(res?.errMsg);
        //   }
        // });
      },
    });
  };
  return (
    <div>
      <Button
        size="small"
        type="primary"
        onClick={handleOk}
        disabled={!(props.inquiryId || props.selectedRow?.length)}
      >
        提交审核
      </Button>
      <ReplaceModal
        ref={replaceModalRef}
        recall={() => props?.recall()}
        path={pathParams?.sorurceType || location.pathname.split('/').pop()}
        id={props.inquiryId}
        dataList={repalceList}
        subData={props.selectedRow.map((item: any) => item.skuVo?.inqLineId)}
        type={2}
      />
    </div>
  );
};

export default ToauditBtn;
