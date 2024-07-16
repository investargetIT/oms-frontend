import { Modal, Button, Select, message } from 'antd';
import { useState, forwardRef, useImperativeHandle } from 'react';
const { Option } = Select;
import { getRegionList, saveWareHouseRegion, saveWareHouseMapping } from '@/services/SalesOrder';
const Index = function ({ houseInfo, fn, fn2 }: any, ref: any) {
  const [visible, setVisible] = useState(false);
  const [akey, setAkey] = useState('');
  const [state, setState] = useState('');
  const [region, setRegion] = useState([]); //?存储服务地区编号
  const [cityInfo, setCityInfo]: any = useState([]);
  const [WareCode, setWareCode]: any = useState([]);

  const open = async (e: any, cityInf: any) => {
    setState(e);
    setVisible(true);
    console.log(cityInf);
    if (cityInf?.length > 0) {
      const arr = cityInf.filter((item: any) => {
        return item.wareName !== houseInfo.wareName;
      });
      setCityInfo(arr);
    }
  };
  const close = () => {
    setVisible(false);
  };
  // ? 弹框点击下一步
  const handleOk = async () => {
    if (state == 'serve') {
      const res = await saveWareHouseRegion({
        wareCode: houseInfo.wareCode,
        regionCode: akey,
      });
      if (res.errCode === 200) {
        message.success('添加成功');
        setVisible(false);
        fn(); //?刷新表格
      } else {
        message.error(res.errMsg);
        setVisible(false);
      }
    } else {
      const res = await saveWareHouseMapping({
        wareCode: houseInfo.wareCode,
        backUpWareCode: WareCode,
        // backUpWareCode: houseInfo.wareCode,
        // wareCode: WareCode,
        level: 1,
      });
      if (res.errCode === 200) {
        message.success('添加成功');
        setVisible(false);
        fn2(); //?刷新表格
      } else {
        message.error(res.errMsg);
        setVisible(false);
      }
    }
    // console.log(res, 123);
  };
  const onChange = (e: any) => {
    setAkey(e);
    console.log(e);
  };
  const onChange2 = (e: any) => {
    setWareCode(e);
  };

  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  const onFocus = async () => {
    const res = await getRegionList({
      // parentId: 'region',
    });
    if (res.errCode === 200) {
      setRegion(res.data?.dataList);
    } else {
      message.error('获取区域失败');
    }
  };
  return (
    <div>
      <Modal
        title="添加服务范围"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={500}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        {state === 'serve' && <div>请选择省份</div>}
        {state === 'add' && <div>请选仓库</div>}
        {state === 'serve' && (
          <Select
            showSearch
            style={{ width: '90%', margin: '0 auto' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
          >
            {region.map((item: any) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        )}
        {state === 'add' && (
          <Select
            showSearch
            style={{ width: '90%', margin: '0 auto' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={onChange2}
          >
            {cityInfo.map((item: any) => {
              return (
                <Option value={item.wareCode} key={item.wareCode}>
                  {item.wareName}
                </Option>
              );
            })}
          </Select>
        )}
      </Modal>
    </div>
  );
};
export default forwardRef(Index);
