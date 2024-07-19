import { SearchOutlined } from '@ant-design/icons';
import { getByKeys } from '@/services/afterSales/utils';
import { getCompanyList } from '@/services/InquirySheet/utils';
import '../../index.less';
import { ProFormTextArea, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getInvoice } from '@/services/loan';
import { useModel } from 'umi';
interface BasicInfoProps {
  id?: string;
  type?: string;
  applyDisabled?: boolean;
  addDisabled?: boolean;
  handlePriceHide?: Function;
  handleSplitHide?: Function;
  tablelinelist?: Function;
  tableApplyVo?: Function;
  updateInvoice?: Function;
  info?: Record<any, any>;
  formRef?: any;
  allsDisable?: boolean;
}
const ApplicationContent: React.FC<BasicInfoProps> = ({
  info = {} as any,
  formRef,
  allsDisable,
  handleSplitHide,
  tablelinelist,
  tableApplyVo,
  handlePriceHide,
  updateInvoice,
  applyDisabled,
  addDisabled,
}) => {
  const {
    systemInvoiceNo = '', //系统发票号
    loanApplyType = '', //借贷类型
    applyTitle = '', //申请标题
    changeHeaderFlag = 2, //更换开票抬头
    billSubject = '', //开票主体
    //  billSubjectCode = '',//开票主体Code
    applyRemarks = '', //申请备注
  } = info;
  const [statusList, setStatusList] = useState<any>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true); //借贷类型
  const [cpList, setCpList] = useState<any>([]); //开票主体
  const [isBillDisabled, setIsBillDisabled] = useState<boolean>(false); //不是【变更开票主体】类型不可编辑
  const [billSubjectVal, setBillSubject] = useState<any>('');
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [isChangeHeaderFlag, setIsChangeHeaderFlag] = useState<boolean>(false); //变更开票抬头类型 选项状态
  const { setInitialState }: any = useModel('@@initialState');
  //1.变更发票抬头 2.调整金额 3.拆分发票 4.变更发票主体 5.其他 现在
  //1.拆分发票 2.调整金额 3.变更发票主体 4. 其他 之前
  useEffect(() => {
    if (addDisabled) {
      setIsDisabled(addDisabled);
    } else {
      setIsDisabled(applyDisabled);
    }
    if (loanApplyType !== 'EO4') {
      setIsBillDisabled(true);
    }
    if (loanApplyType == 'EO5') {
      setIsRequired(true);
    }
    if (loanApplyType == 'EO1') {
      setIsChangeHeaderFlag(true);
    }
    if (changeHeaderFlag === 1) {
      updateInvoice(false);
    } else {
      updateInvoice(true);
    }
  }, []);
  const searchCheck = async () => {
    // const allVal = formRef.getFieldsValue();
    // const res = await getInvoice(allVal.systemInvoiceNo);
    // if (res.errCode === 200) {
    //   const result = cpList.find((item: { key: any }) => {
    //     return res.data.applyVo?.billSubjectCode === item.key;
    //   });
    //   setIsBillDisabled(true);
    //   setBillSubject(res.data.applyVo?.billSubject);
    //   formRef?.setFieldsValue({
    //     systemInvoiceNo: res.data.applyVo?.systemInvoiceNo,
    //     billSubject: result?.label,
    //     invoiceReceiver: res.data.applyVo?.invoiceReceiver,
    //     invoiceEmail: res.data.applyVo?.invoiceEmail,
    //     invoiceFollowGoods: res.data.applyVo?.invoiceFollowGoods,
    //     invoiceAddress: res.data.applyVo?.invoiceAddress,
    //     invoiceZip: res.data.applyVo?.invoiceZip,
    //     invoiceTel: res.data.applyVo?.invoiceTel,
    //     invoiceMobile: res.data.applyVo?.invoiceMobile,
    //     invoiceRegion: res.data.applyVo?.invoiceRegion,
    //     vatTypeName: res.data.applyVo?.vatTypeName,
    //     vatCompanyName: res.data.applyVo?.vatCompanyName,
    //     vatTaxNo: res.data.applyVo?.vatTaxNo,
    //     vatAddress: res.data.applyVo?.vatAddress,
    //     vatBankName: res.data.applyVo?.vatBankName,
    //     vatBankNo: res.data.applyVo?.vatBankNo,
    //     vatPhone: res.data.applyVo?.vatPhone,
    //     orderNo: res.data.applyVo?.orderNo,
    //     obdNo: res.data.applyVo?.obdNo,
    //     customerCode: res.data.applyVo?.customerCode,
    //     customerName: res.data.applyVo?.customerName,
    //     companyName: res.data.applyVo?.companyName,
    //     deptName: res.data.applyVo?.deptName,
    //     groupCode: res.data.applyVo?.groupCode,
    //     groupName: res.data.applyVo?.groupName,
    //     salesName: res.data.applyVo?.salesName,
    //     contactNameR3: res.data.applyVo?.contactNameR3,
    //     contactCodeR3: res.data.applyVo?.contactCodeR3,
    //     originalChannelName: res.data.applyVo?.originalChannelName,
    //     purchaseName: res.data.applyVo?.purchaseName,
    //   });
    //   //  const loanLineVo = await invoiceDetailLoan(res.data?.applyVo?.loanApplyNo);

    //   if (res.data.applyVo.readOnly == 1) {
    //     setIsDisabled(true);
    //     formRef?.setFieldsValue({
    //       loanApplyType: 'EO5',
    //     });
    //     setIsRequired(true);
    //     handleSplitHide(true);
    //     tablelinelist([]);
    //     tableApplyVo([]);
    //     setInitialState((s: any) => ({
    //       ...s,
    //       totalAmount: res.data?.applyVo?.totalAmount,
    //     }));
    //     message.error('本发票仅支持借贷类型为其他'); //借贷类型强制为【其他(请备注)】
    //   } else {
    //     formRef?.setFieldsValue({
    //       loanApplyType: '',
    //     });
    //     setIsRequired(false);
    //     tablelinelist(res.data.lineList);
    //     tableApplyVo(res.data.applyVo);

    //     setInitialState((s: any) => ({
    //       ...s,
    //       Infolist: res.data.applyVo,
    //       lineList: res.data.lineList,
    //     }));
    //     setIsDisabled(false);
    //   }
    //   setInitialState((s: any) => ({
    //     ...s,
    //     // newArrLineVo: loanLineVo?.data?.loanOriginalInvoiceVo.lineVos?.map(
    //     //   (item: { detachableQty: any; dismantledQty: any }) => {
    //     //     return {
    //     //       ...item,
    //     //       dismantledQty: item.detachableQty,
    //     //       detachableQty: item.dismantledQty,
    //     //     };
    //     //   },
    //     // ),
    //     originalChannel: res.data?.applyVo?.originalChannel,
    //     loanApplyNo: res.data?.applyVo?.loanApplyNo,
    //     readOnly: res.data?.applyVo?.readOnly,
    //     cpList: cpList,
    //   }));
    // } else {
    //   message.error(res.errMsg);
    // }
  };

  useEffect(() => {
    // 借贷申请类型
    const par = { list: ['loanApplyTypeEnum', 'changeHeaderEnum'] };
    // getByKeys(par).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         return io.enums.map((ic: any) => ({
    //           ...ic,
    //           value: ic.code,
    //           label: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
    // getCompanyList().then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setCpList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         value: io.value,
    //         label: io.value,
    //       })),
    //     );
    //   }
    // });
  }, []);
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'系统发票号'}
            initialValue={systemInvoiceNo}
            name="systemInvoiceNo"
            readonly={allsDisable}
            placeholder={'请输入'}
            allowClear={false}
            disabled={applyDisabled}
            onBlur={searchCheck}
            rules={[{ required: true, message: '请输入' }]}
            fieldProps={{
              suffix: !allsDisable && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'借贷类型'}
            name="loanApplyType"
            disabled={isDisabled}
            initialValue={loanApplyType}
            fieldProps={{
              //1.变更发票抬头 2.调整金额 3.拆分发票 4.变更发票主体 5.其他 现在
              //1.拆分发票 2.调整金额 3.变更发票主体 4. 其他 之前
              onChange: (e) => {
                if (e == 'EO4') {
                  setIsBillDisabled(false);
                } else {
                  formRef?.setFieldsValue({
                    billSubject: billSubjectVal,
                  });
                  setIsBillDisabled(true);
                }
                if (e == 'EO2' || e == 'EO5') {
                  handlePriceHide(false);
                } else {
                  handlePriceHide(true);
                }
                if (e == 'EO3') {
                  handleSplitHide(false);
                } else {
                  handleSplitHide(true);
                }
                if (e == 'EO5') {
                  setIsRequired(true); //申请备注必填
                } else {
                  setIsRequired(false);
                }
                if (e == 'EO1') {
                  setIsChangeHeaderFlag(true);
                  formRef?.setFieldsValue({
                    changeHeaderFlag: 1,
                  });
                  updateInvoice(false);
                } else {
                  setIsChangeHeaderFlag(false);
                  formRef?.setFieldsValue({
                    changeHeaderFlag: 2,
                  });
                  updateInvoice(true);
                }
              },
            }}
            readonly={allsDisable}
            options={statusList[0]}
            placeholder="请选择"
            rules={[{ required: true, message: '请选择' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            allowClear={false}
            label={'申请标题'}
            fieldProps={{ maxLength: 50 }}
            name="applyTitle"
            initialValue={applyTitle}
            readonly={allsDisable}
            placeholder={'请输入'}
            rules={[{ required: true, message: '请输入' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            label="更换开票抬头"
            disabled={isChangeHeaderFlag}
            name={'changeHeaderFlag'}
            initialValue={changeHeaderFlag}
            options={[
              {
                label: '不更换',
                value: 2,
              },
              {
                label: '更换',
                value: 1,
              },
            ]}
            fieldProps={{
              onChange: (e) => {
                if (e.target.value === 1) {
                  updateInvoice(false);
                } else {
                  updateInvoice(true);
                }
              },
            }}
            rules={[{ required: true, message: '请选择' }]}
            //options={statusList[1]}
            readonly={allsDisable}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'开票主体'}
            name="billSubject"
            initialValue={billSubject}
            disabled={isBillDisabled}
            readonly={allsDisable}
            options={cpList}
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={16}>
          <ProFormTextArea
            name={'applyRemarks'}
            initialValue={applyRemarks}
            label="申请备注"
            placeholder={'请输入'}
            fieldProps={{ maxLength: 255, showCount: true }}
            readonly={allsDisable}
            rules={[
              () => {
                return { required: isRequired, message: '请输入' };
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default ApplicationContent;
