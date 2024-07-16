import LogInfo from '@/pages/components/LogInfo';
import {
  addItemDetail,
  editInqLine,
  inqLnList,
  deleteItemDetail,
  clearItemDetail,
  editItemDetail,
} from '@/services/InquirySheet';
import { getEnv, colLimit } from '@/services/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Upload } from 'antd';
import Cookies from 'js-cookie';
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useParams, history, useLocation } from 'umi';
import SkuInfoSingle from './SkuInfoSingle';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Logout } from '@/services/utils';
const SkuInfo: React.FC<{
  itemList?: any;
  getSkuData: Function;
  customerCode: string;
  baseInfo?: any;
  setPathId?: any;
  params?: any;
}> = (props: any, ref: any) => {
  const pathParams: any = useParams();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [logVisible, setLogVisible]: any = useState(false);
  const [data, setData]: any = useState([]);
  const [id, setId]: any = useState('');
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [visible, setVisible]: any = useState(false);
  const [isModalVisible, setIsModalVisible]: any = useState(false);
  const [uploadData, setUploadData]: any = useState({});
  const [inquiryId, setInquiryId]: any = useState('');
  const { confirm } = Modal;
  const skuRef = useRef<ActionType>();
  const tableRef = useRef<ActionType>();
  const location: any = useLocation();
  // console.log(props.params.sid, 'props.params.sid');

  useEffect(() => {
    if (pathParams?.id) {
      setInquiryId(pathParams?.id);
    }
  }, []); //?这个是第一次进来会执行的

  useEffect(() => {
    if (props.params.sid) {
      setInquiryId(props.params.sid);
    }
  }, [props.params.sid]); //?这个慢一步所以会在第二次熏染表格的时候执行

  const delInfo = (selIndex?: any) => {
    const selRow = selIndex || selectedRow;
    if (!selRow && selRow.length === 0) return;
    confirm({
      title: '确认删除吗？',
      onOk() {
        const delList: any = [];
        selRow.forEach((item: any) => {
          if (item.sid) {
            delList.push(item.sid);
          }
        });
        deleteItemDetail({ list: delList }).then((delMsg: any) => {
          if (delMsg.errCode === 200) {
            message.success('删除成功!');
            tableRef.current?.reload(true);
          } else {
            message.error(delMsg.errMsg);
          }
        });
        setSelectedRowKeys([]);
      },
    });
  };
  const getSingleSkuData = async (singleVal?: any): any => {
    if (singleVal) {
      singleVal.reqReplaceableStr = singleVal.reqReplaceable === 1 ? '可以' : '不可以';
    } else {
      skuRef.current?.resetForm();
      setVisible(false);
      return false;
    }
    singleVal.inquiryId = inquiryId;
    if (singleVal?.sid) {
      editItemDetail(singleVal).then((editMsg: any) => {
        if (editMsg.errCode === 200) {
          message.success('编辑成功!');
          tableRef.current?.reload();
        } else {
          message.error(editMsg.errMsg);
        }
      });
    } else {
      const baseForm: any = (await props?.baseInfo.current?.getBaseForm()) || {};
      baseForm.inquiryId = inquiryId;
      setUploadData(JSON.parse(JSON.stringify(baseForm)));
      addItemDetail({ ...baseForm, ...singleVal }).then((editMsg: any) => {
        if (editMsg.errCode === 200) {
          message.success('新增成功!');
          if (!inquiryId) {
            props.setPathId(editMsg.data);
            setInquiryId(editMsg.data);
          }
          tableRef.current?.reload(true);
        } else {
          message.error(editMsg.errMsg);
        }
      });
    }
    skuRef.current?.resetForm();
    setVisible(false);
  };
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys,
    onChange: (keys: React.Key[], row: any) => {
      setSelectedRowKeys(keys);
      setSelectedRow(row);
    },
  };
  const operateClearAll = () => {
    if (inquiryId) {
      clearItemDetail({ inquiryId }).then((clearMsg: any) => {
        if (clearMsg.errCode === 200) {
          message.success('清空成功!');
          tableRef.current?.reload(true);
        } else {
          message.error(clearMsg.errMsg);
        }
      });
    }
    setSelectedRowKeys([]);
  };
  const clearAll = () => {
    if (!data && data.length === 0) return;
    confirm({
      title: '确认清空当前全部明细内容吗？',
      icon: <ExclamationCircleOutlined />,
      content: '清空操作不可撤销，请谨慎操作',
      onOk() {
        operateClearAll();
      },
    });
  };
  useImperativeHandle(ref, () => ({
    clearAllSku: operateClearAll,
  }));
  const editInfo = (record: any) => {
    setVisible(true);
    setTimeout(() => {
      if (record.sid) {
        editInqLine(record.sid).then((res: any) => {
          if (res.errCode === 200) {
            res.data.index = record.index;
            res.data.sid = record.sid;
            skuRef?.current?.setForm(res.data);
          }
        });
      } else {
        skuRef?.current?.setForm(record);
      }
    }, 1000);
  };
  const loglogInfo = (record: any) => {
    setId(record.sid);
    setLogVisible(true);
  };
  const colBtn = (record: any) => {
    if (!pathParams?.id) {
      return (
        <Space>
          <Button
            type="link"
            key={'编辑'}
            onClick={() => {
              editInfo(record);
            }}
          >
            {' '}
            编辑
          </Button>
          <Button
            type="link"
            key={'删除'}
            onClick={() => {
              delInfo([record]);
            }}
          >
            {' '}
            删除
          </Button>
        </Space>
      );
    } else {
      return (
        <Space>
          <Button
            type="link"
            key={'编辑'}
            onClick={() => {
              editInfo(record);
            }}
          >
            {' '}
            编辑
          </Button>
          <Button
            type="link"
            key={'删除'}
            onClick={() => {
              delInfo([record]);
            }}
          >
            {' '}
            删除
          </Button>
          <Button
            type="link"
            key={'日志'}
            onClick={() => {
              loglogInfo(record);
            }}
          >
            {' '}
            日志
          </Button>
        </Space>
      );
    }
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'sequenceNo',
      width: 40,
      fixed: 'left',
    },
    {
      title: '行操作',
      dataIndex: 'index1',
      fixed: 'left',
      width: 150,
      render: (text: any, record: any) => {
        return colBtn(record);
      },
    },
    { title: '需求SKU', dataIndex: 'reqSku', width: 150, ellipsis: true, fixed: 'left' },
    { title: 'SKU号', dataIndex: 'sku', width: 150, ellipsis: true, fixed: 'left' },
    { title: '行项目编号', dataIndex: 'sid', width: 150, ellipsis: true },
    { title: '行项目类型', dataIndex: 'lineTypeStr', width: 150, ellipsis: true },
    { title: '行项目状态', dataIndex: 'lineStatusStr', width: 150, ellipsis: true },
    { title: '客户物料号', dataIndex: 'reqCustomerSku', width: 150, ellipsis: true },
    { title: '客户行号', dataIndex: 'reqPoItemNo', width: 150, ellipsis: true },
    {
      title: '需求产品名称',
      dataIndex: 'reqProductName',
      width: 200,
      ellipsis: true,
      sorter: (a: any, b: any) => {
        return a.reqProductName?.toString().localeCompare(b.reqProductName?.toString());
      },
    },
    { title: '需求品牌名称', dataIndex: 'reqBrandName', width: 200, ellipsis: true },
    { title: '需求制造商型号', dataIndex: 'reqMfgSku', width: 220, ellipsis: true },
    { title: '客户期望单价', dataIndex: 'reqPrice', width: 200, ellipsis: true },
    { title: '需求采购单位', dataIndex: 'reqUom', width: 200, ellipsis: true },
    { title: '需求数量', dataIndex: 'reqQty', width: 150, ellipsis: true },
    { title: '是否可替换', dataIndex: 'reqReplaceableStr', width: 180, ellipsis: true },
    { title: '需求技术参数/规格', dataIndex: 'reqTechSpec', width: 250, ellipsis: true },
    { title: '需求产品线', dataIndex: 'reqProductLineName', width: 180, ellipsis: true },
    { title: '需求segment', dataIndex: 'reqSegmentName', width: 180, ellipsis: true },
    { title: '是否长期采购', dataIndex: 'reqIsLongRequestStr', width: 180, ellipsis: true },
    { title: '长期采购数量', dataIndex: 'reqLongRequestNum', width: 180, ellipsis: true },
    { title: '需求描述', dataIndex: 'reqRemark', width: 180, ellipsis: true },
    { title: '最后修改人', dataIndex: 'updateName', width: 150, ellipsis: true },
    { title: '行项目创建时间', dataIndex: 'createTime', width: 180, ellipsis: true },
    { title: '最后修改时间', dataIndex: 'updateTime', width: 150, ellipsis: true },
  ];
  const editCol: any = columns.concat([
    { title: '匹配类型', dataIndex: 'pairTypeStr', width: 150, ellipsis: true },
    {
      title: 'SKU产品名称',
      dataIndex: 'productNameZh',
      width: 150,
      ellipsis: true,
      sorter: (a: any, b: any) => {
        return a.productNameZh?.toString().localeCompare(b.productNameZh?.toString());
      },
    },
    { title: 'SKU类型', dataIndex: 'skuTypeStr', width: 150, ellipsis: true },
    { title: 'SKU品牌名称', dataIndex: 'brandTypeStr', width: 150, ellipsis: true },
    { title: 'SKU制造厂商型号', dataIndex: 'mfgSku', width: 150, ellipsis: true },
    { title: 'SKU销售单位', dataIndex: 'purchUomCode', width: 150, ellipsis: true },
    { title: 'SKU规格', dataIndex: 'techSpec', width: 150, ellipsis: true },
    { title: 'SKU供应商名称', dataIndex: 'supplierNameZh', width: 150, ellipsis: true },
    { title: 'SKU供应商产品型号', dataIndex: 'supplierSku', width: 150, ellipsis: true },
    { title: 'Product', dataIndex: 'productLineName', width: 150, ellipsis: true },
    { title: 'Segment', dataIndex: 'segmentName', width: 150, ellipsis: true },
    { title: 'Family', dataIndex: 'familyName', width: 150, ellipsis: true },
    { title: 'Category', dataIndex: 'categoryName', width: 150, ellipsis: true },
    { title: '产品PMS', width: 150, dataIndex: 'categoryPmsUser' },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 150, ellipsis: true },
    { title: '物理单位', dataIndex: 'phyUomCode', width: 150, ellipsis: true },
    { title: '销售单位包含物理单位个数', dataIndex: 'salesPackQty', width: 150, ellipsis: true },
    { title: '含税销售成交价', dataIndex: 'salesPrice', width: 150, ellipsis: true },
    { title: '含税面价', dataIndex: 'listPrice', width: 150, ellipsis: true },
    { title: '未税销售成交价', dataIndex: 'salesPriceNet', width: 150, ellipsis: true },
    { title: '小计含税成交金额', dataIndex: 'totalAmount', width: 150, ellipsis: true },
    { title: '小计未税成交金额', dataIndex: 'totalAmountNet', width: 150, ellipsis: true },
    { title: '小计折扣金额', dataIndex: 'totalDiscount', width: 150, ellipsis: true },
    { title: '采购计价货币', dataIndex: 'purchCurrency', width: 150, ellipsis: true },
    { title: '报价到期日', dataIndex: 'quoteValidDate', width: 150, ellipsis: true },
  ]);
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const uploadMsg = (successNum?: number, errorNum?: number, url?: string) => (
    <div>
      <p>
        成功识别{successNum}条，失败{errorNum}条，可修改后重新导入
      </p>
      <Button type="link" href={url}>
        下载失败数据
      </Button>
    </div>
  );
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  let hide: any = null;
  const uploadProps: any = {
    maxCount: 1,
    accept: '.xls,.xlsx',
    name: 'file',
    data: uploadData,
    action: `${getEnv()}/omsapi/inquiry/importItemDetail`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    async beforeUpload() {
      const baseForm: any = (await props?.baseInfo.current?.getBaseForm()) || {};
      baseForm.inquiryId = inquiryId;
      setUploadData(JSON.parse(JSON.stringify(baseForm)));
      return true;
    },
    onChange(info: any) {
      if (info.file.status === 'uploading') {
        if (!hide) {
          hide = message.loading({
            content: '接口疯狂导入中...',
            className: 'loadingMessage',
            duration: 0,
          });
        }
      } else if (info.file.status === 'done') {
        if (hide) {
          setTimeout(() => {
            hide();
            hide = null;
          }, 200);
        }
        const res: any = info.file.response;
        if (res.errCode === 200) {
          if (!inquiryId) {
            props.setPathId(res.data);
            setInquiryId(res.data);
          }
          tableRef.current?.reload(true);
          setSelectedRowKeys([]);
          setSelectedRow([]);
          setIsModalVisible(false);
          message.success(`${info.file.name} 导入成功!`);
        } else {
          if (res.data) {
            Modal.warning({
              title: '导入结果提示',
              content: uploadMsg(res.data?.successNum, res.data?.errorNum, res.data?.url),
            });
          } else {
            Modal.warning({
              title: '导入结果提示',
              content: res.errMsg,
            });
          }
        }
      } else if (info.file.status === 'error') {
        if (hide) {
          setTimeout(hide, 200);
        }
        message.error(`${info.file.name} 导入失败!`);
        if (info.file.error.status === 401) {
          Logout();
        }
      }
    },
  };
  const onExport = () => {
    if (data && data.length > 0) {
      confirm({
        title:
          '当前已有明细数据，导入会追加内容，可能产生重复数据；如需替换原数据，请先手动清空明细!',
        onOk() {
          setIsModalVisible(true);
        },
      });
    } else {
      setIsModalVisible(true);
    }
  };
  return (
    <div className="base-info" id="inquiryAddNewLastCol">
      <ProTable<any>
        columns={props.itemList?.length ? editCol : columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        request={async (params) => {
          const searchParams: any = {};
          searchParams.pathOp = 'info';
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          searchParams.inquiryId = inquiryId;
          searchParams.inqLnStatList = [];
          if (!searchParams.inquiryId) {
            return Promise.resolve({ data: [], total: 0, success: true });
          }
          if (location.state && location.state.type === 'copy') {
            //? 如果是复制的逻辑
            // console.log(props.params, 'props.params');
            searchParams.inquiryId = props.params.sid;
          } else {
            //? 如果是编辑的，或者新增的逻辑
            searchParams.inquiryId = inquiryId;
          }
          const res = await inqLnList(searchParams);
          if (res?.errCode === 200) {
            setSelectedRow([]);
            const list: any = res.data?.list.map((item: any) => {
              return { ...item, ...item?.reqVo };
            });
            setData(list);
            props.getSkuData(list);
            return Promise.resolve({
              data: list,
              total: res.data?.total,
              success: true,
            });
          } else {
            message.error(res?.errMsg);
            return Promise.resolve([]);
          }
        }}
        rowSelection={rowSelection}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.sid)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.sid);
                setSelectedRowKeys(newKeys);
                const newRows = selectedRow.filter((item: any) => item.sid !== record.sid);
                setSelectedRow(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.sid]));
                setSelectedRow(selectedRow.concat([record]));
              }
            },
          };
        }}
        options={{ reload: false, density: false }}
        rowKey="sid"
        search={false}
        tableAlertRender={false}
        actionRef={tableRef}
        defaultSize="small"
        scroll={{ x: 200, y: 300 }}
        bordered
        size="small"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          showQuickJumper: true,
        }}
        className="inquiryAddNewTable"
        headerTitle={
          <Space style={{ margin: '5px 0' }}>
            <Button
              type="primary"
              key={'导入'}
              // disabled={!props.customerCode}
              // api  props.params?.apiMark 是1  普通是0
              disabled={props.params?.apiMark !== 1 ? false : pathParams.id ? true : false}
              onClick={onExport}
            >
              {' '}
              导 入{' '}
            </Button>
            <Button
              type="primary"
              // disabled={!props.customerCode}
              disabled={props.params?.apiMark !== 1 ? false : pathParams.id ? true : false}
              key={'添加'}
              onClick={() => {
                setVisible(true);
              }}
            >
              添 加
            </Button>
            <Button
              key={'删除'}
              disabled={!selectedRow.length}
              onClick={() => {
                delInfo();
              }}
            >
              {' '}
              删 除{' '}
            </Button>
            <Button
              disabled={!data.length}
              key={'清空'}
              onClick={clearAll}
              danger
              className="light_danger"
            >
              {' '}
              清 空{' '}
            </Button>
          </Space>
        }
      />
      <SkuInfoSingle
        ref={skuRef}
        customerCode={props.customerCode}
        getSingleSkuData={getSingleSkuData}
        visible={visible}
      />
      <Modal
        title="导入需求单(仅支持xls, xlsx)"
        visible={isModalVisible}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div style={{ position: 'relative' }}>
          <Upload {...uploadProps}>
            <Button type="link">选择文件</Button>
          </Upload>
          <Button
            type="link"
            href={`${getEnv()}/omsapi/download/inquiryLine.xlsx?token=${Cookies.get('ssoToken')}`}
            style={{ position: 'absolute', left: '80px', top: '4px' }}
          >
            下载模板
          </Button>
        </div>
      </Modal>
      <LogInfo
        id={id}
        title={'行项目操作日志'}
        sourceType={'21'}
        visible={logVisible}
        closed={() => {
          setLogVisible(false);
        }}
      />
    </div>
  );
};
export default forwardRef(SkuInfo);
