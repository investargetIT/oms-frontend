import React, { useRef, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { complete, searchFaTransAstSku, RFQsubmitCheckList } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';
import RebackModal from '../RebackModal';
const QuoteBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [repalceList, setRepalceList] = useState<any>([]);
  const rebackModalRef = useRef({} as any);

  const onOperate = (): any => {
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    const res: any = {};
    const inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    if (inqLineIdList && inqLineIdList.length > 0) {
      res.inqLineIdList = inqLineIdList;
    }
    Modal.confirm({
      title: '确定完成报价?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        if (['RFQquote', 'allRFQ'].includes(path)) {
          await RFQsubmitCheckList(res).then(async (respons: any) => {
            if (respons.errCode === 200) {
              message.success('报价成功!');
              if (props.recall) {
                props.recall();
              } else {
                history.go(-1);
              }
            } else {
              message.error(respons.errMsg);
            }
          });
        } else {
          res.button = 'baojia-tijiaobaojia';
          await searchFaTransAstSku(path, res).then(async (res1: any) => {
            if (res1?.errCode == 200) {
              if (res1?.data?.dataList?.length > 0) {
                setRepalceList(res1?.data?.dataList);
                rebackModalRef?.current?.open();
                //接下来做是否替换操作
              } else {
                // 原来逻辑
                await complete(path, res).then((resd: any) => {
                  if (resd.errCode === 200) {
                    message.success('报价成功!');
                    if (props.recall) {
                      props.recall();
                    } else {
                      history.go(-1);
                    }
                  } else {
                    message.error(resd.errMsg);
                  }
                });
              }
            } else {
              message.error(res1?.errMsg);
            }
          });
        }
        // 判断接口 souring报价
      },
    });
  };
  return (
    <div>
      <Button size="small" type="primary" disabled={!props.selectedRow?.length} onClick={onOperate}>
        提交报价
      </Button>
      {/* sourcing报价提交报价的时 */}
      <RebackModal
        ref={rebackModalRef}
        path={pathParams?.sorurceType || location.pathname.split('/').pop()}
        id={props.inquiryId}
        dataList={repalceList}
        subData={props.selectedRow.map((item: any) => item.skuVo?.inqLineId)}
        type={2}
        tableRefresh={() => props.recall()}
      />
    </div>
  );
};
export default QuoteBtn;
