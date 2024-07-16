import { getReplaceItemInfo } from '@/services/SalesOrder';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, InputNumber, message, Modal } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AtoBDrawer from '../AtoBDrawer';
import './index.less';
import { queryGrossProfitBySku } from '@/services/System/Inventory';
const Index = function ({ fn, btnClickStatus, resetBtnStatus }: any, ref: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [OrderNo, setOrderNo] = useState('');
  const [selectedRows, setSelectedRows]: any = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowskeys]: any = useState([]);
  const [textareavalue, setTextareavalue] = useState('');
  // const [rowData, setRowData]: any = useState([]); //?存储当前商品明细table的所有信息1
  // const [exrowData, setExRowData]: any = useState([]); //?存储上一个列表的上一个列表的行信息
  const [confirmload, setConfirmload]: any = useState(false);
  const tableRef: any = useRef([]);
  const [replaceArr, setReplaceArr]: any = useState([]);
  const [total, setTotal] = useState();
  const DrawerRef: any = useRef();
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const [selectedMDMRow, setSelectedMDMRow]: any = useState([]);
  const [selectedRowKeysMDM, setSelectedRowKeysMDM]: any = useState([]);
  const [MDMtableData, setMDMtableData] = useState<any>([]);

  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
  const open = async (row: any, aTobArr: any) => {
    setReplaceArr(aTobArr);
    setTotal(aTobArr.length);
    setOrderNo(row.orderNo);
    setVisible(true);
    setSelectedRows([]);
    setSelectedRowskeys([]);
  };
  const close = () => {
    setVisible(false);
  };
  // const distinctmore = (arr: any, key1: any, key2: any, key3?: any) => {
  //   //?数组中的对象去重
  //   const newArr = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     let flag = true;
  //     for (let j = 0; j < newArr.length; j++) {
  //       if (
  //         arr[i][key1] == newArr[j][key1] &&
  //         arr[i][key2] == newArr[j][key2] &&
  //         arr[i][key3] == newArr[j][key3]
  //       ) {
  //         flag = false;
  //         break;
  //       }
  //     }
  //     if (flag) {
  //       newArr.push(arr[i]);
  //     }
  //   }
  //   return newArr;
  // };
  const handleOk = async (): Promise<any> => {
    // ? 弹框点击下一步
    setConfirmload(true);
    // ? 对空对象进行去除，后端提交参数优化
    const arr = replaceArr.filter((item: any) => {
      return !!item.skudetail;
    });
    if (!arr.length) {
      setConfirmload(false);
      return message.error('请设置需要替换的订单');
    }
    const Arr = arr.map((item: any) => {
      return {
        orderLineId: item.orderLineId,
        replaceInfo: item.skudetail,
      };
    });
    const params = {
      orderNo: OrderNo,
      dataList: Arr,
    };
    // console.log(JSON.stringify(params));
    const res = await getReplaceItemInfo(params);
    // console.log(res, 'res111');
    // const arr = distinctmore(res.data, 'replaceSku', 'replaceQty')
    if (res.errCode === 200 && res.data?.length > 0) {
      DrawerRef?.current?.openDrawer(OrderNo, null, null, res.data);
      setVisible(false);
    } else if (res.data?.length == 0) {
      message.warning('无法查询该替换信息');
    } else if (res.errCode === 500) {
      message.warning('后端服务器出错');
    } else {
      message.warning(res.errMsg);
    }
    setConfirmload(false);
  };

  const getSkuList = async (sku: any) => {
    await setMDMtableData([]);
    await setSelectedRowKeysMDM([]);
    await setSelectedMDMRow([]);
    queryGrossProfitBySku({ sku }).then((res: any) => {
      const { data, errCode, errMsg } = res;
      if (errCode == 200) {
        setMDMtableData(data.dataList);
      } else {
        message.error(errMsg);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: async (selectedRowKeyss: React.Key[], selectedRows_: any) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeyss}`,
        'selectedRows_: ',
        selectedRows_,
        selectedRowKeyss,
      ); //这个打印可能很重要
      setSelectedRows(selectedRows_); //?将当前的行信息存储起来
      setSelectedRowskeys(selectedRowKeyss); //?将当前的行号存储起来
      setTextareavalue(selectedRows_[0].skudetail);
      getSkuList(selectedRows_[0].sku);
    },
  };
  const replacefn = (e: any) => {
    //?文本域改变事件
    setTextareavalue(e.target.value.replace(/[^\a-\z\A-\Z0-9\,\.\ |\n]/g, ''));
    //! 只让用户输入规定的英文逗号，回车，或者空格，其他的不允许输入
  };
  const saveSKU = async () => {
    //add 增加list業務
    if (MDMtableData.length > 0 && selectedMDMRow.length > 0) {
      if (!selectedMDMRow[0].skuNum) {
        message.error('请填写替换数量');
        return;
      }
      setReplaceArr(
        replaceArr.map((item: any) => {
          if (item.sid === selectedRowKeys[0]) {
            return {
              ...item,
              skudetail: `${selectedMDMRow[0].replaceSku},${selectedMDMRow[0].skuNum || 1}`, //?把更改的同步到表格上去
            };
          } else {
            return item;
          }
        }),
      );
    }
    if (MDMtableData.length == 0 && selectedRows.length == 0) {
      return message.warning('请先选择列表项');
    }
    if (MDMtableData.length !== 0 && (selectedMDMRow.length == 0 || selectedRows.length == 0)) {
      return message.warning('请先选择列表项');
    }

    //?保存按钮事件
    if (selectedRows.length > 0 && MDMtableData.length == 0) {
      setReplaceArr(
        replaceArr.map((item: any) => {
          if (item.sid === selectedRowKeys[0]) {
            return {
              ...item,
              skudetail: textareavalue, //?把更改的同步到表格上去
            };
          } else {
            return item;
          }
        }),
      );
    }
  };
  const afterClose = () => {
    setTextareavalue('');
    setMDMtableData([]);
    setSelectedRowKeysMDM([]);
    setSelectedMDMRow([]);
  };
  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  const infoColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SKU', dataIndex: 'sku', width: 120, fixed: 'left' },
    { title: '数量', dataIndex: 'qty', width: 100 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 120 },
    { title: '产品名称', dataIndex: 'productNameConcatStr', width: 260 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 100 },
    {
      title: '替换SKU信息',
      dataIndex: 'skudetail',
      width: 200,
      render(_, record) {
        return <span className="replaceDetil">{record.skudetail}</span>;
      },
    },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  const delRow = (): any => {
    if (selectedRowKeys.length == 0) {
      return message.warning('请先选择列表项');
    }
    const res = replaceArr.filter((item: any) => {
      return item.sid !== selectedRowKeys[0];
    });
    setReplaceArr(res);
    setTotal(res.length);
    setSelectedRowskeys([]);
  };

  const infoMDMColumn: ProColumns<any>[] = [
    {
      title: '替换SKU号',
      dataIndex: 'replaceSku',
      width: 120,
      fixed: true,
    },
    {
      title: '替换SKU数量',
      dataIndex: 'skuNum',
      width: 100,
      render: (_, record: any) => {
        return (
          <InputNumber
            precision={0}
            min={1}
            // defaultValue={1}
            onChange={(v) => (record.skuNum = v)}
          />
        );
      },
    },
    { title: '替换SKU名称', dataIndex: 'replaceSkuName', width: 100, ellipsis: true },
    { title: '替换SKU品牌', dataIndex: 'branchName', width: 120, ellipsis: true },
    { title: '供应商名称', dataIndex: 'supplierName', width: 120, ellipsis: true },
  ];

  return (
    <div>
      <Modal
        className="OderMyModal"
        title="替换SKU"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => {
          setVisible(false);
          setMDMtableData([]);
          setSelectedRowKeysMDM([]);
          setSelectedMDMRow([]);
        }}
        width={1600}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false);
              setMDMtableData([]);
              setSelectedRowKeysMDM([]);
              setSelectedMDMRow([]);
            }}
          >
            取消
          </Button>,
          <Button key="submit" loading={confirmload} type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
        zIndex={1001}
        afterClose={afterClose}
        // destroyOnClose={true}
      >
        <div className="left">
          <div className="Oldertitle">原SKU </div>
          <div className="Oldertitle">每次仅可选择一个原SKU进行替换，支持1对多替换</div>
          <Button danger className="deleteBtn light_danger" onClick={delRow}>
            删除
          </Button>
          <ProTable<any>
            columns={infoColumn}
            bordered
            size="small"
            rowKey="sid"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              // showTotal: total => `共有 ${total} 条数据`,
              total: total,
              showTotal: (_, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            }}
            dataSource={replaceArr}
            search={false}
            tableAlertRender={false}
            actionRef={tableRef}
            defaultSize="middle"
            scroll={{ x: 0 }}
            toolBarRender={false}
            options={{ reload: false, density: false }}
            rowSelection={{ type: 'radio', ...rowSelection }}
            style={{ width: 'calc(100% - 40px)', margin: '10px auto' }}
            onRow={(record) => {
              return {
                onClick: () => {
                  // console.log(123, '122333', record, [record.sid], selectedRowKeys);
                  setTextareavalue(record.skudetail);
                  setSelectedRowskeys([record.sid]);
                  setSelectedRows([record]);
                  getSkuList(record.sku);
                }, // 点击行
                // onDoubleClick: () => {
                //   setTextareavalue(record.skudetail);
                //   setSelectedRowskeys([record.sid]);
                //   setSelectedRows([record]);
                // },
              };
            }}
          />
        </div>
        <div className="right">
          <div className="top">
            <h1>替换SKU</h1>
            {MDMtableData.length > 0 ? (
              <div>
                <ProTable<any>
                  columns={infoMDMColumn}
                  bordered
                  size="small"
                  dataSource={MDMtableData}
                  rowKey="replaceSku"
                  rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedRowKeysMDM,
                    onChange: (rowKeys: any, selectedRows1: any) => {
                      setSelectedMDMRow(selectedRows1);
                      setSelectedRowKeysMDM(rowKeys);
                    },
                  }}
                  // onRow={(record: any) => {
                  //   return {
                  //     onClick: () => {
                  //       if (selectedRowKeys.includes(record.orderLineId)) {
                  //         const newKeys = selectedRowKeys.filter(
                  //           (item: any) => item !== record.orderLineId,
                  //         );
                  //         setSelectedRowKeys(newKeys);
                  //         const newRows = selectedRow.filter(
                  //           (item: any) => item.orderLineId !== record.orderLineId,
                  //         );
                  //         setSelectedRow(newRows);
                  //       } else {
                  //         setSelectedRowKeys(selectedRowKeys.concat([record.orderLineId]));
                  //         setSelectedRow(selectedRow.concat([record]));
                  //       }
                  //     },
                  //   };
                  // }}
                  search={false}
                  tableAlertRender={false}
                  defaultSize="small"
                  scroll={{ x: 0, y: 700 }}
                  options={{ reload: false, density: false }}
                  // toolBarRender={true}
                  // actionRef={tableRef}
                  pagination={false}
                />
              </div>
            ) : (
              <div className="inner">
                <Input.TextArea
                  onChange={replacefn}
                  value={textareavalue}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            )}
            <div className="bottom">
              <Button onClick={saveSKU} className="SKUsaveBtn">
                保存
              </Button>
            </div>
          </div>
          <div className="note">
            <div>
              1.从系统或本地文件中复制万物集库存号(SKU)和产品数量，粘贴到上方输入框(清单内的SKU直接选择替换SKU并手工填写替换数量)
            </div>
            <div>2.支持批量输入SKU，每行为一个SKU，每行数据格式如下:</div>
            <div className="blue">万物集库存号 [空格或逗号] 数量</div>
            <div>输入示例：</div>
            <div>1A1234 30</div>
            <div>1A5678,30</div>
          </div>
        </div>
      </Modal>
      <AtoBDrawer
        ref={DrawerRef}
        fn={fn}
        resetBtnStatus={resetBtnStatus}
        setVisible={setVisible}
        btnClickStatus={btnClickStatus}
      />
    </div>
  );
};
export default forwardRef(Index);
