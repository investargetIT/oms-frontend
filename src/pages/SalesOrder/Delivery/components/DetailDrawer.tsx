import {
  getDeliveryLogistics,
  queryRefResource,
  saveRefResourceNew,
  downloadToStream,
} from '@/services/SalesOrder';
import { Form, Tabs, Button, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import DelivryDetailTable from './DelivryDetailTable';
import Logistics from './Logistics';
import './style.less';
import ProTable from '@ant-design/pro-table';
import { ProFormUploadButton, ModalForm, ProFormRadio } from '@ant-design/pro-form';
import Cookies from 'js-cookie';
import { getEnv } from '@/services/utils';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
const prefix = getEnv();
import printJS from 'print-js';

const DetailDrawer: React.FC<{ id: string; tableRowData: object }> = (props: any) => {
  const { id, tableRowData } = props;
  const { TabPane } = Tabs;
  const data = tableRowData;
  if (tableRowData.sendTime) {
    data.sendTime = moment(tableRowData.sendTime).format('YYYY-MM-DD HH:mm:ss');
  }
  const [receiptDetail, setReceiptDetail] = useState([]);
  const [logisticsDetail, setLogisticsDetail] = useState([]);
  const [logisticsError, setLogisticsError] = useState('');
  const detailRef = useRef<ActionType>();
  const onDown = (filePath: string) => {
    downloadToStream(filePath).then((res) => {
      console.log(res);
      let result;
      const uint8Array = new Uint8Array(res);
      for (let i = 0; i < uint8Array.length; i++) {
        // String.fromCharCode：将 Unicode 编码转为一个字符:
        result += String.fromCharCode(uint8Array[i]);
      }
      const printBase64 = window.btoa(result);
      // 与src里直接放入data:application/pdf;base64 xxxx这样的格式， 真正的base64数据是xxx不包含之前的
      // 如果要是做预览，请自行加上前边类型字段
      printJS({ printable: printBase64, type: 'pdf', base64: true });
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      render: (_, record) => {
        if (record.fileType === '.pdf') {
          return (
            <Button
              type="link"
              onClick={() => {
                onDown(record.resourceUrl);
              }}
            >
              {record.resourceName}
            </Button>
          );
        }
        return <a href={record.resourceUrl}>{record.resourceName}</a>;
      },
    },
    {
      title: '单证类型',
      dataIndex: 'subType',
      valueEnum: {
        '60': {
          text: '定制单证',
        },
        '70': {
          text: '其他',
        },
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
  useEffect(() => {
    const logData = {
      obd_no_list: [tableRowData?.obdNo],
      sys_user: 'OMS',
    };
    getDeliveryLogistics(logData).then((res: any) => {
      if (res.errCode === 200) {
        if (res.data[0] && JSON.stringify(res.data[0]) != '{}') {
          if (res.data[0].image_urlList && JSON.stringify(res.data[0].image_urlList) != '[]') {
            const detail_data: any = {
              data: res.data[0].image_urlList,
              total: res.data[0].image_urlList.length,
              current: 1,
              pageSize: 20,
              success: true,
            };
            setReceiptDetail(detail_data);
          }

          if (res.data[0].tran_data_list && JSON.stringify(res.data[0].tran_data_list) != '[]') {
            const detail_data = {
              data: res.data[0].tran_data_list,
              total: res.data[0].tran_data_list.length,
              current: 1,
              pageSize: 20,
              success: true,
            };
            setLogisticsDetail(detail_data);
          }
        }
        setLogisticsError('');
      } else {
        setLogisticsError(res.errMsg);
        setReceiptDetail([]);
        setLogisticsDetail([]);
      }
    });
  }, []);

  return (
    <div className="form-content-search tabs-detail delivery-content">
      <h4 className="formTitle">订单信息</h4>
      <Form className="has-gridForm">
        <div className="ant-advanced-form four-gridCol" id="deliveryOrderDetailCol">
          <Form.Item label="发货单号">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.obdNo}
            </span>
          </Form.Item>
          <Form.Item label="订单号">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.orderNo}
            </span>
          </Form.Item>
          <Form.Item label="销售">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.salesName}
            </span>
          </Form.Item>
          <Form.Item label="物流商名称" className="minLabel">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.tplname}
            </span>
          </Form.Item>

          <Form.Item label="快递单号">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.expCode}
            </span>
          </Form.Item>

          <Form.Item label="收货人">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.consignee}
            </span>
          </Form.Item>
          <Form.Item label="手机">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.cellphone}
            </span>
          </Form.Item>
          <Form.Item label="发货时间">
            <span className="form-span" style={{ color: '#1890FF' }}>
              {data.sendTime}
            </span>
          </Form.Item>
        </div>
      </Form>
      <Tabs defaultActiveKey="1">
        <TabPane tab="发货明细" key="1">
          <DelivryDetailTable id={id} tableRowData={tableRowData} />
        </TabPane>
        <TabPane tab="物流信息" key="2">
          <h4 className="formTitle">
            定制单证
            <ModalForm
              title="上传"
              width={350}
              modalProps={{
                destroyOnClose: true,
              }}
              submitTimeout={2000}
              onFinish={async (values) => {
                const { response } = values.file[0];
                const res = await saveRefResourceNew({
                  sourceId: tableRowData?.orderId,
                  subIdentification: tableRowData?.obdNo,
                  resourceVOList: [
                    {
                      resourceUrl: response.data.resourceUrl,
                      resourceName: response.data.resourceName,
                      subType: values.subType,
                    },
                  ],
                });
                if (res.errMsg === '成功') {
                  detailRef?.current?.reload(true);
                  return true;
                } else {
                  message.error(res.errMsg);
                  return false;
                }
              }}
              trigger={
                tableRowData.preShip === 1 ? (
                  <Button type="primary" size="small" style={{ marginLeft: '20px' }}>
                    上传
                  </Button>
                ) : (
                  <></>
                )
              }
            >
              <ProFormUploadButton
                name="file"
                max={1}
                fieldProps={{
                  name: 'file',
                  headers: {
                    token: Cookies.get('ssoToken'),
                  },
                }}
                action={`${prefix}/omsapi/refResource/upload`}
                rules={[{ required: true, message: '这是必填项' }]}
              />
              <ProFormRadio.Group
                label="单证类型"
                name="subType"
                options={[
                  { label: '定制单证', value: '60' },
                  { label: '其他', value: '70' },
                ]}
                rules={[{ required: true, message: '这是必填项' }]}
              />
            </ModalForm>
          </h4>
          <ProTable<any>
            columns={columns}
            bordered
            size="small"
            options={false}
            request={async (params = {}) => {
              const { current, pageSize }: any = params;
              const res = await queryRefResource({
                pageNumber: current,
                pageSize: pageSize,
                sourceId: tableRowData?.orderId,
                subIdentification: tableRowData?.obdNo,
                sourceType: 136,
              });
              return {
                data: res.data.list,
                total: res.data.total,
              };
            }}
            rowKey={() => Math.random()}
            search={false}
            toolBarRender={false}
            tableAlertRender={false}
            defaultSize="small"
            actionRef={detailRef}
          />
          <Logistics
            receiptDetail={receiptDetail}
            logisticsDetail={logisticsDetail}
            logisticsError={logisticsError}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default DetailDrawer;
