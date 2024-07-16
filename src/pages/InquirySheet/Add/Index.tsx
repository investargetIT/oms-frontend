import React, { useState, useRef, useEffect } from 'react';
import { Space, Card, Button, Modal, message, Spin, Tag } from 'antd';
import BaseInfo from './BaseInfo';
import UploadList from './UploadList';
import InternalCommunication from '@/pages/components/InternalCommunication';
import SkuInfo from './SkuInfo';
import LogInfo from '@/pages/components/LogInfo';
import { history, useParams, useLocation, useModel } from 'umi';
import {
  editSubmitInquiry,
  editDraftInquiry,
  editDetail,
  searchFaTransAstSku,
  copyInquiryInfo,
} from '@/services/InquirySheet';
import ReplaceModal from '../components/ReplaceModal';

const Index: React.FC = () => {
  const { destroyCom } = useModel('tabSelect');
  const pathParams: any = useParams();
  const location: any = useLocation();
  const baseRef = useRef();
  const skuRef = useRef();
  const [spinning, setSpinning]: any = useState(false);
  const [logVisible, setLogVisible]: any = useState(false);
  const [intenarlData, setIntenarlData] = useState([]);
  const [skuData, setSkuData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [customrCode, setCustomrCode] = useState('');
  const [params, setParams]: any = useState({});
  const [pathId, setPathId]: any = useState('');
  const replaceModalRef = useRef({} as any);
  const [repalceList, setRepalceList] = useState<any>([]);
  const [subParams, setSubParams] = useState<any>({});
  useEffect(() => {
    const id: any = pathParams?.id;
    if (id && id !== pathId) {
      //?如果是编辑，或者新增进来的都是有id的，新增没有
      setPathId(id);
    }
    if (!location.state && id) {
      //?如果是编辑页面
      editDetail(id).then((res: any) => {
        if (res.errCode === 200) {
          setParams(res.data);
          setCustomrCode(res.data.customerCode);
        } else {
          message.error(res.errMsg);
        }
      });
    } else if (location.state && location.state.type === 'copy') {
      //?如果是复制页面
      copyInquiryInfo(location.state.id).then((res: any) => {
        if (res.errCode === 200) {
          setParams(res.data.inquiryRespVO);
          setCustomrCode(res.data.inquiryRespVO.customerCode);
        } else {
          message.error(res.errMsg);
        }
      });
    }
  }, [pathParams?.id]);
  const reBack = () => {
    destroyCom('/inquiry/lectotype', location.pathname);
  };
  const getIntenarlData = (val: any) => {
    setIntenarlData(val);
  };
  const getSkuData = (val: any) => {
    if (val) {
      setSkuData(val);
    }
  };
  const getData = (val: any) => {
    setFileData(val);
  };
  const operate = async (type: any, paramsForm: any) => {
    //?1是保存，2是提交
    try {
      setSpinning(true);
      let resd: any = null;
      if (location.state && location.state.type === 'copy') {
        //?如果是复制点击进来的
        paramsForm.sid = params.sid;
      } else if (!location.state && pathParams?.id) {
        //?如果是编辑点进来的
        paramsForm.sid = pathId;
      } else {
        paramsForm.sid = pathId;
      }
      if (type === 1) {
        resd = await editDraftInquiry({ ...paramsForm });
      } else if (type === 2) {
        // 判断接口
        await searchFaTransAstSku('info', { inquiryId: paramsForm.sid }).then(async (res: any) => {
          if (res?.errCode == 200) {
            setSubParams({ ...paramsForm });
            // return
            if (res?.data?.dataList.length > 0) {
              setRepalceList(res?.data?.dataList);
              replaceModalRef?.current?.open();
              //接下来做是否替换操作
            } else {
              resd = await editSubmitInquiry({ ...paramsForm });
            }
          } else {
            message.error(res?.errMsg);
          }
        });
      }
      setSpinning(false);
      if (resd.errCode === 200) {
        message.success('操作成功!');
        if (type === 2) {
          reBack();
        } else if (!pathId) {
          setPathId(resd.data);
        }
      } else {
        Modal.error({ title: resd.errMsg });
      }
    } catch {
      setSpinning(false);
    }
  };
  const onSave = (type: number) => {
    //?1是保存，2是提交
    const baseForm: any = baseRef.current?.getBaseForm;
    if (baseForm) {
      baseForm()
        .then((res: any): any => {
          if (type === 2 && (!res.contactName || !res.expectedReplyTime)) {
            Modal.error({ title: '请检查R3联系人或者期望回复时间是否填写!' });
            return false;
          }
          if (type === 2 && !res.projectName && !res.oppoValue) {
            Modal.error({ title: '商机名称和项目名称至少需要填写一个' });
            return false;
          }
          const paramsForm: any = res;
          paramsForm.chatLogVOList = intenarlData;
          const titMsg = type === 2 ? '确定提交？' : '确定保存？';
          paramsForm.resourceVOList = fileData;
          Modal.confirm({
            title: titMsg,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              setTimeout(() => {
                operate(type, paramsForm);
              }, 500);
              return Promise.resolve();
            },
          });
        })
        .catch(() => {
          Modal.error({ title: '请完善基本信息' });
          // window.scrollY(0)
        });
    }
  };
  const getCustomerCode = (val: any) => {
    setCustomrCode(val);
  };
  return (
    <div className="contentSty" id="inquirySheetAddNewContent">
      <Spin className="pageLoading" tip="加速处理中，请耐心等待" spinning={spinning}>
        <div style={{ backgroundColor: '#fff', padding: '5px' }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            {!pathId || !location.state ? '新增需求单' : ''}
          </div>
          {pathId && !location.state && (
            <div style={{ fontSize: '16px', marginBottom: '5px' }}>
              需求单号：{params.inquiryCode}
              <Tag color="gold" style={{ marginLeft: '10px' }}>
                {params.statusStr}
              </Tag>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              {/* <p>系统评分:0</p> */}
              <div style={{ fontSize: '12px', color: '#999' }}>
                清单条目:
                <span
                  style={{ marginLeft: '5px', fontSize: '13px', fontWeight: '500', color: '#000' }}
                >
                  {skuData?.length}
                </span>
              </div>
            </Space>
            <div>
              {pathId && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    setLogVisible(true);
                  }}
                >
                  查看操作日志
                </Button>
              )}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '10px', marginTop: '10px' }}>
          <Card
            title="需求基本信息"
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <BaseInfo ref={baseRef} params={params} getCustomerCode={getCustomerCode} />
          </Card>
          <Card
            title="清单明细"
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            {/* pathParams.id存在的时候就是复制或者详情进来的，这个时候可以让组件等待params数据出来之后再去渲染dom */}
            {pathParams.id ? (
              params.sid ? (
                <SkuInfo
                  ref={skuRef}
                  params={params}
                  baseInfo={baseRef}
                  itemList={params.itemRespVOList}
                  customerCode={customrCode}
                  getSkuData={getSkuData}
                  setPathId={setPathId}
                />
              ) : null
            ) : (
              <SkuInfo
                ref={skuRef}
                params={params}
                baseInfo={baseRef}
                itemList={params.itemRespVOList}
                customerCode={customrCode}
                getSkuData={getSkuData}
                setPathId={setPathId}
              />
            )}
          </Card>
          <Card
            title="附件"
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <UploadList
              getData={getData}
              sourceData={params.resourceVOList}
              createName={params.createName}
            />
          </Card>
          <Card
            title="内部沟通记录"
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <InternalCommunication
              getIntenarlData={getIntenarlData}
              chatLogVOList={params.chatLogVOList}
            />
          </Card>
        </div>
        <div
          style={{
            position: 'fixed',
            zIndex: 100,
            bottom: '10px',
            right: '10px',
            height: '30px',
            textAlign: 'end',
            backgroundColor: '#fff',
            paddingRight: '10px',
          }}
        >
          <Space>
            <Button
              key={'保存'}
              type="primary"
              onClick={() => {
                onSave(1);
              }}
            >
              保 存
            </Button>
            <Button
              key={'提交'}
              type="primary"
              onClick={() => {
                onSave(2);
              }}
            >
              提 交
            </Button>
            <Button key={'关闭'} onClick={reBack}>
              关闭
            </Button>
          </Space>
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
      </Spin>
      <ReplaceModal
        ref={replaceModalRef}
        id={pathId}
        dataList={repalceList}
        subData={subParams}
        type={1}
      />
    </div>
  );
};

// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
