import { SearchOutlined } from '@ant-design/icons';
import { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import { fieldLabels } from '../const';
import './table.less';
interface ReceiverInfoProps {
  id?: string;
  type?: string; //addOrder afterOrder 多类型
  onModal?: () => void;
  readonly?: boolean;
  info?: Record<any, any>;
  isCsp?: boolean;
}

const ReceiverInfo: React.FC<ReceiverInfoProps> = ({
  onModal,
  type = '',
  readonly,
  info = {} as any,
  isCsp,
}) => {
  const {
    shipRegionName1 = '',
    shipRegionName2 = '',
    shipRegionName3 = '',
    shipStreet = '',
    shipZip = '',
    consigneeName = '',
    consigneeMobile = '',
    consigneeTel = '',
    consigneeTelExt = '',
    shipEmail = '',

    // 字段不一致
    provinceName = '',
    cityName = '',
    districtName = '',
    specialCode = '',
    receiverAddress = '',
    receiverName = '',
    receiverMobile = '',
    receiverPhone = '',
    consigneeEmail = '',
    toBond = false,
    // customerCode = '1',
  } = info;
  let consigneeNumber = consigneeTel;
  if (consigneeTel && consigneeTel !== '' && consigneeTelExt && consigneeTelExt !== '') {
    consigneeNumber = consigneeTel + '-' + consigneeTelExt;
  } else if (!consigneeTel && consigneeTelExt && consigneeTelExt !== '') {
    consigneeNumber = consigneeTelExt;
  }

  // const [bond, setBond] = useState<any>({ edit: true });

  // useEffect(() => {
  //   checkBond({ customerCode }).then((res: any) => {
  //     const { errCode, data } = res;
  //     if (errCode === 200) {
  //       setBond(data);
  //     }
  //   });
  // }, [info?.customerCode]);
  // 注意 ： 后端为两个人携带的 字段key不一致

  if (['addOrder', 'afterOrder', 'scrapDetail', 'scrapApply'].includes(type)) {
    //?添加需求单，新增售后订单，报废详情，新增报废
    return (
      <div>
        <Row gutter={24}>
          <Col
            lg={12}
            md={12}
            sm={24}
            style={{ float: 'left' }}
            onClick={onModal}
            className="canSee"
          >
            <ProFormText
              allowClear={false}
              initialValue={receiverAddress}
              label={fieldLabels.shipStreet}
              name="receiverAddress"
              rules={[{ required: true, message: '请填写地址' }]}
              placeholder="请填写地址或选择已维护的客户地址信息"
              readonly={readonly}
              disabled
              fieldProps={{
                suffix: !readonly && <SearchOutlined />,
              }}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label={fieldLabels.region}
              name="region"
              // rules={[{ required: true, message: '请选择' }]}
              readonly={readonly}
              initialValue={`${provinceName}${cityName}${districtName}`}
              options={[]}
              placeholder=""
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              initialValue={shipZip}
              label={fieldLabels.shipZip}
              name="shipZip"
              placeholder=""
              readonly={readonly}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              // rules={[{ required: true, message: '请填写' }]}
              label={fieldLabels.consigneeName}
              name="receiverName"
              placeholder=""
              readonly={readonly}
              initialValue={receiverName}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              // rules={[{ required: true, message: '请填写', pattern: /^1[3456789]\d{9}$/ }]}
              label={fieldLabels.consigneeMobile} //?收货人手机
              name="receiverMobile"
              placeholder=""
              readonly={readonly}
              initialValue={receiverMobile}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.consigneeTel} //?收货人固话
              name="receiverPhone"
              placeholder=""
              readonly={readonly}
              initialValue={receiverPhone}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.shipEmail}
              name="consigneeEmail"
              placeholder=""
              readonly={readonly}
              initialValue={consigneeEmail}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormRadio.Group
              name="toBond"
              label={fieldLabels.isBonded}
              options={[
                {
                  label: '否',
                  value: false,
                },
                {
                  label: '是',
                  value: true,
                },
              ]}
              initialValue={toBond}
              readonly={readonly}
              // disabled={bond?.edit === false ? true : false}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.qrCode}
              name="specialCode"
              placeholder="请填写二维码信息"
              initialValue={specialCode}
              readonly={readonly}
            />
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div>
        <Row gutter={24}>
          <Col
            lg={12}
            md={12}
            sm={24}
            style={{ float: 'left' }}
            onClick={onModal}
            className="canSee"
          >
            <ProFormText
              allowClear={false}
              initialValue={shipStreet}
              label={fieldLabels.shipStreet}
              name="shipStreet"
              rules={[{ required: isCsp ? false : true, message: '请填写地址' }]}
              placeholder="请填写地址或选择已维护的客户地址信息"
              readonly={readonly}
              disabled
              fieldProps={{
                suffix: !readonly && <SearchOutlined />,
              }}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label={fieldLabels.region}
              name="region"
              // rules={[{ required: true, message: '请选择' }]}
              readonly={readonly}
              initialValue={`${shipRegionName1}${shipRegionName2}${shipRegionName3}`}
              options={[
                {
                  label: '上海',
                  value: '0',
                },
              ]}
              placeholder="请选择"
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              initialValue={shipZip}
              label={fieldLabels.shipZip}
              name="shipZip"
              placeholder=""
              readonly={readonly}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              // rules={[{ required: true, message: '请填写' }]}
              label={fieldLabels.consigneeName}
              name="consigneeName"
              placeholder=""
              readonly={readonly}
              initialValue={consigneeName}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              // rules={[{ required: true, message: '请填写', pattern: /^(1[34578]\d{9})$/ }]}
              label={fieldLabels.consigneeMobile}
              name="consigneeMobile"
              placeholder=""
              readonly={readonly}
              initialValue={consigneeMobile}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.consigneeTel}
              name="consigneeTel"
              placeholder=""
              readonly={readonly}
              initialValue={consigneeNumber}
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.shipEmail}
              name="shipEmail"
              placeholder=""
              readonly={readonly}
              initialValue={shipEmail}
              disabled
            />
          </Col>
          {/* <Col lg={6} md={12} sm={24}>
          {['scrapDetail', 'scrapApply'].includes(type) ? (
            <ProFormText
              label={fieldLabels.shipEmail}
              name="shipEmail"
              placeholder="请填写"
              readonly={readonly}
              initialValue={shipEmail}
              disabled
            />
          ) : (
            <ProFormText
              label={fieldLabels.consigneeTelExt}
              name="consigneeTelExt"
              placeholder="请填写"
              readonly={readonly}
              initialValue={consigneeTelExt}
              disabled
            />
          )}
        </Col> */}
        </Row>
      </div>
    );
  }
};

export default ReceiverInfo;
