import UploadModal from '@/pages/SalesOrder/components/UploadForm';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Input, InputNumber, message, Space, Spin, Tabs } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import MyModal from '../Modal';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import './index.less';
const { TabPane } = Tabs;

import {
  createProductUpdate,
  getProductLineInfo,
  orderDetail,
  queryCustomerDis,
  queryProductLine,
  queryRefResource,
} from '@/services/SalesOrder';
import Cookies from 'js-cookie';

const MyDrawer = ({ reload }: any, ref: any) => {
  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(false); //?step=false就是详情打开的弹框，否则就是新增
  const [OrderNo, setOrderNo]: any = useState({}); //?存储上一个页面的行信息
  const [allPrice, setPrice]: any = useState(); //?联动订单信息的申请替换总价
  const [allPrice2, setPrice2]: any = useState(); //?联动订单信息的申请替换总价
  const [goodsDetail, setGoodsDetail]: any = useState();
  const [replaceArr, setReplaceArr]: any = useState([]);
  const [FileArr, setFileArr]: any = useState([]);
  const [count, setCount]: any = useState(0); //?添加表格行的时候用来累加index
  const [selectedIndex, setSelectedIndex]: any = useState(); //?存储在弹框中获取到的行信息
  const [row, setRow]: any = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoad, setsearchLoad] = useState(false);
  const [load, setLoad] = useState(false);
  const [discountRate, setDiscountRate]: any = useState(); // ?新增行的第一次时候查折扣,用于替换总金额含税的计算
  const [maxCount, setMaxCount]: any = useState();
  const Modalref: any = useRef();
  const tableRef: any = useRef();
  const filetableRef: any = useRef();
  // const pref: any = useRef();
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
  const closeDrawer = () => {
    setRow('');
    setGoodsDetail('');
    setIsModalVisible(false);
  };
  const { initialState }: any = useModel('@@initialState'); //?获取到用户名，然后提供给附件展示创建人
  const open = async (e: any, state: any, rowD: any) => {
    // ? 清空附件缓存
    setFileArr([]);
    // //?清空三个数据选择框的失焦状态
    setCount(0); //?设置初始的数字，再次进入的时候，添加不报错
    setLoad(true);
    setRow(rowD);
    setStep(state);
    setOrderNo(e); //?存储上一个页面的行信息
    setIsModalVisible(true);
    const res2 = await orderDetail(e);
    if (res2.errCode !== 200) {
      return message.error(res2.errMsg);
    }
    const {
      data: { salesOrderRespVo },
    } = res2;
    setGoodsDetail(salesOrderRespVo);
    setLoad(false);
    await setTimeout(() => {}, 0);
    //?关闭抽屉销毁组件无须重置
    // filetableRef?.current?.reload(); //?重新进入页面刷新表格
    tableRef?.current?.reload(); //?刷新替换明细
    // pref?.current?.reload();
    setReplaceArr([]); //?刷新替换信息
  };
  const close = () => {
    setIsModalVisible(false);
  };
  const onSearch = (e: any) => {
    setSelectedIndex(e.index);
    Modalref.current.openModal(OrderNo);
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));
  function callback(key: any) {
    console.log(key);
  }
  const delLine = (e: any) => {
    const arr = replaceArr.filter((k: any) => e.index !== k.index);
    setReplaceArr(arr);
    tableRef?.current?.reload();
  };
  const addLine = async () => {
    // console.log(replaceArr, '我是上一次合并的arr');
    const arr = replaceArr.concat([{ index: count }]);
    const count2 = count + 1;
    setCount(count2);
    setReplaceArr(arr);
    const res = await queryCustomerDis(row.customerCode);
    // ?新增行的第一次时候查折扣,用于替换总金额含税的计算
    setDiscountRate(res.data.discountRate);
    tableRef?.current?.reload();
  };

  //?存储在弹框中获取到明细的行信息(子传父)
  const getInfo = (e: any) => {
    // setInfo(e);
    // ! 关闭弹框了之后将信息同步到刚才选择的那一行
    // ? 首先记录下刚才选择的那一行的信息下标selectedIndex
    // * 然后在关闭弹框的时候通过这个下标找到对应的那一行然后同步信息
    const arr: any = replaceArr.map((item: any) => {
      if (item.index == selectedIndex) {
        return {
          index: selectedIndex,
          originalSku: e.sku, //?原sku
          orderLineId: e.sid, //?订单行号
          BtoBFlag: e.productNameConcatStr, //?产品名称
          productLineCode: e.productLineCode, //?Product
          segmentCode: e.segmentCode, //?Segment
          mfgSku: e.mfgSku, //?制造商型号
          brandName: e.brandName, //?品牌名称
          qty: e.qty, //?订单数量
          closeQty: e.closeQty, //?已发货数量
          salesPrice: e.salesPrice, //?成交价含税
        };
      } else {
        return item;
      }
    });
    if (e.closeQty) {
      //?已发货数量后端没反就是0
      setMaxCount(e.qty - e.closeQty);
    } else {
      setMaxCount(e.qty);
    }
    setReplaceArr(arr);
    tableRef.current.reload();
  };
  // ? 查询替换行明细,并设置行信息
  const query = async (record: any, requestQty?: any, replaceQty?: any, replaceSku?: any) => {
    if (searchLoad) return;
    const par = {
      orderLineId: record.orderLineId,
      requestQty: requestQty || replaceArr[record.index]?.requestQty,
      replaceQty: replaceQty || replaceArr[record.index]?.replaceQty,
      replaceSku: replaceSku || replaceArr[record.index]?.replaceSku,
    };
    // console.log(replaceArr, 'replaceArr');
    // console.log(replaceSku, 'replaceSku参数');
    // console.log(replaceArr[record.index]?.replaceSku, 'replaceArr[record.index]?.replaceSku');
    // console.log(!par.requestQty || !par.replaceQty || par?.replaceSku?.length < 4);
    // console.log(par.requestQty, par.replaceQty, par?.replaceSku, par?.replaceSku?.length < 4);
    if (!par.requestQty || !par.replaceQty || !par?.replaceSku || par?.replaceSku?.length < 4)
      return;
    setsearchLoad(true);
    getProductLineInfo(par).then((res) => {
      if (res.errCode === 200 && res.errMsg == '成功') {
        replaceArr[record.index].replaceListPrice = res.data.replaceListPrice; //?替换物料原面价含税
        replaceArr[record.index].replaceInventory = res.data.replaceInventory; //?库存
        replaceArr[record.index].replacetAmount = res.data.replaceAmount; //?替换总金额含税
        replaceArr[record.index].replaceProductName = res.data.replaceProductName; //? Product
        // 联动订单信息的申请替换总价
        let Price = 0;
        let Price2 = 0;
        replaceArr.forEach((ite: any) => {
          //?精度丢失,需要乘100再除100
          if (ite.requestAmount) {
            //?当这一行有申请金额的时候才去累加否则会造成NAN
            Price = (Price * 100 + Number(ite.requestAmount) * 100) / 100;
          }
        });
        setPrice(Price.toFixed(2));
        // 联动订单信息的替换产品总价
        replaceArr.forEach((ite: any) => {
          if (ite.replaceAmount) {
            //?当这一行有替换金额的时候才去累加否则会造成NAN
            Price2 = (Price2 * 100 + Number(ite.replacetAmount) * 100) / 100;
          }
        });
        setPrice2(Price2.toFixed(2));
        setReplaceArr(replaceArr);
        tableRef.current.reload();
        setsearchLoad(false);
      } else {
        message.error('获取替换信息失败' + res.errMsg);
        setsearchLoad(false);
      }
    });
  };
  //? 申请替换数量输入框
  function repCount(e: any, record: any): any {
    // console.log(replaceArr, selectedIndex); //!简直离了个大特朗普了。。。这里选中的下标replaceArr打印居然是undefined
    //* 问题已解决：原因：使用useEffect来动态操控表格的列，然后列里面的dom注册事件的时候，会获取不到更改后的useState
    const inputDom: any = document.querySelectorAll('.repCount input');
    console.log(inputDom, 'dom');
    console.log(record, '?recro');

    if (replaceArr[record.index]?.orderLineId == undefined) {
      //?当没有选择替换目标的时候，但是在调整输入框大小，对他有一个红色的提示
      inputDom[record.index].style.color = 'red';
      return message.warning('请先选择原订单');
    } else {
      inputDom[record.index].style.color = '#000';
    }
    inputDom[record.index].innerText = 0;
    // console.log(e);
    replaceArr[record.index].requestQty = e;
    // ? 联动申请替换总金额的大小
    const repcou: any = document.querySelectorAll('.repCou');
    // 计算申请替换总金额
    const result = Number(Number(e) * Number(record.salesPrice)).toFixed(2);
    repcou[record.index].innerText = result;
    // console.log(result);
    // 并设置replaceArr对应项的大小
    // replaceArr[record.index].requestAmount = result;
    setReplaceArr(() => {
      const arr = replaceArr.map((item: any) => {
        if (item.index == record.index) {
          return {
            ...item,
            requestAmount: result,
          };
        }
        return item;
      });
      // 联动订单信息的申请替换总价
      let Price = 0;
      arr.forEach((ite: any) => {
        //?精度丢失,需要乘100再除100
        if (ite.requestAmount) {
          //?当这一行有申请金额的时候才去累加否则会造成NAN
          Price = (Price * 100 + Number(ite.requestAmount) * 100) / 100;
        }
      });
      setPrice(Price.toFixed(2));
      return arr;
    });
    tableRef?.current?.reload();

    // console.log(replaceArr,'改变后的数据');
    // query(record, e);
  }

  let Rtimer: any = null;
  //? 替换数量输入框
  const repNum = (e: any, record: any): any => {
    clearTimeout(Rtimer);
    console.log(e, 'eee', discountRate);
    if (replaceArr.length === 0) {
      return message.warning('请先选择原订单');
    }
    if (replaceArr[record.index].orderLineId == undefined) {
      const inputDom: any = document.querySelectorAll('.repNum input');
      inputDom[record.index].style.color = 'red';
      //?当没有选择替换目标的时候，但是在调整输入框大小，对他有一个红色的提示
      return message.warning('请先选择原订单');
    } else {
      const inputDom: any = document.querySelectorAll('.repNum input');
      inputDom[record.index].style.color = '#000';
    }
    replaceArr[record.index].replaceQty = e;
    if (!replaceArr[record.index].replaceListPrice) {
      Rtimer = setTimeout(() => {
        //?防抖优化
        query(record, null, e); //!第一次需要等三个参数输入完成之后查一下行明细
      }, 1500);
      return; //* 如果第一次去查替换明细的东西,那么这里就不再联动
    }
    const RPrice = Number(
      myFixed(
        (replaceArr[record.index].replaceListPrice * 100 * (discountRate * 100) * e) / 10000,
        2,
      ),
    ); //?计算数量改变之后的价格
    setReplaceArr(() => {
      const arr = replaceArr.map((item: any) => {
        if (item.index == record.index) {
          return {
            ...item,
            replacetAmount: RPrice,
            replaceQty: e,
          };
        }
        return item;
      });
      // 联动订单信息的替换产品总价
      let Price2 = 0;
      arr.forEach((ite: any) => {
        if (ite.replaceAmount) {
          //?当这一行有替换金额的时候才去累加否则会造成NAN
          Price2 = (Price2 * 100 + Number(ite.replacetAmount) * 100) / 100;
        }
      });
      setPrice2(Price2);
      return arr;
    });
    tableRef?.current?.reload();
  };
  // ?替换Sku输入框改变函数
  let timer: any = null;
  function repSku(e: any, record: any) {
    replaceArr[record.index].replaceSku = e.target.value;
    setReplaceArr(replaceArr);
    clearTimeout(timer);
    timer = setTimeout(() => {
      query(record, null, null, e.target.value);
    }, 1500);
  }
  function keyUp(e: any, record: any) {
    if (e.keyCode === 13) {
      query(record, null, null, e.target.value);
    }
  }
  // 提交申请
  const submitApply = async () => {
    for (let i = 0; i < replaceArr.length; i++) {
      if (!replaceArr[i].requestQty || !replaceArr[i].replaceQty || !replaceArr[i].replaceSku) {
        return message.warning('请填写替换信息');
      }
    }
    setLoading(true);
    const lines: any = [];
    replaceArr.forEach((e: any) => {
      lines.push({
        orderLineId: e.orderLineId,
        requestQty: e.requestQty,
        replaceQty: e.replaceQty,
        replaceSku: e.replaceSku,
      });
    });
    const parm = {
      orderNo: OrderNo,
      status: 20,
      remark: '123',
      lines,
      resourceVOList: FileArr,
    };
    const res = await createProductUpdate(parm);
    // console.log(res);
    if (res.errCode == 200) {
      message.success('提交成功');
      setIsModalVisible(false);
      // console.log(reload, 'reload');
      reload();
    } else {
      message.error('提交失败' + res.errMsg);
    }
    setLoading(false);
  };
  const uploadFile = () => {
    setVisible(true);
  };
  const getList = async (val: any) => {
    if (val.length > 0) {
      const resourceVOList: any = [];
      val.forEach((e: any, i: any) => {
        resourceVOList.push({
          resourceName: e.resourceName,
          resourceUrl: e.resourceUrl,
          fileType: e.type,
          createUser: initialState.currentUser.name,
          createTime: e.createTime,
          index: i,
        });
      });
      setFileArr(resourceVOList);
      setVisible(false);
      filetableRef?.current?.reload();
    } else {
      setVisible(false);
    }
  };
  const delItem = async (record: any) => {
    setFileArr(
      FileArr.filter((e: any) => {
        return e.index !== record.index;
      }),
    );
    filetableRef?.current?.reload();
  };
  // 附件
  const appendixColumn: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName', width: 250 },
    { title: '文件类型', dataIndex: 'fileType', width: 120 },
    { title: '创建者', dataIndex: 'createUser', width: 120 },
    { title: '创建时间', valueType: 'dateTime', dataIndex: 'createTime', width: 150 },
    {
      title: '操作',
      dataIndex: 'quotCode',
      width: 100,
      render(_, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
            >
              下载
            </Button>
            {step && (
              <Button type="link" onClick={() => delItem(record)}>
                删除
              </Button>
            )}
          </>
        );
      },
    },
  ];
  //替换sku明细  新增  点进去的列
  const infoColumn2: ProColumns<any>[] = [
    { title: '#', dataIndex: 'index', valueType: 'index', width: 50, fixed: 'left' },
    {
      title: '操作',
      dataIndex: 'Button',
      width: 100,
      fixed: 'left',
      render(_, record) {
        return (
          <Button type="link" onClick={() => delLine(record)}>
            删除
          </Button>
        );
      },
    },
    {
      title: '原SKU',
      dataIndex: 'originalSku',
      width: 140,
      render(_: any, record: any) {
        return (
          <Input.Search
            onSearch={() => onSearch(record)}
            value={record.originalSku}
            style={{ width: 120 }}
            readOnly
          />
        );
      },
    },
    { title: '订单行号', dataIndex: 'orderLineId', width: 100 },
    { title: '产品名称', dataIndex: 'BtoBFlag', width: 120 },
    { title: 'Product', dataIndex: 'productLineName', width: 100 },
    { title: 'Segment', dataIndex: 'segmentName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '品牌名称', dataIndex: 'brandName', width: 100 },
    { title: '订单数量', dataIndex: 'qty', width: 100 },
    { title: '已发货数量', dataIndex: 'closeQty', width: 100 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 100 },
    {
      title: '申请替换数量',
      dataIndex: 'requestQty',
      width: 100,
      render(_: any, record: any) {
        let maxCountData = null;
        if (record.closeQty) {
          //?已发货数量后端没反就是0
          maxCountData = record.qty - record.closeQty;
        } else {
          maxCountData = record.qty;
        }
        return (
          <InputNumber
            className="repCount"
            onChange={(e) => repCount(e, record)}
            style={{ width: 90 }}
            controls={true}
            // onBlur={() => onBlur(1, record)}
            min={0}
            max={maxCountData}
          />
        );
      },
    },
    {
      title: '申请替换总金额',
      dataIndex: 'requestAmount',
      width: 100,
      render(_, record) {
        return <span className="repCou">{record.requestAmount}</span>;
      },
    },
    {
      title: '替换SKU',
      dataIndex: 'replaceSku',
      width: 100,
      render(_, record) {
        return (
          <Input
            className="repSku"
            onChange={(e) => repSku(e, record)}
            // onBlur={() => onBlur(2, record)}
            style={{ width: 90 }}
            onKeyUp={(e) => keyUp(e, record)}
          />
        );
      },
    },
    {
      title: '替换数量',
      dataIndex: 'replaceQty',
      width: 100,
      render(_, record) {
        return (
          <InputNumber
            className="repNum"
            onChange={(e) => repNum(e, record)}
            // onBlur={() => onBlur(3, record)}
            style={{ width: 90 }}
            controls={true}
            min={0}
          />
        );
      },
    },
    {
      title: '替换物料原面价含税',
      dataIndex: 'replaceListPrice',
      width: 150,
      render(_, record) {
        return <span className="replaceListPrice">{record.replaceListPrice}</span>;
      },
    },
    {
      title: '替换总金额含税',
      dataIndex: 'replacetAmount',
      width: 100,
      render(_, record) {
        return <span className="replacetAmount">{record.replacetAmount}</span>;
      },
    },
    {
      title: '库存数',
      dataIndex: 'replaceInventory',
      width: 100,
      render(_, record) {
        return <span className="replaceInventory">{record.replaceInventory}</span>;
      },
    },
    {
      title: 'Product',
      dataIndex: 'replaceProductName',
      width: 100,
      render(_, record) {
        return <span className="replaceProductName">{record.replaceProductName}</span>;
      },
    },
  ];
  //替换sku明细   详情   点进去的列
  const infoColumn22: ProColumns<any>[] = [
    { title: '#', dataIndex: 'index', valueType: 'index', width: 50, fixed: 'left' },
    { title: '原SKU', dataIndex: 'originalSku', width: 120 },
    { title: '订单行号', dataIndex: 'orderLineId', width: 100 },
    { title: '产品名称', dataIndex: 'originalProductNameConcatStr', width: 120 },
    { title: 'Product', dataIndex: 'productLineName', width: 100 },
    { title: 'Segment', dataIndex: 'segmentCode', width: 100 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '品牌名称', dataIndex: 'segmentName', width: 100 },
    { title: '订单数量', dataIndex: 'qty', width: 100 },
    { title: '已发货数量', dataIndex: 'closeQty', width: 100 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 100 },
    { title: '申请替换数量', dataIndex: 'requestQty', width: 100 },
    { title: '申请替换总金额', dataIndex: 'requestAmount', width: 100 },
    { title: '替换SKU', dataIndex: 'replaceSku', width: 100 },
    { title: '替换数量', dataIndex: 'replaceQty', width: 100 },
    { title: '替换SKU产品名称', dataIndex: 'replaceProductNameConcatStr', width: 150 },
    { title: '替换物料原面价含税', dataIndex: 'replaceListPrice', width: 150 },
    { title: '替换总金额含税', dataIndex: 'replaceAmount', width: 100 },
    { title: '库存数', dataIndex: 'replaceInventory', width: 100 },
    { title: 'Product', dataIndex: 'replaceProductName', width: 100 },
  ];
  // const infoColumn3: ProColumns<any>[] = [
  //   { title: '#', dataIndex: 'index', valueType: 'index', width: 50, fixed: 'left' },
  //   { title: '流程ID', dataIndex: 'workflowId', width: 120 },
  // ];
  infoColumn2.forEach((item: any) => {
    item.ellipsis = true;
  });
  infoColumn22.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <div>
      <Drawer
        width={drawerWidth}
        placement="right"
        title={[<span key={'订单编号'}>{step ? '新增订单产品修改申请' : '订单产品修改详情'}</span>]}
        visible={isModalVisible}
        onClose={() => {
          closeDrawer();
        }}
        destroyOnClose={true}
        extra={
          <>
            <Space>
              {step && (
                <Button onClick={submitApply} loading={loading} className="addLine">
                  提交申请
                </Button>
              )}
            </Space>{' '}
            <Space>
              <Button onClick={closeDrawer}>关闭</Button>
            </Space>
          </>
        }
        className="ODModificationDrawer form-content-search"
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="申请信息" key="1">
            <Spin spinning={load}>
              <Form className="has-gridForm">
                <h4 className="formTitle" id="one">
                  订单信息
                </h4>
                <div className="ant-advanced-form three-gridCol">
                  {!step && (
                    <Form.Item label="申请编号">
                      <span className="form-span">{row?.sid}</span>
                    </Form.Item>
                  )}
                  <Form.Item label="申请状态">
                    <span className="form-span">{goodsDetail?.orderStatus}</span>
                  </Form.Item>
                  <Form.Item label="订单号">
                    <span className="form-span">{OrderNo}</span>
                  </Form.Item>
                  <Form.Item label="PO单号">
                    <span className="form-span">{goodsDetail?.customerPurchaseNo}</span>
                  </Form.Item>
                  <Form.Item label="渠道">
                    <span className="form-span">{goodsDetail?.channel}</span>
                  </Form.Item>
                  <Form.Item label="客户号">
                    <span className="form-span">{goodsDetail?.customerCode}</span>
                  </Form.Item>
                  <Form.Item label="客户名称">
                    <span className="form-span">{goodsDetail?.customerName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人代号" className="minLabel">
                    <span className="form-span">{goodsDetail?.contactsCode}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人">
                    <span className="form-span">{goodsDetail?.contactsName}</span>
                  </Form.Item>
                  <Form.Item label="申请替换总价" className="minLabel">
                    <span className="form-span">{allPrice}</span>
                  </Form.Item>
                  <Form.Item label="替换产品总价" className="minLabel">
                    <span className="form-span">{allPrice2}</span>
                  </Form.Item>
                  <Form.Item label="负责销售">
                    <span className="form-span">{goodsDetail?.salesName}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="one">
                  附件
                </h4>
                {step && (
                  <Button className="uploadFileBtn" onClick={uploadFile}>
                    上传附件
                  </Button>
                )}
                <ProTable<any>
                  columns={appendixColumn}
                  bordered
                  request={async (params) => {
                    if (!step) {
                      if (!row?.sid) {
                        return Promise.resolve({
                          data: [],
                          success: true,
                        });
                      }
                      const searchParams: any = {
                        pageNumber: params.current,
                        pageSize: params.pageSize,
                        sourceId: row?.sid || '',
                        sourceType: 40,
                        subType: 20, //?以前的数组
                        //?刚进入页面的时候传subTyoe40，接下来传的时候传20，区分原来上传和新增上传的附件
                      };
                      const searchParams2: any = {
                        pageNumber: params.current,
                        pageSize: params.pageSize,
                        sourceId: row?.sid || '',
                        sourceType: 40,
                        subType: 40, //?现在的数组
                        //?刚进入页面的时候传subTyoe40，接下来传的时候传20，区分原来上传和新增上传的附件
                      };
                      const res = await queryRefResource(searchParams);
                      const res2 = await queryRefResource(searchParams2);
                      if (res.errCode === 200) {
                        res2?.data?.list.forEach((e: any, i: any) => {
                          e.delete = i; //?添加删除状态
                        });
                        //? 接下来合并两个数组
                        const newArr = res?.data.list.concat(res2?.data.list);
                        newArr.forEach((e: any, i: any) => {
                          //?防止key报错
                          e.index = i;
                        });
                        return Promise.resolve({
                          data: newArr,
                          total: newArr?.length,
                          success: true,
                        });
                      } else {
                        // message.error(res.errMsg);
                        return Promise.resolve([]);
                      }
                    } else {
                      return Promise.resolve({
                        data: FileArr,
                        total: FileArr?.length,
                        success: true,
                      });
                    }
                    // if (goodsDetail?.sid === undefined) return [];
                  }}
                  rowKey="index"
                  search={false}
                  tableAlertRender={false}
                  actionRef={filetableRef}
                  defaultSize="small"
                  scroll={{ x: 0 }}
                  options={{ reload: false, density: false }}
                  toolBarRender={false}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total, range) =>
                      `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                  }}
                />
                <h4 className="formTitle" id="one">
                  替换SKU明细
                </h4>
                {/* rowDetail.status == 10 &&  */}
                {step && (
                  <Button className="addLine" onClick={addLine}>
                    新增行
                  </Button>
                )}
                <Spin spinning={searchLoad}>
                  <ProTable<any>
                    bordered
                    columns={step ? infoColumn2 : infoColumn22}
                    request={async () => {
                      if (step) {
                        return Promise.resolve({
                          data: replaceArr,
                          success: true,
                        });
                      } else {
                        // if (goodsDetail?.sid === undefined) return [];
                        const res = await queryProductLine(row?.sid);
                        // console.log(res.errMsg);
                        if (res.errCode === 200) {
                          let Price2 = 0;
                          let Price = 0;
                          res.data.forEach((e: any, i: any) => {
                            Price2 = (Price2 * 100 + Number(e.replaceAmount) * 100) / 100;
                            Price = (Price * 100 + Number(e.requestAmount) * 100) / 100;
                            e.index = i;
                          });
                          setPrice2(Price2.toFixed(2));
                          setPrice(Price.toFixed(2));
                          return Promise.resolve({
                            data: res.data,
                            total: res.data?.total,
                            success: true,
                          });
                        } else {
                          message.error('暂无数据');
                          return Promise.resolve([]);
                        }
                      }
                    }}
                    rowKey="index"
                    search={false}
                    tableAlertRender={false}
                    actionRef={tableRef}
                    defaultSize="small"
                    scroll={{ x: 0 }}
                    options={{ reload: false, density: false }}
                    toolBarRender={false}
                    className="SKUclass"
                    pagination={
                      //?如果是添加的行明细那么就不给分页
                      step
                        ? false
                        : {
                            showQuickJumper: false,
                            size: 'default',
                            responsive: false,
                          }
                    }
                  />
                </Spin>
              </Form>
            </Spin>
          </TabPane>
          <TabPane tab="相关流程" key="2">
            <RelatedProcesses billNo={goodsDetail?.orderNo} />
            {/*<ProTable<any>
              actionRef={pref}
              columns={infoColumn3}
              request={async () => {
                const res = await oaprocesses(goodsDetail.orderNo);
                if (res.errCode === 200) {
                  res.data?.dataList.forEach((e: any, i: any) => {
                    e.index = i;
                  });
                  return Promise.resolve({
                    data: res.data?.dataList,
                    total: res.data?.total,
                    success: true,
                  });
                } else {
                  message.error(res?.errMsg);
                  return Promise.resolve([]);
                }
              }}
              rowKey="index"
              search={false}
              tableAlertRender={false}
              defaultSize="small"
              scroll={{ x: 0 }}
              options={{ reload: false, density: false }}
              toolBarRender={false}
            />*/}
          </TabPane>
        </Tabs>
        <MyModal ref={Modalref} getInfo={getInfo} />
        <UploadModal getList={getList} visible={visible} />
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
