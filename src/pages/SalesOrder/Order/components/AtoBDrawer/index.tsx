import { notReplace, saveReplace, saveReplaceLog } from '@/services/SalesOrder/Order';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Input, message } from 'antd';
import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './style.less';

const MyDrawer = ({ setVisible, fn, btnClickStatus, resetBtnStatus }: any, ref: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const infoColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: '原SKU', dataIndex: 'originalSku', width: 120 },
    { title: '原数量', dataIndex: 'originalQty', width: 100 },
    { title: '原含税成交价', dataIndex: 'originalSalesPrice', width: 120 },
    { title: '原SKU产品名称', dataIndex: 'originalProductNameConcatStr', width: 260 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 100 },
    { title: '替换SKU', dataIndex: 'replaceSku', width: 100 },
    { title: '替换数量', dataIndex: 'replaceQty', width: 100 },
    { title: '替换单价含税', dataIndex: 'replaceSalesPrice', width: 100 },
    { title: '替换物料原面价含税', dataIndex: 'replaceOriginalPrice', width: 150 },
    {
      title: '替换成本价含税',
      dataIndex: 'replaceCost',
      width: 100,
      render() {
        return '***';
      },
    },
    {
      title: '替换毛利率',
      dataIndex: 'replaceGp',
      width: 100,
      render() {
        return '***';
      },
    },
    { title: '替换SKU产品名称', dataIndex: 'replaceProductNameConcatStr', width: 260 },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  const drawerWidth = window.innerWidth * 0.8;
  // const key = new Date().getTime();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [key, setKey] = useState(''); //?存储订单号
  // const [sid, setSid] = useState(''); //?存储当前sid进行发给后端进行修改
  // const [replaceArr, setReplaceArr] = useState([]); //?存储子组件传到父组件的替换信息，并加入到表格内部
  const [Row, setRow]: any = useState(); //?存储上一个页面列表行信息
  const [confirmload, setConfirmload]: any = useState(false);
  const [reason, setReason]: any = useState();
  const [pageNum, setPageNum]: any = useState(); //?设置是从哪个页面调用这个组件，如果1就是我的代办，如果2就是全部订单
  const [repArr, setRepArr]: any = useState();
  const tableRef: any = useRef();
  const closeDrawer = () => {
    setIsModalVisible(false);
  };
  const open = async (e: any, record: any, pageNumber?: any, reparr?: any) => {
    setReason('');
    setPageNum(pageNumber);
    setConfirmload(false);
    setRow(record);
    setKey(e);
    setRepArr(reparr);
    setIsModalVisible(true);
    await setTimeout(() => {}, 0); //?打开抽屉之后重新刷新表格
    tableRef.current.reload();
    // setReplaceArr([]); //?再次进入页面的时候，将上一次替换但是没存的给清空
  };
  const close = () => {
    setIsModalVisible(false);
    setReason('');
  };
  const onChange = (e: any) => {
    setReason(e.target.value);
  };
  const replaceSKU = () => {
    setVisible(true);
  };
  const savefn = async () => {
    setConfirmload(true);
    const params = {
      orderNo: key,
      remark: reason,
      requestStatus: 20,
      // sid: passSid,
      lines: repArr,
    };
    const res = await saveReplace(params);
    if (res.errCode == 200) {
      message.success('保存成功');
      // 记录log
      const par = {
        types: btnClickStatus?.filter((io: any) => io),
        orderNo: key,
      };
      await saveReplaceLog(par);
      resetBtnStatus();
      setRepArr([]);
      setIsModalVisible(false);
      fn(); //?刷新主数据的表格
    } else {
      message.warning(res.errMsg);
    }
    setConfirmload(false);
  };
  const dontRep = async () => {
    setConfirmload(true);
    const res = await notReplace(key);
    if (res.errCode == 200) {
      message.success('不替换操作成功');
      setIsModalVisible(false);
      fn(); //?刷新主数据的表格
    } else {
      message.warning(res.errMsg);
    }
    setConfirmload(false);
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));
  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'订单详情查看'}
        destroyOnClose={false}
        placement="right"
        title={[<span key={'销售处理'}>MDM赋码申请</span>]}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="OrderDrawer"
        footer={[
          <Button
            className={classNames({
              show: !(
                Row?.currentnodetypeName === '退回' ||
                Row?.orderStatus == '退回' ||
                pageNum !== '1'
              ),
              hide:
                Row?.currentnodetypeName === '退回' ||
                Row?.orderStatus == '退回' ||
                pageNum !== '1',
              replace: true,
            })}
            key="back"
            onClick={dontRep}
            loading={confirmload}
          >
            不替换
          </Button>,
          <Button key="apply" className="saveSub" loading={confirmload} onClick={savefn}>
            提交申请
          </Button>,
          <Button key="close" className="close" onClick={closeDrawer}>
            关闭
          </Button>,
        ]}
      >
        <Button className="replaceBtn" onClick={replaceSKU}>
          编辑SKU
        </Button>
        <ProTable<any>
          columns={infoColumn}
          bordered
          size="small"
          dataSource={repArr}
          rowKey="orderLineId"
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          scroll={{ x: 0, y: 250 }}
          options={{ reload: false, density: false }}
          toolBarRender={false}
          actionRef={tableRef}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          }}
        />
        <div style={{ display: 'flex', width: '98%' }}>
          <span style={{ display: 'inline-block', width: '100px', marginLeft: '10px' }}>
            申请原因
          </span>
          <Input.TextArea
            showCount
            maxLength={255}
            placeholder="请输入，最多255字"
            style={{ height: 120, width: '100%' }}
            onChange={onChange}
            value={reason}
          />
        </div>
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
