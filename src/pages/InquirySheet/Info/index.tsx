import React, { useEffect, useState, useRef } from 'react';
import { Space, Card, Tag, Button, message, Modal } from 'antd';
import BaseInfo from './BaseInfo';
import UploadList from '../Add/UploadList';
import InternalCommunication from '@/pages/components/InternalCommunication';
import SkuInfo from './SkuInfo';
import LogInfo from '@/pages/components/LogInfo';
import { history, useLocation, useModel } from 'umi';
import ReturnBtn from '../components/BtnCom/ReturnBtn';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { KeepAlive } from 'react-activation';
import UpdatePrice from './UpdatePrice';
import { inqLnDetail, submitCheck, clarify, startMatch } from '@/services/InquirySheet';
const Index: React.FC = () => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const { destroyCom } = useModel('tabSelect');
  const [params, setParams]: any = useState({});
  const [inquiryId, setInquiryId]: any = useState('');
  const [path, setPath]: any = useState('');
  const [skuTotal, setSkuTotal]: any = useState(0);
  const [logVisible, setLogVisible]: any = useState(false);
  const skuRef = useRef();
  const getInfo = () => {
    setParams({});
    if (pathParams.id) {
      inqLnDetail(pathParams.id).then((res: any) => {
        if (res.errCode === 200) {
          setTimeout(() => {
            setParams(res.data);
          }, 500);
        }
      });
    }
  };
  const pathList = {
    all: '/inquiry/sourcing/all',
    allmatch: '/inquiry/allmatch',
    info: '/inquiry/lectotype',
    ae: '/inquiry/ae',
    te: '/inquiry/te',
    aepcm: '/inquiry/aepcm',
    tepcm: '/inquiry/tepcm',
    quote: '/inquiry/sourcing/quote',
    otherchannel: '/inquiry/sourcing/otherchannel',
    'sourcing-pcm': '/inquiry/sourcing/sourcing-pcm',
    'sourcing-pcd': '/inquiry/sourcing/sourcing-pcd',
    allRFQ: '/inquiry/actualTime/allRFQ',
    RFQquote: '/inquiry/actualTime/RFQquote',
  };
  useEffect(() => {
    if (pathParams?.id) {
      setInquiryId(pathParams.id);
      getInfo();
      const newParams = pathParams?.sorurceType || 'info';
      setPath(newParams);
    }
  }, [pathParams]);
  const onSubmitCheck = () => {
    Modal.confirm({
      title: '确定提交审核?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const resPath: any = path || history.location.pathname.split('/').pop();
        const resd = await submitCheck(resPath, { inquiryId: inquiryId });
        if (resd.errCode === 200) {
          message.success(resd.data);
          history.goBack();
        } else {
          message.error(resd.errMsg);
        }
      },
    });
  };
  const onClarify = (need: boolean) => {
    Modal.confirm({
      title: `确定进行${need ? '需要' : '不需要'}澄清处理?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        clarify({ need, inquiryId: inquiryId }).then((resd: any) => {
          if (resd.errCode === 200) {
            message.success('操作成功!');
            getInfo();
          } else {
            message.error(resd.errMsg);
          }
        });
      },
    });
  };
  const onStartMatch = () => {
    startMatch(inquiryId).then((resd: any) => {
      if (resd.errCode === 200) {
        message.success('操作成功!');
        getInfo();
      } else {
        message.error(resd.errMsg);
      }
    });
  };
  const onOperate = (type: number) => {
    if (type === 1) {
      onSubmitCheck();
    } else if (type === 2) {
      onClarify(true);
    } else if (type === 3) {
      onClarify(false);
    } else if (type === 4) {
      onStartMatch();
    }
  };
  const getInfoTotal = (val: any) => {
    setSkuTotal(val);
  };
  const onBack = () => {
    const newParams = pathParams?.sorurceType || 'info';
    destroyCom(pathList[newParams], `${location.pathname}${newParams}`);
  };
  return (
    // <KeepAlive name={`${location.pathname}${pathParams?.sorurceType}`} saveScrollPosition="screen">
    <div className="contentSty skuInfoContent" id="inquirySheetAddNewContent">
      <div
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            需求单号：{params.inquiryCode}
            <Tag color="gold" style={{ marginLeft: '10px' }}>
              {params.statusStr}
            </Tag>
          </div>
          <Space>
            {/* <p>系统评分:0</p> */}
            <div style={{ fontSize: '12px', color: '#999' }}>
              清单条目:
              <span
                style={{ marginLeft: '5px', fontSize: '13px', fontWeight: '500', color: '#000' }}
              >
                {skuTotal}
              </span>
            </div>
          </Space>
        </div>
        <Space>
          {[200, 40].includes(params.status) && path === 'ae' && (
            <ReturnBtn key={'整单退回'} inquiryId={inquiryId} isOrder={true} />
          )}
          <Button
            size="small"
            type="link"
            onClick={() => {
              setLogVisible(true);
            }}
          >
            查看操作日志
          </Button>
          {path === 'info' && (
            <UpdatePrice
              inquiryId={inquiryId}
              custPurpose={params.custPurpose}
              customerCode={params.customerCode}
              recall={skuRef?.current?.refresh}
            />
          )}
        </Space>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '10px', marginTop: '10px' }}>
        <Card
          title="需求基本信息"
          key="需求基本信息"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <BaseInfo params={params} />
        </Card>
        <Card
          title="清单明细"
          key="清单明细"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <SkuInfo
            ref={skuRef}
            id={inquiryId}
            onlyKey={pathParams?.sorurceType}
            customerCode={params.customerCode}
            custPurpose={params.custPurpose}
            status={params.status}
            getInfoTotal={getInfoTotal}
            recall={() => {
              setInquiryId(pathParams.id);
              getInfo();
            }}
          />
        </Card>
        <Card
          title="附件"
          key="附件"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <UploadList sourceData={params.resourceVOList} />
        </Card>
        <Card
          title="内部沟通记录"
          key="内部沟通记录"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <InternalCommunication id={inquiryId} />
        </Card>
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
          <Space>
            {/* {params.status === 40 && path === 'ae' && (
                <React.Fragment>
                  <Button
                    size="small"
                    key={'需要澄清'}
                    type="primary"
                    onClick={() => {
                      onOperate(2);
                    }}
                  >
                    {' '}
                    需要澄清{' '}
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    key={'不需要澄清'}
                    onClick={() => {
                      onOperate(3);
                    }}
                  >
                    {' '}
                    不需要澄清
                  </Button>
                </React.Fragment>
              )} */}
            {params.status === 40 && path === 'ae' && (
              <React.Fragment>
                <Button
                  size="small"
                  key={'开始选配'}
                  type="primary"
                  onClick={() => {
                    onOperate(4);
                  }}
                >
                  {' '}
                  开始选配{' '}
                </Button>
              </React.Fragment>
            )}
            <Button size="small" key={'关闭'} icon={<CloseCircleTwoTone />} onClick={onBack}>
              {' '}
              关闭{' '}
            </Button>
          </Space>
        </div>
      </div>
      <LogInfo
        showNo={params.inquiryCode}
        id={params.sid}
        title={'需求单操作日志'}
        sourceType={'20'}
        visible={logVisible}
        closed={() => {
          setLogVisible(false);
        }}
      />
    </div>
    // </KeepAlive>
  );
};
export default Index;
