import { Modal, Input, Form, Upload, Row, Col, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import '../Add/add.less';
import { getEnv } from '@/services/utils';
import Cookies from 'js-cookie';
const SkuInfoEdit: React.FC<{
  valueChange?: any;
  params?: any;
  disabled?: boolean;
  pathType?: any;
}> = ({ valueChange, params, disabled, pathType }: any) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [imageBag, setUrlBag] = useState('');
  const [fileList, setFileList] = useState([]);
  const [bagList, setBagList] = useState([]);
  const backParams = (val?: any, image?: any, resourceUrl?: any) => {
    if (val?.target) setProductDesc(val.target.value);
    const nowImg = image === undefined ? imageUrls : image;
    if (valueChange) {
      valueChange({
        productDesc: val?.target?.value,
        imageUrls: nowImg,
        fixedProductUrl: resourceUrl,
      });
    }
  };
  useEffect(() => {
    if (params) {
      const list: any = [];
      let imageList: any = '';
      params?.imageUrls?.split(',').forEach((item: any) => {
        if (item && item != 'undefined') {
          list.push({ url: item });
          imageList += (imageList ? ',' : '') + item;
        }
      });
      if (params.fixedProductUrl) {
        const nameIndex = params.fixedProductUrl.lastIndexOf('/');
        const arr = [
          {
            uid: 1,
            name: params.fixedProductUrl.substr(nameIndex + 1),
            url: params.fixedProductUrl,
            status: 'done',
          },
        ];
        setBagList(arr);
        setUrlBag(params.fixedProductUrl);
      }
      setFileList(list);
      // setImageUrls(params?.imageUrls);
      // backParams({ target: { value: params.productDesc } }, params?.imageUrls);
      setImageUrls(imageList);
      backParams({ target: { value: params.productDesc } }, imageList, params.fixedProductUrl);
      if (params.productDesc) setProductDesc(params.productDesc);
    }
  }, [params]);
  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.response.data.resourceUrl);
    setPreviewVisible(true);
  };
  const handleCancel = () => setPreviewVisible(false);
  const uploadProps: any = {
    name: 'file',
    // action: `${getEnv()}/omsapi/refResource/ignoreName/upload`,
    action: `${getEnv()}/omsapi/refResource/ignoreName/faUpload`,
    showUploadList: true,
    listType: 'picture-card',
    fileList: fileList,
    maxCount: 5,
    data: { name: 'inquirySku' },
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onPreview: handlePreview,
    beforeUpload(file: any) {
      const imgType = file.type.split('/')[1];
      if (file.size / (1024 * 1024) > 5) {
        Modal.error({
          content: '文件大小不能超过5MB!',
        });
        return Upload.LIST_IGNORE;
      } else if (!['jpg', 'jpeg', 'png'].includes(imgType)) {
        Modal.error({
          content: '图片支持格式有：jpg, jpeg, png!',
        });
        return Upload.LIST_IGNORE;
      } else {
        return true;
      }
    },
    onChange(info: any) {
      setFileList(info.fileList);
      let tempUrl = '';
      info.fileList.forEach((item: any) => {
        tempUrl += (tempUrl ? ',' : '') + (item.url || item.response?.data.resourceUrl);
      });
      setImageUrls(tempUrl);
      console.log(tempUrl, 'tempUrl=====');
      backParams({ target: { value: productDesc } }, tempUrl);

      let imageList: any = '';
      tempUrl.split(',').forEach((item: any) => {
        if (item && item != 'undefined') {
          imageList += (imageList ? ',' : '') + item;
        }
      });
      setImageUrls(imageList);
      console.log(imageList, 'tempUrl****');
      backParams({ target: { value: productDesc } }, imageList);
      if (info.file.status === 'error') {
        Modal.error({
          content: '上传错误!',
        });
      }
    },
  };
  const uploadPropsBag: any = {
    name: 'file',
    maxCount: 1,
    fileList: bagList,
    listType: 'picture',
    action: `${getEnv()}/omsapi/refResource/upload`,
    accept: '*',
    disabled: disabled,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onRemove() {
      setUrlBag('');
      backParams({ target: { value: productDesc } }, imageUrls, '');
    },
    onChange(msg: any) {
      setBagList(msg.fileList);
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        const {
          response: { data },
        } = msg.file;
        setUrlBag(data.resourceUrl);
        backParams({ target: { value: productDesc } }, imageUrls, data.resourceUrl);
      } else if (msg.file.status === 'error') {
        setUrlBag('');
      }
    },
  };
  return (
    <div>
      <Form labelWrap>
        <Row>
          <Col span={18}>
            <Form.Item label="SKU图片" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <div>
                <Upload {...uploadProps} disabled={pathType === 'info' ? true : false}>
                  {fileList.length >= 5 ? null : (
                    <div>
                      <PlusOutlined />
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  title={'查看图片'}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img alt="" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
                  支持jpg、jpeg、png格式，每张图片不超过5M，最多5张
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item
              label="定制品图纸"
              name={'fixedProductUrl'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <div>
                <Upload {...uploadPropsBag}>
                  <Button icon={<UploadOutlined />} disabled={disabled}>
                    上传图纸
                  </Button>
                </Upload>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
                  支持支持任意格式的附件，仅可上传一个附件，若有多个附件需求，请打成压缩包后上传
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="商品描述" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Input.TextArea
                disabled={pathType === 'info' ? true : false}
                rows={3}
                value={productDesc}
                showCount
                maxLength={500}
                onChange={backParams}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SkuInfoEdit;
