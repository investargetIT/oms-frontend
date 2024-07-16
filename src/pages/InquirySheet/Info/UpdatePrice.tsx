import React, { useState, useRef } from 'react';
import { Button, Modal, message, Empty } from 'antd';
import ProTable from '@ant-design/pro-table';
import { searchToUpdatePrice, updatePrice } from '@/services/InquirySheet';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
const UpdatePrice: React.FC<{
  recall: any;
  inquiryId?: any;
  custPurpose: any;
  customerCode: any;
}> = ({ inquiryId, custPurpose, customerCode, recall }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [list, setList] = useState([]);
  const ref = useRef<ActionType>();
  const onOperate = (): any => {
    if (!inquiryId) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    setIsModalVisible(true);
    ref.current?.reload();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    updatePrice(inquiryId, list).then((res: any) => {
      if (res.errCode === 200) {
        message.success('更新成功!');
        if (recall) recall();
        handleCancel();
      } else {
        message.error(res.errMsg);
      }
    });
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{index + 1}</span>;
      },
    },
    { title: '行项目ID', width: 160, dataIndex: 'inqLineId', fixed: 'left' },
    { title: 'SKU', width: 120, dataIndex: 'sku' },
    { title: '产品名称(中文)', width: 150, dataIndex: 'productNameZh' },
    { title: '含税面价', width: 120, dataIndex: 'listPrice' },
    { title: '当前成交价含税', width: 120, dataIndex: 'oldSalesPrice' },
    { title: '当前折扣类型', width: 150, dataIndex: 'oldDiscountCode' },
    { title: '最新报价含税', width: 120, dataIndex: 'salesPrice' },
    { title: '最新折扣类型', width: 150, dataIndex: 'discountCode' },
    // { title: '更新原因', width: 120, dataIndex: 'updateReason' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div>
      <Button size="small" onClick={onOperate} type="primary">
        更新报价
      </Button>
      <Modal
        title="更新报价(只更新目录品报价，并屏蔽限量促销价格)"
        destroyOnClose
        maskClosable={false}
        visible={isModalVisible}
        onOk={handleOk}
        okButtonProps={{ disabled: hasNoData }}
        width={1600}
        okText={'更新报价'}
        onCancel={handleCancel}
      >
        <ProTable<any>
          columns={columns}
          request={async () => {
            setHasNoData(true);
            const res: any = await searchToUpdatePrice({ inquiryId, custPurpose, customerCode });
            if (res.errCode === 200) {
              const tempList: any = res.data?.dataList || [];
              if (tempList.length > 0) setHasNoData(false);
              setList(tempList);
              return Promise.resolve({ data: tempList, total: res.data?.total, success: true });
            } else {
              message.error(res.errMsg);
              return Promise.resolve([]);
            }
          }}
          options={{ reload: false, density: false }}
          rowKey="inqLineId"
          search={false}
          tableAlertRender={false}
          actionRef={ref}
          defaultSize="small"
          scroll={{ x: 200, y: 300 }}
          bordered
          size="small"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100', '200'],
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            showQuickJumper: true,
          }}
          locale={{
            emptyText: <Empty description="当前无可更新价格的行明细!" />,
          }}
          className="inquiryAddNewTable"
        />
      </Modal>
    </div>
  );
};

export default UpdatePrice;
