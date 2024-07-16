/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
import LogInfo from '@/pages/components/LogInfo';
import {
  inqLnList,
  inqLnSourcingUpdate,
  inqMatch,
  itemEdit,
  updateAndComplete,
  updateSku,
  // updateSkuImg,
  editInqLine,
  submitSourcing,
  updateAndSubmitCheck,
  searchFaTransAstSku,
  RFQsubmitCheck,
} from '@/services/InquirySheet';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, message, Modal, Select, Space, Spin, Input, Form, Upload } from 'antd';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useLocation } from 'umi';
import type { UploadProps } from 'antd';
import BtnCom from '../components/BtnCom';
import ProductBtn from '../components/BtnCom/ProductBtn';
import ReturnBtn from '../components/BtnCom/ReturnBtn';
import CreateSku from './CreateSku';
// import EditSku from './EditSku';
import { getEnv } from '@/services/utils';
import { history } from 'umi';
import Cookies from 'js-cookie';
import SkuInfoSingle from '../Add/SkuInfoSingle';
import HandleLectotype from './HandleLectotype';
import '../Add/add.less';
import SkuDetail from './SkuDetail';
import { useModel } from 'umi';
import { colLimit } from '@/services';
import ReplaceModal from '../components/ReplaceModal';
import RebackModal from '../components/RebackModal';
const SkuInfo: React.FC<{
  onlyKey: any;
  getInfoTotal: any;
  recall: any;
  customerCode: string;
  status: string;
  custPurpose: string;
  id?: any;
}> = (props: any, ref: any) => {
  const [form] = Form.useForm();
  const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [singleRow, setSingleRow]: any = useState([]);
  const [visible, setVisible]: any = useState(false);
  const [editVisible, setEditVisible]: any = useState(false);
  const [handleVisible, setHandleVisible]: any = useState(false);
  const [logVisible, setLogVisible]: any = useState(false);
  const [sourcingVisible, setSourcingVisible]: any = useState(false);
  const [id, setId]: any = useState('');
  const [lastPath, setLastPath]: any = useState('');
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [drawerTitle, setDrawerTitle]: any = useState('');
  const [createTitle, setCreateTitle]: any = useState('行项目Sourcing报价');
  const refs = useRef<ActionType>();
  const skuDetail = useRef<ActionType>();
  const handleRef = useRef();
  const createRef = useRef();
  const skuRef = useRef();
  const [lineStatus, setLineStatus] = useState([]);
  const [load, setLoad] = useState(false);
  const [repalceList, setRepalceList] = useState<any>([]);
  const replaceModalRef = useRef({} as any);
  const rebackModalRef = useRef({} as any);
  const [lineEditData, setlineEditData] = useState<any>({});
  const [inSubmit, setInSubmit] = useState<any>(0);
  const [LastState, setLastState]: any = useState([]);
  const [sourcingReqTypeStrHide, setSourcingReqTypeStrHide]: any = useState(true);

  useEffect(() => {
    console.log(pathParams);
    sessionStorage.removeItem('remark');
    getKeys(['reqTypeEnum', 'custPurposeEnum', 'inqLnStat']).then((res: any) => {
      if (res) {
        setLineStatus(res.inqLnStat);
      }
    });
    const path: any = pathParams?.sorurceType || 'info';
    let rowStatus: any = [];
    if (path === 'ae') {
      rowStatus = [40, 60, 70, 80, 90, 100, 110];
      setDrawerTitle('行项目选配处理');
      setSourcingReqTypeStrHide(true);
    } else if (path === 'te') {
      rowStatus = [90, 100, 110];
      setDrawerTitle('行项目选配处理');
      setSourcingReqTypeStrHide(true);
    } else if (path === 'createsku') {
      rowStatus = [190];
      setDrawerTitle('行项目更新SKU');
      setSourcingReqTypeStrHide(true);
    } else if (path === 'sourcing-pcd') {
      rowStatus = [170];
      setSourcingReqTypeStrHide(true);
    } else if (path === 'sourcing-pcm') {
      rowStatus = [160];
      // 区分审核和详情页面
      // if(pathParams?.type === 'operate'){
      // 	setSourcingReqTypeStrHide(false);
      // }else{
      // 	setSourcingReqTypeStrHide(true);
      // }
      setSourcingReqTypeStrHide(false);
    } else if (path === 'quote') {
      rowStatus = [140, 150, 155];
      setSourcingReqTypeStrHide(true);
    } else if (path === 'otherchannel') {
      rowStatus = [140, 150, 155];
      setCreateTitle('行项目指定渠道报价');
      setSourcingReqTypeStrHide(true);
    } else if (path === 'aepcm') {
      rowStatus = [120];
      setSourcingReqTypeStrHide(true);
    } else if (path === 'tepcm') {
      rowStatus = [130];
      setSourcingReqTypeStrHide(true);
    } else if (path === 'info') {
      rowStatus = LastState;
      setSourcingReqTypeStrHide(true);
    } else if (path === 'allRFQ') {
      // rowStatus = [230, 240];
      rowStatus = [];
      setCreateTitle('行项目-实时询价任务报价');
      setSourcingReqTypeStrHide(true);
    } else if (path === 'RFQquote') {
      rowStatus = [230, 240];
      setCreateTitle('行项目-实时询价任务报价');
      setSourcingReqTypeStrHide(true);
    }
    if (form?.setFieldsValue) form?.setFieldsValue({ inqLnStatList: rowStatus });
    setLastPath(path);
    // if (props?.onlyKey && localStorage.getItem(props.onlyKey)?.length) {
    //   const newCol: any = localStorage.getItem(props.onlyKey);
    //   setColumnsStateMap(JSON.parse(newCol));
    // }
    refs.current?.reload();
  }, [pathParams, props.status]);
  const loglogInfo = (record: any) => {
    setLoad(true);
    setId(record.skuVo?.inqLineId || record.id);
    setLogVisible(true);
    setLoad(false);
  };
  const onInfo = (record: any) => {
    setId(record.skuVo?.inqLineId);
    setVisible(true);
  };
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (keys: React.Key[], row: any) => {
      setSelectedRowKeys(keys);
      setSelectedRow(row);
    },
  };
  const onLectotype = (record: any) => {
    setId(record.skuVo?.inqLineId);
    setHandleVisible(true);
    setSingleRow([record]);
  };
  const colBtn = (record: any) => {
    const returnCom: any = [];
    if (pathParams?.type) {
      if (['ae'].includes(lastPath) && [60, 70, 80].includes(record.lineStatus)) {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-1'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onLectotype(record);
            }}
          >
            选配型
          </Button>,
        );
      } else if (['te'].includes(lastPath) && [90, 110, 100].includes(record.lineStatus)) {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-2'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onLectotype(record);
            }}
          >
            选配型
          </Button>,
        );
      } else if (lastPath === 'createsku') {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-3'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onLectotype(record);
            }}
          >
            {' '}
            更新sku{' '}
          </Button>,
          <Button
            type="link"
            key={'skuinfo-4'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setId(record.skuVo?.inqLineId);
              setSourcingVisible(true);
              setSingleRow([record]);
            }}
          >
            {' '}
            临时物料{' '}
          </Button>,
        );
      } else if (['sourcing-all', 'quote', 'RFQquote'].includes(lastPath)) {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-5'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setSourcingVisible(true);
              setId(record.skuVo?.inqLineId);
              setSingleRow([record]);
            }}
          >
            {' '}
            报价{' '}
          </Button>,
        );
      } else if (lastPath === 'otherchannel') {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-6'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              // onLectotype(record);
              setSourcingVisible(true);
              setId(record.skuVo?.inqLineId);
              setSingleRow([record]);
            }}
          >
            {' '}
            报价{' '}
          </Button>,
        );
      } else if (['aepcm'].includes(lastPath)) {
        returnCom.push(
          <Button
            type="link"
            key={'skuinfo-01'}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onInfo(record);
              sessionStorage.setItem('remark', 'remark');
            }}
          >
            备注
          </Button>,
        );
      }
    }
    if (['info'].includes(lastPath) && [20].includes(record.lineStatus)) {
      returnCom.push(
        <Button
          type="link"
          key={'skuinfo-7'}
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setEditVisible(true);
            setId(record.skuVo?.inqLineId);
            setSingleRow([record]);
            if (record.sid) {
              editInqLine(record.sid).then((res: any) => {
                if (res.errCode === 200) {
                  res.data.index = record.index;
                  res.data.sid = record.sid;
                  skuRef?.current?.setForm(res.data);
                }
              });
            }
          }}
        >
          编辑
        </Button>,
      );
    }

    // returnCom.push(
    //   <Button
    //     type="link"
    //     key={'skuinfo-10'}
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       e.nativeEvent.stopImmediatePropagation();
    //       onInfo(record);
    //     }}
    //   >
    //     备注
    //   </Button>,
    // );
    returnCom.push(
      <Button
        type="link"
        key={'skuinfo-8'}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          onInfo(record);
          sessionStorage.removeItem('remark');
        }}
      >
        详情
      </Button>,
    );
    returnCom.push(
      <Button
        type="link"
        key={'skuinfo-9'}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          loglogInfo(record);
        }}
      >
        日志
      </Button>,
    );
    return returnCom;
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'sequenceNo',
      width: 40,
      fixed: 'left',
    },
    {
      title: '操作',
      dataIndex: 'index1',
      fixed: 'left',
      width: 150,
      render: (text: any, record: any) => {
        return colBtn(record);
      },
    },
    { title: '需求SKU', dataIndex: 'reqSku', width: 150, ellipsis: true, fixed: 'left' },
    { title: 'SKU号', dataIndex: 'sku', width: 150, ellipsis: true, fixed: 'left' },
    { title: '行项目编号', dataIndex: 'inqLineId', width: 150 },
    {
      title: '行项目状态',
      dataIndex: 'lineStatusStr',
      width: 150,
    },
    {
      title: '行项目类型',
      dataIndex: 'lineTypeStr',
      width: 150,
    },
    { title: '客户物料号', dataIndex: 'reqCustomerSku', width: 150, ellipsis: true },
    { title: '客户行号', dataIndex: 'reqPoItemNo', width: 150, ellipsis: true },
    { title: '实时询价处理人', width: 200, dataIndex: 'pmsRfqQuoteUser' },
    {
      title: '需求产品名称',
      dataIndex: 'reqProductName',
      width: 200,
      ellipsis: true,
      sorter: (a: any, b: any) => {
        return a.reqProductName?.toString().localeCompare(b.reqProductName?.toString());
      },
    },
    { title: '需求品牌名称', dataIndex: 'reqBrandName', width: 200, ellipsis: true },
    { title: '需求制造商型号', dataIndex: 'reqMfgSku', width: 220, ellipsis: true },
    { title: '客户期望单价', dataIndex: 'reqPrice', width: 200, ellipsis: true },
    { title: '需求采购单位', dataIndex: 'reqUom', width: 200, ellipsis: true },
    { title: '需求数量', dataIndex: 'reqQty', width: 150, ellipsis: true },
    {
      title: '是否可替换',
      dataIndex: 'reqReplaceable',
      width: 180,
      ellipsis: true,
      render: (text: any, record: any) => <span>{record.reqReplaceable ? '是' : '否'}</span>,
    },
    { title: '需求技术参数/规格', dataIndex: 'reqTechSpec', width: 250, ellipsis: true },
    { title: '需求产品线', dataIndex: 'reqProductLineName', width: 180, ellipsis: true },
    { title: '需求segment', dataIndex: 'reqSegmentName', width: 180, ellipsis: true },
    {
      title: '是否长期采购',
      dataIndex: 'reqIsLongRequestStr', //?编辑，新增，复制，和详情统一使用reqIsLongRequestStr，
      width: 180,
      ellipsis: true,
      // render: (text: any, record: any) => <span>{record.reqIsLongRequest ? '是' : '否'}</span>,
    },
    { title: '长期采购数量', dataIndex: 'reqLongRequestNum', width: 180, ellipsis: true },
    { title: '需求描述', dataIndex: 'reqRemark', width: 180, ellipsis: true },
    {
      title: '需求分类',
      dataIndex: 'sourcingReqTypeStr',
      width: 180,
      ellipsis: true,
      hideInTable: sourcingReqTypeStrHide,
    },
    { title: '匹配类型', dataIndex: 'pairTypeStr', width: 150, ellipsis: true },
    {
      title: 'SKU产品名称',
      dataIndex: 'productNameZh',
      width: 150,
      ellipsis: true,
      sorter: (a: any, b: any) => {
        return a.productNameZh?.toString().localeCompare(b.productNameZh?.toString());
      },
    },
    { title: 'SKU类型', dataIndex: 'skuTypeStr', width: 150, ellipsis: true },
    { title: 'SKU品牌ID', width: 120, dataIndex: 'brandCode' },
    { title: 'SKU品牌名称', dataIndex: 'brandName', width: 150, ellipsis: true },
    { title: 'SKU制造厂商型号', dataIndex: 'mfgSku', width: 150, ellipsis: true },
    { title: 'SKU销售单位', dataIndex: 'purchUomCode', width: 150, ellipsis: true },
    { title: 'SKU规格', dataIndex: 'techSpec', width: 150, ellipsis: true },
    // { title: 'SKU供应商名称', dataIndex: 'supplierNameZh', width: 150, ellipsis: true },
    { title: 'SKU供应商产品型号', dataIndex: 'supplierSku', width: 150, ellipsis: true },
    { title: 'Product', dataIndex: 'productLineName', width: 150, ellipsis: true },
    { title: 'Segment', dataIndex: 'segmentName', width: 150, ellipsis: true },
    { title: 'Family', dataIndex: 'familyName', width: 150, ellipsis: true },
    { title: 'Category', dataIndex: 'categoryName', width: 150, ellipsis: true },
    { title: 'AE处理人', width: 150, dataIndex: 'aeUser' },
    { title: 'TE处理人', width: 150, dataIndex: 'teUser' },
    { title: 'Sourcing处理人', width: 150, dataIndex: 'sourcingUser' },
    { title: '产品PMS', width: 150, dataIndex: 'categoryPmsUser' },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 150, ellipsis: true },
    { title: '物理单位', dataIndex: 'phyUomCode', width: 150, ellipsis: true },
    { title: '销售单位包含物理单位个数', dataIndex: 'salesPackQty', width: 150, ellipsis: true },
    { title: '销售最小起订量', dataIndex: 'salesMoq', width: 150, ellipsis: true },
    { title: '销售增幅', dataIndex: 'moqIncrement', width: 150, ellipsis: true },
    { title: '含税销售成交价', dataIndex: 'salesPrice', width: 150, ellipsis: true },
    { title: '含税面价', dataIndex: 'listPrice', width: 150, ellipsis: true },
    { title: '未税销售成交价', dataIndex: 'salesPriceNet', width: 150, ellipsis: true },
    { title: '小计含税成交金额', dataIndex: 'totalAmount', width: 150, ellipsis: true },
    { title: '小计未税成交金额', dataIndex: 'totalAmountNet', width: 150, ellipsis: true },
    { title: '小计折扣金额', dataIndex: 'totalDiscount', width: 150, ellipsis: true },
    { title: '采购计价货币', dataIndex: 'purchCurrency', width: 150, ellipsis: true },
    { title: '折扣类型', dataIndex: 'discountCode', width: 150, ellipsis: true },
    { title: '报价到期日', dataIndex: 'quoteValidDate', width: 150, ellipsis: true },
    { title: '选型备注', dataIndex: 'matchRemark', width: 150, ellipsis: true },
    { title: 'Sourcing备注', dataIndex: 'skuRemark', width: 150, ellipsis: true },
    { title: '实时询价备注', dataIndex: 'rfqQuoteRemark', width: 150, ellipsis: true },
    { title: '最后修改人', dataIndex: 'updateName', width: 150, ellipsis: true },
    { title: '行项目创建时间', dataIndex: 'createTime', width: 180, ellipsis: true },
    { title: '最后修改时间', dataIndex: 'updateTime', width: 150, ellipsis: true },
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
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const curPath: any = pathParams?.sorurceType || 'info';
  if (['all', 'quote', 'otherchannel', 'sourcing-pcm', 'allRFQ', 'RFQquote'].includes(curPath)) {
    // columns.push({ title: 'sourcing提交报价时间', width: 150, dataIndex: 'sourcingSubmitTime' });
  }
  const onSumbit = () => {
    const getParams: any = handleRef?.current?.getParams;
    if (getParams) {
      getParams().then((res: any) => {
        if (res) {
          Modal.confirm({
            title: '确定进行处理?',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              let resd = null;
              if (lastPath === 'otherchannel') {
                resd = await inqLnSourcingUpdate(lastPath, res);
              } else if (lastPath === 'createsku') {
                resd = await updateSku({
                  sid: res.skuVo?.inqLineId,
                  sku: res.skuVo?.sku,
                  pairType: res.skuVo?.pairType,
                });
              } else {
                resd = await inqMatch(lastPath, res);
              }
              if (resd.errCode === 200) {
                message.success('操作成功!');
                setHandleVisible(false);
                refs.current?.reload();
              } else {
                message.error(resd.errMsg);
              }
            },
          });
        }
      });
    }
  };
  const onSumbitAuidt = () => {
    const getParams: any = handleRef?.current?.getParams;
    if (getParams) {
      getParams().then((res: any) => {
        if (res) {
          Modal.confirm({
            title: '确定进行提交审核?',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              res.inquiryId = props.id;
              // 判断接口
              await searchFaTransAstSku('info', {
                inquiryId: res?.skuVo.inquiryId,
                inqLineIdList: [res.skuVo.inqLineId],
                newSkuList: [{ inqLnId: res.skuVo.inqLineId, sku: res?.skuVo?.sku }],
              }).then(async (res1: any) => {
                if (res1?.errCode == 200) {
                  if (res1?.data?.dataList?.length > 0) {
                    setInSubmit(1);
                    setRepalceList(res1?.data?.dataList);
                    setlineEditData(res);
                    replaceModalRef?.current?.open();
                    //接下来做是否替换操作
                  } else {
                    // 原来逻辑
                    const resd = await updateAndSubmitCheck(res, lastPath);
                    if (resd.errCode === 200) {
                      message.success('操作成功!');
                      setHandleVisible(false);
                      refs.current?.reload();
                    } else {
                      message.error(resd.errMsg);
                    }
                  }
                }
              });
            },
          });
        }
      });
    }
  };
  const recall = () => {
    refs.current?.reload(true);
    setSelectedRow([]);
    setSelectedRowKeys([]);
    setSourcingVisible(false);
    setHandleVisible(false);
  };
  const onCreateSku = () => {
    const getParams: any = createRef?.current?.getParams;
    getParams().then((res) => {
      console.log(res, 121212);
      if (res.skuVo.fixedProduct && !res.skuVo.fixedProductUrl) {
        message.error('是否定制品选择“是”时，定制品图纸必须上传');
      } else {
        createRef.current?.onSave(recall);
      }
    });
  };
  const onSumbitQuote = (refsd: any) => {
    const getParams: any = refsd?.current?.getParams;
    if (getParams) {
      getParams().then((res: any) => {
        if (res) {
          if (res.skuVo.fixedProduct && !res.skuVo.fixedProductUrl) {
            message.error('是否定制品选择“是”时，定制品图纸必须上传');
            return;
          }
          Modal.confirm({
            title: '确定提交报价?',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              if (['RFQquote', 'allRFQ'].includes(lastPath)) {
                const allVal: any = res?.skuVo;
                const { purchPrice, listPrice, salesPrice }: any = allVal;
                let code = [
                  allVal.productLineCode,
                  allVal.segmentCode,
                  allVal.familyCode,
                  allVal.categoryCode,
                ];
                code = code.filter((item: any) => item);
                if (purchPrice && listPrice && salesPrice && code) {
                  const submitData = {
                    inquiryId: res?.skuVo.inquiryId,
                    inqLineId: res?.skuVo.inqLineId,
                    rfqQuoteRemark: res?.rfqQuoteRemark,
                    ...res.skuVo,
                    detailCategoryCode: code.join(),
                    purchPrice,
                    listPrice,
                    salesPrice,
                    purchCurrency: allVal?.purchCurrency || 'CNY',
                    purchPriceCNY: allVal?.purchPriceCNY || 0,
                    quoteValidDates: res?.quoteValidDates,
                    quoteValidDate: res?.quoteValidDate,
                  };
                  await RFQsubmitCheck(submitData).then(async (respons: any) => {
                    if (respons.errCode === 200) {
                      message.success('操作成功!');
                      setHandleVisible(false);
                      setSourcingVisible(false);
                      refs.current?.reload();
                    } else {
                      message.error(respons.errMsg);
                    }
                  });
                } else {
                  message.error('出错啦！');
                }
              } else {
                await searchFaTransAstSku('info', {
                  button: 'baojia-tijiaobaojia',
                  inquiryId: res?.skuVo.inquiryId,
                  inqLineIdList: [res.skuVo.inqLineId],
                  newSkuList: [{ inqLnId: res.skuVo.inqLineId, sku: res?.skuVo?.sku }],
                }).then(async (res1: any) => {
                  if (res1?.errCode == 200) {
                    if (res1?.data?.dataList?.length > 0) {
                      setRepalceList(res1?.data?.dataList);
                      setlineEditData(res);
                      rebackModalRef?.current?.open();
                      //接下来做是否替换操作
                    } else {
                      //原来逻辑
                      let resd = null;
                      resd = await updateAndComplete(lastPath, res);
                      if (resd.errCode === 200) {
                        // if (res.imageParams) updateSkuImg(res.imageParams);
                        message.success('操作成功!');
                        setHandleVisible(false);
                        setSourcingVisible(false);
                        refs.current?.reload();
                      } else {
                        message.error(resd.errMsg);
                      }
                    }
                  } else {
                    message.error(res?.errMsg);
                  }
                });
              }
              // let resd = null;
              // resd = await updateAndComplete(lastPath, res);
              // if (resd.errCode === 200) {
              //   if (res.imageParams) updateSkuImg(res.imageParams);
              //   message.success('操作成功!');
              //   setHandleVisible(false);
              //   setSourcingVisible(false);
              //   refs.current?.reload();
              // } else {
              //   message.error(resd.errMsg);
              // }
            },
          });
        }
      });
    }
  };
  const [changeLoading, setChangeLoading] = useState<any>(false);
  const drawerBtn = () => {
    const returnCom: any = [];
    if (lastPath === 'otherchannel') {
      returnCom.push(
        <React.Fragment key="skuinfo-10">
          <ReturnBtn key="skuinfo-11" lastPath={lastPath} selectedRow={singleRow} recall={recall} />
          <ProductBtn key="skuinfo-12" selectedRow={singleRow} recall={recall} />
          <Button
            type="primary"
            key="skuinfo-13"
            size="small"
            onClick={() => onSumbitQuote(handleRef)}
          >
            提交报价
          </Button>
          <Button type="primary" key="skuinfo-14" size="small" onClick={onSumbit}>
            {' '}
            保存{' '}
          </Button>
        </React.Fragment>,
      );
    } else if (['ae', 'te', 'createsku'].includes(lastPath)) {
      returnCom.push(
        <React.Fragment key="skuinfo-15">
          <ReturnBtn key="skuinfo-16" lastPath={lastPath} selectedRow={singleRow} recall={recall} />
          <Button type="primary" key="skuinfo-hah" size="small" onClick={onSumbitAuidt}>
            提交审核
          </Button>
          <Button type="primary" key="skuinfo-17" size="small" onClick={onSumbit}>
            选配完成
          </Button>
        </React.Fragment>,
      );
    }
    returnCom.push(
      <Button
        size="small"
        key="skuinfo-18"
        onClick={() => {
          setHandleVisible(false);
        }}
      >
        取消
      </Button>,
    );
    return returnCom;
  };
  const createSkuBtn = () => {
    const returnCom: any = [];
    if (['quote', 'otherchannel', 'RFQquote'].includes(lastPath)) {
      returnCom.push(
        <React.Fragment key={'submitSaveButton'}>
          <ReturnBtn key="skuinfo-19" lastPath={lastPath} selectedRow={singleRow} recall={recall} />
          <ProductBtn key="skuinfo-120" selectedRow={singleRow} recall={recall} />
          <Button
            type="primary"
            key="skuinfo-20"
            size="small"
            onClick={() => {
              onSumbitQuote(createRef);
            }}
            loading={changeLoading}
          >
            提交报价
          </Button>
          <Button
            type="primary"
            key={'skuinfo-21'}
            size="small"
            onClick={onCreateSku}
            loading={changeLoading}
          >
            保存
          </Button>
        </React.Fragment>,
      );
    } else if (lastPath === 'createsku') {
      returnCom.push(
        <React.Fragment key={'submitButton'}>
          <ProductBtn key="skuinfo-22" selectedRow={singleRow} recall={recall} />
          <Button type="primary" key={'skuinfo-23'} size="small" onClick={onCreateSku}>
            提交
          </Button>
        </React.Fragment>,
      );
    }
    returnCom.push(
      <Button
        size="small"
        key="skuinfo-24"
        onClick={() => {
          setSourcingVisible(false);
        }}
      >
        取消
      </Button>,
    );
    return returnCom;
  };
  const remarkSkuBtn = () => {
    const returnCom: any = [];
    if (['quote', 'otherchannel', 'all'].includes(lastPath)) {
      returnCom.push(
        <React.Fragment key={'saveButton'}>
          <Button type="primary" key="skuinfo-28" size="small" onClick={() => onSaveImg()}>
            保存
          </Button>
        </React.Fragment>,
      );
    } else if (['allRFQ', 'RFQquote'].includes(lastPath)) {
      returnCom.push(
        <React.Fragment key={'closeButton'}>
          <Button key="skuinfo-228" size="small" onClick={() => setVisible(false)}>
            关闭
          </Button>
        </React.Fragment>,
      );
    } else if (lastPath === 'aepcm' && sessionStorage.getItem('remark')) {
      returnCom.push(
        <React.Fragment key={'saveRemarkButton'}>
          <Button type="primary" key={'skuinfo-26'} size="small" onClick={onSaveRemark}>
            保存备注
          </Button>
          <Button
            key={'skuinfo-27'}
            size="small"
            onClick={() => {
              setVisible(false);
            }}
          >
            取消
          </Button>
        </React.Fragment>,
      );
    }
    return returnCom;
  };
  const onSaveRemark = async () => {
    skuDetail?.current?.onRemark(() => {
      setVisible(false);
    });
  };
  const onEditSku = async (res: any) => {
    if (res) {
      // 新家逻辑字段判断
      if (singleRow[0].lineStatus == 20) {
        // 判断接口
        await searchFaTransAstSku('info', {
          inquiryId: singleRow[0].inquiryId,
          inqLineIdList: [singleRow[0].inqLineId],
          newSkuList: [{ inqLnId: singleRow[0].sid, sku: res?.sku }],
        }).then(async (res1: any) => {
          if (res1?.errCode == 200) {
            if (res1?.data?.dataList?.length > 0) {
              setRepalceList(res1?.data?.dataList);
              setlineEditData(res);
              replaceModalRef?.current?.open();
              //接下来做是否替换操作
            } else {
              //原来逻辑
              const resd = await itemEdit(res);
              if (resd.errCode === 200) {
                message.success('操作成功!');
                setEditVisible(false);
                recall();
              } else {
                message.error(resd.errMsg);
              }
            }
          }
        });
      }
    } else {
      skuRef.current?.resetForm();
      setEditVisible(false);
    }
  };
  const onSaveImg = () => {
    skuDetail?.current?.onSave(() => {
      setVisible(false);
    });
  };
  const onFieldsChange = () => {
    setLastState(form.getFieldValue('inqLnStatList'));
    refs.current?.reload();
  };
  const toSourcing = () => {
    if (selectedRow?.length) {
      Modal.confirm({
        title: '确定提交Sourcing?',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const list: any = selectedRow.map((item: any) => item.sid);
          submitSourcing({ list }).then((res: any) => {
            if (res.errCode === 200) {
              message.success('提交成功!');
              refs.current?.reload();
            } else {
              message.error(res.errMsg);
            }
          });
        },
      });
    } else {
      message.error('请选择需要Sourcing的行进行提交!');
    }
  };
  useImperativeHandle(ref, () => ({
    refresh: () => {
      refs.current?.reload();
    },
  }));

  const propsUp: UploadProps = {
    name: 'file',
    maxCount: 1,
    showUploadList: false,
    action: `${getEnv()}/omsapi/inquiry/importReturnItemEdit/${pathParams?.id}`,
    accept: '.xls,.xlsx',
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const res: any = info.file.response;
        if (res.errCode === 200) {
          refs.current?.reload(true);
          props.recall();
          Modal.success({
            title: '导入成功!',
          });
        } else {
          Modal.warning({
            title: '导入结果提示',
            content: res.errMsg,
          });
        }
        console.log(res, 'resres');
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="base-info" id="inquiryAddNewLastCol">
      <ProTable<any>
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: '/inquiry/info',
          persistenceType: 'localStorage',
        }}
        request={async (params) => {
          const searchParams: any = form.getFieldsValue() || {};
          searchParams.pathOp = lastPath || 'info';
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          searchParams.inquiryId = pathParams?.id;
          const res = await inqLnList(searchParams);
          setSelectedRow([]);
          setSelectedRowKeys([]);
          if (res.errCode === 200) {
            let list: any = res.data?.list || [];
            list = list.map((item: any) => {
              return { ...item, ...item.reqVo, ...item.skuVo };
            });
            if (props.getInfoTotal) {
              props.getInfoTotal(res.data?.total);
            }
            return Promise.resolve({ data: list, total: res.data?.total, success: true });
          } else {
            message.error(res.errMsg);
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
        options={{ reload: false, density: false }}
        rowKey="inqLineId"
        search={false}
        tableAlertRender={false}
        actionRef={refs}
        defaultSize="small"
        scroll={{ x: 200, y: 300 }}
        bordered
        size="small"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          showQuickJumper: true,
        }}
        className="inquiryAddNewTable"
        headerTitle={
          <Space style={{ margin: '5px 0', flexDirection: 'column', alignItems: 'flex-start' }}>
            <React.Fragment key={'buttons'}>
              <Space>
                {pathParams && pathParams.sorurceType === 'info' && (
                  <Upload {...propsUp}>
                    <Button type="primary">导入</Button>
                  </Upload>
                )}
                <BtnCom
                  inquiryId={pathParams?.id}
                  selectedRow={selectedRow}
                  status={props.status}
                  recall={recall}
                />
                {['info'].includes(lastPath) && ![30].includes(props.status) && (
                  <Button type="primary" onClick={toSourcing}>
                    提交Sourcing
                  </Button>
                )}
              </Space>
              <Form key={'skuinfo-25'} layout="inline" form={form} onFieldsChange={onFieldsChange}>
                <Form.Item name="inqLineIds" label="行项目ID">
                  <Input style={{ width: '200px' }} placeholder="请输入行项目ID" allowClear />
                </Form.Item>
                <Form.Item name="inqLnStatList" label="行项目状态">
                  <Select style={{ width: 300 }} mode={'multiple'} maxTagCount={2}>
                    {lineStatus &&
                      lineStatus.map((item: any) => (
                        <Select.Option value={item.code} key={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Form>
            </React.Fragment>
          </Space>
        }
      />
      <Drawer
        title={createTitle}
        destroyOnClose={true}
        placement="right"
        width={window.innerWidth}
        onClose={() => {
          setSourcingVisible(false);
        }}
        extra={<Space>{createSkuBtn()}</Space>}
        visible={sourcingVisible}
        key={'drawer-1'}
      >
        <CreateSku
          ref={createRef}
          id={id}
          backMtd={loglogInfo}
          customerCode={props.customerCode}
          custPurpose={props.custPurpose}
          onFileChangeTrue={() => setChangeLoading(true)}
          onFileChangeFalse={() => setChangeLoading(false)}
          curPath={curPath}
        />
      </Drawer>
      <Drawer
        title={drawerTitle}
        destroyOnClose
        width={window.innerWidth}
        onClose={() => {
          setHandleVisible(false);
        }}
        extra={<Space>{drawerBtn()}</Space>}
        visible={handleVisible}
        key={'drawer-2'}
      >
        <HandleLectotype
          customerCode={props.customerCode}
          custPurpose={props.custPurpose}
          ref={handleRef}
          id={id}
          backMtd={loglogInfo}
          curPath={curPath}
        />
      </Drawer>
      <Drawer
        title={'行项目详情信息'}
        width={window.innerWidth}
        destroyOnClose
        onClose={() => {
          setVisible(false);
          sessionStorage.removeItem('remark');
        }}
        visible={visible}
        extra={
          <Space>{remarkSkuBtn()}</Space>
          // ['quote', 'otherchannel', 'all'].includes(lastPath) && (
          //   <Button type="primary" key="skuinfo-28" size="small" onClick={() => onSaveImg()}>
          //     保存
          //   </Button>
          // )
          // lastPath === 'aepcm' && (
          //   <Space>
          //   <Button type="primary" key={'skuinfo-26'} size="small" onClick={onEditSku}>
          //     提交
          //   </Button>
          //   <Button
          //     key={'skuinfo-27'}
          //     size="small"
          //     onClick={() => {
          //       setEditVisible(false);
          //     }}
          //   >
          //     取消
          //   </Button>
          // </Space>
          // )
        }
        key={'drawer-3'}
      >
        <Spin spinning={load}>
          <SkuDetail curPath={curPath} ref={skuDetail} id={id} backMtd={loglogInfo} />
        </Spin>
      </Drawer>
      {/* <Drawer
        title={'行明细编辑'}
        placement="right"
        width={1200}
        destroyOnClose
        onClose={() => {
          setEditVisible(false);
        }}
        visible={editVisible}
        extra={
          <Space>
            <Button type="primary" key={'skuinfo-26'} size="small" onClick={onEditSku}>
              提交
            </Button>
            <Button
              key={'skuinfo-27'}
              size="small"
              onClick={() => {
                setEditVisible(false);
              }}
            >
              取消
            </Button>
          </Space>
        }
      >
        <EditSku id={id} ref={skuRef} customerCode={props.customerCode} />
      </Drawer> */}
      <SkuInfoSingle
        ref={skuRef}
        customerCode={props.customerCode}
        getSingleSkuData={onEditSku}
        visible={editVisible}
        key={'drawer-4'}
      />
      <LogInfo
        id={id || ''}
        title={'行项目操作日志'}
        sourceType={'21'}
        visible={logVisible}
        closed={() => {
          setLogVisible(false);
        }}
        key={'drawer-5'}
      />
      {singleRow[0]?.inquiryId && (
        <ReplaceModal
          close={() => setEditVisible(false)}
          lineEditData={lineEditData}
          ref={replaceModalRef}
          path={'info'}
          id={singleRow[0].inquiryId}
          dataList={repalceList}
          subData={singleRow[0]?.inqLineId}
          type={3}
          inSubmit={inSubmit}
          lastPath={lastPath}
          handClose={() => setHandleVisible(false)}
          tableReload={onFieldsChange}
          key={'drawer-6'}
        />
      )}
      {/* sourcing内页提交报价 */}
      {singleRow[0]?.inquiryId && (
        <RebackModal
          ref={rebackModalRef}
          path={lastPath}
          id={singleRow[0].inquiryId}
          dataList={repalceList}
          lineEditData={lineEditData}
          subData={singleRow[0]?.inqLineId}
          type={3}
          tableRefresh={recall}
          key={'drawer-7'}
        />
      )}
    </div>
  );
};
export default forwardRef(SkuInfo);
