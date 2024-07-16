/* eslint-disable @typescript-eslint/no-unused-expressions */
import { querySearchCustomer } from '@/services/afterSales/utils';
import { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Col, Input, Modal, Row } from 'antd';
import React, { useRef, useState } from 'react';
import SelectCustomer from './SelectCustomer';
import R3Modal from '@/pages/SalesAfter/components/R3Modal';
import type { ActionType } from '@ant-design/pro-table';

interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  onChangeBasic?: (values: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, info = {} as any, onChangeBasic }) => {
  const [isVisibleModal, setIsVisibleModal] = useState<any>(false);
  const columnCustomer: any[] = [
    { title: '#', dataIndex: 'index', valueIndex: 'index', search: false },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      ellipse: true,
      renderFormItem: () => {
        return <Input placeholder="请输入供应商的客户号" />;
      },
    },
    { title: '客户中文名称', dataIndex: 'customerName', ellipse: true, search: false },
    { title: '所在地区', dataIndex: 'customerArea', ellipse: true, search: false },
    { title: '详细地址', dataIndex: 'customerAddress', ellipse: true, search: false },
    { title: '所属公司', dataIndex: 'branchCompanyName', ellipse: true, search: false },
    { title: '所属事业部', dataIndex: 'branchDivisionName', ellipse: true, search: false },
    { title: '所属团队', dataIndex: 'branchTeamName', ellipse: true, search: false },
  ];
  const [rowData, setRowData] = useState<any>({});
  // const [r3List, setR3List] = useState<any>([]);
  const {
    customerCode = '',
    companyName = '',
    costTotalPrice = '',
    scrapTotalPrice = '',
    applyTitle = '',
    contactName = {} as any,
    contactCodeR3 = '',
    salesName = '',
    afterSales = {} as any,
    applyReason = '',
  } = info;
  const R3ModalRef: any = useRef<ActionType>();
  const getData = async (params: any) => {
    const res = await querySearchCustomer({ customerCode: params?.customerCode || 1234567890 });
    // const res = await querySearchCustomer({ customerCode: params?.customerCode });
    return res;
  };

  // const getr3List = async () => {
  //   if (customerCode) {
  //     queryContact({ customerCode }).then((res: any) => {
  //       if (res.errCode === 200) {
  //         const concatList = res?.data?.dataList?.map((io: any) => ({
  //           label: io.contactName,
  //           value: io.contactCode,
  //         }));
  //         setR3List(concatList);
  //       }
  //     });
  //   }
  // };
  function operateMethod(val: { contactName: any; contactCodeR3: any }) {
    if (val) {
      onChangeBasic &&
        onChangeBasic({
          ...rowData, //?选择的用户的行信息
          contactName: { label: val[0].contactName, value: val[0].contactCode },
        });
    }
  }
  const dbSave = async (record: any) => {
    onChangeBasic && onChangeBasic(record);
    setIsVisibleModal(false);
  };
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'申请标题'}
            name="applyTitle"
            initialValue={applyTitle}
            placeholder="请输入"
            rules={[{ required: true, max: 50 }]}
            readonly={readonly}
            fieldProps={{
              showCount: true,
              maxLength: 50,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'成本合计'}
            name="costTotalPrice"
            initialValue={costTotalPrice}
            placeholder="请输入"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'报废售价合计'}
            name="scrapTotalPrice"
            initialValue={scrapTotalPrice}
            placeholder="请输入"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={'报废供应商'}
            name="afterSales"
            initialValue={afterSales?.value}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
            rules={[{ required: true }]}
            showSearch={false}
            fieldProps={{
              labelInValue: true,
              open: false,
              onClick: () => {
                setIsVisibleModal(true);
              },
            }}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={'R3联系人'}
            name="contactName"
            // options={r3List}
            readonly={readonly}
            initialValue={contactName?.value}
            rules={[{ required: true }]}
            fieldProps={{
              labelInValue: true,
              dropdownStyle: {
                maxHeight: '300px',
              },
              open: false,
              onClick: () => {
                if (customerCode) {
                  R3ModalRef?.current?.open(customerCode);
                  // queryContact({ customerCode }).then((res: any) => {
                  //   if (res.errCode === 200) {
                  //     const concatList = res?.data?.dataList?.map((io: any) => ({
                  //       label: io.contactName,
                  //       value: io.contactCodeR3,
                  //     }));
                  //     setR3List(concatList);
                  //   }
                  // });
                }
              },
              // onChange: (val: any) => {
              //   onChangeBasic &&
              //     onChangeBasic({
              //       ...rowData, //?选择的用户的行信息
              //       contactName: { label: val.label, value: val.value },
              //     });
              // },
            }}
            placeholder="请选择"
            allowClear={false}
          />
          {/* <Form.Item
            label={'R3联系人'}
            name="contactName"
            // initialValue={contactName?.value}
            rules={[{ required: true }]}
          >
            <Select
              placeholder="请选择R3联系人"
              readOnly={true}
              onSearch={() => {
                onSearch();
              }}
              onClick={() => {
                onSearch();
              }}
            />
          </Form.Item> */}
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'所属公司'}
            initialValue={companyName}
            name="companyName"
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12} className={readonly ? 'wordBreak' : ''}>
          <ProFormTextArea
            name={'applyReason'}
            initialValue={applyReason}
            label="申请原因"
            placeholder={'请输入，最多255字'}
            fieldProps={{ maxLength: 255, showCount: true }}
            rules={[{ required: true, message: '请选择' }]}
            readonly={readonly}
          />
        </Col>
      </Row>

      <Modal
        title={'选择供应商'}
        visible={isVisibleModal}
        destroyOnClose
        width={1000}
        onOk={() => {
          setIsVisibleModal(false);
          onChangeBasic && onChangeBasic(rowData);
        }}
        onCancel={() => {
          setIsVisibleModal(false);
        }}
      >
        <SelectCustomer
          column={columnCustomer}
          getData={(params) => getData(params)}
          onSelect={(rows) => setRowData(rows[0])}
          onDbSave={(record) => dbSave(record)}
        />
      </Modal>
      <R3Modal ref={R3ModalRef} operateMethod={operateMethod} />
    </>
  );
};

export default BasicInfo;
