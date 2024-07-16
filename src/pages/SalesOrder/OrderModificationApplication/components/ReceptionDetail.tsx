import React, { useState, useEffect } from 'react';
import { Form, Spin, message, Button } from 'antd';
import { PlayCircleOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { getReceptionDetail } from '@/services/SalesOrder';
import './style.less';

interface detailInfo {
  receptionCode?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  const { receptionCode } = props;
  const [basicData, setBasicData]: any = useState({});
  const [load, setLoad] = useState(false);
  const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  useEffect(() => {
    setLoad(true);
    getReceptionDetail(receptionCode)
      .then((res: any) => {
        if (res?.errCode === 200) {
          setBasicData(res?.data);
          setLoad(false);
        } else {
          message.error(res.errMsg);
          setLoad(false);
        }
      })
      .finally(() => {
        return;
      })
      .catch((errorInfo) => {
        message.error(errorInfo, 3);
        setLoad(false);
      });
  }, [receptionCode]);

  function openVoice(url: any) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="form-content-search tabs-detail requestDetail" id="RequestChannel">
      <section className="omsAntStyles">
        <Spin spinning={load}>
          <Form className="has-gridForm" autoComplete="off">
            <div className="content">
              <div className="content1 box">
                <div id="one" className="title">
                  基本信息
                </div>
                <div className="ant-advanced-form three-gridCol ReceptionRecordDetailTopCol">
                  {/*<Form.Item label="接待单号">
                    <span className="form-span">{receptionCode}</span>
                  </Form.Item>*/}
                  <Form.Item label="接待单类型">
                    <span className="form-span">{basicData?.receptionTypeStr}</span>
                  </Form.Item>
                  <Form.Item label="创建人">
                    <span className="form-span">{basicData?.creator}</span>
                  </Form.Item>
                  <Form.Item label="客户号">
                    <span className="form-span">{basicData?.customerCode}</span>
                  </Form.Item>
                  <Form.Item label="客户身份">
                    <span className="form-span">{basicData?.customerIdentity}</span>
                  </Form.Item>
                  <Form.Item label="客户名称">
                    <span className="form-span">{basicData?.customerName}</span>
                  </Form.Item>
                  <Form.Item label="联系人号">
                    <span className="form-span">{basicData?.contactCode}</span>
                  </Form.Item>
                  <Form.Item label="联系人姓名">
                    <span className="form-span">{basicData?.contactName}</span>
                  </Form.Item>
                  <Form.Item label="联系电话">
                    <span className="form-span">{basicData?.tel}</span>
                  </Form.Item>
                  <Form.Item label="任务编号">
                    <span className="form-span">{basicData?.taskCampaignCode}</span>
                  </Form.Item>
                  <Form.Item label="任务分类">
                    <span className="form-span">{basicData?.taskClass}</span>
                  </Form.Item>
                  <Form.Item label="接听类型">
                    <span className="form-span">{basicData?.callResultStr}</span>
                  </Form.Item>
                  <Form.Item label="创建时间">
                    {basicData?.createTime && (
                      <span className="form-span">
                        {moment(basicData?.createTime).format(dateTimeFormat)}
                      </span>
                    )}
                  </Form.Item>
                  <Form.Item label="接待结果" className="fullLineGrid">
                    <span className="form-span wordBreak">{basicData?.receptionResult}</span>
                  </Form.Item>
                </div>
              </div>

              <div className="content3 box">
                <div id="three" className="title">
                  通话记录
                </div>
                {basicData?.url ? (
                  <Button
                    type="primary"
                    style={{ marginTop: '10px' }}
                    icon={<PlayCircleOutlined />}
                    onClick={() => {
                      openVoice(basicData?.url);
                    }}
                  >
                    播放录音
                  </Button>
                ) : (
                  <p style={{ margin: '10px 10px', color: '#999' }}>
                    <ExclamationCircleTwoTone style={{ fontSize: '16px' }} />{' '}
                    本接待单没有录音(音频)url
                  </p>
                )}
                {/*<Button type="primary" icon={<PlayCircleOutlined />} 
									onClick={() => {
									  clickVoice();
									}}
								>播放录音</Button>
                {basicData?.url && (
                  <Space>
                    <p style={{ marginTop: '5px', color: '#999' }}>播放录音:</p>
                    <audio
                      id="play"
                      media-player="audioPlayer"
                      style={{ height: '35px', marginTop: '5px',  }}
                      controls="controls"
                      src={basicData?.url}
                      crossOrigin="anonymous"
                      preload="auto"
                    ></audio>
                  </Space>
                )}*/}

                <div className="ant-advanced-form three-gridCol ReceptionRecordDetailTopCol">
                  {/*
                  {basicData?.url && (
                    <Form.Item label="播放录音" className="fullLineGrid labelMarginTop">
                      <span className="form-span">
                        <audio
                          id="play"
                          media-player="audioPlayer"
                          style={{ height: '35px', marginTop: '5px' }}
                          controls="controls"
                          src={
                            'https://test-img.mymro.cn/audio/202211/554915863292096C134023291.wav'
                          }
                          crossOrigin="anonymous"
                          preload="auto"
                        ></audio>
                      </span>
                    </Form.Item>
                  )}
									*/}

                  <Form.Item label="Call-ID">
                    <span className="form-span">{basicData?.callId}</span>
                  </Form.Item>
                  <Form.Item label="主叫">
                    <span className="form-span">{basicData?.caller}</span>
                  </Form.Item>
                  <Form.Item label="被叫">
                    <span className="form-span">{basicData?.called}</span>
                  </Form.Item>
                  <Form.Item label="原始被叫">
                    <span className="form-span">{basicData?.trunkCalled}</span>
                  </Form.Item>
                  <Form.Item label="呼叫方向">
                    <span className="form-span">{basicData?.callTypeStr}</span>
                  </Form.Item>
                  <Form.Item label="开始日期">
                    {basicData?.startDate && (
                      <span className="form-span">
                        {moment(basicData?.startDate).format(dateFormat)}
                      </span>
                    )}
                  </Form.Item>
                  <Form.Item label="开始时间">
                    <span className="form-span">{basicData?.startTime}</span>
                  </Form.Item>
                  <Form.Item label="结束日期">
                    {basicData?.endDate && (
                      <span className="form-span">
                        {moment(basicData?.endDate).format(dateFormat)}
                      </span>
                    )}
                  </Form.Item>
                  <Form.Item label="结束时间">
                    <span className="form-span">{basicData?.endTime}</span>
                  </Form.Item>
                  <Form.Item label="响铃时长">
                    <span className="form-span">{basicData?.lenRing}</span>
                  </Form.Item>
                  <Form.Item label="通话时长">
                    <span className="form-span">{basicData?.lenTalk}</span>
                  </Form.Item>
                  <Form.Item label="坐席姓名">
                    <span className="form-span">{basicData?.staffName}</span>
                  </Form.Item>
                  <Form.Item label="CTI工号">
                    <span className="form-span">{basicData?.ctiAccount}</span>
                  </Form.Item>
                  <Form.Item label="分机号">
                    <span className="form-span">{basicData?.ext}</span>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </Spin>
      </section>
    </div>
  );
};
export default Index;
