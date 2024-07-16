import { getR3ConList } from '@/services/SalesOrder';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const BasicInfo = (props: any, Ref: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [customerCode, setCustomerCode] = useState();
  const ref = useRef<ActionType>();
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(rowKeys);
      props.operateMethod(selectedRows);
    },
    // getCheckboxProps: (record: any) => ({
    //   disabled: record.effective === '0', // Column configuration not to be checked
    //   effective: record.effective,
    // }),
  };
  const r3Cols: any[] = [
    {
      title: '#',
      width: 40,
      dataIndex: 'index',
      valueIndex: 'index',
      render(text: number) {
        return (currentPage - 1) * currentPageSize + text + 1;
      },
      search: false,
    },
    // { title: '联系人号', width: 150, dataIndex: 'contactCodeR3', ellipsis: true, search: false },
    { title: '联系人号', width: 150, dataIndex: 'contactCode', ellipsis: true, search: false },
    { title: '联系人名称', width: 150, dataIndex: 'contactName', ellipsis: true, search: true },
    {
      title: '是否已冻结',
      width: 150,
      dataIndex: 'effective',
      ellipsis: true,
      search: false,
      render(_: any, record: any) {
        if (record.effective == 0) {
          return '否';
        } else if (record.effective == 1) {
          return '是';
        }
      },
      // render(record: any) {
      //   return record;
      // },
    },
    { title: '联系人邮箱', width: 260, dataIndex: 'email', ellipsis: true, search: false },
    { title: '联系人手机', width: 150, dataIndex: 'mobile', ellipsis: true, search: false },
    { title: '联系人固话', width: 150, dataIndex: 'tel', ellipsis: true, search: false },
  ];
  function onShowSizeChange(current: any, pageSize: any) {
    setSelectedRowKeys([]);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    props.operateMethod('');
  }
  function open(customerCode_: any) {
    setCustomerCode(customerCode_);
    setIsModalVisible(true);
  }
  function modalOK() {
    setIsModalVisible(false);
  }
  useImperativeHandle(Ref, () => ({
    open,
  }));
  return (
    <Modal
      title={'选择R3联系人'}
      visible={isModalVisible}
      width={'70%'}
      destroyOnClose={true}
      onOk={modalOK}
      onCancel={() => {
        setIsModalVisible(false);
      }}
    >
      <ProTable<any>
        id="fromCrm"
        className="emptySpecialTable"
        locale={{
          emptyText: () => (
            <>
              <div style={{ marginBottom: '20px' }}>暂无数据</div>
              <div>请前往CRM系统维护相关客户数据</div>
            </>
          ),
        }}
        columns={r3Cols}
        bordered
        size="small"
        scroll={{ x: 100, y: 300 }}
        request={async (params: any) => {
          params.pageNumber = params.current;
          params.pageSize = params.pageSize;
          params.customerCode = customerCode;
          setCurrentPage(params.pageNumber);
          setCurrentPageSize(params.pageSize);
          const result = await getR3ConList(params);
          if (result?.data) {
            const list = result.data.dataList?.map((item: any, index: number) => {
              item.index = index;
              return item;
            });
            return Promise.resolve({
              data: list,
              total: result.data.dataList?.length,
              success: true,
            });
          } else {
            message.error(result.errMsg, 3);
            return Promise.resolve([]);
          }
        }}
        search={{
          labelWidth: 'auto',
          span: 8,
          defaultCollapsed: false,
          collapseRender: false,
          className: 'search-form',
        }}
        rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
        options={false}
        rowKey="index"
        tableAlertRender={false}
        actionRef={ref}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRowKeys([record.index]);
              props.operateMethod([record]);
            }, // 点击行
            onDoubleClick: () => {
              props.operateMethod([record]);
              modalOK();
            },
          };
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
      />
    </Modal>
  );
};

export default forwardRef(BasicInfo);
