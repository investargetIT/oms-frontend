import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  goodsDetails,
  updateJv,
  notReplace,
  queryOderChannelConfig,
  markLocalSupplier,
  saveReplaceLog,
  appointSupplier,
  getReportLogDetail,
  getSupplierSearchByCode,
} from '@/services/SalesOrder';
import { queryListDataMap } from '@/services';
import MyModal from '../Modal';
import './style.less';
import ProForm, {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useAccess, Access, useModel } from 'umi';
const { Option } = Select;
const MyDrawer = ({ fn }: any, ref: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { initialState }: any = useModel('@@initialState');
  const [currentPageSize, setCurrentPageSize] = useState(100);
  const [companyList, setCompanyList] = useState([]);
  const drawerWidth = window.innerWidth * 0.8;
  // const key = new Date().getTime();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [key, setKey] = useState(''); //?存储订单号
  // const [sid, setSid] = useState(''); //?存储当前sid进行发给后端进行修改
  const [replaceArr, setReplaceArr]: any = useState([]); //?订单明细的表格数据
  const [Row, setRow]: any = useState(); //?存储上一个页面列表行信息
  // console.log(Row, 'Row');
  const [total, setTotal]: any = useState(); //?表格的总条数
  const [confirmload, setConfirmload]: any = useState(false);
  const [changeArr, setChageArr]: any = useState([]); //?这个数组用来存所有的改过的行信息
  const [mdmForm] = Form.useForm();
  const [changeSupplierForm] = Form.useForm();
  const [changeTheSpecifiedVendorForm] = Form.useForm();
  const [vendorOpen, setVendorOpen] = useState<any>(false);
  const { btnPerm } = useAccess();
  const [selectReportModal, setSetselectReportModal] = useState<any>(false);
  const [reportKeys, setReportKeys] = useState<any>([]);
  const [reportRows, setReportRows] = useState<any>([]);
  const [rpObj, setRpObj] = useState<any>({});
  const [noCheck, setNoCheck] = useState<any>(false);
  const [defaultLeadTime, setDefaultLeadTime] = useState<any>(60);
  const [objSp, setObjSp] = useState<any>({});
  console.log(
    initialState?.currentUser?.authorizations.includes(
      'salesorder00011:omssallOrederMarkAppointSupplier',
    ),
    'btnPerm',
  );
  const booList = [
    {
      label: '是',
      value: true,
    },
    {
      label: '否',
      value: false,
    },
  ];
  const booList1 = [
    {
      label: '需要',
      value: true,
    },
    {
      label: '不需要',
      value: false,
    },
  ];
  const [modalJv, setModalJv] = useState<any>(false);
  const [jvForm] = Form.useForm();
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);

  const [jvStatus, setJvStatus] = useState<any>(null);
  const [mdmStatus, setMdmStatus] = useState<any>(null);
  const [markSupplierStatus, setMarkSupplierStatus] = useState<any>(null);
  const [markAppointSupplierStatus, setMarkAppointSupplierStatus] = useState<any>(null);

  //! 在存的时候需要注意：
  //? 1、检测之前的数组里面有没有相同的项，如果有就替换，没有就添加
  //? 2、再次获取table数据的时候，需要遍历该数组，并找到与table中相同sid的所有项，并将table中的所有sid相同的那几项替换掉
  const tableRef: any = useRef();
  const ModalRef: any = useRef();
  //?清一下分页缓存和替换数据缓存
  const reloadData = () => {
    setChageArr([]); //?将分页记忆的数组清空一下
    setCurrentPageSize(100); //?初始化一下总页数
    setCurrentPage(1); //?初始化一下页码
  };
  // //?确认项下拉改变触发 //caozuo jv 注意：此需求第一个版本   行内修改操作
  // function handleChange(e: any, record: any) {
  //   console.log(e, 'e', record);
  //   setReplaceArr(
  //     replaceArr.map((item: any) => {
  //       if (item.sid === record.sid) {
  //         return { ...item, Jvalue: e, jvCompanyCode: '', jvCompanyName: '' };
  //       } else {
  //         return item;
  //       }
  //     }),
  //   );
  //   const flag = changeArr.some((item: any) => {
  //     //?检测当前的改变数组内部是否有
  //     return item.sid == record.sid;
  //   });
  //   if (flag) {
  //     //?如果有就修改
  //     setChageArr(
  //       changeArr.map((item: any) => {
  //         if (item.sid === record.sid) {
  //           //?找到那一项改一下当前
  //           return {
  //             ...record,
  //             Jvalue: e,
  //             jvCompanyCode: '',
  //             jvCompanyName: '',
  //           };
  //         } else {
  //           return item;
  //         }
  //       }),
  //     );
  //   } else {
  //     //?如果没有就添加
  //     setChageArr([...changeArr, { ...record, Jvalue: e, jvCompanyCode: '', jvCompanyName: '' }]);
  //   }
  // }
  // //?JV公司下拉改变
  // function handleCompany(e: any, record: any) {
  //   console.log(e, 'e');
  //   // console.log(changeArr, 'changeArr');
  //   setReplaceArr(
  //     replaceArr.map((item: any) => {
  //       if (item.sid === record.sid) {
  //         return { ...item, jvCompanyCode: e.key, jvCompanyName: e.label };
  //       } else {
  //         return item;
  //       }
  //     }),
  //   );
  //   const flag = changeArr.some((item: any) => {
  //     //?检测当前的改变数组内部是否有
  //     return item.sid == record.sid;
  //   });
  //   if (flag) {
  //     //?如果有就修改
  //     setChageArr(
  //       changeArr.map((item: any) => {
  //         if (item.sid === record.sid) {
  //           //?找到那一项改一下当前
  //           return {
  //             ...record,
  //             jvCompanyCode: e.key,
  //             jvCompanyName: e.label,
  //           };
  //         } else {
  //           return item;
  //         }
  //       }),
  //     );
  //   } else {
  //     //?如果没有就添加
  //     setChageArr([...changeArr, { ...record, jvCompanyCode: e.key, jvCompanyName: e.label }]);
  //   }
  // }

  //caozuo jv 注意：此需求第二个版本   按钮修改操作

  const jvOperition = (e: any) => {
    const newSelectRows = selectedRow?.map((io: any) => ({
      ...io,
      jv: e?.jv,
      jvCompanyName: e?.jvcc?.value,
      jvCompanyCode: e?.jvcc?.key,
    }));
    replaceArr?.map((io: any) => {
      for (let i = 0; i < newSelectRows.length; i++) {
        if (io.sid == newSelectRows[i].sid) {
          io.jv = newSelectRows[i].jv;
          io.jvCompanyName = newSelectRows[i].jvCompanyName;
          io.jvCompanyCode = newSelectRows[i].jvCompanyCode;
          io.reportingQty = newSelectRows[i].reportingQty;
          io.availableQty = newSelectRows[i].availableQty;
          io.consumedQty = newSelectRows[i].consumedQty;
          io.changeStatus = true;
          return io;
        }
      }
    });
    //记录按钮
    setJvStatus(1);
    setChageArr(replaceArr?.filter((io: any) => io.changeStatus));
  };

  const [mdm, setMdm] = useState<any>(true);
  const markMDM = async () => {
    if (selectedRowKeys.length == 0) {
      message.error('请选择行数据');
      return;
    }
    Modal.confirm({
      title: '标记MDM赋码',
      content: (
        <>
          <ProForm submitter={false} layout="vertical" form={mdmForm}>
            <ProFormRadio.Group
              name="mdm"
              label="是否需要MDM赋码:"
              initialValue={true}
              options={booList1}
              fieldProps={{
                onChange: (val) => {
                  setMdm(val?.target?.value);
                },
              }}
            />
          </ProForm>
        </>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let flagSubmit = false;
        const newSelectRows = selectedRow?.map((io: any) => ({
          ...io,
          mdm: mdmForm?.getFieldValue('mdm'),
        }));
        replaceArr?.map((io: any) => {
          for (let i = 0; i < newSelectRows.length; i++) {
            if (io.sid == newSelectRows[i].sid) {
              if (newSelectRows[i].markAppointSupplier && newSelectRows[i].mdm) {
                flagSubmit = true;
                return false;
              }
              io.mdm = newSelectRows[i].mdm;
              io.changeStatus = true;
              return io;
            }
          }
        });
        if (flagSubmit) {
          message.error('行sku信息的mdm赋码和项目单匹配不能都选为是');
          return false;
        }
        setMdmStatus(2);
        setMarkAppointSupplierStatus(null);
        setChageArr(replaceArr?.filter((io: any) => io.changeStatus));
      },
    });
  };

  const [markChangeSupplier, setMarkChangeSupplier] = useState<any>(true);
  const [isMarkSupplier, setIsMarkSupplier] = useState<any>(false);
  const markChangeSupplierClick = async () => {
    if (selectedRowKeys.length == 0) {
      message.error('请选择行数据');
      return;
    }
    Modal.confirm({
      title: '标记切换供应商',
      content: (
        <>
          <ProForm submitter={false} layout="vertical" form={changeSupplierForm}>
            <ProFormRadio.Group
              name="markChangeSupplier"
              label="是否需要标记切换供应商:"
              initialValue={true}
              options={booList}
              fieldProps={{
                onChange: (val) => {
                  setMarkChangeSupplier(val?.target?.value);
                },
              }}
            />
          </ProForm>
        </>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const newSelectRows = selectedRow?.map((io: any) => ({
          ...io,
          markChangeSupplier: changeSupplierForm?.getFieldValue('markChangeSupplier'),
        }));
        replaceArr?.map((io: any) => {
          for (let i = 0; i < newSelectRows.length; i++) {
            if (io.sid == newSelectRows[i].sid) {
              io.markChangeSupplier = newSelectRows[i].markChangeSupplier;
              io.changeStatus = true;
              return io;
            }
          }
        });
        const filRepData = replaceArr?.filter((io: any) => io.changeStatus);
        setChageArr(filRepData);
        setIsMarkSupplier(true);
        setMarkSupplierStatus(3);
        // 后端新加借口标记切换供应商 单的的标记供应商切换接口，
      },
    });
  };

  const clearAllMark = async () => {
    if (selectedRowKeys.length == 0) {
      message.error('请选择行数据');
      return;
    }
    Modal.confirm({
      title: '确认清除所有标记吗？',
      content: (
        <>
          <span style={{ color: 'red' }}>
            选中行已有的JV标记&JV公司，切换供应商标记，需要MDM赋码标记，项目单匹配标记，将全部清除
          </span>
          ，你还要继续吗？
        </>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        //清除所有的标记 等于重置数据
        const newSelectRows = selectedRow?.map((io: any) => ({
          ...io,
          jv: null,
          jvCompanyCode: '',
          jvCompanyName: '',
          mdm: null,
          markChangeSupplier: null,
          markAppointSupplier: null,
          localSupplierCode: null,
          // localLeadTime: null,
          localPurchPrice: null,
          localRemark: null,
          changeStatus: false, //qingchule
        }));
        replaceArr?.map((io: any) => {
          for (let i = 0; i < newSelectRows.length; i++) {
            if (io.sid == newSelectRows[i].sid) {
              io.jv = newSelectRows[i].jv;
              io.jvCompanyCode = newSelectRows[i].jvCompanyCode;
              io.jvCompanyName = newSelectRows[i].jvCompanyName;
              io.mdm = newSelectRows[i].mdm;
              io.markChangeSupplier = newSelectRows[i].markChangeSupplier;
              io.markAppointSupplier = newSelectRows[i].markAppointSupplier;
              io.localSupplierCode = newSelectRows[i].localSupplierCode;
              // io.localLeadTime = newSelectRows[i].localLeadTime;
              io.localPurchPrice = newSelectRows[i].localPurchPrice;
              io.localRemark = newSelectRows[i].localRemark;
              io.changeStatus = false;
              return io;
            }
          }
        });
        setChageArr(replaceArr?.filter((io: any) => io.changeStatus));
        setSelectedRowKeys([]);
        setSelectedRow([]);
      },
    });
  };

  // 渲染按鈕接口
  const [btnStatusData, setbtnStatusData] = useState<any>({});
  const initBtn = async (e?: any) => {
    queryOderChannelConfig(e).then((res: any) => {
      const { errCode, errMsg, data } = res;
      if (errCode == 200) {
        console.log(data, 'data');
        setbtnStatusData(data);
      } else {
        message.error(errMsg);
      }
    });
  };

  //?进入页面的时候搜索所有的公司的下拉
  const searchCompany = async () => {
    const res = await queryListDataMap(['masterJV']);
    if (res.errCode == 200) {
      setCompanyList(res?.data?.masterJV);
    } else {
      message.error('失败' + res.errMsg);
    }
  };
  const infoColumn: ProColumns<any>[] = [
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'left',
      width: 80,
      render: (_, record: any) => {
        return (
          <>
            {!!record.repeat && (
              <Button
                type="link"
                onClick={(event: any) => {
                  setRpObj(record);
                  setSetselectReportModal(true);
                  event.stopPropagation();
                }}
              >
                详情
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SKU', dataIndex: 'sku', width: 100 },
    { title: '数量', dataIndex: 'qty', width: 60 },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 100 },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 130 },
    { title: '面价', dataIndex: 'listPrice', width: 100 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 100 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 100 },
    // 进价=原含税成交价*（1-进价率）
    { title: '供应商名称', dataIndex: 'localSupplierName', width: 100 }, // 新增加名称字段对应供应商cdoe
    {
      title: '供应商号',
      dataIndex: 'localSupplierCode',
      width: 80,
      render: (_, record: any) => {
        return (
          <Input
            width={100}
            disabled={record.markAppointSupplier ? false : true}
            value={record?.localSupplierCode || ''}
            onChange={(val: any) => {
              setReplaceArr(
                replaceArr.map((io: any) => {
                  if (io.sid === record.sid) {
                    io.localSupplierCode = val.target.value;
                  }
                  return io;
                }),
              );
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
        );
      },
    },
    {
      title: '进价',
      dataIndex: 'localPurchPrice',
      width: 120,
      render: (_, record: any) => {
        return (
          <InputNumber
            min={0}
            // max={record.salesPrice}
            width={100}
            precision={2}
            disabled={record.markAppointSupplier ? false : true}
            value={record?.localPurchPrice || null}
            onChange={(val: any) => {
              setReplaceArr(
                replaceArr.map((io: any) => {
                  if (io.sid === record.sid) {
                    io.localPurchPrice = val || 0;
                    io.purchRate = (1 - val / record.salesPrice).toFixed(2);
                    // if (io.purchRate >= 1) {
                    //   message.error('进价率只能维持在0-1之间');
                    //   io.localPurchPrice = 0;
                    //   io.purchRate = 1;
                    // }
                    // if (io.purchRate <= 0.01) {
                    //   message.error('进价率只能维持在0-1之间');
                    //   io.localPurchPrice = 0.99 * Number(record.salesPrice);
                    //   io.purchRate = 0.01;
                    // }
                  }
                  return io;
                }),
              );
            }}
            controls={false}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
        );
      },
    },
    // { title: '进价率', dataIndex: 'purchRate', width: 80 },
    // {
    //   title: '交期',
    //   dataIndex: 'localLeadTime',
    //   width: 100,
    //   render: (_, record: any) => {
    //     return (
    //       <InputNumber
    //         min={0}
    //         width={70}
    //         value={record?.localLeadTime}
    //         disabled={record.markAppointSupplier ? false : true}
    //         onChange={(val: any) => {
    //           setReplaceArr(
    //             replaceArr.map((io: any) => {
    //               if (io.sid === record.sid) {
    //                 io.localLeadTime = val;
    //               }
    //               return io;
    //             }),
    //           );
    //         }}
    //         controls={false}
    //         onPressEnter={(e) => {
    //           e.preventDefault();
    //         }}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           e.nativeEvent.stopImmediatePropagation();
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      title: '备注',
      dataIndex: 'localRemark',
      width: 150,
      render: (_, record: any) => {
        return (
          <Input
            value={record?.localRemark}
            disabled={record.markAppointSupplier ? false : true}
            onChange={(val: any) => {
              setReplaceArr(
                replaceArr.map((io: any) => {
                  if (io.sid === record.sid) {
                    io.localRemark = val.target.value;
                  }
                  return io;
                }),
              );
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
        );
      },
    },
    { title: '产品名称', dataIndex: 'productNameConcatStr', width: 160 },
    { title: '品牌', dataIndex: 'brandName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '客户物料号', dataIndex: 'customerSku', width: 100 },
    { title: '客户需求行号', dataIndex: 'poItemNo', width: 100 },
    // new
    {
      title: '是否JV',
      dataIndex: 'jv',
      width: 100,
      valueEnum: { true: { text: '是' }, false: { text: '否' } },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 200 },
    // { title: '是否中航', dataIndex: '11111111111', width: 100 },
    {
      title: '需要MDM赋码',
      dataIndex: 'mdm',
      width: 100,
      valueEnum: { true: { text: '是' }, false: { text: '否' } },
    },
    {
      title: '是否切换供应商',
      dataIndex: 'markChangeSupplier',
      width: 100,
      valueEnum: { true: { text: '是' }, false: { text: '否' } },
    },
    {
      title: '是否项目单匹配',
      dataIndex: 'markAppointSupplier',
      width: 100,
      render: (_, record: any) => {
        return record.markAppointSupplier
          ? '是'
          : record.markAppointSupplier == 0 || record.markAppointSupplier == false
          ? '否'
          : '-';
      },
    },
    // old
    // {
    //   title: '确认项',
    //   width: 150,
    //   render(_, record) {
    //     return (
    //       <Select
    //         value={record.Jvalue}
    //         style={{ width: 120 }}
    //         onChange={(e) => handleChange(e, record)}
    //         // defaultValue={record.jvCompanyCode ? 'mark' : 'unchange'} //?如果传了公司的jvCode就让确认项显示成标记JV
    //       >
    //         <Option value="mark">标记JV</Option>
    //         <Option value="change">MDM赋码</Option>
    //         <Option value="unchange">不处理</Option>
    //       </Select>
    //     );
    //   },
    // },
    // {
    //   title: 'JV公司',
    //   width: 150,
    //   render(_, record) {
    //     return (
    //       <Select
    //         // value={record.jvCompanyCode}
    //         disabled={record.Jvalue !== 'mark'}
    //         style={{ width: 120 }}
    //         value={{ value: record.jvCompanyCode, label: record.name }}
    //         onChange={(e) => handleCompany(e, record)}
    //         labelInValue
    //       >
    //         {companyList.map((item: any) => (
    //           <Option key={item.key} value={item.key}>
    //             {item.value}
    //           </Option>
    //         ))}
    //       </Select>
    //     );
    //   },
    // },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  const reportColumns: ProColumns<any>[] = [
    { title: '供应商编号', dataIndex: 'reportSupplierCode', fixed: true, width: 100 },
    { title: '供应商名称', dataIndex: 'reportSupplierName', width: 150 },
    { title: '点位%', dataIndex: 'point', width: 80 },
    // { title: '交期', dataIndex: 'reportItemLeadTime', width: 80 },
    { title: '报备下单数量', dataIndex: 'orderNum', width: 100 },
    { title: '报备下单总价', dataIndex: 'totalAmount', width: 100 },
    { title: '报备下单时间', dataIndex: 'orderTime', width: 150 },
    { title: '报备编号', dataIndex: 'reportCode', width: 150 },
    { title: 'RSM', dataIndex: 'rms', width: 100 },
    { title: '销售', dataIndex: 'mainSale', width: 150 },
  ];
  reportColumns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const closeDrawer = () => {
    // setChageArr([]);
    setCurrentPageSize(100); //?初始化一下总页数
    setCurrentPage(1); //?初始化一下页码
    setIsModalVisible(false);
  };
  const acceptArr = (e: any) => {
    //?接收子组件传过来的交换信息
    setReplaceArr(e);
    tableRef.current.reloadAndRest();
  };
  //?获取表格数据
  const getTableData = async (e?: any, current?: any, pageSize?: any) => {
    const searchParams: any = {
      pageNumber: current || 1,
      pageSize: pageSize || 100,
      orderNo: e || key,
    };
    const res = await goodsDetails(searchParams);
    // console.log(res, 'res');
    // console.log(changeArr, 'changeArr');
    if (res.errCode == 200) {
      setTotal(res?.data?.total);
      for (let i = 0; i < res?.data.list.length; i++) {
        // const item = res?.data.list[i];
        // console.log(item, 'item');
        //   //?一开始进入页面的时候，当有公司的jVCode的时候，让确认项的初始值等于mark，显示成标记JV
        if (res?.data?.list[i]?.jvCompanyCode) {
          res.data.list[i].Jvalue = 'mark';
          res.data.list[i].jv = '是';
        } else {
          res.data.list[i].Jvalue = 'unchange';
          res.data.list[i].jv = '否';
        }
      }
      // console.log(res.data.list, 'res.data.list');
      // ?拿到changeArr（改变过的）每一项，去请求回来的数据里面去匹配，如果找到一样的就将changeArr里面的那一项，替换掉请求回来的那一项
      for (let i = 0; i < changeArr.length; i++) {
        const element = changeArr[i];
        for (let j = 0; j < res?.data?.list?.length; j++) {
          const ele = res?.data?.list[j];
          if (element.sid === ele.sid) {
            res.data.list[j] = element;
          }
        }
      }
      setReplaceArr(res?.data?.list);
      const lp = res?.data?.list?.filter((io: any) =>
        selectedRowKeys.some((ic: any) => ic == io.orderLineId),
      );
      setSelectedRow(lp);
    } else {
      message.error('失败' + res.errMsg);
    }
  };
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    getTableData(key, current, pageSize);
  }
  //?抽屉组件被打开的时候的回调
  const open = async (e: any, record: any) => {
    setConfirmload(false);
    // setChageArr([]); //?将分页记忆的数组清空一下
    setReplaceArr([]); //?将表格数据清一下
    setRow(record); //?行信息
    setKey(e); //?订单号
    getTableData(e); //?获取表格数据
    initBtn(e); //初始化btn
    searchCompany(); //?获取公司下拉
    setIsModalVisible(true);
    await setTimeout(() => {}, 0); //?打开抽屉之后重新刷新表格
    tableRef.current.reload();
  };
  const close = () => {
    setIsModalVisible(false);
  };
  // const replaceSKU = () => {
  //   ModalRef.current.openModal(key);
  // };
  const savefn = async () => {
    setConfirmload(true);
    // 弹窗提醒
    const btnss =
      initialState?.currentUser?.authorizations.includes(
        'salesorder00011:omssallOrederMarkAppointSupplier',
      ) && !!btnStatusData?.markAppointSupplier;
    const filterRep = replaceArr.filter(
      (io: any) => io.markAppointSupplier == 0 || io.markAppointSupplier == false,
    );
    const filterCha = changeArr.filter(
      (io: any) => io.markAppointSupplier == 0 || io.markAppointSupplier == false,
    );
    let tanFlag = false;
    if (btnss && (filterRep.length > 0 || filterCha > 0)) {
      Modal.confirm({
        title: '项目报备提醒',
        content: '您本次提交的报备申请不包含所有行，请确认',
        onOk: async () => {
          tanFlag = true;
          let isRepeat = true; //?一开始默认都是重复的
          for (let i = 0; i < changeArr.length; i++) {
            const element = changeArr[i];
            if (element.Jvalue == 'mark' && element.jvCompanyCode == '') {
              setConfirmload(false);
              return message.warning('标记JV的选项需要选择JV公司');
            }
            for (let j = 0; j < replaceArr.length; j++) {
              const ele = replaceArr[j];
              if (!ele.jvCompanyCode || !element.jvCompanyCode) {
                //?刚开始进入页面的时候默认为空，过滤掉,改过的如果为空也过掉
                // console.log(ele,'ele1',element);
                continue;
              } else if (ele.jvCompanyCode !== element.jvCompanyCode) {
                // console.log(ele,'ele2',element);
                //?如果遇到不一样的就将isRepeat置为false，意思是没有重复的
                isRepeat = false;
                break;
              }
            }
          }
          //?判断是不是全部重复的jvCompanyCode，是的话就发请求
          if (isRepeat) {
            if (changeArr.length > 0) {
              //add 需求标记切换供应商接口带哦用
              if (isMarkSupplier) {
                const par = changeArr.map((io: any) => ({
                  orderNo: key,
                  orderLineId: io.orderLineId,
                  markChangeSupplier: io.markChangeSupplier ? 1 : 0,
                }));
                const { errCode, errMsg } = await markLocalSupplier(par);
                if (errCode != 200) {
                  message.error(errMsg);
                  setConfirmload(false);
                  return false;
                }
              }
              // add 需要制定供應商
              const changeArrS = changeArr.filter((io: any) => io.markAppointSupplier);
              // const changeArrM = changeArr.filter((io: any) => io.mdm);
              const checkLineSupplierCode = changeArrS?.filter(
                (io: any) => !io.localSupplierCode || !io.localPurchPrice,
              );
              if (checkLineSupplierCode.length > 0) {
                message.error('项目单匹配必须填写供应商号，进价，交期。 请检查');
                setConfirmload(false);
                return false;
              }

              if (changeArrS.length > 0) {
                const par = {
                  orderNo: key,
                  appointSupplierLines: changeArr.map((io: any) => ({
                    orderLineId: io.orderLineId,
                    markAppointSupplier: io.markAppointSupplier ? 1 : 0,
                    localSupplierCode: io.localSupplierCode,
                    // purchRate: io.purchRate ? Number(io.purchRate) : null,
                    localPurchPrice: io.localPurchPrice ? Number(io.localPurchPrice) : null,
                    // localLeadTime: io.localLeadTime,
                    localRemark: io.localRemark,
                    reportingQty: io.reportingQty,
                    availableQty: io.availableQty,
                    consumedQty: io.consumedQty,
                  })),
                };
                const { errCode, errMsg } = await appointSupplier(par);
                if (errCode != 200) {
                  message.error(errMsg);
                  setConfirmload(false);
                  return false;
                }
              }
              //?说明有改动的内容，如果没有改动的内容就不替换
              const paramsArr = changeArr
                // .filter((item: any) => {
                //   //?当时A换B的时候，jvCompanyCode==''这个要过滤一下，然后再给后端
                //   //?把所有不是A换B的，标记JV或者不处理的筛选出来
                //   return item.Jvalue !== 'change';
                // })
                .map((item: any) => {
                  return {
                    orderNo: key,
                    orderLineId: item.orderLineId,
                    jvCompanyCode: item.jvCompanyCode,
                    jvCompanyName: item.jvCompanyName,
                  };
                });
              //?A换B的同时也标记了JV，不存在标记了JV到不处理
              const changePar = changeArr.filter((item: any) => {
                // return item.Jvalue == 'change'; 第一批需求的字段标识
                return item.mdm == true;
              });

              //?如果有改了公司code的就给后端发请求，否则不发
              //! 这个情况就是同时标记了jv但是不用A换B

              if (paramsArr.length > 0 && changePar.length == 0 && changeArrS.length == 0) {
                const res = await updateJv(paramsArr);
                if (res.errCode == 200) {
                  const result = await notReplace(key);
                  if (result.errCode == 200) {
                    message.success('操作成功');
                    // 记录log
                    const par = {
                      types: [jvStatus, markSupplierStatus]?.filter((io) => io),
                      orderNo: key,
                    };
                    if (par?.types.length > 0) {
                      await saveReplaceLog(par);
                    }
                    setConfirmload(false);
                    reloadData(); //?清一下分页缓存和替换数据缓存
                    setIsModalVisible(false);
                    fn(); //?刷新主数据的表格
                  } else {
                    setConfirmload(false);
                    message.error('失败' + result.errMsg);
                  }
                  //?将所有AhuanB状态的数据筛选出来
                  // setIsModalVisible(false);
                } else {
                  setConfirmload(false);
                  message.warning(res.errMsg);
                }
              } else if (paramsArr.length > 0 && changePar.length == 0 && changeArrS.length > 0) {
                const res = await updateJv(paramsArr);
                if (res.errCode == 200) {
                  message.success('操作成功');
                  // 记录log
                  const par = {
                    types: [jvStatus, markSupplierStatus, markAppointSupplierStatus]?.filter(
                      (io) => io,
                    ),
                    orderNo: key,
                  };
                  if (par?.types.length > 0) {
                    await saveReplaceLog(par);
                  }
                  setConfirmload(false);
                  reloadData(); //?清一下分页缓存和替换数据缓存
                  setIsModalVisible(false);
                  fn(); //?刷新主数据的表格
                } else {
                  setConfirmload(false);
                  message.warning(res.errMsg);
                }
              } else if (paramsArr.length > 0 && changePar.length > 0) {
                //? 先把从不处理到标记jv的存到后端数据库
                const res = await updateJv(paramsArr);
                if (res.errCode == 200) {
                  message.success('操作成功');
                  //?顺便把a换b就带到下一个页面
                  ModalRef?.current?.openModal(Row, changePar);
                  setConfirmload(false);
                  reloadData(); //?清一下分页缓存和替换数据缓存
                  setIsModalVisible(false);
                } else {
                  setConfirmload(false);
                  message.error('操作失败' + res.errMsg);
                }
                // } else if (changePar.length > 0 && changePar.length == 0) {
                ModalRef?.current?.openModal(Row, changePar);
                reloadData(); //?清一下分页缓存和替换数据缓存
                setIsModalVisible(false);
                setConfirmload(false);
                // } else {
                //   message.success('保存成功');
                //   setIsModalVisible(false);
                // }
                //! 这个情况就是只有A换B
              } else if (paramsArr.length == 0 && changePar.length > 0) {
                setConfirmload(false);
                ModalRef?.current?.openModal(Row, changePar);
                setChageArr([]); //?将分页记忆的数组清空一下
                setIsModalVisible(false);
              }
            } else {
              //?当没有改动的内容的时候直接调用不替换的接口
              await saveReplaceLog({ types: [4], orderNo: key });
              const result = await notReplace(key);
              if (result.errCode == 200) {
                message.success('操作成功');
                setConfirmload(false);
                setIsModalVisible(false);
                fn(); //?刷新主数据的表格
              } else {
                setConfirmload(false);
                message.error('失败' + result.errMsg);
              }
            }
            setConfirmload(false);
          } else {
            message.warning('一笔订单不支持多个JV。');
            setConfirmload(false);
          }
        },
        onCancel: () => {
          tanFlag = false;
          setConfirmload(false);
          return false;
        },
      });
    } else {
      tanFlag = true;
    }

    if (!tanFlag) {
      setConfirmload(false);
      return false;
    }
    // console.log(changeArr,'changeArr');
    let isRepeat = true; //?一开始默认都是重复的
    for (let i = 0; i < changeArr.length; i++) {
      const element = changeArr[i];
      if (element.Jvalue == 'mark' && element.jvCompanyCode == '') {
        setConfirmload(false);
        return message.warning('标记JV的选项需要选择JV公司');
      }
      for (let j = 0; j < replaceArr.length; j++) {
        const ele = replaceArr[j];
        if (!ele.jvCompanyCode || !element.jvCompanyCode) {
          //?刚开始进入页面的时候默认为空，过滤掉,改过的如果为空也过掉
          // console.log(ele,'ele1',element);
          continue;
        } else if (ele.jvCompanyCode !== element.jvCompanyCode) {
          // console.log(ele,'ele2',element);
          //?如果遇到不一样的就将isRepeat置为false，意思是没有重复的
          isRepeat = false;
          break;
        }
      }
    }
    //?判断是不是全部重复的jvCompanyCode，是的话就发请求
    if (isRepeat) {
      if (changeArr.length > 0) {
        //add 需求标记切换供应商接口带哦用
        if (isMarkSupplier) {
          const par = changeArr.map((io: any) => ({
            orderNo: key,
            orderLineId: io.orderLineId,
            markChangeSupplier: io.markChangeSupplier ? 1 : 0,
          }));
          const { errCode, errMsg } = await markLocalSupplier(par);
          if (errCode != 200) {
            message.error(errMsg);
            setConfirmload(false);
            return false;
          }
        }
        // add 需要制定供應商
        const changeArrS = changeArr.filter((io: any) => io.markAppointSupplier);
        // const changeArrM = changeArr.filter((io: any) => io.mdm);
        const checkLineSupplierCode = changeArrS?.filter(
          (io: any) => !io.localSupplierCode || !io.localPurchPrice,
        );
        if (checkLineSupplierCode.length > 0) {
          message.error('项目单匹配必须填写供应商号，进价，交期。 请检查');
          setConfirmload(false);
          return false;
        }

        if (changeArrS.length > 0) {
          const par = {
            orderNo: key,
            appointSupplierLines: changeArr.map((io: any) => ({
              orderLineId: io.orderLineId,
              markAppointSupplier: io.markAppointSupplier ? 1 : 0,
              localSupplierCode: io.localSupplierCode,
              // purchRate: io.purchRate ? Number(io.purchRate) : null,
              localPurchPrice: io.localPurchPrice ? Number(io.localPurchPrice) : null,
              // localLeadTime: io.localLeadTime,
              localRemark: io.localRemark,
              reportingQty: io.reportingQty,
              availableQty: io.availableQty,
              consumedQty: io.consumedQty,
            })),
          };
          const { errCode, errMsg } = await appointSupplier(par);
          if (errCode != 200) {
            message.error(errMsg);
            setConfirmload(false);
            return false;
          }
        }
        //?说明有改动的内容，如果没有改动的内容就不替换
        const paramsArr = changeArr
          // .filter((item: any) => {
          //   //?当时A换B的时候，jvCompanyCode==''这个要过滤一下，然后再给后端
          //   //?把所有不是A换B的，标记JV或者不处理的筛选出来
          //   return item.Jvalue !== 'change';
          // })
          .map((item: any) => {
            return {
              orderNo: key,
              orderLineId: item.orderLineId,
              jvCompanyCode: item.jvCompanyCode,
              jvCompanyName: item.jvCompanyName,
            };
          });
        //?A换B的同时也标记了JV，不存在标记了JV到不处理
        const changePar = changeArr.filter((item: any) => {
          // return item.Jvalue == 'change'; 第一批需求的字段标识
          return item.mdm == true;
        });

        //?如果有改了公司code的就给后端发请求，否则不发
        //! 这个情况就是同时标记了jv但是不用A换B

        if (paramsArr.length > 0 && changePar.length == 0 && changeArrS.length == 0) {
          const res = await updateJv(paramsArr);
          if (res.errCode == 200) {
            const result = await notReplace(key);
            if (result.errCode == 200) {
              message.success('操作成功');
              // 记录log
              const par = {
                types: [jvStatus, markSupplierStatus]?.filter((io) => io),
                orderNo: key,
              };
              if (par?.types.length > 0) {
                await saveReplaceLog(par);
              }
              setConfirmload(false);
              reloadData(); //?清一下分页缓存和替换数据缓存
              setIsModalVisible(false);
              fn(); //?刷新主数据的表格
            } else {
              setConfirmload(false);
              message.error('失败' + result.errMsg);
            }
            //?将所有AhuanB状态的数据筛选出来
            // setIsModalVisible(false);
          } else {
            setConfirmload(false);
            message.warning(res.errMsg);
          }
        } else if (paramsArr.length > 0 && changePar.length == 0 && changeArrS.length > 0) {
          const res = await updateJv(paramsArr);
          if (res.errCode == 200) {
            message.success('操作成功');
            // 记录log
            const par = {
              types: [jvStatus, markSupplierStatus, markAppointSupplierStatus]?.filter((io) => io),
              orderNo: key,
            };
            if (par?.types.length > 0) {
              await saveReplaceLog(par);
            }
            setConfirmload(false);
            reloadData(); //?清一下分页缓存和替换数据缓存
            setIsModalVisible(false);
            fn(); //?刷新主数据的表格
          } else {
            setConfirmload(false);
            message.warning(res.errMsg);
          }
        } else if (paramsArr.length > 0 && changePar.length > 0) {
          //? 先把从不处理到标记jv的存到后端数据库
          const res = await updateJv(paramsArr);
          if (res.errCode == 200) {
            message.success('操作成功');
            //?顺便把a换b就带到下一个页面
            ModalRef?.current?.openModal(Row, changePar);
            setConfirmload(false);
            reloadData(); //?清一下分页缓存和替换数据缓存
            setIsModalVisible(false);
          } else {
            setConfirmload(false);
            message.error('操作失败' + res.errMsg);
          }
          // } else if (changePar.length > 0 && changePar.length == 0) {
          ModalRef?.current?.openModal(Row, changePar);
          reloadData(); //?清一下分页缓存和替换数据缓存
          setIsModalVisible(false);
          setConfirmload(false);
          // } else {
          //   message.success('保存成功');
          //   setIsModalVisible(false);
          // }
          //! 这个情况就是只有A换B
        } else if (paramsArr.length == 0 && changePar.length > 0) {
          setConfirmload(false);
          ModalRef?.current?.openModal(Row, changePar);
          setChageArr([]); //?将分页记忆的数组清空一下
          setIsModalVisible(false);
        }
      } else {
        //?当没有改动的内容的时候直接调用不替换的接口
        await saveReplaceLog({ types: [4], orderNo: key });
        const result = await notReplace(key);
        if (result.errCode == 200) {
          message.success('操作成功');
          setConfirmload(false);
          setIsModalVisible(false);
          fn(); //?刷新主数据的表格
        } else {
          setConfirmload(false);
          message.error('失败' + result.errMsg);
        }
      }
      setConfirmload(false);
    } else {
      message.warning('一笔订单不支持多个JV。');
      setConfirmload(false);
    }
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));

  const resetBtnStatus = async () => {
    setJvStatus(null);
    setMdmStatus(null);
    setMarkSupplierStatus(null);
    setMarkAppointSupplierStatus(null);
  };

  useEffect(() => {
    setReportKeys([]);
    setReportRows([]);
  }, [selectReportModal]);

  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'订单详情查看'}
        destroyOnClose={false}
        placement="right"
        title={[<span key={'销售处理'}>销售处理页</span>]}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="OrderDrawer"
        footer={[
          <Button key="apply" className="saveSub" loading={confirmload} onClick={savefn}>
            确认
          </Button>,
          <Button key="close" className="close" onClick={closeDrawer}>
            关闭
          </Button>,
        ]}
      >
        <ProTable<any>
          columns={infoColumn}
          bordered
          size="small"
          dataSource={replaceArr}
          rowKey="orderLineId"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (rowKeys: any, selectedRows: any) => {
              setSelectedRow(selectedRows);
              setSelectedRowKeys(rowKeys);
            },
          }}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (selectedRowKeys.includes(record.orderLineId)) {
                  const newKeys = selectedRowKeys.filter(
                    (item: any) => item !== record.orderLineId,
                  );
                  setSelectedRowKeys(newKeys);
                  const newRows = selectedRow.filter(
                    (item: any) => item.orderLineId !== record.orderLineId,
                  );
                  setSelectedRow(newRows);
                } else {
                  setSelectedRowKeys(selectedRowKeys.concat([record.orderLineId]));
                  setSelectedRow(selectedRow.concat([record]));
                }
              },
            };
          }}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          scroll={{ x: 0, y: 700 }}
          options={{ reload: false, density: false }}
          // toolBarRender={true}
          actionRef={tableRef}
          pagination={{
            pageSize: currentPageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            total: total,
            current: currentPage,
            showQuickJumper: true,
            showTotal: (_, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current_, pageSize_) => onShowSizeChange(current_, pageSize_),
          }}
          headerTitle={
            <>
              {!!btnStatusData?.markJv && (
                <Button
                  key={'标记JV'}
                  style={{ margin: ' 0 20px 20px 0' }}
                  type="primary"
                  onClick={() => {
                    if (selectedRowKeys.length == 0) {
                      message.error('请选择行数据');
                      return;
                    }
                    setModalJv(true);
                  }}
                >
                  标记JV
                </Button>
              )}
              {!!btnStatusData?.markMdm && (
                <Button
                  key={'MDM赋码'}
                  style={{ margin: ' 0 20px 20px 0' }}
                  type="primary"
                  onClick={markMDM}
                >
                  MDM赋码
                </Button>
              )}
              {!!btnStatusData?.markChangeSupplier && (
                <Button
                  key={'标记切换供应商'}
                  style={{ margin: ' 0 20px 20px 0' }}
                  type="primary"
                  onClick={markChangeSupplierClick}
                >
                  标记切换供应商
                </Button>
              )}
              {
                <Access
                  key={'标记项目单匹配'}
                  accessible={
                    initialState?.currentUser?.authorizations.includes(
                      'salesorder00011:omssallOrederMarkAppointSupplier',
                    ) && !!btnStatusData?.markAppointSupplier
                  }
                >
                  <Button
                    key={'标记项目单匹配'}
                    style={{ margin: ' 0 20px 20px 0' }}
                    type="primary"
                    onClick={() => {
                      if (selectedRowKeys.length == 0) {
                        message.error('请选择行数据');
                        return;
                      }
                      // 复制优化
                      // if(selectedRowKeys.length === 1){
                      //   const {localLeadTime, localPurchPrice, localRemark, localSupplierCode,markAppointSupplier} = selectedRow
                      //   changeTheSpecifiedVendorForm?.setFieldsValue({
                      //     localLeadTime, localPurchPrice, localRemark, localSupplierCode,markAppointSupplier
                      //   })
                      // }
                      const all = selectedRow.filter(
                        (io: any) =>
                          io.localSupplierCode &&
                          io.localPurchPrice &&
                          // io.localLeadTime &&
                          io.localRemark,
                      );
                      if (all.length == selectedRow.length) {
                        setNoCheck(true);
                        setDefaultLeadTime(null);
                      } else {
                        setNoCheck(false);
                        setDefaultLeadTime(60);
                      }
                      setVendorOpen(true);
                    }}
                  >
                    标记项目单匹配
                  </Button>
                </Access>
              }
              <Button
                key={'清除全部标记'}
                type="primary"
                style={{ margin: ' 0 20px 20px 0' }}
                danger
                onClick={clearAllMark}
              >
                清除全部标记
              </Button>
            </>
          }
        />
        <div style={{ color: '#dddddd' }}>
          <div>操作说明：</div>
          <div>1、可选择所需行。标记是否是JV、是否需要MDM赋码、是否需要标记xxx，三者互不影响</div>
          <div>
            2、有需要MDM赋码的行明细时，提交后在第二步填写替换信息，确认后会自动发起审批流程（若未选择MDM赋码，不会出现第二步替换界面）
          </div>
        </div>
      </Drawer>
      {/* jvmodal */}
      <ModalForm
        title="标记JV"
        width={400}
        form={jvForm}
        visible={modalJv}
        onVisibleChange={setModalJv}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async (value: any) => {
          if (value.jv) {
            if (!value?.jvcc?.value) {
              message.warning('标记jv就需要选择JV公司哦');
              return false;
            }
          }
          await jvOperition(value);
          return true;
        }}
      >
        <ProFormRadio.Group
          name="jv"
          initialValue={true}
          label="是否需要标记JV"
          options={booList}
          fieldProps={{
            onChange: (e) => {
              if (e?.target?.value == false) {
                jvForm?.setFieldsValue({
                  jvcc: null,
                });
              }
            },
          }}
        />
        <ProFormSelect
          dependencies={['jv']}
          allowClear={false}
          label={'选择JV公司'}
          name="jvcc"
          fieldProps={{
            labelInValue: true,
          }}
          request={async (depObj: any) => {
            return depObj?.jv == false ? [] : companyList;
          }}
        />
      </ModalForm>
      {/* modalVendor */}
      <ModalForm
        title="标记项目单匹配"
        width={400}
        form={changeTheSpecifiedVendorForm}
        visible={vendorOpen}
        onVisibleChange={setVendorOpen}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async (value: any) => {
          const formValue = [
            value.localSupplierCode,
            value.purchRate,
            // value.localLeadTime,
            value.localRemark,
          ].filter((io) => io != undefined && io !== '');
          if (value.markAppointSupplier && formValue.length > 0 && formValue.length < 3) {
            message.error('请填写完整数据');
            return false;
          }
          let flagSubmit = false;
          const newSelectRows = selectedRow?.map((io: any) => ({
            ...io,
            markAppointSupplier: value.markAppointSupplier,
            localSupplierCode:
              value?.markAppointSupplier && formValue.length == 3
                ? value.localSupplierCode
                : value?.markAppointSupplier && formValue.length == 0
                ? io.localSupplierCode
                : null,
            localSupplierName:
              value?.markAppointSupplier && formValue.length == 3
                ? objSp?.supplierNameZh
                : value?.markAppointSupplier && formValue.length == 0
                ? io.localSupplierName
                : null,
            // localPurchPrice:
            //   value?.markAppointSupplier && formValue.length == 4
            //     ? value.localPurchPrice
            //     : value?.markAppointSupplier && formValue.length == 0
            //     ? io.localPurchPrice
            //     : null,
            purchRate:
              value?.markAppointSupplier && formValue.length == 3
                ? value.purchRate
                : value?.markAppointSupplier && formValue.length == 0
                ? io.purchRate
                : null,
            // localLeadTime:
            //   value?.markAppointSupplier && formValue.length == 4
            //     ? value.localLeadTime
            //     : value?.markAppointSupplier && formValue.length == 0
            //     ? io.localLeadTime
            //     : null,
            localRemark:
              value?.markAppointSupplier && formValue.length == 3
                ? value.localRemark
                : value?.markAppointSupplier && formValue.length == 0
                ? io.localRemark
                : null,
          }));
          replaceArr?.map((io: any) => {
            for (let i = 0; i < newSelectRows.length; i++) {
              if (io.sid == newSelectRows[i].sid) {
                if (newSelectRows[i].markAppointSupplier && newSelectRows[i].mdm) {
                  flagSubmit = true;
                  return false;
                }
                io.markAppointSupplier = newSelectRows[i].markAppointSupplier;
                io.localSupplierCode = newSelectRows[i].localSupplierCode;
                io.purchRate = newSelectRows[i].purchRate / 100;
                // io.localPurchPrice = value?.markAppointSupplier
                //   ? (
                //       Number(newSelectRows[i].salesPrice) *
                //       (1 - Number(newSelectRows[i].purchRate / 100))
                //     ).toFixed(2)
                //   : null;
                io.localPurchPrice =
                  value?.markAppointSupplier && formValue.length == 3
                    ? (
                        Number(newSelectRows[i].salesPrice) *
                        (1 - Number(newSelectRows[i].purchRate / 100))
                      ).toFixed(2)
                    : value?.markAppointSupplier && formValue.length == 0
                    ? io.localPurchPrice
                    : null;
                // io.localLeadTime = newSelectRows[i].localLeadTime;
                io.localRemark = newSelectRows[i].localRemark;
                io.localSupplierName = newSelectRows[i].localSupplierName;
                io.changeStatus = true;
                return io;
              }
            }
          });
          if (flagSubmit) {
            message.error('行sku信息的mdm赋码和项目单匹配不能都选为是');
            return false;
          }
          const filRepData = replaceArr?.filter((io: any) => io.changeStatus);
          setChageArr(filRepData);
          setMarkAppointSupplierStatus(5);
          changeTheSpecifiedVendorForm?.resetFields();
          return true;
        }}
      >
        <ProFormRadio.Group
          name="markAppointSupplier"
          label="是否需要标记项目单匹配:"
          initialValue={true}
          options={booList}
          fieldProps={{
            onChange: (val) => {
              if (!val?.target?.value) {
                changeTheSpecifiedVendorForm.setFieldsValue({
                  localSupplierCode: '',
                  purchRate: '',
                  // localLeadTime: '',
                  localRemark: '',
                });
                setObjSp({});
              }
            },
          }}
        />
        <ProFormDependency name={['markAppointSupplier']}>
          {({ markAppointSupplier }) => {
            // 调整修改为接口选择供应商，
            return (
              // <ProFormText
              //   label={`请输入供应商号：`}
              //   name="localSupplierCode"
              //   rules={[{ required: markAppointSupplier && !noCheck ? true : false }]}
              //   disabled={markAppointSupplier ? false : true}
              // />
              // 改为下拉选择
              <ProFormSelect
                label={`请选择供应商：`}
                placeholder={'请输入供应商号'}
                showSearch
                name="localSupplierCode"
                rules={[{ required: markAppointSupplier && !noCheck ? true : false }]}
                disabled={markAppointSupplier ? false : true}
                fieldProps={{
                  onSelect: async (val: any, obj: any) => {
                    setObjSp(obj);
                  },
                }}
                request={async (e: any) => {
                  let list = [] as any;
                  const { data, errCode } = await getSupplierSearchByCode({
                    supplierCode: e.keyWords,
                  });
                  if (errCode === 200) {
                    list = data?.dataList?.map((io: any) => ({
                      ...io,
                      label: `${io.supplierCode}: ${io.supplierNameZh}`,
                      value: io.supplierCode,
                    }));
                  }
                  return list;
                }}
              />
            );
          }}
        </ProFormDependency>
        <ProFormDependency name={['markAppointSupplier']}>
          {({ markAppointSupplier }) => {
            return (
              <ProFormDigit
                label={`请输入进价率：`}
                // placeholder={'进价率值在0.01 ~ 1'}
                name="purchRate"
                rules={[{ required: markAppointSupplier && !noCheck ? true : false }]}
                disabled={markAppointSupplier ? false : true}
                min={-99.99}
                // max={100}
                fieldProps={{
                  addonAfter: '%',
                  precision: 2,
                }}
              />
            );
          }}
        </ProFormDependency>
        {/* <ProFormDependency name={['markAppointSupplier']}>
          {({ markAppointSupplier }) => {
            return (
              <ProFormDigit
                label={`请输入指定交期(天)：`}
                name="localLeadTime"
                rules={[{ required: markAppointSupplier && !noCheck ? true : false }]}
                disabled={markAppointSupplier ? false : true}
                min={0}
                initialValue={defaultLeadTime}
              />
            );
          }}
        </ProFormDependency> */}
        <ProFormDependency name={['markAppointSupplier']}>
          {({ markAppointSupplier }) => {
            return (
              <ProFormText
                label={`备注：`}
                placeholder={'请输入备注'}
                name="localRemark"
                rules={[{ required: markAppointSupplier && !noCheck ? true : false }]}
                disabled={markAppointSupplier ? false : true}
              />
            );
          }}
        </ProFormDependency>
      </ModalForm>
      <MyModal
        ref={ModalRef}
        acceptArr={acceptArr}
        fn={fn}
        resetBtnStatus={resetBtnStatus}
        btnClickStatus={[jvStatus, mdmStatus, markSupplierStatus, markAppointSupplierStatus]}
      />
      {/* 报备modal */}
      <ModalForm
        title="选择报备记录"
        visible={selectReportModal}
        onVisibleChange={setSetselectReportModal}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          if (reportRows.length > 0) {
            // reportRows 选择的行报备记录详情
            setReplaceArr(
              replaceArr?.map((io: any) => {
                if (io.sku === reportRows[0].skuCode) {
                  io.localSupplierName = reportRows[0].reportSupplierName;
                  io.localSupplierCode = reportRows[0].reportSupplierCode;
                  io.localPurchPrice = (io.salesPrice * (1 - reportRows[0].point / 100)).toFixed(2); //reportRows[0].localPurchPrice; // 进价=原含税成交价*（1-进价率）
                  // io.localLeadTime = reportRows[0].reportItemLeadTime;
                  io.purchRate = reportRows[0].point;
                  io.localRemark = reportRows[0].reportCode;
                  io.reportingQty = reportRows[0].reportingQty;
                  io.availableQty = reportRows[0].availableQty;
                  io.consumedQty = reportRows[0].consumedQty;
                }
                return io;
              }),
            );
            return true;
          } else {
            message.error('请先选择报备记录信息');
            return false;
          }
        }}
      >
        <ProTable<any>
          columns={reportColumns}
          bordered
          scroll={{ x: 800 }}
          size="small"
          request={async () => {
            const par = {
              skuCode: rpObj?.sku,
              orderNo: key,
            };
            const { data, errCode, errMsg } = await getReportLogDetail(par);
            if (errCode === 200) {
              return Promise.resolve({
                data: data?.dataList,
                total: data?.total,
                success: true,
              });
            } else {
              return message.error(errMsg);
            }
          }}
          rowKey="id"
          rowSelection={{
            type: 'radio',
            selectedRowKeys: reportKeys,
            onChange: (rowKeys: any, selectedRows: any) => {
              setReportRows(selectedRows);
              setReportKeys(rowKeys);
            },
          }}
          onRow={(record: any) => {
            return {
              onClick: () => {
                setReportRows([record]);
                setReportKeys([record.id]);
              },
            };
          }}
          search={false}
          tableAlertRender={false}
          options={{ reload: false, density: false }}
        />
      </ModalForm>
    </div>
  );
};
export default forwardRef(MyDrawer);
