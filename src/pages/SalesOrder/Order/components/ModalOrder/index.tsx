import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useState } from 'react';
import { message, Form } from 'antd';
import { getByKeys } from '@/services';
import { quickModifyStatusData, quickModifyStatus } from '@/services/SalesOrder';
export default ({ open, visit, id }) => {
  return (
    <ModalForm
      title="修改订单状态"
      visible={open}
      modalProps={{
        destroyOnClose: true,
      }}
      width={400}
      onFinish={async (val) => {
        const res = await quickModifyStatus(val);
        if (res.errCode === 200) {
          message.success('提交成功');
          return true;
        }
        message.error(res.errMsg);
        return false;
      }}
      onVisibleChange={visit}
      request={async () => {
        const res = await quickModifyStatusData(id);
        return {
          orderNo: id,
          ...res.data,
        };
      }}
    >
      <ProFormText name="orderNo" width="md" disabled label="订单号" />
      <ProFormSelect
        width="md"
        rules={[{ required: true, message: '这是必填项' }]}
        fieldProps={{
          fieldNames: { label: 'name', value: 'code' },
        }}
        request={async () => {
          const res = await getByKeys({ list: ['orderStatusEnum'] });
          return res.data && res.data[0].enums;
        }}
        name="orderStatus"
        label="订单状态"
      />
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          return (
            <ProFormSelect
              disabled={!getFieldValue('replaceStatus')}
              // rules={[{ required: true, message: '这是必填项' }]}
              width="md"
              fieldProps={{
                fieldNames: { label: 'name', value: 'code' },
              }}
              request={async () => {
                const res = await getByKeys({ list: ['quickModifyStatusEnum'] });
                return (
                  res.data &&
                  res.data[0].enums.map((e) => {
                    return {
                      ...e,
                      disabled: e.code === 90 ? false : true,
                    };
                  })
                );
              }}
              name="replaceStatus"
              label="MDM赋码状态"
            />
          );
        }}
      </Form.Item>
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          return (
            <ProFormSelect
              width="md"
              disabled={!getFieldValue('appointSupplierStatus')}
              // rules={[{ required: true, message: '这是必填项' }]}
              fieldProps={{
                fieldNames: { label: 'name', value: 'code' },
              }}
              request={async () => {
                const res = await getByKeys({ list: ['quickModifyStatusEnum'] });
                return (
                  res.data &&
                  res.data[0].enums.map((e) => {
                    return {
                      ...e,
                      disabled: e.code === 90 ? false : true,
                    };
                  })
                );
              }}
              name="appointSupplierStatus"
              label="项目单匹配状态"
            />
          );
        }}
      </Form.Item>
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          return (
            <ProFormSelect
              disabled={getFieldValue('approvalMark') !== 1}
              width="md"
              rules={[{ required: true, message: '这是必填项' }]}
              fieldProps={{
                fieldNames: { label: 'name', value: 'code' },
              }}
              request={async () => {
                const res = await getByKeys({ list: ['whetherEnum'] });
                return res.data && res.data[0].enums;
              }}
              name="approvalMark"
              label="是否审批中"
            />
          );
        }}
      </Form.Item>

      <ProFormSelect
        width="md"
        rules={[{ required: true, message: '这是必填项' }]}
        fieldProps={{
          fieldNames: { label: 'name', value: 'code' },
        }}
        request={async () => {
          const res = await getByKeys({ list: ['whetherEnum'] });
          return res.data && res.data[0].enums;
        }}
        name="afterSales"
        label="是否售后"
      />
      <ProFormText
        width="md"
        name="applicant"
        label="申请人"
        rules={[{ required: true, message: '这是必填项' }]}
      />
    </ModalForm>
  );
};
