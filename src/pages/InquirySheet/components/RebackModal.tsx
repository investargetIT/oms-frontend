/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  backConfirm,
  complete,
  pcmApprove,
  sourcingPcmApprove,
  updateAndComplete,
  updateSkuImg,
} from '@/services/InquirySheet/lecty';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Select } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// import { useModel } from 'umi';
import '../index.less';
interface RebackModalProps {
  id: number | string;
  dataList?: any;
  subData?: any;
  lineEditData?: any;
  type?: number; //1 aetepcm 操作审核通过时候 + sourcingpcm审核通过（区分url） 2 sourcing报价的时候提交报价 3  sourcing报价内层
  path?: any;
  tableRefresh?: () => void;
}
const RebackModal = (props: RebackModalProps, ref: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [selRows, setSelRows] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const { type } = props;
  // const { destroyCom } = useModel('tabSelect');
  // const reBack = () => {
  //   destroyCom('/inquiry/lectotype', location.pathname);
  // };
  // console.log(props.path, 'props.path');
  useEffect(() => {
    if (props?.dataList?.length > 0) {
      setSelectedRowKeys(
        props?.dataList
          ?.filter((io: any) => io.astSkus?.split(',')?.length == 1)
          .map((ic: any) => ic.inqLnId),
      );
    }
  }, [props]);

  const columns: any = [
    {
      title: '行项目ID',
      dataIndex: 'inqLnId',
    },
    {
      title: 'SKU号',
      dataIndex: 'faSku',
    },
    {
      title: '产品名称',
      dataIndex: 'productNameConcatStr',
    },
    {
      title: '已转目录品号',
      dataIndex: 'astSkus',
    },
    {
      title: '退回节点',
      dataIndex: 'toLineStatus',
      hideInTable: type == 2 || type == 3 ? false : true,
      render: (_, record: any) => {
        return (
          <Select
            options={[
              { label: '退回至销售', value: 20 },
              { label: '退回至AE', value: 80 },
            ]}
            defaultValue={20}
            placeholder="请选择"
            disabled={
              ['quote', 'RFQquote'].includes(props.path)
                ? false
                : record?.astSkus?.split(',')?.length > 1
                ? true
                : false
            }
            onChange={(e, val: any) => {
              record.toLineStatus = val;
              return val;
            }}
          />
        );
      },
    },
  ];

  useImperativeHandle(ref, () => ({
    open: () => {
      setModalVisible(true);
    },
    close: () => {
      setModalVisible(false);
    },
  }));

  const submit = async () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选中至少一行');
      return;
    }
    if (type == 1) {
      const newList = props?.dataList
        ?.filter((io: any) => selectedRowKeys.some((ic: any) => ic === io.inqLnId))
        ?.map((io: any) => ({
          ...io,
          toLineStatus: props?.path == 'aepcm' ? 80 : props?.path == 'tepcm' ? 110 : 150,
          returnReasonDesc: `${io.faSku}已转目录品${io.astSkus}`,
          returnReason: props?.path == 'sourcing-pcm' ? '请修改报价信息' : '有目录品',
          inqLnId: io.inqLnId,
        }));
      // await backConfirm(props.path, newList).then((res: any) => {
      //   const { errCode, errMsg } = res;
      //   if (errCode == 200) {
      //     message.success('提交成功');
      //     // reBack();
      //     setModalVisible(false);
      //     props?.tableRefresh && props?.tableRefresh();
      //   } else {
      //     message.error(errMsg);
      //   }
      // });
    } else if (type == 2) {
      const newList = props?.dataList
        ?.filter((io: any) => selectedRowKeys.some((ic: any) => ic === io.inqLnId))
        ?.map((io: any) => ({
          ...io,
          toLineStatus: io.toLineStatus ? io.toLineStatus.value : 20,
          returnReasonDesc: `${io.faSku}已转目录品${io.astSkus}`,
          returnReason: 'sourcing推荐目录品',
          inqLnId: io.inqLnId,
        }));
      // await backConfirm(props.path, newList).then((res: any) => {
      //   const { errCode, errMsg } = res;
      //   if (errCode == 200) {
      //     message.success('提交成功');
      //     // reBack();
      //     setModalVisible(false);
      //     props?.tableRefresh && props?.tableRefresh();
      //   } else {
      //     message.error(errMsg);
      //   }
      // });
    } else if (type == 3) {
      const newList = props?.dataList
        ?.filter((io: any) => selectedRowKeys.some((ic: any) => ic === io.inqLnId))
        ?.map((io: any) => ({
          ...io,
          toLineStatus: io.toLineStatus ? io.toLineStatus.value : 20,
          returnReasonDesc: `${io.faSku}已转目录品${io.astSkus}`,
          returnReason: 'sourcing推荐目录品',
          inqLnId: io.inqLnId,
        }));
      // await backConfirm(props.path, newList).then((res: any) => {
      //   const { errCode, errMsg } = res;
      //   if (errCode == 200) {
      //     message.success('提交成功');
      //     setModalVisible(false);
      //     props?.tableRefresh && props?.tableRefresh();
      //   } else {
      //     message.error(errMsg);
      //   }
      // });
    }
  };

  const noReplace = async () => {
    if (type == 1) {
      const temp = {
        // inqLineIdList: props?.subData,
        inqLineIdList: props?.dataList?.map((ele: any) => ele.inqLnId),
        inquiryId: props?.id,
      } as any;
      // const { errMsg, errCode } =
      //   props?.path === 'sourcing-pcm'
      //     ? await sourcingPcmApprove(temp)
      //     : await pcmApprove(props?.path, temp);
      // if (errCode === 200) {
      //   message.success('操作成功!');
      //   setModalVisible(false);
      //   props?.tableRefresh && props?.tableRefresh();
      // } else {
      //   message.error(errMsg);
      // }
    } else if (type == 2) {
      const temp = {
        inqLineIdList: props?.subData,
        inquiryId: props?.id,
      } as any;
      // await complete(props?.path, temp).then((resd: any) => {
      //   if (resd.errCode === 200) {
      //     message.success('报价成功!');
      //     props?.tableRefresh && props?.tableRefresh();
      //     setModalVisible(false);
      //   } else {
      //     message.error(resd.errMsg);
      //   }
      // });
    } else if (type == 3) {
      const temp = {
        ...props?.lineEditData,
        inquiryId: props?.id,
      } as any;
      let resd = null;
      // resd = await updateAndComplete(props?.path, temp);
      // if (resd.errCode === 200) {
      //   if (temp.imageParams) updateSkuImg(temp.imageParams);
      //   message.success('报价成功!');
      //   props?.tableRefresh && props?.tableRefresh();
      //   setModalVisible(false);
      // } else {
      //   message.error(resd.errMsg);
      // }
    }
  };

  const headTitle = () => {
    let s = 'FA已转目录品提示' as any;
    if (['aepcm', 'tepcm'].includes(props?.path)) {
      s = 'FA已转目录品提示';
    } else if (props.path == 'sourcing-pcm') {
      s = 'FA已转目录品SourcingPCM提示';
    } else if (type == 2 || type === 3) {
      s = 'FA已转目录品Sourcing提示';
    }
    return s;
  };

  return (
    <Modal
      title={headTitle()}
      visible={modalVisible}
      destroyOnClose={true}
      width={'70%'}
      onCancel={() => {
        setModalVisible(false);
      }}
      footer={[
        <Button key="1" type="primary" onClick={submit}>
          确认退回
        </Button>,
        <Button key="0" type="primary" ghost onClick={noReplace}>
          跳过
        </Button>,
        <Button
          key="-1"
          type="default"
          onClick={() => {
            setModalVisible(false);
          }}
        >
          取消
        </Button>,
      ]}
    >
      <p style={{ paddingLeft: '50px', paddingBottom: '20px' }}>
        请选择需要退回的行，点击确认退回(其余行项目会保留当前FA)
      </p>
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100 }}
        bordered
        size="small"
        options={false}
        dataSource={props.dataList}
        rowSelection={{
          type: 'checkbox',
          onChange: (rowKeys: any, selectedRows: any) => {
            setSelRows(selectedRows);
            setSelectedRowKeys(rowKeys);
          },
          getCheckboxProps: (record: any) => ({
            disabled: ['aepcm', 'quote', 'tepcm', 'sourcing-pcm', 'RFQquote'].includes(props.path) //?sourcing报价,sourcingpcm提交报价的时候，aepcm审核主页面审核通过的时候，tepcm主页面审核的时候
              ? false
              : record?.astSkus?.split(',').length > 1,
          }),
          selectedRowKeys,
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (record?.astSkus?.split(',').length > 1) {
                return;
              }
              if (selectedRowKeys.includes(record.inqLnId)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.inqLnId);
                setSelectedRowKeys(newKeys);
                const newRows = selRows.filter((item: any) => item.inqLnId !== record.inqLnId);
                setSelRows(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.inqLnId]));
                setSelRows(selRows.concat([record]));
              }
            },
          };
        }}
        tableAlertRender={false}
        pagination={false}
        rowKey={'inqLnId'}
        search={false}
      />
    </Modal>
  );
};

export default forwardRef(RebackModal);
