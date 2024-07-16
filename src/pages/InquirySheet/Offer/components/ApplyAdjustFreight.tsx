/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Col, InputNumber, message, Row, Upload, Space } from 'antd';
import React, { useCallback, useState } from 'react';
import { fieldLabels } from '../const';
import Cookies from 'js-cookie';
import './index.less';
import { getEnv } from '@/services/utils';

interface ApplyAdjustFreightProps {
  id?: string;
  info?: Record<any, any>;
  // onSelectAdjust?: (value: any) => void;
}

type TableListItem = Record<any, any>;

const ApplyAdjustFreight: React.FC<ApplyAdjustFreightProps> = ({
  info = {} as any,
  // onSelectAdjust,
}) => {
  const {
    sid,
    quotCode,
    customerName,
    contactName,
    salesName,
    freight,
    interFreight,
    totalFreight,
    // quotationLineRespVoPage, //一个字段改了好几遍、、、、、
    quotationLineRespVoList,
  } = info;
  const [adjVal, setAdjVal] = useState<any>(0);
  const [tableData, setTableData] = useState<any>(quotationLineRespVoList);
  const [newTotalFreight, setNewTotalFreight] = useState<any>('');
  const [fileList, setFileList] = useState<any>([]);
  console.log(info, '??00');

  // const select = useCallback((listData: any) => {
  //   onSelectAdjust && onSelectAdjust(listData);
  // }, []);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: 'sku',
      width: 100,
      dataIndex: 'sku',
    },
    {
      title: '产品名称',
      width: 400,
      dataIndex: 'productName',
      render: (_, record: any) => {
        return `${record?.brandName} ${record?.productNameZh} ${record?.mfgSku}`;
      },
      ellipsis: true,
      copyable: true,
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'qty',
    },
    {
      title: '销售单位',
      width: 80,
      dataIndex: 'salesUomCode',
    },
    {
      title: '运费',
      width: 80,
      dataIndex: 'freight',
    },
    {
      title: '调整至',
      width: 120,
      dataIndex: 'requestFreight',
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            defaultValue={0}
            onChange={(val: any) => {
              record.requestFreight = val;
              let num;
              if (tableData.length < 1) {
                num = (adjVal + interFreight + 0).toFixed(2);
              } else {
                const lineAmount = tableData
                  ?.map((io: any) => io.interFreight + io.requestFreight)
                  ?.reduce((cur: any, net: any) => cur + net);
                num = (adjVal + interFreight + lineAmount).toFixed(2);
              }
              setNewTotalFreight(num);
              // select(tableData);
            }}
          />
        );
      },
    },
    {
      title: '含税成交价',
      width: 100,
      dataIndex: 'salesPrice',
    },
    {
      title: '不含税成交价',
      width: 100,
      dataIndex: 'salesPriceNet',
    },
    {
      title: '小计',
      width: 100,
      dataIndex: 'totalAmount',
    },
    {
      title: '国际运费',
      width: 80,
      dataIndex: 'interFreight',
    },
  ];

  const uploadProps = {
    name: 'file',
    action: `${getEnv()}/omsapi/refResource/upload`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
        console.log(msg.file, msg.fileList);
      }
      if (msg.file.status === 'done') {
        const {
          response: { data },
          uid,
        } = msg.file;
        const par = {
          sid: sid,
          resourceName: data.resourceName,
          resourceUrl: data.resourceUrl,
          fileType: 'fileType',
          uid,
        };
        setFileList([par]);
        sessionStorage.setItem('fileListApplyAdjust', JSON.stringify([par]));
        message.success(`${msg.file.name} file uploaded successfully`);
        // actionRef.current.reload(); //?上传文件成功之后重新刷新表格
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="form-content-search edit" id="applyAdjustFreight">
      <div className="has-gridForm">
        <Card title="报价单运费信息" bordered={false} headStyle={{ fontSize: '14px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'报价单号'}
                name="quotCode"
                disabled
                initialValue={quotCode}
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'客户名称'}
                name="customerName"
                initialValue={customerName}
                disabled
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'R3联系人'}
                name="contactName"
                initialValue={contactName}
                disabled
                placeholder=""
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'主销售'}
                name="salesName"
                initialValue={salesName}
                disabled
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'头运费'}
                name="freight"
                initialValue={freight}
                disabled
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <ProFormDigit
                labelAlign="left"
                label={fieldLabels.adjust}
                name="adjustFreightAmount"
                initialValue={0}
                fieldProps={{
                  onChange: (val) => {
                    let num;
                    if (tableData.length < 1) {
                      num = (Number(val) + interFreight).toFixed(2);
                    } else {
                      const lineAmount = tableData
                        ?.map((io: any) => io.interFreight + io.requestFreight)
                        ?.reduce((cur: any, net: any) => cur + net);
                      num = (Number(val) + interFreight + lineAmount).toFixed(2);
                    }
                    setAdjVal(val);
                    setNewTotalFreight(num);
                    return val;
                  },
                }}
                placeholder="请输入"
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <ProFormText
                labelAlign="left"
                label={'国际运费'}
                name="interFreight"
                initialValue={interFreight}
                placeholder=""
                disabled
              />
            </Col>
          </Row>
          <Row gutter={24} style={{ marginBottom: '20px' }}>
            <Space style={{ width: '90px' }}>
              <p style={{ color: '#999' }}>上传附件：</p>
            </Space>
            <Col span={6}>
              <Upload maxCount={1} {...uploadProps}>
                <Button>上传附件</Button>
              </Upload>
            </Col>
          </Row>
        </Card>
        <Card title="直送物料信息" bordered={false} headStyle={{ fontSize: '14px' }}>
          <ProTable<TableListItem>
            size="small"
            className="cust-table"
            columns={columns}
            bordered
            dataSource={tableData}
            pagination={false}
            options={false}
            search={false}
            rowKey="quotLineId"
            scroll={{ x: 200, y: 600 }}
          />
        </Card>
        <Card title="运费申请调整信息" bordered={false} headStyle={{ fontSize: '14px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <ProFormDigit
                label={fieldLabels.oldFreight}
                placeholder=""
                name="totalFreight"
                initialValue={totalFreight}
                width="sm"
                min={0}
                disabled
              />
            </Col>
            <Col span={8}>
              <ProFormDigit
                label={fieldLabels.newFreight}
                placeholder=""
                name="newTotalFreight"
                fieldProps={{ value: newTotalFreight }}
                width="sm"
                min={0}
                disabled
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <ProFormTextArea
                name="applyReason"
                label="申请原因"
                rules={[{ required: true, message: '请输入' }]}
                placeholder={'请输入，最多255字'}
                fieldProps={{ maxLength: 255, showCount: true }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ApplyAdjustFreight;
