import React from 'react';
import './table.less';
interface TotalDescProps {
  totalDesc: Record<any, any>;
  type?: string;
}

const TotalDesc: React.FC<TotalDescProps> = ({ totalDesc }) => {
  const {
    goodsTotalPrice = '0',
    headFreightPrice = '0',
    intlFreightPrice = '0',
    tariffPrice = '0',
    totalFreightPrice = '0',
    taxTotalPrice = '0',
    noTaxTotalPrice = '0',
    discountTaxTotalPrice = '0',
    useRebatePrice = '0',
  } = totalDesc;
  return (
    <>
      {/*<Descriptions title="" bordered column={4} size="small" className="pr-desc-cust">
        <Descriptions.Item label="货品金额合计">{goodsTotalPrice}</Descriptions.Item>
        <Descriptions.Item label="头运费">{headFreightPrice}</Descriptions.Item>
        <Descriptions.Item label="国际运费">{intlFreightPrice}</Descriptions.Item>
        <Descriptions.Item label="关税">{tariffPrice}</Descriptions.Item>
        <Descriptions.Item label="运费总计">{totalFreightPrice}</Descriptions.Item>
        <Descriptions.Item label="总计金额含税">{taxTotalPrice}</Descriptions.Item>
        <Descriptions.Item label="总计金额未税">{noTaxTotalPrice} </Descriptions.Item>
        <Descriptions.Item label="折扣总价含税"> {discountTaxTotalPrice}</Descriptions.Item>
        <Descriptions.Item label="使用返利金额">{useRebatePrice}</Descriptions.Item>
      </Descriptions>*/}
      <div className="jerryLangDetail">
        <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
          <tbody>
            <tr>
              <th>货品金额合计:</th>
              <td>{goodsTotalPrice}</td>
              <th>头运费:</th>
              <td>{headFreightPrice}</td>
              <th>国际运费:</th>
              <td>{intlFreightPrice}</td>
              <th>关税:</th>
              <td>{tariffPrice}</td>
              <th>运费总计:</th>
              <td>{totalFreightPrice}</td>
            </tr>
            <tr>
              <th>总计金额含税:</th>
              <td>{taxTotalPrice}</td>
              <th>总计金额未税:</th>
              <td>{noTaxTotalPrice}</td>
              <th>折扣总价含税:</th>
              <td>{discountTaxTotalPrice}</td>
              <th>使用返利金额:</th>
              <td>{useRebatePrice}</td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TotalDesc;
