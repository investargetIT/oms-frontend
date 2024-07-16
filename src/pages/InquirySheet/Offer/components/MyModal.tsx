import { createFromIconfontCN } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import './MyModal.less';
const BasicInfo = ({ codeErrorMsg }: any, Ref: any) => {
  const [visible, setVisible] = useState(false);
  function open() {
    setVisible(true);
  }
  const close = () => {
    setVisible(false);
  };
  useImperativeHandle(Ref, () => ({
    open,
    close,
  }));
  const IconFont = createFromIconfontCN({
    scriptUrl: ['//at.alicdn.com/t/c/font_3607808_kkknfm2naqa.js'],
  });

  return (
    <Modal
      title={
        <>
          <IconFont type="icon-round_close_fill_light-copy" className="CloseIcon" />
          <span className="titleInfo">地址信息已经失效</span>
          {/* <span className="titleInfo">地址信息与CRM不一致，是否更新?</span> */}
        </>
      }
      footer={
        <>
          {/* <Button onClick={reSelect}>重新选择</Button>
          <Button type="primary" onClick={refresh}>
            刷新地址
          </Button> */}
          <Button onClick={() => setVisible(false)} type="primary">
            关闭
          </Button>
        </>
      }
      wrapClassName="addresModal"
      visible={visible}
      keyboard={false}
      closable={false}
    >
      <div className="ModalContent">
        {codeErrorMsg}
        {/* <div>重新选择：从CRM重新选择一个地址信息</div>
        <div>刷新地址：从CRM读取改地址信息，覆盖当前数据</div> */}
      </div>
    </Modal>
  );
};

export default forwardRef(BasicInfo);
