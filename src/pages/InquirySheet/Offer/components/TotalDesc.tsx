import React from 'react';
import './table.less';

interface TotalDescProps {
  totalDesc: Record<any, any>;
  type?: string;
}

const TotalDesc: React.FC<TotalDescProps> = ({ totalDesc }) => {
  return (
    <>
      {/*<Descriptions title="" bordered column={4} size="small" className="pr-desc-cust">
        <Descriptions.Item label="货品金额总计">{totalDesc?.goodsAmount || ' 0'}</Descriptions.Item>
        <Descriptions.Item label="头运费">
          {totalDesc?.calcFreightRespVo?.headFreight || '0'}
        </Descriptions.Item>
        <Descriptions.Item label="国际运费">
          {totalDesc?.calcFreightRespVo?.interFreight || '0'}
        </Descriptions.Item>
        <Descriptions.Item label="关税">
          {totalDesc?.calcFreightRespVo?.tariff || '0'}
        </Descriptions.Item>
        <Descriptions.Item label="运费合计">
          {totalDesc?.calcFreightRespVo?.totalFreight || '0'}
        </Descriptions.Item>
        <Descriptions.Item label="总计金额含税">{totalDesc?.amount || '0'}</Descriptions.Item>
        
        <Descriptions.Item label="总计金额未税">{totalDesc?.amountNet || '0'}</Descriptions.Item>
        <Descriptions.Item label="折扣总计">{totalDesc?.totalDiscount || '0'}</Descriptions.Item>
      </Descriptions>*/}

      <div className="jerryLangDetail">
        <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
          <tbody>
            <tr>
              <th>货品金额合计:</th>
              <td>{totalDesc?.goodsAmount || ' 0'}</td>
              <th>头运费:</th>
              <td>{totalDesc?.calcFreightRespVo?.headFreight || '0'}</td>
              <th>国际运费:</th>
              <td>{totalDesc?.calcFreightRespVo?.interFreight || '0'}</td>
              <th>关税:</th>
              <td>{totalDesc?.calcFreightRespVo?.tariff || '0'}</td>
            </tr>
            <tr>
              <th>运费总计:</th>
              <td>{totalDesc?.calcFreightRespVo?.totalFreight || '0'}</td>
              <th>总计金额含税:</th>
              <td>{totalDesc?.amount || '0'}</td>
              {/* // 以下两个字段不同接口 不同返回需注意 */}
              <th>总计金额未税:</th>
              <td>{totalDesc?.amountNet || '0'}</td>
              <th>折扣总计:</th>
              <td>{totalDesc?.totalDiscount || '0'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TotalDesc;
