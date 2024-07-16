import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { queryListDataMap } from '@/services';
const Uom: React.FC = ({ onChange, value, disabled = false, isProductOil }: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    queryListDataMap(['uom']).then((res: any) => {
      if (res.errCode === 200) {
        if (isProductOil == 1) {
          const newData: any = [];
          res?.data?.uom?.forEach((item: any) => {
            if (['G', 'GLL', 'KG', 'L', 'LB', 'ML', 'OZ', 'QT', 'TON'].includes(item.key)) {
              const source: any = item;
              newData.push(source);
            }
          });
          setList(newData);
        } else {
          setList(res.data.uom);
        }
      }
    });
  }, [isProductOil]);
  const valChange = (val: any) => {
    onChange(val);
  };
  return (
    <Select
      showSearch
      onChange={valChange}
      value={value}
      disabled={disabled}
      filterOption={(input, option) =>
        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
      }
    >
      {list &&
        list.map((item: any) => (
          <Select.Option value={`${item.key}_${item.value}`} key={item.key}>
            {item.value}
          </Select.Option>
        ))}
    </Select>
  );
};
export default Uom;
