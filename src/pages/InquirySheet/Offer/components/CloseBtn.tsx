import { CloseCircleTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useModel } from 'umi';

interface IProps {
  type: number | string;
}

const CloseBtn: React.FC<any> = (props: IProps) => {
  const { destroyCom } = useModel('tabSelect');
  const reBack = () => {
    const { type } = props;
    const lastPath = type ? '/inquiry/csp-offer' : '/inquiry/offer';
    destroyCom(lastPath, location.pathname);
  };
  return (
    <div
      style={{
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        height: '30px',
        textAlign: 'end',
        backgroundColor: '#fff',
        paddingRight: '10px',
        paddingBottom: '10px',
      }}
    >
      <Button size="small" key={'关闭'} icon={<CloseCircleTwoTone />} onClick={reBack}>
        {' '}
        关闭{' '}
      </Button>
    </div>
  );
};

export default CloseBtn;
