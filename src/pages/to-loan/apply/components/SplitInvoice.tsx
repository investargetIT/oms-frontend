/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, InputNumber, message, Modal, Row, Tabs } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import leftSrc from '../static/left.png';
import rightSrc from '../static/right.png';
const initialItems: any[] | (() => any[]) = [
  // { label: 'Tab 1', children: '', key: '1' },
];

const SplitInvoice = (
  { splitInfo = {} as any, leftTable, setleftTable, tabHandle, channelVal }: any,
  ref: any,
) => {
  const leftTableRef: any = useRef();
  const [activeKey, setActiveKey] = useState('');
  const [items, setItems]: any = useState(initialItems);
  const newTabIndex = useRef(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [selectedRowKeysRight, setSelectedRowKeysRight]: any = useState([]);
  const [visibleHeadFreight, setHeadFreight] = useState<boolean>(false);
  const [reload, setReload] = useState(true); //?让tabs组件重新刷新
  const [disableHeadFreight, setDisableHeadFreight] = useState<boolean>(false); //头运费按钮
  const [spFreight, setSpFreight] = useState(0);
  const tableData: any = useRef([]);
  const ArrData: any = useRef([]); //?右边容器
  const actKey: any = useRef('');
  const tableRef: any = useRef('');
  const leftTableDataRef: any = useRef('');
  const [form] = Form.useForm();
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SKU', width: 160, dataIndex: 'sku', fixed: 'left' },
    { title: '原开票数量', width: 120, dataIndex: 'originalQty' },
    { title: '开票小计含税', width: 150, dataIndex: 'originaSubtotalPrice' },
    {
      title: '可拆数量',
      width: 120,
      dataIndex: 'detachableQty',
      render: (_, record: any) => {
        if (channelVal == 22) {
          return Number(myFixed(record.detachableQty, 2));
        } else {
          return Number(record.detachableQty).toFixed(0);
        }
      },
    },
    {
      title: '已拆数量',
      width: 120,
      dataIndex: 'dismantledQty',
      render: (_, record: any) => {
        if (channelVal == 22) {
          return Number(myFixed(record.dismantledQty, 2));
        } else {
          return Number(record.dismantledQty).toFixed(0);
        }
      },
    },
  ];
  function getData() {}
  useImperativeHandle(ref, () => ({
    getData,
  }));
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (rowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(rowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.sku === 'S00001', // Column configuration not to be checked
    }),
  };
  const rowSelectionRight: any = {
    type: 'checkbox',
    selectedRowKeysRight,
    onChange: (rowKeys: any) => {
      setSelectedRowKeysRight(rowKeys);
    },
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    actKey.current = newActiveKey;
    // ? 切换的时候，需要将原来的大容器的arr找到，然后给到右侧表格
    const activeArr = ArrData?.current?.find((ele: any) => ele.key == newActiveKey);
    if (activeArr) {
      tableData.current = JSON.parse(JSON.stringify(activeArr?.arr));
    } else {
      //?编辑逻辑不需要sid
      tableData.current = JSON.parse(JSON.stringify(selectedRow));
    }
    tableRef?.current && tableRef?.current?.reload();
    setSelectedRowKeysRight([]);
  };
  const HeadFreight = () => {
    if (!activeKey) {
      Modal.warning({ title: '请选择需要拆入运费的发票!' });
      return false;
    } else {
      setHeadFreight(true);
    }
  };
  const HeadFreightOK = () => {
    const price = form.getFieldsValue();
    // ? 判断拆分的运费总数是否超了
    let otherCount = 0; //?除了当前的tab的所有运费
    for (let i = 0; i < ArrData?.current.length; i++) {
      const element = ArrData?.current[i];
      if (element.key === activeKey) {
        continue;
      } else {
        const eleprice: any =
          element.arr.find((ele: any) => ele.sku === 'S00001')?.splitSubtotalPrice || 0;
        otherCount = otherCount + eleprice;
      }
    }
    if (price.splitSubtotalPrice + otherCount > splitInfo?.loanOriginalInvoiceVo?.originalFreight) {
      return message.error('拆入运费金额大于可拆数值');
    }

    //? 找到sku为s00001的itemNo
    const leftItemNo = leftTable.find((ele: any) => ele.sku === 'S00001').itemNo;
    const leftLoanApplyNo = leftTable.find((ele: any) => ele.sku === 'S00001').loanApplyNo;
    const leftSubtotalPrice = leftTable.find(
      (ele: any) => ele.sku === 'S00001',
    ).originaSubtotalPrice;
    // ?先判断右侧数据有无运费
    const FreightItem = tableData?.current.find((ele: any) => ele.sku === 'S00001');
    let newTable: any = [];
    if (FreightItem) {
      //?如果找到了的话就替换
      newTable = tableData.current.map((ele: any) => {
        if (ele.sku === 'S00001') {
          return {
            sid: null,
            loanApplyNo: leftLoanApplyNo,
            originaSubtotalPrice: leftSubtotalPrice,
            splitSubtotalPrice: price.splitSubtotalPrice,
            sku: 'S00001',
            originalQty: 1,
            qty: 1,
            itemNo: leftItemNo,
          };
        } else {
          return ele;
        }
      });
    } else {
      //?如果没找到就添加进去
      newTable = tableData.current.concat({
        sid: null,
        loanApplyNo: leftLoanApplyNo,
        originaSubtotalPrice: leftSubtotalPrice,
        splitSubtotalPrice: price.splitSubtotalPrice,
        originalQty: 1,
        sku: 'S00001',
        qty: 1,
        itemNo: leftItemNo,
      });
    }
    tableData.current = JSON.parse(JSON.stringify(newTable)); //*处理右侧数据
    //* 处理大容器,这里大容器肯定存在，所以不用判断是否存在
    ArrData.current = ArrData?.current?.map((ele: any) => {
      if (ele.key === actKey?.current) {
        return {
          ...ele,
          arr: JSON.parse(JSON.stringify(newTable)),
        };
      } else {
        return ele;
      }
    });
    tabHandle(ArrData.current);
    //*处理左侧数据
    let count = 0; //?总的已拆数量
    for (let i = 0; i < ArrData?.current.length; i++) {
      const element = ArrData?.current[i];
      const eleprice: any =
        element.arr.find((ele: any) => ele.sku === 'S00001')?.splitSubtotalPrice || 0;
      count = count + eleprice;
    }
    setSpFreight(count);
    tableRef?.current?.reload();
    setHeadFreight(false);
    form.resetFields();
  };
  const HeadFreightCancel = () => {
    setHeadFreight(false);
    form.resetFields();
  };
  function myFixed(num: any, digit: any) {
    if (Object.is(parseFloat(num), NaN)) {
      return console.log(`传入的值：${num}不是一个数字`);
    }
    // eslint-disable-next-line no-param-reassign
    num = parseFloat(num);
    return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(
      digit,
    );
  }
  function otherNum(record: any) {
    const filterArr = ArrData.current.filter((ite: any) => ite.key !== actKey.current);
    let sum = 0;
    for (let index = 0; index < filterArr.length; index++) {
      const element = filterArr[index];
      for (let j = 0; j < element.arr.length; j++) {
        const ele = element.arr[j];
        if (ele.itemNo === record.itemNo) {
          sum += ele.qty || 0;
        }
      }
    }
    const res = Number(myFixed(record.originalQty - sum, 2));
    return res;
  }
  function minNum() {
    if (channelVal == 22) {
      return 0.01;
    } else {
      return 1;
    }
  }
  const limitDecimals = (value: any) => {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    if (channelVal == 22) {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').replace(reg, '$1$2.$3');
    } else {
      //return value.replace(/^(0+)|[^\d]+/g, '');
      return Number(value).toFixed(0);
    }
  };
  const tabColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: 'SKU',
      width: 120,
      dataIndex: 'sku',
    },
    {
      title: '拆入数量',
      width: 120,
      dataIndex: 'qty',
      render: (_, record: any) => {
        return (
          <InputNumber
            placeholder="请输入"
            defaultValue={record.qty}
            //    precision={0}
            formatter={limitDecimals}
            disabled={record.sku === 'S00001'}
            max={otherNum(record)}
            min={minNum()}
            onChange={(val: any) => {
              //原订单渠道是API-国电（渠道号22） 可以输入小数
              tableData.current = tableData?.current?.map((ele: any) => {
                if (ele.itemNo === record.itemNo) {
                  return {
                    ...ele,
                    qty: val,
                    splitSubtotalPrice: val * ele.salesPrice,
                  };
                } else {
                  return ele;
                }
              });
              //? 处理大容器
              if (ArrData?.current.some((ele: any) => ele.key == actKey?.current)) {
                ArrData.current = ArrData?.current?.map((ele: any) => {
                  if (ele.key === actKey?.current) {
                    return {
                      ...ele,
                      arr: JSON.parse(JSON.stringify(tableData?.current)),
                    };
                  } else {
                    return ele;
                  }
                });
              } else {
                ArrData.current.push({
                  key: actKey?.current,
                  arr: JSON.parse(JSON.stringify(tableData?.current)),
                });
              }
              tabHandle(ArrData?.current);

              //*处理左侧数据
              leftTableRef.current = leftTableRef.current?.map((ele: any) => {
                if (ele.itemNo === record.itemNo) {
                  //?把所有不是当前tab的数组找出来
                  const hasNum = ArrData.current.filter((ite: any) => ite.key !== actKey.current);
                  let sum = 0; //?累加起来所有当前行的数量
                  for (let index = 0; index < hasNum.length; index++) {
                    const element = hasNum[index];
                    for (let j = 0; j < element.arr.length; j++) {
                      const eles = element.arr[j];
                      if (eles.itemNo === record.itemNo) {
                        sum += eles.qty || 0;
                      }
                    }
                  }
                  return {
                    ...ele,
                    detachableQty: Number(ele?.originalQty) - (Number(sum) + Number(val)), //?调整左侧的可拆数量=原始总数量-已经拆掉的数量
                    dismantledQty: Number(sum) + Number(val), //? 已拆数量=（已经拆过的数量+输入的数量）
                  };
                } else {
                  return ele;
                }
              });
              tableRef?.current?.reload();
              setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
              leftTableDataRef?.current && leftTableDataRef?.current?.reload();

              // return val?.target?.value;
            }}
          />
        );
      },
    },
    {
      title: '拆分开票金额小计',
      width: 120,
      dataIndex: 'splitSubtotalPrice',
      render: (_, record: any) => {
        return Number(record.splitSubtotalPrice).toFixed(2);
      },
    },
  ];
  useEffect(() => {
    tableRef?.current && tableRef?.current?.reload();
    // newTabIndex.current = 2;
    if (!splitInfo?.loanInvoiceVos || splitInfo?.loanInvoiceVos?.length < 1) return;
    setItems(
      splitInfo?.loanInvoiceVos?.map((item: any) => {
        ++newTabIndex.current;
        return {
          label: `${item.invoiceName}`,
          children: (
            <ProTable<any>
              columns={tabColumns}
              scroll={{ x: 500, y: 500 }}
              search={false}
              toolBarRender={false}
              tableAlertRender={false}
              defaultSize="small"
              rowSelection={rowSelectionRight}
              options={{ reload: false, density: false }}
              // dataSource={tableData?.current}
              rowKey="itemNo"
              actionRef={tableRef}
              request={() => {
                return Promise.resolve({
                  data: tableData?.current,
                  success: true,
                  total: tableData?.current?.length,
                });
              }}
            />
          ),
          key: item.invoiceName,
          // closable: false,
        };
      }),
    );
    ArrData.current = splitInfo?.loanInvoiceVos?.map((item: any) => {
      return {
        sid: item?.sid,
        key: item?.invoiceName,
        arr: JSON.parse(JSON.stringify(item?.lineList)),
      };
    });
    tabHandle(ArrData.current);
    tableData.current =
      splitInfo?.loanInvoiceVos?.length &&
      JSON.parse(JSON.stringify(splitInfo?.loanInvoiceVos[0]?.lineList));
    actKey.current = splitInfo?.loanInvoiceVos[0]?.invoiceName;
    setActiveKey(splitInfo?.loanInvoiceVos?.length && splitInfo?.loanInvoiceVos[0]?.invoiceName);
  }, [splitInfo?.loanInvoiceVos]); //?请求的信息里面如果有的话就是编辑，并设置右侧初始值
  useEffect(() => {
    //?返显拆分发票
    if (splitInfo?.loanOriginalInvoiceVo?.originalFreight > 0) {
      setDisableHeadFreight(false);
      setSpFreight(splitInfo?.loanOriginalInvoiceVo?.splitFreight);
    } else {
      setDisableHeadFreight(true);
    }
    if (splitInfo?.loanOriginalInvoiceVo?.lineVos) {
      leftTableRef.current = JSON.parse(JSON.stringify(splitInfo?.loanOriginalInvoiceVo?.lineVos));
      setleftTable(splitInfo?.loanOriginalInvoiceVo?.lineVos);
    }
    leftTableDataRef?.current && leftTableDataRef?.current?.reload();
    tableRef?.current && tableRef?.current?.reload();
  }, [splitInfo?.loanOriginalInvoiceVo]);
  const add = () => {
    if (!selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return;
    }
    for (let k = 0; k < selectedRow.length; k++) {
      const ele = selectedRow[k];
      const leftNum = leftTable.find((eles: any) => eles.itemNo === ele.itemNo);
      if (channelVal == 22 && leftNum.detachableQty < 1) {
        return message.error('可拆数量<1时,禁止新增发票');
      }
      if (leftNum.detachableQty == 0) {
        return message.error('可拆发票数量不可小于0');
      }
    }
    //新增时
    tableData.current = JSON.parse(
      JSON.stringify(
        selectedRow.map((item: any) => {
          return {
            ...item,
            originaSubtotalPrice: item.originaSubtotalPrice,
            sid: null,
            qty: 1,
            splitSubtotalPrice: item.salesPrice,
          };
        }),
      ),
    );

    for (let i = 0; i < selectedRow.length; i++) {
      const element = selectedRow[i]; //?左侧每一项
      for (let k = 0; k < leftTableRef.current.length; k++) {
        const ele = leftTableRef.current[k];
        if (ele.itemNo === element.itemNo) {
          leftTableRef.current[k].detachableQty = leftTableRef.current[k].detachableQty - 1;
          leftTableRef.current[k].dismantledQty = leftTableRef.current[k].dismantledQty + 1;
        }
      }
    }
    setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
    const newActiveKey = `发票${newTabIndex.current}`;
    const newPanes = [...items];
    newPanes.push({
      label: `发票${newTabIndex.current++}`,
      children: (
        <ProTable<any>
          columns={tabColumns}
          scroll={{ x: 500, y: 500 }}
          search={false}
          toolBarRender={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={tableRef}
          rowKey="itemNo"
          rowSelection={rowSelectionRight}
          options={{ reload: false, density: false }}
          request={() => {
            return Promise.resolve({
              data: tableData?.current,
              success: true,
              total: tableData?.current?.length,
            });
          }}
        />
      ),
      key: newActiveKey,
      // closable: false,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
    actKey.current = newActiveKey;
    //?看看大容器里面有没有数据
    if (ArrData?.current.some((ele: any) => ele.key == actKey?.current)) {
      //?有就修改
      ArrData.current = ArrData?.current?.map((ele: any) => {
        if (ele.key === actKey?.current) {
          return {
            ...ele,
            arr: JSON.parse(JSON.stringify(tableData?.current)),
          };
        } else {
          return ele;
        }
      });
    } else {
      //?没有就添加
      ArrData.current.push({
        key: actKey?.current,
        arr: JSON.parse(JSON.stringify(tableData?.current)),
      });
    }
    tabHandle(ArrData.current);
    leftTableDataRef?.current && leftTableDataRef?.current?.reload();
  };
  const leftRow = () => {
    for (let i = 0; i < selectedRowKeysRight.length; i++) {
      const element = selectedRowKeysRight[i];
      // * 处理左侧表格数据
      for (let k = 0; k < leftTableRef.current.length; k++) {
        const eles = leftTableRef.current[k];
        if (eles.itemNo === element) {
          leftTableRef.current[k].detachableQty =
            leftTableRef.current[k].detachableQty +
            tableData?.current?.find((ite: any) => ite.itemNo === element)?.qty;
          leftTableRef.current[k].dismantledQty =
            leftTableRef.current[k].dismantledQty -
            tableData?.current?.find((ite: any) => ite.itemNo === element)?.qty;
        }
      }
      // * 处理右侧表格数据
      for (let j = 0; j < tableData?.current.length; j++) {
        const ele = tableData?.current[j];
        // * 处理运费
        if (ele.sku === 'S00001') {
          if (spFreight == 0) {
            setSpFreight(ele.splitSubtotalPrice - spFreight);
          } else {
            setSpFreight(spFreight - ele.splitSubtotalPrice);
          }
        }
        if (element === ele.itemNo) {
          tableData.current.splice(j, 1); //?删掉右侧的选中的那一项
        }
      }
    }
    // ! 如果右侧数据长度为0 则将右侧静态结构删掉
    if (tableData?.current.length == 0) {
      setItems(items.filter((ele: any) => ele.key !== activeKey));
      ArrData.current = ArrData?.current?.filter((ele: any) => ele.key !== activeKey);
      //?如果右侧没有数据的时候，需要将tab的高亮key值清空
      if (ArrData.current.length === 0) {
        setActiveKey('');
      } else {
        onChange(ArrData.current[0].key);
      }
      // tableData.current = JSON.parse(JSON.stringify(ArrData.current[0].arr));
    } else {
      // * 处理大容器
      ArrData.current = ArrData?.current?.map((ele: any) => {
        if (ele.key === actKey?.current) {
          return {
            ...ele,
            arr: JSON.parse(JSON.stringify(tableData?.current)),
          };
        } else {
          return ele;
        }
      });
      tableData.current = JSON.parse(JSON.stringify(tableData?.current));
      if (ArrData.current?.length !== 0) {
        onChange(activeKey); //?这里调用onchange可以直接触发销毁dom
      }
    }
    tabHandle(ArrData.current);

    setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
    leftTableDataRef?.current?.reload();
    tableRef?.current && tableRef?.current?.reload();
    setSelectedRowKeysRight([]);
  };
  // ?  点击右箭头
  const rightRow = () => {
    if (!selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    } else {
      setReload(false); //?让tabs组件重新刷新
      setSelectedRowKeysRight([]);
      //? 1、首先判断左侧选中的数据在右侧有没有 ，如果有的话，选中的那一条，就不会到右边去
      let rightItem: any;
      for (let k = 0; k < selectedRow.length; k++) {
        const ele = selectedRow[k];
        const leftNum = leftTable.find((eles: any) => eles.itemNo === ele.itemNo);
        if (channelVal == 22 && leftNum.detachableQty < 1 && !tableData?.current) {
          return message.error('可拆数量<1时,禁止新增发票');
        }
        if (leftNum.detachableQty == 0 && !tableData?.current) {
          return message.error('可拆发票数量不可小于0');
        }
      }
      for (let i = 0; i < selectedRow.length; i++) {
        const element = selectedRow[i]; //?左侧每一项
        rightItem = tableData?.current?.find((ele: any) => ele.itemNo === element.itemNo);
        //?2、当没找到的时候，将这左边的一项同步到右边
        if (!rightItem) {
          tableData.current = JSON.parse(
            JSON.stringify([
              ...tableData?.current,
              {
                ...element,
                sid: null,
                qty: 1,
                splitSubtotalPrice: element.salesPrice,
                originaSubtotalPrice: element.originaSubtotalPrice,
              },
            ]),
          );
          if (items.length !== 0) {
            // onChange(activeKey);
            for (let k = 0; k < leftTableRef.current.length; k++) {
              const ele = leftTableRef.current[k];
              // if (ele.detachableQty == 0) {
              //   console.log(ele, 'ele');
              //   return message.error('可拆发票数量不可小于0');
              // }
              if (ele.itemNo === element.itemNo) {
                leftTableRef.current[k].detachableQty = leftTableRef.current[k].detachableQty - 1;
                leftTableRef.current[k].dismantledQty = leftTableRef.current[k].dismantledQty + 1;
              }
            }
            setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
          }
        }
      }
      // add();
      //* 先看下右边有没有table，如果有就同步数据，没有就先把静态结构放一份在右边,并且把选中的数据给右边
      if (items.length == 0) {
        const newActiveKey = `发票${newTabIndex.current}`;
        setItems([
          {
            label: `发票${newTabIndex.current++}`,
            children: (
              <ProTable<any>
                columns={tabColumns}
                scroll={{ x: 500, y: 500 }}
                search={false}
                toolBarRender={false}
                tableAlertRender={false}
                defaultSize="small"
                actionRef={tableRef}
                rowKey="itemNo"
                rowSelection={rowSelectionRight}
                options={{ reload: false, density: false }}
                request={() => {
                  return Promise.resolve({
                    data: tableData?.current,
                    success: true,
                    total: tableData?.current?.length,
                  });
                }}
              />
            ),
            key: newActiveKey,
            // closable: false,
          },
        ]);
        setActiveKey(newActiveKey);
        actKey.current = newActiveKey;
        tableData.current = JSON.parse(
          JSON.stringify(
            selectedRow.map((ele: any) => {
              return {
                ...ele,
                qty: 1,
                originaSubtotalPrice: ele.originaSubtotalPrice,
                splitSubtotalPrice: ele.salesPrice,
              };
            }),
          ),
        );
        for (let i = 0; i < selectedRow.length; i++) {
          const ele = selectedRow[i];
          const leftItem = leftTableRef.current.find((item: any) => item.itemNo === ele.itemNo);
          if (!leftItem) continue;
          leftItem.detachableQty = leftItem.detachableQty - 1;
          leftItem.dismantledQty = leftItem.dismantledQty + 1;
        }
        setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
      }
      //?看看大容器里面有没有数据
      if (ArrData?.current.some((ele: any) => ele.key == actKey?.current)) {
        //?有就修改
        ArrData.current = ArrData?.current?.map((ele: any) => {
          if (ele.key === actKey?.current) {
            return {
              ...ele,
              arr: JSON.parse(JSON.stringify(tableData?.current)),
            };
          } else {
            return ele;
          }
        });
      } else {
        //?没有就添加
        ArrData.current.push({
          key: actKey?.current,
          arr: JSON.parse(JSON.stringify(tableData?.current)),
        });
      }
      setTimeout(() => {
        setReload(true); //?让tabs组件重新刷新
      }, 100);
      tabHandle(ArrData.current);
      tableRef?.current && tableRef?.current?.reload();
      leftTableDataRef?.current && leftTableDataRef?.current?.reload();
    }
  };
  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item: { key: string }, i: number) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item: { key: string }) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    //?先找到刚刚叉掉的那个数组
    const removeData = ArrData?.current?.find((ele: any) => ele.key === targetKey);
    //?处理移除的运费的数量
    const removeFreight: any =
      removeData.arr.find((ele: any) => ele.sku === 'S00001')?.splitSubtotalPrice || 0;
    if (spFreight == 0) {
      setSpFreight(removeFreight - spFreight);
    } else {
      setSpFreight(spFreight - removeFreight);
    }
    //?把左边的数据减掉的加回来，加的数据-1
    for (let i = 0; i < removeData?.arr.length; i++) {
      const element = removeData.arr[i];
      for (let j = 0; j < leftTableRef.current.length; j++) {
        const ele = leftTableRef.current[j];
        if (element.itemNo == ele.itemNo) {
          //?这里注意，减去和加上的量是之前输入的量
          leftTableRef.current[j].detachableQty =
            leftTableRef.current[j].detachableQty + element.qty;
          leftTableRef.current[j].dismantledQty =
            leftTableRef.current[j].dismantledQty - element.qty;
        }
      }
    }
    setleftTable(JSON.parse(JSON.stringify(leftTableRef.current)));
    leftTableDataRef?.current && leftTableDataRef?.current?.reload();

    ArrData.current = ArrData.current?.filter((item: { key: string }) => item.key !== targetKey); //移除后新的
    tabHandle(ArrData.current);
    setItems(newPanes);
    // setActiveKey(newActiveKey);
    onChange(newActiveKey);
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Row gutter={24}>
      <Col span={12}>
        <div className="Detail">
          <Row gutter={24}>
            <Col span={18}>
              <table className="amountTable" cellSpacing="0">
                <tbody>
                  <tr>
                    <th>原头运费:</th>
                    <td>{splitInfo?.loanOriginalInvoiceVo?.originalFreight}</td>
                    <th>已拆头运费:</th>
                    <td>{spFreight}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col span={6} style={{ marginTop: '30px' }}>
              <Button
                disabled={disableHeadFreight}
                onClick={HeadFreight}
                danger
                className="light_blue"
              >
                拆入头运费
              </Button>
            </Col>
          </Row>

          <Modal
            width={500}
            key={'split'}
            title="拆分发票 "
            visible={visibleHeadFreight}
            footer={[]}
            destroyOnClose={true}
            onCancel={HeadFreightCancel}
          >
            <Form name="form" form={form} onFinish={HeadFreightOK}>
              <Form.Item
                label="头运费金额"
                name="splitSubtotalPrice"
                rules={[{ required: true, message: '不能为空! 仅可输入数字' }]}
              >
                <InputNumber
                  style={{ width: '100%', marginRight: '20px' }}
                  min={0.01}
                  precision={2}
                  placeholder="请输入拆入头运费金额"
                />
              </Form.Item>
              <div className="ant-modal-footer">
                <Button htmlType="button" key="cancel" onClick={HeadFreightCancel}>
                  取 消
                </Button>
                <Button type="primary" key="submit" htmlType="submit">
                  确 定
                </Button>
              </div>
            </Form>
          </Modal>
          <div className="detail_table_mod" style={{ marginTop: '10px' }}>
            <ProTable<any>
              columns={columns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                // showTotal: (total, range) =>
                //   `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
              }}
              // dataSource={leftTable}
              request={async () => {
                return Promise.resolve({
                  data: leftTable.filter((ele: any) => ele.sku !== 'S00001'),
                  success: true,
                  total: leftTable?.length,
                });
              }}
              rowKey="itemNo"
              actionRef={leftTableDataRef}
              search={false}
              toolBarRender={false}
              tableAlertRender={false}
              // actionRef={ref}
              defaultSize="small"
              options={{ reload: false, density: false }}
              rowSelection={rowSelection}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    if (record.sku === 'S00001') return;
                    if (selectedRowKeys.includes(record.itemNo)) {
                      const newKeys = selectedRowKeys.filter((item: any) => item !== record.itemNo);
                      setSelectedRowKeys(newKeys);
                      const newRows = selectedRow.filter(
                        (item: any) => item.itemNo !== record.itemNo,
                      );
                      setSelectedRow(newRows);
                    } else {
                      setSelectedRowKeys(selectedRowKeys.concat([record.itemNo]));
                      setSelectedRow(selectedRow.concat([record]));
                    }
                  },
                };
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={1}>
        <div className="iconStyle">
          <img src={rightSrc} onClick={rightRow} />
          <img src={leftSrc} onClick={leftRow} />
          {/* <DoubleLeftOutlined style={{ fontSize: '200%' }} onClick={leftRow} />
          <DoubleRightOutlined style={{ fontSize: '200%' ,marginTop:'10px'}} onClick={rightRow} /> */}
        </div>
      </Col>
      <Col span={11}>
        {reload && ( //?手动销毁并重新刷新tabs组件
          <Tabs
            destroyInactiveTabPane={true}
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={items}
          />
        )}
      </Col>
    </Row>
  );
};

export default forwardRef(SplitInvoice);
