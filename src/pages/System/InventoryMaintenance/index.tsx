import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, Modal, message } from 'antd';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { importGrossprofit, queryInventoryList } from '@/services/System/index';
import { colLimit, getEnv } from '@/services';
import { UploadOutlined } from '@ant-design/icons';
import { ProFormUploadButton } from '@ant-design/pro-form';
import Cookies from 'js-cookie';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [title, setTitle] = useState<any>();
  const [visible, setVisible] = useState<any>();
  const [upPar, setUpPar] = useState<any>();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();

  enum LinkEnum {
    'https://test-omsapi.mymro.cn/omsapi/download/grossProfit.xlsx' = 181,
    // 'https://www.baodu1.com.xlsx' = 182,
  }
  const uploadObj = {
    导入负毛利物料替换清单: 181,
    // 上传MDM报备清单: 182,
  };

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '清单类型',
      dataIndex: 'inventoryType',
      width: 100,
    },
    {
      title: '原物料SKU号',
      dataIndex: 'sku',
      width: 180,
    },
    {
      title: 'MDM码',
      dataIndex: 'mdmCode',
      hideInTable: true,
      width: 120,
    },
    {
      title: '客户商品编号',
      hideInTable: true,
      dataIndex: 'customerSkuCode',
      width: 180,
    },
    {
      title: '原物料商品描述',
      dataIndex: 'productNameZh',
      width: 120,
    },
    {
      title: '原物料品牌',
      dataIndex: 'branchName',
      width: 120,
    },
    {
      title: '原物料计价单位',
      dataIndex: 'salesUomName',
      width: 120,
    },
    {
      title: '原物料下单数量',
      hideInTable: true,
      dataIndex: 'orderQty',
      width: 120,
    },
    {
      title: '原物料下单总价',
      hideInTable: true,
      dataIndex: 'amount',
      width: 120,
    },
    {
      title: '计划下单时间',
      hideInTable: true,
      dataIndex: 'orderTime',
      width: 120,
    },
    {
      title: '替换物料sku',
      dataIndex: 'replaceSku',
      width: 120,
    },
    {
      title: '替换物料产品名称',
      dataIndex: 'replaceSkuName',
      width: 120,
    },
    {
      title: '替换物料品牌',
      dataIndex: 'replaceBrandCode',
      width: 120,
    },
    {
      title: '替换物料计价单位',
      dataIndex: 'replaceSalesUomName',
      width: 150,
    },
    {
      title: '替换物料供应商编号',
      dataIndex: 'replaceSupplierCode',
      width: 150,
    },
    {
      title: '替换物料供应商名称',
      dataIndex: 'replaceSupplierName',
      width: 150,
    },
    {
      title: '是否授权',
      hideInTable: true,
      dataIndex: 'authorized',
      width: 120,
    },
    {
      title: '是否已消耗',
      hideInTable: true,
      dataIndex: 'consumed',
      width: 120,
    },
    {
      title: '二级采购单位客户号',
      hideInTable: true,
      dataIndex: 'purchaseCode',
      width: 150,
    },
    {
      title: '二级采购单位名称',
      hideInTable: true,
      dataIndex: 'purchaseName',
      width: 150,
    },
    {
      title: '报备号',
      dataIndex: 'reportNo',
      width: 120,
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle" style={{ marginTop: '6px' }}>
      <ProTable<any>
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        request={async (params) => {
          const searchParams: any = {
            pageNo: params.current,
            pageSize: params.pageSize,
          };
          // const res = await queryInventoryList(searchParams);
          // res.data?.dataList?.forEach((e: any, i: number) => {
          //   e.index = i;
          // });
          // if (startPage) {
          //   params.current = 1;
          // }
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.dataList,
          //     total: res.data.total,
          //     success: true,
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        rowKey="index"
        search={false}
        actionRef={ref}
        headerTitle={
          <Space>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setTitle('导入负毛利物料替换清单');
                setVisible(true);
              }}
            >
              上传负毛利清单
            </Button>
            {/* <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setTitle('上传MDM报备清单');
                setVisible(true);
              }}
            >
              上传MDM报备清单
            </Button> */}
          </Space>
        }
      />
      <Modal
        width={600}
        title={title}
        visible={visible}
        destroyOnClose={true}
        cancelText="关闭"
        onOk={async () => {
          ref?.current?.reload();
          setVisible(false);
          return;
          //beiyong
          if (upPar?.fileUrl) {
            // 注意入参类型formdata
            const formData = new FormData();
            formData.append('files', upPar?.file);
            const url = await importGrossprofit(formData);
            url.then((res: any) => {
              if (res.errCode === 200) {
                setVisible(false);
                message.success({
                  duration: 10,
                  content: (
                    <div>
                      导入成功，请点击
                      <Button
                        type="link"
                        onClick={() => {
                          history.push('/importmanage/myimport');
                        }}
                      >
                        查看
                      </Button>
                    </div>
                  ),
                });
              } else {
                message.error('上传失败');
              }
            });
          } else {
            message.error('请上传文件');
          }
        }}
        onCancel={() => {
          setUpPar({});
          ref?.current?.reload();
          setVisible(false);
        }}
      >
        <Form layout="inline">
          <Form.Item
            label="上传文件"
            // rules={[{ required: true, message: '请上传文件!' }]}
          >
            <ProFormUploadButton
              name="file"
              accept=".xlsx,.xls"
              action={`${getEnv()}/omsapi/orderReplace/import/grossprofit`}
              max={1}
              title="选择文件"
              buttonProps={{
                type: 'primary',
              }}
              fieldProps={{
                headers: {
                  token: Cookies.get('ssoToken'),
                },
                onChange: async (val: any) => {
                  // if (val?.file?.response?.errCode == 200) {
                  //   if (val.file.status === 'done') {
                  //     const par = {
                  //       url: val?.file?.response?.data?.url,
                  //       fileName: val?.file?.response?.data?.fileName,
                  //       sourceKey: uploadObj[title],
                  //       file: val?.file?.originFileObj, // 文件刘
                  //     };
                  //     message.success('上传成功');
                  //     setUpPar(par);
                  //   } else if (val.file.status === 'error') {
                  //     message.error('上传错误');
                  //   }
                  // } else if (val?.file?.response?.errCode && val?.file?.response?.errCode != 200) {
                  //   message.error(val?.file?.response?.errMsg);
                  // }
                },
                onRemove: async () => {
                  setUpPar({});
                },
              }}
            />
            <div style={{ marginTop: '20px' }}>
              <Button type="link" href={LinkEnum[uploadObj[title]]}>
                下载模板
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div style={{ fontSize: '12px', color: '#999' }}>
          <div>导入说明：</div>
          <div>· 仅支持xls.xlsx文件；</div>
          <div>· 每次导入上限5000行，超过部分请分多次导入</div>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
