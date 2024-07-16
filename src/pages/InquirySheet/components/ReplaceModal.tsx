/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  editSubmitInquiry,
  itemEdit,
  searchFaTransAstAT,
  submitCheck,
  updateAndSubmitCheck,
} from '@/services/InquirySheet/lecty';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import '../index.less';
interface ReplaceModalProps {
  id: number | string;
  dataList?: any;
  subData?: any;
  type?: number; //1 需求单新增 2 aate 提交审核 3编辑单行提交
  path?: any;
  lineEditData?: any;
  close?: () => void;
  recall?: () => void;
  inSubmit?: number; // 1 区分同个组件同一个页面的不同逻辑的流程标识
  lastPath: string; // 1类似上字段
  handClose?: () => void;
  tableReload?: () => void;
}
const ReplaceModal = (props: ReplaceModalProps, ref: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [selRows, setSelRows] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const { type, id } = props;

  const { destroyCom } = useModel('tabSelect');
  const reBack = () => {
    let url = '/inquiry/lectotype';
    if (type == 1) {
      url = '/inquiry/lectotype';
    } else if (type == 2) {
    } else if (type == 3) {
    }
    destroyCom(url, location.pathname);
  };

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
      title: props?.type == 1 ? '需求SKU号' : 'SKU号',
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
      const par = {
        ...props.subData,
        faTransAstList: props?.dataList?.filter((io: any) =>
          selectedRowKeys.some((ic: any) => ic === io.inqLnId),
        ),
      };
      await editSubmitInquiry(par).then((res: any) => {
        const { errCode, errMsg } = res;
        if (errCode == 200) {
          message.success('提交成功');
          reBack();
          setModalVisible(false);
        } else {
          message.error(errMsg);
        }
      });
    } else if (type == 2) {
      const resd = await searchFaTransAstAT(props.path, {
        inquiryId: id,
        inqLineIdList: props.subData,
        faTransAstList: props?.dataList?.filter((io: any) =>
          selectedRowKeys.some((ic: any) => ic === io.inqLnId),
        ),
      });
      if (resd.errCode === 200) {
        // message.success(resd.data);
        message.success('操作成功!');
        setModalVisible(false);
        props.recall && props.recall();
      } else {
        message.error(resd.errMsg);
      }
    } else if (type == 3 && props?.inSubmit != 1) {
      const res = {
        ...props?.lineEditData,
        sku: props?.dataList[0].astSkus,
        faTransAstList: props?.dataList?.filter((io: any) =>
          selectedRowKeys.some((ic: any) => ic === io.inqLnId),
        ),
      };
      const resd = await itemEdit(res);
      if (resd.errCode === 200) {
        message.success('操作成功!');
        setModalVisible(false);
        props.close && props.close();
        reBack();
        props?.tableReload && props.tableReload();
      } else {
        message.error(resd.errMsg);
      }
    } else if (type == 3 && props?.inSubmit == 1) {
      const res = {
        ...props?.lineEditData,
        skuVo: {
          ...props?.lineEditData.SkuVo,
          sku: props?.dataList[0].astSkus,
        },
        originFaCode: props?.dataList[0].faSku,
        sku: props?.dataList[0].astSkus,
        faTransAstList: props?.dataList?.filter((io: any) =>
          selectedRowKeys.some((ic: any) => ic === io.inqLnId),
        ),
      };
      // 原来逻辑
      const resd = await updateAndSubmitCheck(res, props?.lastPath);
      if (resd.errCode === 200) {
        message.success('操作成功!');
        props.handClose && props.handClose();
        setModalVisible(false);
        props?.tableReload && props.tableReload();
      } else {
        message.error(resd.errMsg);
      }
    }
  };

  const noReplace = async () => {
    if (type == 1) {
      const par = {
        sid: props?.id,
        ...props?.subData,
      } as any;
      const { errMsg, errCode } = await editSubmitInquiry(par);
      if (errCode === 200) {
        message.success('操作成功!');
        reBack();
        setModalVisible(false);
      } else {
        message.error(errMsg);
      }
    } else if (type === 2) {
      const resd = await submitCheck(props.path, { inquiryId: id, inqLineIdList: props.subData });
      if (resd.errCode === 200) {
        message.success('操作成功!');
        setModalVisible(false);
        props.recall && props.recall();
      } else {
        message.error(resd.errMsg);
      }
    } else if (type == 3 && props?.inSubmit != 1) {
      const resd = await itemEdit(props?.lineEditData);
      if (resd.errCode === 200) {
        message.success('操作成功!');
        setModalVisible(false);
        props.close && props.close();
        props?.tableReload && props.tableReload();
        reBack();
      } else {
        message.error(resd.errMsg);
      }
    } else if (type == 3 && props?.inSubmit == 1) {
      const resd = await updateAndSubmitCheck(props?.lineEditData, props?.lastPath);
      if (resd.errCode === 200) {
        message.success('操作成功!');
        props.handClose && props.handClose();
        setModalVisible(false);
        props?.tableReload && props.tableReload();
      } else {
        message.error(resd.errMsg);
      }
    }
  };

  return (
    <Modal
      title="FA已转目录品提示"
      visible={modalVisible}
      destroyOnClose={true}
      width={'70%'}
      onCancel={() => {
        setModalVisible(false);
      }}
      footer={[
        <Button key="1" type="primary" onClick={submit}>
          确认替换
        </Button>,
        <Button key="0" type="primary" ghost onClick={noReplace}>
          不替换
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
        请选择需要替换目录品的行，点击确认替换
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
            disabled: record?.astSkus?.split(',').length > 1,
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

export default forwardRef(ReplaceModal);
