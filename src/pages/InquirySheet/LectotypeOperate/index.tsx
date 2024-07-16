import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  Select,
  Modal,
  Drawer,
  Spin,
  Cascader,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { useModel, history } from 'umi';
import BtnCom from '../components/BtnCom';
import {
  getInfoList,
  exportToAssortment,
  exportInqLnExcel,
  queryAllDeptListByType,
  getFieldConfiguration,
  saveFieldConfiguration
} from '@/services/InquirySheet';
import './index.less';
import SkuDetail from '@/pages/InquirySheet/Info/SkuDetail';
import LogInfo from '@/pages/components/LogInfo';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import VirtualTable from '@/components/VirtualTable';
import SortColumns from '@/components/SortColumns';
import { getChildrenCategory } from '@/services';
import { ProFormSelect } from '@ant-design/pro-form';
const { SHOW_CHILD } = Cascader;

// import { KeepAlive } from 'react-activation';11
const Index: React.FC = () => {
  const [cascList, setCascList] = useState();
  const [lineStatus, setLineStatus] = useState([]);
  const [pageParams, setPageParams] = useState({});
  const [inqLnTypeList, setInqLnTypeList] = useState([]);
  const { initialState } = useModel('@@initialState');
  const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const { RangePicker }: any = DatePicker;
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(900);
  const [companyList, setCompanyList] = useState([]);
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [tableColumns, setTableColumns]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [columnsStateAll, setColumnsStateAll] = useState<Record<string, any>>();
  const [getId, setId]: any = useState('');
  const [lastPath, setLastPath]: any = useState('');
  const [pathname, setPathname]: any = useState('');
  const [aeLine, setAeLine]: any = useState(0);
  const [visible, setVisible]: any = useState(false);
  const [load, setLoad] = useState(false);
  const [logVisible, setLogVisible]: any = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [reqList, setReqList] = useState([]);
  const [cosPurList, setCosPurList] = useState([]);
  const skuDetail = useRef<ActionType>();
  const [fold, setFold] = useState(false);
  const [list, setList] = useState<any>([]);
  const [sourcingReqTypeStrHide, setSourcingReqTypeStrHide]: any = useState(true);
  const aePage = history.location.pathname === '/inquiry/ae'
  function UpDown() {
    setFold(!fold);
  }
  const onShowSizeChange = (current: any, pageSize: any) => {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  };
  const onDetailInfo = (record: any) => {
    setId(record.skuVo?.inqLineId);
    setVisible(true);
  };
  const loglogInfo = (record: any) => {
    setLoad(true);
    setId(record.skuVo?.inqLineId || record.id);
    setLogVisible(true);
    setLoad(false);
  };
  const onInfo = (id: any, operate: any, record: any) => {
    const newPath: any = history.location.pathname.split('/').pop();
    history.push({
      state: { id, sorurceType: newPath, type: operate, ExportInquiryCode: record?.inquiryCode },
      pathname: '/inquiry/info',
    });
  };
  const colBtn = (record: any) => {
    const newPath: any = history.location.pathname.split('/').pop();
    const btnName: any = [];
    const returnCom: any = [];
    if (['sourcing-pcd', 'sourcing-pcm', 'tepcm', 'aepcm'].includes(newPath)) {
      btnName.push({ code: newPath, name: '审核' });
    }
    if (['otherchannel', 'quote', 'RFQquote'].includes(newPath)) {
      btnName.push({ code: newPath, name: '报价', ExportInquiryCode: record.inquiryCode });
    }
    if (newPath === 'createsku') {
      btnName.push({ code: newPath, name: '待建目录品' });
    }
    // if (lastPath === 'all') {
    //   if ([150, 155, 140].includes(record.lineStatus)) {
    //     if ([10, 20].includes(record.reqSkuType)) {
    //       // btnName.push({ code: 'quote', name: '报价' });
    //     } else if (record.reqSkuType === 80) {
    //       // btnName.push({ code: 'otherchannel', name: '报价' });
    //     }
    //   } else if (record.lineStatus === 160) {
    //     // btnName.push({ code: 'sourcing-pcm', name: '审核' });
    //   } else if (record.lineStatus === 170) {
    //     // btnName.push({ code: 'sourcing-pcd', name: '审核' });
    //   }
    // }
    if (['all', 'allmatch', 'allRFQ'].includes(newPath)) {
      returnCom.push(
        <Button
          type="link"
          key={'skuinfo-8'}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            onDetailInfo(record);
          }}
        >
          详情
        </Button>,
      );
    } else {
      btnName.forEach((item: any) => {
        returnCom.push(
          <Button
            type="link"
            key={item}
            onClick={() => {
              history.push({
                state: {
                  id: record.inquiryId,
                  sorurceType: item.code,
                  type: 'operate',
                  check: '审核',
                  back: '退回',
                  ExportInquiryCode: record.inquiryCode,
                },
                pathname: '/inquiry/info',
              });
            }}
          >
            {item.name}
          </Button>,
        );
      });
      returnCom.push(
        <Button
          type="link"
          key={'详情'}
          onClick={() => {
            if (['ae', 'te'].includes(newPath)) {
              history.push({
                state: {
                  id: record.inquiryId,
                  sorurceType: newPath,
                  type: 'operate',
                  ExportInquiryCode: record.inquiryCode,
                },
                pathname: '/inquiry/info',
              });
            } else {
              onInfo(record.inquiryId, '', record);
            }
          }}
        >
          详情
        </Button>,
      );
    }
    return returnCom;
  };
  const onSaveImg = () => {
    setConfirmLoading(true);
    skuDetail?.current?.onSave(() => {
      setVisible(false);
      setConfirmLoading(false);
    });
  };
  const columns: ProColumns<any>[] = aePage ? 
  [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 80,
      render: (text: any, record: any) => {
        return colBtn(record);
      },
    },
    {
      title: '需求单号',
      dataIndex: 'inquiryCode',
    },
    { title: '需求清单条目数',  dataIndex: 'inqLineTotalCount'},
    { title: '待AE选配条目数',  dataIndex: 'inqLineAeCount' },
    { title: '客户编号',  dataIndex: 'customerCode' },
    { title: '客户名称',  dataIndex: 'customerName' },
    { title: '所属部门', dataIndex: 'deptName' },
    { title: '客户目的',  dataIndex: 'custPurposeDesc' },
    { title: '需求类型',  dataIndex: 'reqTypeDesc' },
    { title: '创建人',  dataIndex: 'createName'},
    { title: '创建时间',  dataIndex: 'createTime' },
  ]
  : [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      // fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 150,
      render: (text: any, record: any) => {
        return colBtn(record);
      },
      fixed: 'left',
    },
    {
      title: '需求单号',
      width: 150,
      dataIndex: 'inquiryCode',
      // fixed: 'left',
      render: (text: any, record: any) =>
        ['all', 'quote', 'allmatch', 'allRFQ', 'RFQquote'].includes(history.location.pathname.split('/').pop()) ? (
          <Button
            type="link"
            key={'需求单号'}
            className={'orderBtn'}
            onClick={() => {
              onInfo(record.inquiryId, 'viewDetail', {});
            }}
          >
            {text}
          </Button>
        ) : (
          <span>{text}</span>
        ),
    },

    { title: '需求清单条目数', width: 120, dataIndex: 'lnCount' },
    { title: '需求SKU号', dataIndex: 'reqSku', width: 150 },
    { title: 'SKU', width: 150, dataIndex: 'sku' },
    { title: '行项目ID', width: 120, dataIndex: 'inqLineId' },
    { title: '行项目类型', width: 120, dataIndex: 'lineTypeStr' },
    { title: '行项目状态', width: 120, dataIndex: 'lineStatusStr' },
    { title: '询价类型', width: 120, dataIndex: 'inqTypeStr' },
    { title: '实时询价处理人', width: 200, dataIndex: 'pmsRfqQuoteUser' },
    { title: '需求类型', width: 120, dataIndex: 'reqTypeStr' },
    { title: '客户名称', width: 180, dataIndex: 'customerName' },
    { title: 'AE处理人', width: 150, dataIndex: 'aeUser' },
    { title: 'TE处理人', width: 150, dataIndex: 'teUser' },
    { title: 'Sourcing处理人', width: 150, dataIndex: 'sourcingUser' },
    { title: '产品PMS', width: 150, dataIndex: 'categoryPmsUser' },
    { title: '客户物料号', width: 120, dataIndex: 'reqCustomerSku' },
    { title: '客户行号', width: 150, dataIndex: 'reqPoItemNo' },
    {
      title: '需求产品名称',
      width: 150,
      dataIndex: 'reqProductName',
      sorter: (a: any, b: any) => {
        return a?.reqProductName?.toString().localeCompare(b?.reqProductName?.toString());
      },
    },
    { title: '需求品牌名称', width: 120, dataIndex: 'reqBrandName' },
    { title: '需求制造商型号', width: 150, dataIndex: 'reqMfgSku' },
    { title: '需求采购单位', width: 120, dataIndex: 'reqUom' },
    { title: '需求技术参数/规格', width: 150, dataIndex: 'reqTechSpec' },
    { title: '需求数量', width: 120, dataIndex: 'reqQty' },
    { title: '是否可替换', width: 120, dataIndex: 'reqReplaceableStr' },
    { title: '需求产品线', width: 180, dataIndex: 'reqProductLineName' },
    { title: '需求segment', width: 120, dataIndex: 'reqSegmentName' },
    { title: '客户期望单价', width: 120, dataIndex: 'reqPrice' },
    { title: '是否长期采购', width: 120, dataIndex: 'reqIsLongRequestStr' },
    { title: '长期采购数量', width: 120, dataIndex: 'reqLongRequestNum' },
    { title: '销售最小起订量', dataIndex: 'salesMoq', width: 150, ellipsis: true },
    { title: '销售增幅', dataIndex: 'moqIncrement', width: 150, ellipsis: true },
    { title: '需求描述', dataIndex: 'reqRemark', width: 180, ellipsis: true },
    {
      title: '需求分类',
      dataIndex: 'sourcingReqTypeStr',
      width: 180,
      ellipsis: true,
      hideInTable: sourcingReqTypeStrHide,
    },
    {
      title: '匹配类型',
      width: 120,
      dataIndex: 'pairTypeStr',
      render: (_, record: any) => {
        return record?.pairTypeStr;
      },
    },
    {
      title: 'SKU产品名称',
      width: 120,
      dataIndex: 'productNameZh',
      sorter: (a: any, b: any) => {
        return a.productNameZh?.toString().localeCompare(b.productNameZh?.toString());
      },
    },
    {
      title: 'SKU类型',
      width: 120,
      dataIndex: 'skuTypeStr',
      render: (_, record: any) => {
        return record?.skuTypeStr;
      },
    },
    { title: 'SKU品牌ID', width: 120, dataIndex: 'brandCode' },
    { title: 'SKU品牌名称', width: 120, dataIndex: 'brandName' },
    { title: 'SKU制造厂商型号', width: 120, dataIndex: 'mfgSku' },
    { title: 'SKU销售单位', width: 120, dataIndex: 'purchUomCode' },
    { title: 'SKU规格', width: 120, dataIndex: 'TechSpec' },
    { title: 'SKU供应商名称', width: 120, dataIndex: 'supplierNameZh' },
    { title: 'SKU供应商产品型号', width: 150, dataIndex: 'supplierSku' },
    { title: 'Product', width: 180, dataIndex: 'productLineName' },
    { title: 'segment', width: 150, dataIndex: 'segmentName' },
    { title: 'Family', width: 150, dataIndex: 'familyName' },
    { title: 'Category', width: 120, dataIndex: 'categoryName' },
    { title: '销售单位', width: 120, dataIndex: 'salesUomCode' },
    { title: '物理单位', width: 120, dataIndex: 'phyUomCode' },
    { title: '销售单位包含物理单位个数', width: 120, dataIndex: 'salesPackQty' },
    { title: '含税销售成交价', width: 120, dataIndex: 'salesPrice' },
    { title: '含税面价', width: 120, dataIndex: 'listPrice' },
    { title: '未税销售成交价', width: 120, dataIndex: 'salesPriceNet' },
    { title: '采购计价货币', width: 120, dataIndex: 'purchCurrency' },
    { title: '小计含税成交金额', width: 120, dataIndex: 'totalAmount' },
    { title: '小计未税成交金额', width: 120, dataIndex: 'totalAmountNet' },
    { title: '小计折扣金额', width: 120, dataIndex: 'totalDiscount' },
    { title: '含税采购价', width: 120, dataIndex: 'purchPrice' },
    { title: 'GP(%)', width: 120, dataIndex: 'gpRate' },
    { title: '报价到期日', width: 120, dataIndex: 'quoteValidDate' },
    { title: '选型备注', width: 120, dataIndex: 'matchRemark' },
    { title: 'Sourcing备注', width: 120, dataIndex: 'skuRemark' },
    { title: '实时询价备注', width: 120, dataIndex: 'rfqQuoteRemark' },
    { title: '最后修改人', width: 120, dataIndex: 'updateName' },
    { title: '行项目创建时间', width: 150, dataIndex: 'createTime' },
    { title: 'AE提交审核时间', width: 150, dataIndex: 'aeApproveTime' },
    { title: 'AEPCM审核时间', width: 150, dataIndex: 'aepcmApproveTime' },
    { title: 'sourcing开始时间', width: 150, dataIndex: 'qoutStartTime' },
    { title: 'sourcingPCM审核时间', width: 150, dataIndex: 'qoutPCMSubmitTime' },
    { title: 'sourcing提交报价时间', width: 150, dataIndex: 'sourcingSubmitTime' },
    {
      title: '实时询价开始时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'rfqQuoteStartTime',
    },
    {
      title: '实时询价提交报价时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'rfqQuoteCompleteTime',
    },
  ];
  const curPath: any = history.location.pathname.split('/').pop();
  if (['all', 'quote', 'otherchannel', 'sourcing-pcm', 'allRFQ', 'RFQquote'].includes(curPath)) {
    // columns.push({ title: 'sourcing提交报价时间', width: 150, dataIndex: 'sourcingSubmitTime' });
  }
  // if (['sourcing-pcm'].includes(curPath)) {
  // 	setSourcingReqTypeStrHide(false);
  // } else {
  // 	setSourcingReqTypeStrHide(true);
  // }
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (rowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(rowKeys);
    },
  };
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 340);
    if (history.action === 'REPLACE') {
      ref.current?.reload();
      setSelectedRowKeys([]);
    }
  }, [history.action]);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 410);
  }, [initialState?.windowInnerHeight]);
  useEffect(() => {
    setPathname(history.location.pathname)
    setLastPath(history.location.pathname.split('/').pop());
    getFieldConfiguration({url: history.location.pathname}).then(res => {
      let arr  = []
      if (res.data) {
        let datas = JSON.parse(res.data)
        arr = tableList(datas)
        if (!aePage) {
          setTableColumns(arr)
        } else {
          setTableColumns(columns)
        }
        setColumnsStateAll(datas)
      } else {
        setColumnsStateAll({})
      }

    })
  }, [history.location.pathname]);
  const tableList = (datas) => {
    let arr  = []
    for(let key in datas) {
      if (datas[key].show && key !== '1') {
        let obj = columns.find(e => e.dataIndex === key && !e.hideInTable)
        if (obj && datas[key].fixed) {
          obj['fixed'] = datas[key].fixed
        }
        if (obj) {
          arr.push(obj)
        }
      } else if (datas[key].show) {
        
        let obj = columns.find(e => !e.dataIndex)
        if (obj && datas[key].fixed) {
          obj['fixed'] = datas[key].fixed
        }
        arr.push(obj)
      }  
    }
    return arr
  }
  useEffect(() => {
    
    getKeys([
      'inqLnTypeEnum',
      'branchCompanyEnum',
      'reqTypeEnum',
      'custPurposeEnum',
      'inqLnStat',
    ]).then((res: any) => {
      if (res) {
        setCompanyList(res.branchCompanyEnum);
        setInqLnTypeList(res.inqLnTypeEnum);
        setReqList(res.reqTypeEnum);
        setCosPurList(res.custPurposeEnum);
        setLineStatus(res.inqLnStat);
      }
    });
    queryAllDeptListByType().then((res: any) => {
      if (res.errCode === 200 && res?.data) {
        const list: any = Object.keys(res.data).map((item: any) => {
          const newCode = res.data[item].map((ite: any) => ite.deptCode);
          return { deptName: item, deptCode: newCode.join(), children: res.data[item] };
        });
        setCascList(list);
      }
    });
    setLastPath(history.location.pathname.split('/').pop());
    if (history.location.pathname.split('/').pop() == 'sourcing-pcm') {
      setSourcingReqTypeStrHide(false);
    } else {
      setSourcingReqTypeStrHide(true);
    }
  }, []);
  const recall = () => {
    ref.current?.reload(true);
    setSelectedRowKeys([]);
  };
  const onExport = () => {
    const thisLastPath: any = history.location.pathname.split('/').pop();
    let titleMsg = '';
    let exportParams: any = {};
    if (selectedRowKeys.length) {
      titleMsg = '确定导出所选择的数据？';
      if (thisLastPath === 'ae') {
        let arr = []
        selectedRow.forEach(e => {
          console.log(e.inqLineIds)
          arr = [...arr, ...e.inqLineIds]
        })
        exportParams = { sidList: arr };
      } else {
        exportParams = { sidList: selectedRowKeys };
      }
      
    } else {
      titleMsg = '确定根据查询条件导出数据？';
      const searchParams = form.getFieldsValue(true);
      searchParams.createTimeStart =
        moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00';
      searchParams.createTimeEnd =
        moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59';
      exportParams = { ...pageParams, ...searchParams };
      exportParams.pageNumber = 1;
    }

    const CodeList = selectedRow.map((item: any) => item.inquiryCode);
    const newCodeList = CodeList.sort();
    let isRepeat: any;
    for (let i = 0; i < newCodeList.length; i++) {
      if (newCodeList.length == 1) {
        isRepeat = newCodeList[i];
      } else if (newCodeList[i] == newCodeList[i + 1]) {
        isRepeat = newCodeList[i];
      } else {
      }
    }
    Modal.confirm({
      title: titleMsg,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let res: any = null;
        // if (lastPath === 'createsku' || ) {
        if (thisLastPath === 'createsku') {
          res = await exportToAssortment(JSON.parse(JSON.stringify(exportParams)));
        } else {
          // res = await exportInqLnExcel(lastPath, JSON.parse(JSON.stringify(exportParams)));
          res = await exportInqLnExcel(thisLastPath, JSON.parse(JSON.stringify(exportParams)));
        }
        if (res) {
          const { data } = res;
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
              if (resContent.statusCode) {
                Modal.error(resContent.errMsg);
              }
            } catch {
              const el = document.createElement('a');
              el.style.display = 'none';
              el.href = URL.createObjectURL(data);
              // if (['aepcm', 'tepcm', 'ae', 'te'].includes(lastPath) && !(isRepeat == undefined)) {
              if (
                ['aepcm', 'tepcm', 'ae', 'te'].includes(thisLastPath) &&
                !(isRepeat == undefined)
              ) {
                el.download = `${isRepeat}_AETE选配.xlsx`;
                // } else if (['quote', 'sourcing-pcm'].includes(lastPath) && !(isRepeat == undefined)) {
              } else if (
                ['quote', 'sourcing-pcm'].includes(thisLastPath) &&
                !(isRepeat == undefined)
              ) {
                el.download = `${isRepeat}_Sourcing报价.xlsx`;
              } else if (
                ['RFQquote', 'allRFQ'].includes(thisLastPath) &&
                !(isRepeat == undefined)
              ) {
                el.download = `${isRepeat}_实时询价报价.xlsx`;
              } else if (
                // ['quote', 'sourcing-pcm', 'aepcm', 'tepcm', 'ae', 'te'].includes(lastPath) &&
                ['quote', 'sourcing-pcm', 'aepcm', 'tepcm', 'ae', 'te', 'RFQquote'].includes(
                  thisLastPath,
                ) &&
                !(isRepeat == undefined)
              ) {
                el.download = '明细列表导出.xlsx';
              } else {
                el.download = '明细列表导出.xlsx';
              }
              //  el.download = lastPath === 'createsku' ? '明细列表导出.xlsx' : '明细列表导出.xlsx';
              document.body.append(el);
              el.click();
              window.URL.revokeObjectURL(el.href);
              document.body.removeChild(el);
            }
          };
          reader.readAsText(data);
        }
      },
    });
  };
  useEffect(() => {
    getChildrenCategory(0).then((res: any) => {
      if (res.errCode === 200) {
        setList(res.data.dataList?.map((io: any)=>({
          label:`${io.categoryCode}:${io.categoryName}`,
          value: io.categoryCode
        })));
      }
    });
  }, []);

  return (
    <div className="omsAntStyle">
      <div className="form-content-search">
        <Form
          autoComplete="off"
          className="ant-advanced-form"
          layout="inline"
          form={form}
          initialValues={{
            createTime: [moment().subtract(1, 'month'), moment()],
          }}
        >
          
          <Form.Item name="inquiryCode" label="需求单号">
            <Input placeholder="请输入需求单号" />
          </Form.Item>
          <Form.Item name="customerCode" label="客户编号">
            <Input placeholder="请输入客户编号" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="inqLineIds" label="行项目ID">
            <Input placeholder="多个行项目ID用逗号分隔" />
          </Form.Item>
          <Form.Item name="searchSku" label="SKU">
            <Input placeholder="请输入SKU号" />
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="lineType" label="行项目类型">
                <Select showSearch style={{ width: 200 }} placeholder="行项目类型">
                  <Select.Option value="" key={'0'}>
                    全部
                  </Select.Option>
                  {inqLnTypeList &&
                    inqLnTypeList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="lineStatus" label="行项目状态">
                <Select showSearch style={{ width: 200 }} placeholder="行项目状态">
                  <Select.Option value={''} key={'全部'}>
                    全部
                  </Select.Option>
                  {lineStatus &&
                    lineStatus.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              {['ae', 'te', 'aepcm', 'tepcm'].includes(lastPath) ? (
                <Form.Item name="deptCode" label="所属部门">
                  <Cascader
                    options={cascList}
                    fieldNames={{ label: 'deptName', value: 'deptCode' }}
                    showCheckedStrategy={SHOW_CHILD}
                    multiple
                    maxTagCount={3}
                    placeholder="请选择所属部门"
                  />
                </Form.Item>
              ) : (
                <Form.Item name="supplierNameLike" label="供应商名称">
                  <Input placeholder="请输入供应商名称" />
                </Form.Item>
              )}
              <Form.Item name="mfgSku" label="制造商型号">
                <Input placeholder="请输入制造商型号" />
              </Form.Item>
              <Form.Item name="brandName" label="报价品牌">
                <Input placeholder="请输入品牌" />
              </Form.Item>
              <Form.Item name="createName" label="创建人">
                <Input placeholder="请输入创建人" />
              </Form.Item>
              <Form.Item name="branchCode" label="所属公司">
                <Select showSearch style={{ width: 200 }} placeholder="所属公司">
                  <Select.Option value="">全部</Select.Option>
                  {companyList &&
                    companyList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="reqType" label="需求类型">
                <Select showSearch style={{ width: 200 }} placeholder="需求类型">
                  <Select.Option value="">全部</Select.Option>
                  {reqList &&
                    reqList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="客户目的" name={'custPurpose'}>
                <Select placeholder="请选择客户目的" mode="multiple">
                  {cosPurList &&
                    cosPurList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              {['all', 'quote', 'otherchannel', 'sourcing-pcm'].includes(lastPath) ? 
                <Form.Item name="sourcingUser" label="Sourcing处理人">
                  <Input placeholder="请输入Sourcing处理人" />
                </Form.Item> :
                <Form.Item name="categoryPmsUser" label="产线PMS">
                  <Input placeholder="请输入产线PMS" />
                </Form.Item>
              }
              <Form.Item name="reqProductName" label="需求产品">
                <Input placeholder="请输入需求产品" />
              </Form.Item>
              <Form.Item name="reqBrandName" label="需求品牌">
                <Input placeholder="请输入品牌" />
              </Form.Item>
              {(['all', 'quote', 'otherchannel', 'sourcing-pcm'].includes(lastPath) && list.length) ? 
                <ProFormSelect
                  label="产品线"
                  name = "productLineCode"
                  options = {list}
                  placeholder="请选择"
                /> : <></> 
              }
              {
                ['allmatch'].includes(lastPath) && <>
                  <ProFormSelect
                    label="需求产品线"
                    name = "reqProductLineCodes"
                    placeholder="请选择"
                    fieldProps={{
                      mode: 'multiple',
                      maxTagCount: 1
                    }}
                    options = {list}
                  />
                  <Form.Item name="reqSegmentName" label="需求Segment">
                    <Input placeholder="请输入需求Segment" />
                  </Form.Item>
                </>
              }
              <Form.Item name="createTime" label="创建时间" className="self-time">
                <RangePicker format="YYYY-MM-DD" allowClear={false} />
              </Form.Item>
            </>
          )}
          <Form.Item label=" " colon={false}>
            <Space>
              <Button
                size="small"
                key={'查询'}
                type="primary"
                onClick={() => {
                  ref.current?.reload(true);
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                size="small"
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重 置
              </Button>
              <Button
                key={'展开'}
                icon={fold ? <DownOutlined /> : <UpOutlined />}
                onClick={() => {
                  UpDown();
                }}
              >
                {fold ? '展开' : '收起'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <VirtualTable
        columns={tableColumns}
        scroll={{ x: 350, y: yClient }}
        bordered
        size="small"
        request={async (params) => {
          const searchParams = form.getFieldsValue(true);
          console.log(searchParams.deptCode, 'searchParams.deptCode')
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          searchParams.pathOp = lastPath;
          let deptCode = []
          if (searchParams.deptCode && searchParams.deptCode.length) {
            searchParams.deptCode.forEach(e => {
              e.forEach((c, index) => {
                if (index > 0) {
                  deptCode.push(c)
                }
              })
            })
          }
          // if (lastPath == 'allRFQ') searchParams.pathOp = 'all';
          // if (lastPath == 'RFQquote') searchParams.pathOp = 'quote';
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          searchParams.createTimeStart = moment(searchParams.createTime[0]).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          searchParams.createTimeEnd =
            moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59';
          setPageParams(searchParams);
          const res = await getInfoList({ ...searchParams, deptCode: deptCode.length ? deptCode.join(',') : '' });
          if (res.errCode === 200) {
            setSelectedRow([]);
            setSelectedRowKeys([]);
            if (aePage && res.data && res.data.list.length) {
              setAeLine(res.data?.list[0].totalCount)
            }
            const temp = res.data?.list.map((item: any) => {
              const tempItem = { ...item.skuVo, ...item.reqVo, ...item };
              return tempItem;
            });
            console.log(temp, '');
            return Promise.resolve({ data: temp, total: res.data?.total, success: true });
          } else {
            Modal.error({ title: res.errMsg });
            return Promise.resolve([]);
          }
        }}
        rowSelection={rowSelection}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.sid)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.sid);
                setSelectedRowKeys(newKeys);
                const newRows = selectedRow.filter((item: any) => item.sid !== record.sid);
                setSelectedRow(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.sid]));
                setSelectedRow(selectedRow.concat([record]));
              }
            },
          };
        }}
        toolBarRender={
          () => tableColumns && <SortColumns columns={columns} columnsStateAll={columnsStateAll} onChange={(val) => {
            const len = Object.keys(val)
            if (len.length) {
              const arr = tableList(val)
              setTableColumns(arr)
              saveFieldConfiguration({
                url: pathname,
                fieldConfiguration: JSON.stringify(val)
              })
            }
          }}/>
        }
        options={{ reload: false, density: false, setting: false }}
        rowKey={!aeLine ? "sid" : "inquiryId"}
        search={false}
        tableAlertRender={false}
        actionRef={ref}
        defaultSize="small"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => {
            return `共有 ${total} 条数据, ${aePage ? aeLine + '条行数据,' : ''} 本页显示 ${range[0]}-${range[1]}条`
          },
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        headerTitle={
          <Space>
            <Button size="small" key={'导出'} onClick={onExport}>
              {' '}
              导出
            </Button>
            <BtnCom key={'按钮组件'} selectedRow={selectedRow} recall={recall} />
          </Space>
        }
      />
      <Drawer
        title={'行项目详情信息'}
        width={window.innerWidth}
        destroyOnClose
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        extra={
          ['allRFQ', 'RFQquote'].includes(lastPath) ? (
            <Button
              key="skuinfo-228"
              size="small"
              onClick={() => setVisible(false)}
              loading={confirmLoading}
            >
              关闭
            </Button>
          ) : (
            <Button
              type="primary"
              key="skuinfo-28"
              size="small"
              onClick={() => onSaveImg()}
              loading={confirmLoading}
            >
              保存
            </Button>
          )
        }
      >
        <Spin spinning={load}>
          <SkuDetail ref={skuDetail} id={getId} backMtd={loglogInfo} type={'withUploadImage'} />
        </Spin>
      </Drawer>
      <LogInfo
        id={getId}
        title={'行项目操作日志'}
        sourceType={'21'}
        visible={logVisible}
        closed={() => {
          setLogVisible(false);
        }}
      />
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
