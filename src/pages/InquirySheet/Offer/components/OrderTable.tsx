/* eslint-disable @typescript-eslint/no-unused-expressions */
import { transferOrder, transferSecondOrder } from '@/services/InquirySheet/offerOrder';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space, message, Spin, Pagination } from 'antd';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { NumStatus } from '../../contants';

interface OrderTableProps {
  ids: any;
  // dataList?: Record<any, any>;
  OnSelect?: (ids: any, data: any) => void;
  onError?: () => void;
  // pageTotal?: any;
  selectRows?: any;
  modalVisible?: any;
  getAllSkuData?: any;
}

type TableListItem = Record<any, any>;

const OrderTable: React.FC<OrderTableProps> = (
  {
    // dataList = [] as any,
    OnSelect,
    ids = [] as any,
    // pageTotal,
    selectRows,
    modalVisible,
    getAllSkuData,
    onError,
  }: any,
  ref: any,
) => {
  const [tableData, setTableData] = useState([]);
  const [pageTotal, setPageTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeNum, setPageSizeNum] = useState(200);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]); //表格数据
  const [selectedRow, setSelectedRow]: any = useState([]);
  const tableRef: any = useRef();
  const [countLine, setCountLine] = useState<any>(0);

  useEffect(() => {
    if (ids.length == 0) return;
    transferSecondOrder({ quotIdList: ids }).then((res: any) => {
      const { errCode, data, errMsg } = res;
      if (errCode === 200) {
        setCountLine(data?.lines?.length);
      } else {
        message.error(errMsg);
      }
    });
  }, [ids]);

  const rowSelection = {
    selectedRowKeys,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelect: (record: any, selected: any, _selectedRow: any) => {
      // console.log('record:', record);
      let keys: any = [...selectedRowKeys];
      let rows: any = [...selectedRow];
      if (selected) {
        keys = [...selectedRowKeys, record.quotLineId];
        rows = [...selectedRow, record];
      } else {
        keys = selectedRowKeys.filter((item: any) => item !== record.quotLineId);
        rows = selectedRow.filter((item: any) => item.quotLineId !== record.quotLineId);
      }
      // console.log(selected, 'selected', _selectedRow, keys, rows);
      setSelectedRowKeys(keys);
      setSelectedRow(rows);
      OnSelect(keys, rows);
    },
    onSelectAll: (selected: any, _selectedRows: any, changeRows: any) => {
      // console.log(changeRows, 'changeRows', _selectedRows);
      if (selected) {
        const addCheckedKeys = changeRows.map((item: { quotLineId: any }) => {
          return item.quotLineId;
        });
        setSelectedRowKeys([...selectedRowKeys, ...addCheckedKeys]);
        setSelectedRow([...selectedRow, ...changeRows]);
        OnSelect([...selectedRowKeys, ...addCheckedKeys], [...selectedRow, ...changeRows]);
      } else {
        const subCheckedKeys = selectedRowKeys.filter((id: any) => {
          return !changeRows.some((item: { quotLineId: any }) => {
            return item.quotLineId === id;
          });
        });
        // console.log(selectedRow, 'selectedRow');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const subArr = selectedRow.filter((element: any, index: any) => {
          const flag = changeRows.find((e: any) => {
            // console.log(e.quotLineId, 'e.quotLineId', element.quotLineId, index);
            return e.quotLineId == element.quotLineId;
          });
          if (flag) {
            return false;
          } else {
            return true;
          }
        });
        setSelectedRowKeys(subCheckedKeys);
        setSelectedRow(subArr);
        // console.log(subArr, 'subArr');
        OnSelect(subCheckedKeys, subArr);
      }
    },
  };
  const onShowSizeChange = async (current: any, pageSize: any) => {
    setCurrentPage(current);
    setPageSizeNum(pageSize);
    setLoading(true);
    const params = {
      quotIdList: ids,
      customerCode: selectRows[0]?.customerCode,
      pageNumber: current || 1,
      pageSize: pageSize || 200,
    };
    const { data, errCode, errMsg } = await transferOrder(params);
    // console.log(data, 'data', errCode, params, total);
    if (errCode === 200) {
      data?.list.forEach((element: any, index: any) => {
        element.index = index;
      });
      setTableData(data?.list);
      getAllSkuData(data?.list);
      setPageTotal(data?.total);
      // setModalVisible(true);
    } else {
      onError(errMsg);
      message.error(errMsg);
    }
    setLoading(false);
  };
  useLayoutEffect(() => {
    if (modalVisible) {
      setSelectedRowKeys([]);
      setSelectedRow([]);
      onShowSizeChange(1, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);
  function reloadTable() {
    // tableRef.current.reload();
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      render: (_) => <a>{_}</a>,
    },
    {
      title: 'SKU号',
      width: 100,
      dataIndex: 'sku',
    },
    {
      title: '产品名称（中文）',
      width: 300,
      dataIndex: 'productNameZh',
      render: (_, record: any) => {
        return `${record?.productNameZh}`;
      },
    },
    {
      title: '转订单状态',
      width: 100,
      dataIndex: 'lineStatus',
      render: (_, record: any) => NumStatus[record.lineStatus],
    },
    {
      title: '报价数量',
      width: 80,
      dataIndex: 'qty',
    },
    {
      title: '已清数量',
      width: 80,
      dataIndex: 'closeQty',
    },
    {
      title: '需求数量',
      width: 80,
      dataIndex: 'reqQty',
    },
    {
      title: '成交价含税',
      width: 120,
      dataIndex: 'salesPrice',
    },
    {
      title: '成交价未税',
      width: 120,
      dataIndex: 'salesPriceNet',
    },
    {
      title: '行运费',
      width: 80,
      dataIndex: 'freight',
    },
    {
      title: '客户物料号',
      width: 100,
      dataIndex: 'customerSku',
    },
    {
      title: '需求采购单位',
      width: 100,
      dataIndex: 'reqUom',
    },
    {
      title: 'SKU类型',
      width: 100,
      dataIndex: 'skuTypeName',
    },
    {
      title: 'SKU状态',
      width: 100,
      dataIndex: 'bizStatus',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useImperativeHandle(ref, () => ({
    reloadTable,
    onShowSizeChange,
  }));
  // const canTransLength = tableData?.filter(
  //   (ic: any) => ic.lineStatus == 10 || ic.lineStatus == 80 || ic.lineStatus == 100,
  // ).length;

  return (
    <Spin spinning={loading}>
      <ProTable<TableListItem>
        bordered
        size="small"
        tableStyle={{ padding: 0 }}
        scroll={{ x: 200, y: 400 }}
        columns={columns}
        rowSelection={{
          alwaysShowAlert: true,
          type: 'checkbox',
          ...rowSelection,
          // onChange: (rowKeys, rowData) => {
          //   console.log(rowKeys, rowData);
          //   onSelect && onSelect(rowKeys, rowData);
          // },
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (record?.enabledFlag == 0) {
                return false;
              }
              const selectedRowKeys1 = [...selectedRowKeys];
              const newList = [...tableData] as any;
              if (selectedRowKeys1.indexOf(record.quotLineId) >= 0) {
                selectedRowKeys1.splice(selectedRowKeys1.indexOf(record.quotLineId), 1);
                newList.forEach((item: any, index: any) => {
                  if (item.quotLineId === record.quotLineId) {
                    newList.splice(index, 1);
                  }
                });
              } else {
                selectedRowKeys1.push(record.quotLineId);
                newList.push(record);
              }
              setSelectedRowKeys(selectedRowKeys1);
              OnSelect && OnSelect(selectedRowKeys1, newList);
            },
          };
        }}
        // eslint-disable-next-line @typescript-eslint/no-shadow
        tableAlertRender={({ selectedRowKeys }) => (
          <Space size={24}>
            {/* <span>
              数据统计：已选 {ids.length}个报价单，{tableData?.length}行需求， 其中
              {canTransLength} 行可转订单；当前已选明细{selectedRowKeys.length}行
            </span> */}
            <span>
              数据统计：已选 {ids.length}个报价单，{countLine} 行可转订单；当前已选明细
              {selectedRowKeys.length}行
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return false;
        }}
        actionRef={tableRef}
        dataSource={tableData}
        options={false}
        search={false}
        rowKey="quotLineId"
        pagination={false}
      />
      <Pagination
        size="small"
        total={pageTotal}
        onChange={onShowSizeChange}
        showSizeChanger
        showQuickJumper
        current={currentPage}
        pageSize={pageSizeNum}
        pageSizeOptions={['10', '20', '50', '100', '200']}
        // style={{ display: 'none' }}
      />
    </Spin>
  );
};

export default forwardRef(OrderTable);
