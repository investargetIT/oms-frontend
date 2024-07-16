import { costCenter, queryChannel, queryContact, save } from '@/services/afterSales';
import ProForm from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, InputNumber, message, Space } from 'antd';
import Cookies from 'js-cookie';
import { useRef, useState } from 'react';
import { history, useModel } from 'umi';
import ApplyInfo from './components/ApplyInfo';
import BasicInfo from './components/BasicInfo';
import AddModal from './components/Modal';
import UploadFile from './components/UploadForm';
import './index.less';

interface AddProps {
  id?: string;
}
type TableListItem = Record<string, any>;

const Add: React.FC<AddProps> = () => {
  const { destroyCom } = useModel('tabSelect');
  const filetableRef: any = useRef();
  const [uploadList, setUploadList] = useState<any>([]);
  // const [resourceList, setResourceList] = useState<any>([]);
  const [replaceArr, setReplaceArr] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectOrder, setSelectOrder]: any = useState([]);
  const [modalVisibleUpload, setModalVisibleUpload] = useState<any>(false);
  const [r3list, setR3list] = useState<any>();
  const [Code, setCode] = useState<any>();
  const [salesId, setSalesId] = useState<any>();
  const [CostCenter, setCostCenter] = useState<any>(); //?设置成本中心id提交申请的时候参数用
  const [expect, setExpect] = useState<any>(); //?设置成本中心id提交申请的时候参数用
  const [AreaInfo, setArea] = useState<any>(); //?选择收获信息之后
  const [companyCode, setCompanyCode] = useState<any>(); //?//?设置公司code给提交申请的时候的接口
  const [companyName, setCompanyName] = useState<any>(); //?设置公司name给提交申请的时候的接口
  const [PassCode, setPassCode] = useState<any>(0);
  const [Channel, setChannel] = useState();
  const formRef: any = useRef();
  const modalRef: any = useRef();
  function onblur(record: any) {
    //?在输入框失去焦点的时候恢复成黑色
    const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
    const setSalesPrice: any = rowDom.querySelector('.totalAmount');
    setSalesPrice.style.color = '#000'; //*设置小计含税颜色
  }
  //?替换信息填写之后同步到上方表格
  const getRepData = (data: any) => {
    let amountCount = 0;
    const newArr = replaceArr.concat(data);
    newArr.forEach((element: any, i: any) => {
      element.index = i;
      if (element.qty && element.salesPrice) {
        element.subtotalPrice = Number(Number(element.qty) * Number(element.salesPrice)).toFixed(2);
        amountCount += Number(Number(Number(element.qty) * Number(element.salesPrice)).toFixed(2));
      }
    });
    setReplaceArr(newArr);
    formRef?.current?.setFieldsValue({
      applyAmount: Number(amountCount).toFixed(2),
    });
  };
  const delItem = async (record: any) => {
    setUploadList(uploadList.filter((item: any) => item.resourceName !== record.resourceName));
  };
  const delItem2 = async (record: any) => {
    let amountCount = 0;

    const arr = replaceArr.filter((item: any) => {
      if (item.index !== record.index && item.salesPrice) {
        item.subtotalPrice = Number(Number(item.qty) * Number(item.salesPrice)).toFixed(2);
        amountCount += Number(item.subtotalPrice);
      }
      formRef?.current?.setFieldsValue({
        applyAmount: Number(amountCount).toFixed(2),
      });
      return item.index != record.index;
    });
    setReplaceArr(arr);
  };
  function doCount(value: any, record: any) {
    //?设置金额联动函数
    //? 1、首先获取到当前的下标是record.index  然后根据这个index可以获取到当前行的dom结构
    const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
    // console.log(rowDom, '选中的dom');
    //? 2、然后在当前行内的dom结构中通过子代选择器，一个一个的选中需要同步变更的那几项
    const setSalesPrice: any = rowDom?.querySelector('.subtotalPrice');
    setSalesPrice.innerHTML = Number(Number(value) * Number(record.salesPrice)).toFixed(2); //*设置小计含税
  }
  function FreightOnChange(value: string, record?: any) {
    // console.log(value, record, replaceArr[record.index]);
    //? 数量更改
    const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
    const setSalesPrice: any = rowDom?.querySelector('.subtotalPrice');
    ////设置最大的可调范围暂不需要，暂不删除注释，以后可能会用
    ////if (Number(value) > Number(record.totalAmountMax)) {
    //   // console.log(1, value);
    //   //setSalesPrice.style.color = 'red'; //*设置小计含税颜色
    //   //message.warning('超出可调范围');
    // //} else
    if (Number(value) < 0) {
      setSalesPrice.style.color = 'red'; //*设置小计含税颜色
      message.warning('超出可调范围');
    } else if (value == null) {
      setSalesPrice.style.color = '#000'; //*设置小计含税颜色
    } else {
      doCount(value, record);
      setSalesPrice.style.color = '#000'; //*设置小计含税颜色
    }
    //?联动函数
    // 设置变量统计小计含税总额
    let amountCount = 0;

    const arr = replaceArr.map((item: any) => {
      if (item.index == record.index) {
        item.qty = value;
        if (item.salesPrice) {
          item.subtotalPrice = Number(Number(value) * Number(record.salesPrice)).toFixed(2);
          amountCount += item.subtotalPrice;
        }
        return item;
      } else {
        return item;
      }
    });
    console.log(amountCount, 'amountCount');

    formRef?.current?.setFieldsValue({
      // applyAmount: Number(amountCount).toFixed(2), laode cuode
      applyAmount: arr
        ?.map((io: any) => io.subtotalPrice)
        .filter((io: any) => io)
        ?.reduce((pre: any, cur: any) => (Number(pre) + Number(cur)).toFixed(2)),
    });
    setReplaceArr(arr);
  }
  const fileColumns: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName', width: 150 },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // width: 350,
      render: (_, record) => {
        return (
          <Space>
            {
              <span style={{ display: 'flex' }}>
                <a
                  onClick={() =>
                    window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)
                  }
                  href="#!"
                  key={'down'}
                >
                  下载
                </a>{' '}
                &nbsp;&nbsp;
                <a href="#!" onClick={() => delItem(record)} key={'remove'}>
                  移除
                </a>
              </span>
            }
          </Space>
        );
      },
    },
  ];
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'left',
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={() => {
                delItem2(record);
              }}
              key={'删除'}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
    {
      title: 'SKU号',
      dataIndex: 'sku',
      width: 100,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brandName || ''} ${record?.productName} ${record?.mfgSku || ''}`;
      },
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 100,
      render(text, record) {
        return (
          <InputNumber
            className="totalAmount"
            type="text"
            precision={2}
            size="small"
            style={{ width: '100%' }}
            min={1}
            onChange={(value: any) => {
              FreightOnChange(value, record);
            }}
            onBlur={() => onblur(record)}
            onInput={(value) => FreightOnChange(value, record)}
            value={Number(record.qty).toFixed(2)}
            defaultValue={record.qty}
          />
        );
      },
    },
    {
      title: '面价',
      dataIndex: 'facePrice',
      width: 100,
    },
    {
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 100,
    },
    {
      title: '小计含税',
      dataIndex: 'subtotalPrice',
      width: 100,
      render(_, record) {
        return (
          <span className="subtotalPrice">
            {Number(Number(record.qty) * Number(record.salesPrice)).toFixed(2)}
          </span> //?添加类名方便计算的时候设置
        );
      },
    },
    {
      title: '结算价',
      dataIndex: 'settlePrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  if (selectOrder.length == undefined) {
    console.log(selectOrder, 'selectOrder');
  }
  const submit = async (values: any) => {
    // console.log(values, 'values');
    // console.log(uploadList, 'uploadList');
    if (uploadList.length === 0) {
      return message.error('请先选择附件');
    }
    if (replaceArr.length === 0) {
      return message.error('借样明细不能为空');
    }
    if (!AreaInfo.cityName || !AreaInfo.provinceName) {
      return message.error('省或城市信息不全，请去crm补充收货信息');
    }
    if (!values.fixedPhone && !values.receiverMobile) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    const par = {
      sampleVO: {
        ...values,
        applyStatus: 20,
        applyStatusName: '审批中',
        salesId,
        costCenter: CostCenter,
        invoiceReceiptDate: values.invoiceReceiptDate,
        deliveryDate: values.deliveryDate,
        expectHandleTypeName: expect,
        channelType: Channel,
        provinceCode: AreaInfo.province,
        cityCode: AreaInfo.city,
        districtCode: AreaInfo.district,
        province: AreaInfo.provinceName,
        city: AreaInfo.cityName,
        district: AreaInfo.districtName,
        toBondFlag: PassCode,
        // specialCode: values.specialCode,
        sapCode: AreaInfo?.sapCode,
        companyCode,
        companyName,
      },
      sampleLineVOList: replaceArr,
      resourceList: uploadList,
    };
    // console.log(JSON.stringify(par), 'par',par);
    const { errCode, errMsg } = await save(par);
    if (errCode === 200) {
      message.success('提交申请成功');
      destroyCom('/sales-after/Borrow/Apply', location.pathname);
    } else {
      message.error(errMsg);
    }
  };
  const showList = async (val: any) => {
    if (val.length > 0) {
      // console.log(val, 'val');
      const resourcelist1: any = [];
      val.forEach((e: any, i: any) => {
        e.index = i;
        resourcelist1.push({
          resourceName: e.resourceName,
          resourceUrl: e.resourceUrl,
          // fileType: 'po附件',
        });
      });
      setUploadList(
        [...resourcelist1, ...uploadList].map((io, index) => ({ ...io, index: index })),
      );
      // setResourceList(resourcelist1);
      setModalVisibleUpload(false);
      filetableRef.current.reload();
    } else {
      setModalVisibleUpload(false);
    }
  };
  //?选择了客户之后触发的函数
  const getData = async (val: any) => {
    // console.log(val,'val');
    if (!val) return;
    if (JSON.stringify(val) != '{}') {
      //?当选择了客户之后需要清空一下收货人的信息
      formRef?.current?.setFieldsValue({
        district: '',
        receiverAddress: '',
        shipZip: '',
        receiverName: '',
        receiverMobile: '',
        fixedPhone: '',
        mailbox: '',
      });
      setReplaceArr([]);
      // console.log(val, 'val');
      setSalesId(val.mainSalesId); //?设置主销售id提交申请的时候参数用
      setCode(val.customerCode); //?设置客户号提供给下面的收货信息搜索框查询收货信息
      setCompanyCode(val.ownerCompany); //?设置公司code给提交申请的时候的接口
      setCompanyName(val.officeName); //?设置公司name给提交申请的时候的接口

      const res = await costCenter({ staffCode: val.mainSalesId }); //?查询成本中心
      setCostCenter(res?.data?.costCenterCode); //?设置成本中心id提交申请的时候参数用
      const res2 = await queryContact({ customerCode: val.customerCode });
      if (!res2?.data?.dataList?.length || res2?.data?.dataList?.length === 0) {
        return message.error('请到crm补全r3联系人信息');
      }
      const res3 = await queryChannel({}); // todowwc渠道取到第一个然后，将code传给后端
      // console.log(res3, 'res3');
      const result = res3.data.find((item: any) => {
        return item.channelName === 'OMS';
      });
      // console.log(result, 'result');
      // console.log(res2, 'res2');
      res2?.data?.dataList?.forEach((e: any) => {
        e.label = e.contactName;
        e.value = e.contactCode;
      });
      setChannel(result.channel);
      setR3list(res2?.data?.dataList); //?选择客户之后，通过客户号查询r3联系人和r3联系人代号，然后设置传递给子组件
      formRef?.current?.setFieldsValue({
        customerName: val.customerName,
        customerCode: val.customerCode,
        salesName: val.mainSalesName,
        costCenterName: res?.data?.costCenter,
        channelType: result.channelName,
        channelTypeName: result.channel,
        contactNameR3: res2?.data?.dataList[0]?.label, //?设置r3联系人默认值
        contactCodeR3: res2?.data?.dataList[0]?.value, //?设置r3联系人代号默认值
      });
    }
  };
  //?选择了地区之后触发的函数
  const getRData = (val: any) => {
    if (!val) return;
    if (JSON.stringify(val) != '{}') {
      // console.log(val, 'val');
      setArea(val);
      formRef?.current?.setFieldsValue({
        district: val.districtName,
        receiverAddress: val.receiptAddress,
        shipZip: val.receiptZipCode,
        receiverName: val.recipientName,
        receiverMobile: val.receiptMobilePhone,
        fixedPhone: val.receiptFixPhone,
        mailbox: val.receiptEmail,
      });
    }
  };
  const fn2 = (val: any) => {
    // console.log(val, 'val');
    setExpect(val);
  };
  const passCode = (val: any) => {
    setPassCode(val);
  };
  const delSel = (): any => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择要删除的文件');
      return false;
    } else {
      const newList = uploadList.filter(
        (io: any) => !selectedRowKeys.some((ic: any) => io.index === ic),
      );
      setUploadList(newList);
    }
  };
  return (
    <div className="form-content-search Borrow">
      <ProForm
        className="has-gridForm has-gridForm borrowCreatedContent"
        formRef={formRef}
        layout="horizontal"
        onFinish={(values) => submit(values)}
        onFinishFailed={() => {
          message.warning('您有未完善的信息，请填写正确的信息');
        }}
        submitter={{
          searchConfig: {},
          render: () => {
            return (
              <div
                style={{
                  position: 'fixed',
                  zIndex: 100,
                  bottom: '10px',
                  right: '10px',
                  height: '30px',
                  textAlign: 'end',
                  backgroundColor: '#fff',
                  paddingRight: '10px',
                }}
              >
                <Space>
                  <Button type="primary" htmlType="submit">
                    提交申请
                  </Button>
                  <Button
                    onClick={() => {
                      destroyCom('/sales-after/Borrow/Apply', location.pathname);
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            );
          },
        }}
        initialValues={{
          toBondFlag: 0,
        }}
      >
        <Card className="head-title-wrap">
          <p className="head-title">新增借样申请</p>
          <Space>
            <p className="red">同一客户每季度借样订单总金额大于300元需备注超额原因</p>
          </Space>
        </Card>
        <div className="editContentCol">
          <Card title="申请基本信息" bordered={false} id="basic">
            <BasicInfo formRef={formRef} r3list={r3list} type="add" fn2={fn2} fn={getData} />
          </Card>
          <Card title="收货信息" bordered={false} id="pay">
            <ApplyInfo passCode={passCode} Code={Code} type="add" fn={getRData} />
          </Card>
          <Card
            title={'申请附件' + ' ' + '(必填)'}
            bordered={false}
            className="order-msg"
            id="shopDetail"
          >
            <ProTable<TableListItem>
              style={{ width: '70%' }}
              columns={fileColumns}
              bordered
              size="small"
              rowKey="index"
              options={false}
              search={false}
              dateFormatter="string"
              dataSource={uploadList}
              tableAlertRender={false}
              actionRef={filetableRef}
              rowSelection={{
                selectedRowKeys,
                onChange: (selectedRowKeyss: React.Key[], selectedRows: any[]) => {
                  //左侧单选框触发的时候会执行的函数
                  setSelectOrder(selectedRows);
                  setSelectedRowKeys(selectedRowKeyss);
                },
              }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    if (selectedRowKeys.includes(record.index)) {
                      const newKeys = selectedRowKeys.filter((item: any) => item !== record.index);
                      setSelectedRowKeys(newKeys);
                    } else {
                      setSelectedRowKeys(selectedRowKeys.concat([record.index]));
                    }
                  },
                };
              }}
              headerTitle={
                <Space style={{ marginBottom: '6px' }}>
                  <Button type="primary" onClick={() => setModalVisibleUpload(true)}>
                    上传附件
                  </Button>
                  <Button onClick={delSel}>删除选中</Button>
                </Space>
              }
              pagination={false}
            />
          </Card>
          <Card title="借样明细" bordered={false} className="order-msg" id="shopDetail">
            <ProTable<TableListItem>
              className="selectedTable"
              columns={columns}
              scroll={{ x: 100, y: 500 }}
              size="small"
              bordered
              options={false}
              search={false}
              pagination={false}
              dateFormatter="string"
              dataSource={replaceArr}
              rowKey="index"
              headerTitle={
                <Space style={{ marginBottom: '6px' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      modalRef.current.openModal();
                    }}
                  >
                    添加SKU
                  </Button>
                </Space>
              }
            />
          </Card>
        </div>
      </ProForm>
      <UploadFile getList={showList} visible={modalVisibleUpload} />
      <AddModal ref={modalRef} getData={getRepData} formRef={formRef} />
    </div>
  );
};
// export default Add;
import { KeepAlive } from 'react-activation';
import { number } from 'echarts';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Add />
  </KeepAlive>
);
