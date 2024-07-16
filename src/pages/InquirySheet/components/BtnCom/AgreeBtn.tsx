import React, { useRef, useState } from 'react';
import { Button, Modal, message } from 'antd';
import {
  pcmApprove,
  pcdApprove,
  sourcingPcmApprove,
  searchFaTransAstSku,
} from '@/services/InquirySheet';
import { useLocation } from 'umi';
import RebackModal from '../RebackModal';
const AgreeBtn: React.FC<{ selectedRow: any; inquiryId?: any; recall?: any; checkVal?: any }> = (
  props: any,
) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [repalceList, setRepalceList] = useState<any>([]);
  const rebackModalRef = useRef({} as any);

  const onOperate = (): boolean => {
    const path: any = pathParams?.sorurceType || location.pathname.split('/').pop();
    if (!props.selectedRow?.length && !props.inquiryId) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    const inqLineIdList: any = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    Modal.confirm({
      title: '确定审核通过?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const temp: any = {};
        // if (inqLineIdList?.length) {
        //   temp.inqLineIdList = inqLineIdList;
        // } else {
        //   temp.inquiryId = props.inquiryId;
        // }
        if (inqLineIdList?.length) {
          temp.inqLineIdList = inqLineIdList;
        }
        temp.inquiryId = props.inquiryId;

        let resd = null;
        if (['aepcm', 'tepcm'].includes(path)) {
          // 判断接口 一下类似
          if (path == 'aepcm') {
            temp.button = 'aepcm-shenhetongguo';
          } else if (path == 'tepcm') {
            temp.button = 'tepcm-shenhetongguo';
          }
          await searchFaTransAstSku(path, temp).then(async (res: any) => {
            if (res?.errCode == 200) {
              if (res?.data?.dataList?.length > 0) {
                setRepalceList(res?.data?.dataList);
                rebackModalRef?.current?.open();
                //接下来做是否替换操作
              } else {
                //原来逻辑
                resd = await pcmApprove(path, temp);
              }
            } else {
              message.error(res?.errMsg);
            }
          });
        } else if (path === 'sourcing-pcm') {
          // 判断接口 一下类似
          temp.button = 'sourcingpcm-shenhetongguo';
          await searchFaTransAstSku(path, temp).then(async (res: any) => {
            if (res?.errCode == 200) {
              if (res?.data?.dataList?.length > 0) {
                setRepalceList(res?.data?.dataList);
                rebackModalRef?.current?.open();
                //接下来做是否替换操作
              } else {
                //原来逻辑
                resd = await sourcingPcmApprove(temp);
              }
            } else {
              message.error(res?.errMsg);
            }
          });
        } else if (path === 'sourcing-pcd') {
          resd = await pcdApprove(temp);
        }
        if (resd && resd.errCode === 200) {
          message.success('操作成功!');
          if (props.recall) {
            props.recall();
          } else {
            history.go(-1);
          }
        } else {
          // 修改记录：需求单FA已转目录品时询报价提醒限定：该条修改注释掉提醒信息，但是不知道原因，暂时将注释掉的提示信息解开，提供给是否成品油判断逻辑
          message.error(resd.errMsg);
        }
      },
    });
    return true;
  };
  return (
    <div>
      <Button
        size="small"
        // disabled={!(props.inquiryId || props.selectedRow?.length)}
        disabled={!props.selectedRow?.length && !props.checkVal}
        type="primary"
        onClick={onOperate}
      >
        审核通过
      </Button>
      {/* ae pcm 审核通过时 */}
      <RebackModal
        ref={rebackModalRef}
        path={pathParams?.sorurceType || location.pathname.split('/').pop()}
        id={props.inquiryId}
        dataList={repalceList}
        subData={props.selectedRow.map((item: any) => item.skuVo?.inqLineId)}
        type={1}
        tableRefresh={() => props?.recall()}
      />
    </div>
  );
};
export default AgreeBtn;
