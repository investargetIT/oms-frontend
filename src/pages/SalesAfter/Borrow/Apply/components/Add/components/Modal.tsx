import { addSku } from '@/services/afterSales';
import { Button, Input, message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import './index.less';
const Index = function ({ getData, formRef }: any, ref: any) {
  //?新增弹框的组件
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [textareavalue, setTextareavalue] = useState('');
  const open = (): any => {
    setTextareavalue('');
    if (!formRef?.current?.getFieldsValue(true).customerCode) {
      return message.error('请先选择客户名称');
    }
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };
  // ? 弹框点击下一步
  const handleOk = async () => {
    setLoading(true);
    const res = await addSku({
      skuParams: textareavalue,
      customerCode: formRef?.current?.getFieldsValue(true)?.customerCode,
    });
    if (res.errCode == 200) {
      setLoading(false);
      message.success('操作成功');
      // console.log(res, 'res');
      res?.data?.dataList?.forEach((e: any, index: any) => {
        e.index = index;
      });
      getData(res?.data?.dataList);
    } else {
      setLoading(false);
      return message.error(res.errMsg);
    }
    setLoading(false);
    setVisible(false);
  };
  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  const replacefn = (e: any) => {
    //?文本域改变事件
    //! 只让用户输入规定的英文逗号，回车，或者空格，其他的不允许输入
    setTextareavalue(e.target.value.replace(/[^\a-\z\A-\Z0-9\,\.\ |\n]/g, ''));
  };
  return (
    <Modal
      title="添加SKU"
      centered
      className="borrowModal"
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      width={500}
      style={{ height: '600px' }}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
          确定
        </Button>,
      ]}
    >
      <div className="top">
        <div className="inner">
          <Input.TextArea
            onChange={replacefn}
            value={textareavalue}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div className="bottom">
          {/* <Button onClick={saveSKU} disabled={isdisable} className="SKUsaveBtn">
                保存
              </Button> */}
        </div>
      </div>
      <div className="note">
        <div>1.从系统或本地文件中复制万物集库存号(SKU)和产品数量，粘贴到上方输入框</div>
        <div>2.支持批量输入SKU，每行为一个SKU，每行数据格式如下:</div>
        <div className="blue">万物集库存号 [空格或逗号] 数量</div>
        <div>输入示例：</div>
        <div>1A1234 30</div>
        <div>1A5678,30</div>
      </div>
    </Modal>
  );
};
export default forwardRef(Index);
