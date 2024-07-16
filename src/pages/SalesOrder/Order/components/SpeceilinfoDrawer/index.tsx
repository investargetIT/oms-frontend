import { modifySpecInfoDetail, modifySpecInfo } from '@/services/SalesOrder/Order';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Input, message } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './style.less';

const Index = ({ fn }: any, ref: any) => {
  const [changeArr, setChangeArr]: any = useState([]);
  const [OrderNo, setOrderNo] = useState();
  const [inputArr, setInputArr]: any = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [currentPageSize, setCurrentPageSize] = useState(20);
  // function onShowSizeChange(current: any, pageSize: any) {
  //   setCurrentPage(current);
  //   setCurrentPageSize(pageSize);
  // }
  const changeFn = async (e: any, record: any, type: any) => {
    //?flag判断里面是否有已经修改过的，有则修改，无则添加
    const flag = changeArr.some((item: any) => {
      return item.lineNum === record.lineNum;
    });
    switch (type) {
      case 1:
        if (flag) {
          setChangeArr(
            changeArr.map((item: any) => {
              if (item.lineNum == record.lineNum) {
                return {
                  ...item,
                  customerSku: e.target.value,
                };
              } else {
                return item;
              }
            }),
          );
        } else {
          const arr = [...changeArr];
          arr.push({
            lineNum: record.lineNum,
            sku: record.sku,
            productNameZh: record.productNameZh,
            customerSku: e.target.value,
            customerProductName: record.customerProductName,
            taxNo: record.taxNo,
          });
          setChangeArr(arr);
        }
        break;
      case 2:
        if (flag) {
          setChangeArr(
            changeArr.map((item: any) => {
              if (item.lineNum == record.lineNum) {
                return {
                  ...item,
                  customerProductName: e.target.value,
                };
              } else {
                return item;
              }
            }),
          );
        } else {
          const arr = [...changeArr];
          arr.push({
            lineNum: record.lineNum,
            sku: record.sku,
            productNameZh: record.productNameZh,
            customerSku: record.customerSku,
            customerProductName: e.target.value,
            taxNo: record.taxNo,
          });

          setChangeArr(arr);
        }
        break;
      case 3:
        if (flag) {
          setChangeArr(
            changeArr.map((item: any) => {
              if (item.lineNum == record.lineNum) {
                return {
                  ...item,
                  taxNo: e,
                };
              } else {
                return item;
              }
            }),
          );
        } else {
          const arr = [...changeArr];
          arr.push({
            lineNum: record.lineNum,
            sku: record.sku,
            productNameZh: record.productNameZh,
            customerSku: record.customerSku,
            customerProductName: record.customerProductName,
            taxNo: e,
          });
          setChangeArr(arr);
        }
        break;
      default:
        break;
    }
  };
  const infoColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'lineNum',
      width: 50,
      fixed: 'left',
      render(text, record) {
        return record.lineNum;
        // return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SKU号', dataIndex: 'sku', width: 120 },
    { title: '产品名称', dataIndex: 'productNameZh', width: 120 },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
      width: 120,
      render(text, record) {
        return (
          <Input
            onChange={(value) => changeFn(value, record, 1)}
            defaultValue={record.customerSku}
          />
        );
      },
    },
    {
      title: '客户产品名称',
      dataIndex: 'customerProductName',
      width: 120,
      render(text, record) {
        return (
          <Input
            maxLength={100}
            onChange={(value) => changeFn(value, record, 2)}
            defaultValue={record.customerProductName}
          />
        );
      },
    },
    {
      title: '税收分类编码',
      dataIndex: 'taxNo',
      width: 100,
      render(text, record) {
        return (
          <Input
            maxLength={19}
            style={{ width: '100%' }}
            value={inputArr[record.lineNum - 1]}
            onChange={(value) => {
              setInputArr(
                inputArr.map((ele: any, idx: any) => {
                  if (idx === record.lineNum - 1) {
                    return value?.target?.value.replace(/[^\d]/g, ''); //?限制输入的数量只能是19位的数字
                  } else {
                    return ele;
                  }
                }),
              );
              changeFn(value?.target?.value, record, 3);
            }}
            defaultValue={record.taxNo}
          />
        );
      },
    },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  const drawerWidth = window.innerWidth * 0.8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmload, setConfirmload]: any = useState(false);
  const [InitialData, setInitialData] = useState([]);
  const tableRef: any = useRef();
  const closeDrawer = () => {
    setIsModalVisible(false);
  };
  const open = async (orderNO: any) => {
    setOrderNo(orderNO);
    setConfirmload(false);
    setIsModalVisible(true);
  };
  const savefn = async () => {
    // console.log(changeArr, 'changeArr');
    //?如果有空的就不再往后走逻辑
    if (changeArr?.length == 0 || JSON.stringify(changeArr) == JSON.stringify(InitialData)) {
      return message.error('未提交有效更新数据');
    }
    for (let i = 0; i < changeArr.length; i++) {
      const ele = changeArr[i];
      if (ele?.taxNo?.toString()?.length == 0) {
        continue;
      } else if (ele?.taxNo?.toString()?.length == 19) {
        continue;
      } else if (ele?.taxNo?.toString()?.length > 0 && ele?.taxNo?.toString()?.length !== 19) {
        return message.error('请输入19位的税收编码');
      }
    }
    // return console.log(222, '222');
    setConfirmload(true);
    const res = await modifySpecInfo(changeArr, OrderNo);
    if (res.errCode == 200) {
      message.success('保存成功');
      setIsModalVisible(false);
      fn(); //?刷新主数据的表格
    } else {
      message.warning(res.errMsg);
    }
    setConfirmload(false);
  };
  useImperativeHandle(ref, () => ({
    open,
  }));
  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'修改特定信息'}
        destroyOnClose={true}
        placement="right"
        title="修改特定信息"
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="SpecialModifyDrawer"
        footer={[
          <Button key="apply" className="saveSub" loading={confirmload} onClick={savefn}>
            确认
          </Button>,
          <Button key="close" className="close" onClick={closeDrawer}>
            取消
          </Button>,
        ]}
      >
        <ProTable<any>
          columns={infoColumn}
          bordered
          size="small"
          // dataSource={repArr}
          request={async () => {
            // const searchParams: any = {};
            // searchParams.pageNumber = params.current;
            // searchParams.pageSize = params.pageSize;
            const res = await modifySpecInfoDetail(OrderNo);
            setInitialData(res.data?.dataList); //?将初始的后端反的数据存一下，在提交的时候比较有没有改动
            if (res.errCode === 200) {
              setChangeArr(res?.data?.dataList);
              setInputArr(res.data?.dataList?.map((ele: any) => ele.taxNo));
              return Promise.resolve({
                data: res.data?.dataList,
                total: res.data?.total,
                success: true,
              });
            } else {
              message.error(res.errMsg);
              return Promise.resolve([]);
            }
          }}
          rowKey="lineNum"
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          scroll={{ x: 0, y: 250 }}
          options={{ reload: false, density: false }}
          toolBarRender={false}
          actionRef={tableRef}
          // pagination={{
          //   pageSize: 10,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['10', '20', '50', '100'],
          //   showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          //   onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          // }}
        />
      </Drawer>
    </div>
  );
};
export default forwardRef(Index);
