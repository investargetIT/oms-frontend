import React from 'react';
import './table.less';
interface TotalDescProps {
  totalDesc: Record<any, any>;
  type?: string;
}

const TotalDesc: React.FC<TotalDescProps> = ({ totalDesc }) => {
  const {
    goodsTaxTotalPrice = '0',
    headFreightPrice = '0',
    intlFreightPrice = '0',
    tariffPrice = '0',
    freightTotalPrice = '0',
    taxTotalPrice = '0',
    noTaxTotalPrice = '0',
  } = totalDesc;
  return (
    <>
      {/*<Descriptions
				title=""
				bordered
				column={4}
				size="small"
				className="pr-desc-cust"
			>
				<Descriptions.Item label="货品金额含税">
					{info?.scrapOrderResVO?.goodsTaxTotalPrice}
				</Descriptions.Item>
				<Descriptions.Item label="头运费">
					{info?.scrapOrderResVO?.headFreightPrice}
				</Descriptions.Item>
				<Descriptions.Item label="国际运费">
					{info?.scrapOrderResVO?.intlFreightPrice}
				</Descriptions.Item>
				<Descriptions.Item label="关税">
					{info?.scrapOrderResVO?.tariffPrice}
				</Descriptions.Item>
				<Descriptions.Item label="运费总计">
					{info?.scrapOrderResVO?.freightTotalPrice}
				</Descriptions.Item>
				<Descriptions.Item label="总计金额含税">
					{info?.scrapOrderResVO?.taxTotalPrice}
				</Descriptions.Item>
				<Descriptions.Item label="总计金额未税">
					{info?.scrapOrderResVO?.noTaxTotalPrice}
				</Descriptions.Item>
			</Descriptions>*/}
      <div className="jerryLangDetail">
        <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
          <tbody>
            <tr>
              <th>货品金额含税:</th>
              <td>{goodsTaxTotalPrice}</td>
              <th>头运费:</th>
              <td>{headFreightPrice}</td>
              <th>国际运费:</th>
              <td>{intlFreightPrice}</td>
              <th>关税:</th>
              <td>{tariffPrice}</td>
            </tr>
            <tr>
              <th>运费总计:</th>
              <td>{freightTotalPrice}</td>
              <th>总计金额含税:</th>
              <td>{taxTotalPrice}</td>
              <th>总计金额未税:</th>
              <td>{noTaxTotalPrice}</td>
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
