import { queryChannel } from '@/services/afterSales/utils';
import { getCustomerList } from '@/services/InquirySheet/offerOrder';
import { getR3ConList, getOrderDateList } from '@/services/SalesOrder';
import { getCompanyList } from '@/services/InquirySheet/utils';
import {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { fieldLabels } from '../const';

interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  isCsp?: boolean;
  onChangeDate?: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  type,
  readonly,
  isCsp,
  onChangeDate,
  info = {
    partialShipment: false,
    contactsCode: '',
    couponCode: '',
    intelDevice: 0,
    r3: { contactsCode: '', contactsName: '' } as any,
  } as any,
}) => {
  const [cpList, setCpList] = useState<any>([]);
  const [r3List, setR3List] = useState<any>([]);
  const [businessList, setBusinessList] = useState<any>([]);
  const [channelList, setChannelList] = useState<any>([]);
  const [showDate, setShowDate] = useState(true);
  const [orderTypeList, setOrderTypeList]: any = useState([]);
  const getr3List = async () => {
    console.log(info, 'info###s');
    // const { data, errCode } = await getR3ConList({ customerCode: info.customerCode });
    // if (errCode === 200) {
    //   setR3List(
    //     data?.dataList.map((io: any) => ({
    //       label: io.contactName,
    //       value: io.contactCode,
    //     })),
    //   );
    // }
  };
  const getBuiness = async () => {
    // const { data, errCode } = await getCustomerList({
    //   customerCode: info.customerCode,
    //   // contactName: info.customerName,
    // });
    // if (errCode === 200) {
    //   setBusinessList(
    //     data?.list.map((io: any) => ({
    //       label: io.oppoValue,
    //       value: io.oppoId,
    //     })),
    //   );
    // }
  };
  const companyList = async () => {
    // await getCompanyList().then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setCpList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         value: io.key,
    //         label: io.value,
    //       })),
    //     );
    //   }
    // });
  };

  const getChannel = async () => {
    queryChannel({}).then((res: any) => {
      setChannelList(
        res?.data?.map((io: any) => ({
          value: io.channel,
          label: io.channelName,
        })),
      );
    });
  };
  useEffect(() => {
    getBuiness();
    getr3List();
    companyList();
    getChannel();
    // getOrderDateList({ type: 'orderType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderTypeList(
    //       res.data.dataList.map((e) => {
    //         return {
    //           label: e.value,
    //           value: e.key,
    //         };
    //       }),
    //     );
    //   }
    // });
  }, []);
  function validatorFn() {
    setShowDate(false);
  }
  // add offer order
  if (type === 'offerOrder') {
    return (
      <>
        <Row gutter={24}>
          {readonly && (
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.customerCode}
                initialValue={info.customerCode}
                name="customerCode"
                placeholder="客户代号"
                readonly={readonly}
              />
            </Col>
          )}
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.customerName}
              initialValue={info.customerName}
              name="customerName"
              placeholder="客户名称"
              readonly={readonly}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              allowClear={false}
              label={fieldLabels.contactName}
              initialValue={info?.contactName}
              name="contactName"
              readonly={readonly}
              fieldProps={{
                labelInValue: true,
                dropdownStyle: {
                  maxHeight: '300px',
                },
              }}
              options={r3List}
              placeholder="请选择"
            />
          </Col>
          {!readonly && (
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label={fieldLabels.oppoValue}
                showSearch
                allowClear={false}
                name="oppoValue"
                readonly={readonly}
                options={businessList}
                placeholder="请选择"
                initialValue={info.oppoValue}
                fieldProps={{
                  labelInValue: true,
                }}
              />
            </Col>
          )}
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label={fieldLabels.salesName}
              name="salesName"
              options={[
                {
                  label: '丽丽',
                  value: 0,
                },
              ]}
              placeholder="请选择"
              readonly={readonly}
              initialValue={info.salesName || 'lili'}
              rules={[{ required: isCsp ? false : true, message: '请选择' }]}
              disabled
            />
          </Col>
          {/*</Row>
        <Row gutter={24}>*/}
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.poNo}
              name="poNo"
              placeholder="请输入"
              readonly={readonly}
              initialValue={info.poNo}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDatePicker
              initialValue={info.reqDelivDate ? moment(info.reqDelivDate, 'YYYY-MM-DD') : null}
              // initialValue={moment(
              //   info.reqDelivDate ? info.reqDelivDate : new Date(),
              //   'YYYY-MM-DD',
              // )}
              rules={[{ required: true, message: '请选择' }]}
              // rules={[{ required: isCsp ? false : true, message: '请选择' }]}
              label={fieldLabels.reqDelivDate}
              name="reqDelivDate"
              readonly={readonly}
              fieldProps={{
                style: {
                  width: '100%',
                },
                disabledDate: (current: any) => {
                  return current < moment().startOf('day');
                },
              }}
            />
          </Col>
          {/* <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.campaignCode}
              name="campaignCode"
              readonly={readonly}
              placeholder="请输入"
              initialValue={info.campaignCode}
            />
          </Col> */}
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label={fieldLabels.channel}
              name="channel"
              placeholder="请输入"
              readonly={readonly}
              disabled
              options={channelList}
              initialValue={info.channel}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              allowClear={false}
              label={fieldLabels.branchCompanyName}
              name="company"
              readonly={readonly}
              options={cpList}
              placeholder="请选择"
              // initialValue={info.branchCompanyName}
              fieldProps={{
                labelInValue: true,
              }}
              disabled
              initialValue={info?.company?.value}
            />
          </Col>
        </Row>
        {!readonly && (
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="客户计价方式"
                initialValue={
                  info?.pricingMethod === 1
                    ? '含税模式'
                    : info?.pricingMethod === 2
                    ? '未税模式-2位精度'
                    : info?.pricingMethod === 3
                    ? '未税模式-4位精度'
                    : '-'
                }
                name="pricingMethod"
                readonly={readonly}
                disabled
              />
            </Col>
          </Row>
        )}
        {readonly && (
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.quotValidDate}
                name="quotValidDate"
                readonly={readonly}
                initialValue={info.quotValidDate}
              />
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.pname}
                name="pname"
                readonly={readonly}
                initialValue={info.pname}
              />
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.pemail}
                name="pemail"
                readonly={readonly}
                initialValue={info.pemail}
              />
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.pcontact}
                name="buyerPhone"
                readonly={readonly}
                initialValue={info.pcontact}
              />
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          {readonly && (
            <>
              <Col lg={6} md={12} sm={24}>
                <ProFormText
                  label={fieldLabels.createName}
                  name="createName"
                  readonly={readonly}
                  initialValue={info.createName}
                />
              </Col>
              <Col lg={6} md={12} sm={24}>
                <ProFormText
                  label={fieldLabels.createTime}
                  name="createTime"
                  readonly={readonly}
                  initialValue={info.createTime}
                />
              </Col>
              <Col lg={6} md={12} sm={24}>
                <ProFormSelect
                  label={fieldLabels.oppoValue}
                  showSearch
                  allowClear={false}
                  name="oppoValue"
                  readonly={readonly}
                  options={businessList}
                  placeholder="请选择"
                  initialValue={info.oppoValue}
                  fieldProps={{
                    labelInValue: true,
                  }}
                />
              </Col>
              <Col lg={6} md={12} sm={24}>
                <ProFormText
                  label="所属部门"
                  allowClear={false}
                  name="deptName"
                  readonly={readonly}
                  initialValue={info?.deptName}
                />
              </Col>
            </>
          )}
        </Row>
        {readonly && (
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="所属集团"
                initialValue={info?.groupCustomerName}
                name="groupCustomerName"
                readonly={readonly}
              />
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="集团客户号"
                initialValue={info?.groupCustomerAccount}
                name="groupCustomerAccount"
                readonly={readonly}
              />
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="客户计价方式"
                initialValue={
                  info?.pricingMethod === 1
                    ? '含税模式'
                    : info?.pricingMethod === 2
                    ? '未税模式-2位精度'
                    : info?.pricingMethod === 3
                    ? '未税模式-4位精度'
                    : '-'
                }
                name="pricingMethod"
                readonly={readonly}
              />
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={24}>
            <ProFormTextArea
              name="remark"
              label={fieldLabels.remark}
              readonly={readonly}
              initialValue={info.remark}
              fieldProps={{
                maxLength: 255,
                showCount: true,
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
  // add order // TODO:注意后端是多人写的，字段name可能不一样
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.customerName}
            initialValue={info.customerName}
            name="customerName"
            placeholder="客户名称"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.customerCode}
            initialValue={info.customerCode}
            name="customerCode"
            placeholder="客户代号"
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={fieldLabels.contactName}
            initialValue={info?.r3?.contactsName}
            name="r3"
            fieldProps={{
              labelInValue: true,
              dropdownStyle: {
                maxHeight: '300px',
              },
            }}
            readonly={readonly}
            options={r3List}
            allowClear={false}
            placeholder="请选择"
            rules={[{ required: true, message: '请选择' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.contactCodeR3}
            initialValue={info.contactsCode}
            name="contactsCode"
            placeholder=""
            disabled
            rules={[{ required: true, message: '请选择' }]}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={fieldLabels.oppoValue}
            name="oppoId"
            readonly={readonly}
            showSearch
            options={businessList}
            allowClear={false}
            placeholder="请选择"
            initialValue={info.oppoValue}
            fieldProps={{
              labelInValue: true,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={fieldLabels.salesName}
            name="salesName"
            options={[
              {
                label: '丽丽',
                value: 0,
              },
            ]}
            placeholder="请选择"
            readonly={readonly}
            initialValue={info.salesName || 'lili'}
            rules={[{ required: true, message: '请选择' }]}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.poNo}
            name="customerPurchaseNo"
            placeholder="请输入"
            readonly={readonly}
            initialValue={info.customerPurchaseNo}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={
              moment(info.sendDate).diff(moment(new Date()), 'days') >= 0 //?判断发货的日是否小于今天的日期，小于就让重新选
                ? moment(info.sendDate, 'YYYY-MM-DD')
                : null
            }
            // initialValue={moment(info.sendDate ? info.sendDate : new Date(), 'YYYY-MM-DD')}
            rules={[{ required: true, message: '请选择' }]}
            label={fieldLabels.reqDelivDate}
            allowClear={false}
            name="sendDate"
            readonly={readonly}
            fieldProps={{
              style: {
                width: '100%',
              },
              disabledDate: (current: any) => {
                return current < moment().startOf('day');
              },
              onChange: validatorFn,
            }}
          />
          {showDate && moment(info.sendDate).diff(moment(new Date()), 'days') < 0 ? (
            <div style={{ marginTop: '5px', color: 'red', marginLeft: '96px' }}>
              要求发货日不可早于当日
            </div>
          ) : (
            ''
          )}
          {/* <Form.Item
            initialValue={
              moment(info.sendDate).diff(moment(new Date()), 'days') >= 0 //?判断发货的日是否小于今天的日期，小于就让重新选
                ? moment(info.sendDate, 'YYYY-MM-DD')
                : null
            }
            // rules={[{ required: true, message: '请选择'}]}
            label={fieldLabels.reqDelivDate}
            name="sendDate"
          >
            <DatePicker
              allowClear={false}
              // readonly={readonly}
              style={{
                width: '100%',
              }}
              disabledDate={(current: any) => {
                return current < moment().startOf('day');
              }}
              onChange={validatorFn}
            /> */}

          {/* </Form.Item> */}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={fieldLabels.branchCompanyName}
            name="companyCode"
            readonly={readonly}
            options={cpList}
            placeholder="请选择"
            initialValue={info.companyCode}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name="partialShipment"
            label="一次性发货"
            initialValue={info.partialShipment || 0}
            options={[
              {
                label: '否',
                value: 0,
              },
              {
                label: '是',
                value: 1,
              },
            ]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            label="智能柜设备(非物料)"
            initialValue={info.intelDevice || 0}
            name="intelDevice"
            options={[
              {
                label: '否',
                value: 0,
              },
              {
                label: '是',
                value: 1,
              },
            ]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="网站优惠券号"
            name="couponCode"
            placeholder="请输入"
            initialValue={info.couponCode}
            disabled
          />
          {/* <ProFormText
            label={fieldLabels.relationOrder}
            name="relationOrder"
            placeholder="请输入"
          /> */}
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.pricingMethod}
            initialValue={
              info?.pricingMethod === 1
                ? '含税模式'
                : info?.pricingMethod === 2
                ? '未税模式-2位精度'
                : info?.pricingMethod === 3
                ? '未税模式-4位精度'
                : '--'
            }
            name="pricingMethod"
            placeholder="客户名称"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={info.expectedDate}
            label={fieldLabels.expectedDate}
            name="expectedDate"
            readonly={readonly}
            fieldProps={{
              style: {
                width: '100%',
              },
              disabledDate: (current: any) => {
                return current < moment().startOf('day');
              },
              onChange: (e, dateString) => {
                onChangeDate(dateString);
              },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          {info.consignment && (
            <ProFormSelect
              label={fieldLabels.category}
              name="category"
              options={orderTypeList}
              placeholder="请选择"
              readonly={readonly}
              initialValue={"10"}
              rules={[{ required: true, message: '请选择' }]}
            />
          )}
        </Col>
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            label={fieldLabels.repeatThir}
            name="repeatThir"
            options={[
              {
                label: '否',
                value: 'a',
              },
              {
                label: '是',
                value: 'b',
              },
            ]}
          />
        </Col> */}
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <ProFormTextArea
            style={{ width: '100%' }}
            initialValue={info.userRemark}
            label={fieldLabels.custMark}
            name="userRemark"
            fieldProps={{
              maxLength: 255,
              showCount: true,
            }}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <ProFormTextArea
            name="csrRemark"
            initialValue={info.csrRemark}
            label={fieldLabels.csrMark}
            fieldProps={{
              maxLength: 255,
              showCount: true,
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default BasicInfo;
