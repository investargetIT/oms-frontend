import { Checkbox,Row, Col, Popover, Tooltip, Tree } from 'antd';
import React, { useState, useEffect } from 'react';
import { SettingOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import type { TreeProps, DataNode } from 'antd/es/tree';
import styles from './index.less';

const Sorttable = ({items, sortEnd, moveCol}) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const onCheck = (checkedKeysValue: React.Key[]) => {
    let arr = items.map(e => {
      return {
        ...e,
        show: checkedKeysValue.includes(e.dataIndex)
      }
    })
    sortEnd(arr)
    setCheckedKeys(checkedKeysValue);
  };

  useEffect(() => {
    const list = items.filter(e => e.show !== false)
    const keys = list.map(e => e.dataIndex)
    setCheckedKeys(keys)
  }, [items]);

  const onDrop: TreeProps['onDrop'] = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].dataIndex === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...items];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    sortEnd(data)
  };
  return <Tree
  className="draggable-tree"
  draggable
  checkable
  blockNode
  onDrop={onDrop}
  height={230}
  onCheck={onCheck}
  checkedKeys={checkedKeys}
  style={{width: '200px'}}
  titleRender={(data) => {
    return <div className={styles.treeTitle}>
      <div className={styles.ListItemTitle}>{data.title}</div>
      <div className={styles.ListItemOption}>
        <Tooltip title="固定在列首">
          <VerticalAlignTopOutlined style={{padding: '0 5px',color: '#1890ff'}} onClick={() => moveCol(data.dataIndex, 'left')}/>
        </Tooltip>
        <Tooltip title="固定在列尾">
          <VerticalAlignBottomOutlined style={{color: '#1890ff'}} onClick={() => moveCol(data.dataIndex, 'right')}/>
        </Tooltip>
      </div>
    </div>
  }}
  fieldNames={{ title: 'title', key: 'dataIndex' }}
  treeData={items}
/>
}


const SortColumnsTable: React.FC = ({columns, columnsStateAll,onChange}) => {
  const [sortColumns, setSortColumns] = useState([]);
  const [chooseArr, setChooseArr] = useState([]);

  useEffect(() => {
    let data1 = JSON.parse(JSON.stringify(columns))
    let data = data1.filter(e => !e.hideInTable)
    if (columnsStateAll) {
      for(let key in columnsStateAll) {
        data.forEach(e => {
          if (key === '1' && columnsStateAll[key] && !e.dataIndex) {
            e.show = true
            if (columnsStateAll[key].fixed) {
              e.fixed = columnsStateAll[key].fixed
            }
          } else if (e.dataIndex === key) {
            e.show = columnsStateAll[key].show
            if (columnsStateAll[key].fixed) {
              e.fixed = columnsStateAll[key].fixed
            }
          }
        })
      }
    }
    setSortColumns(data)
  }, [columnsStateAll]);

  useEffect(() => {
    let obj = {}
    sortColumns.forEach((e, index) => {
      if (!e.dataIndex) {
        obj[index] = {
          show:e.show,
        }
        if (e.fixed) {
          obj[index]['fixed'] = e.fixed
        }
      } else {
        obj[e.dataIndex] = {
          show:e.show,
        }
        if (e.fixed) {
          obj[e.dataIndex]['fixed'] = e.fixed
        }
      }
    })
    onChange(obj)
  }, [chooseArr]);

  const moveCol = (key:string,pos: string) => {
    let data = sortColumns
    let index = sortColumns.findIndex(e => e.dataIndex === key)
    data[index].fixed = pos
    data[index].show = true
    setSortColumns(data)
    let selected = data.filter(e => e.show)
    setChooseArr(selected)
  }
  const changeOne = (e, key) => {
    let data = sortColumns
    let index = sortColumns.findIndex(e => e.dataIndex === key)
    data[index].show = e.target.checked
    let selected = data.filter(e => e.show)
    setChooseArr(selected)
    setSortColumns(data)
  }
  const sortEnd = (cols) => {
    let topArr = sortColumns.filter((item) => item.fixed == 'left')
    let bottomArr = sortColumns.filter((item) => item.fixed == 'right')
    let newArr = [...topArr, ...cols, ...bottomArr]
    let selected = newArr.filter(e => e.show)
    setChooseArr(selected)
    setSortColumns(newArr)
  }

  const changeAll = (e) => {
    let data = [...sortColumns]
    const keys = data.map(ele => {
      return {
        ...ele,
        show: e.target.checked
      }
    })
    setSortColumns(keys)
    if (e.target.checked) {
      setChooseArr(keys)
    } else {
      setChooseArr([])
    }
    
  }
  const getHeader = () => {
    return (
      <Row type="flex" justify="space-between">
        <Col>
          <Checkbox
            onChange={changeAll}
            indeterminate={
              chooseArr.length < sortColumns.length && sortColumns.length
            }
            checked={chooseArr.length === sortColumns.length}
          >
            列展示
          </Checkbox>
        </Col>
        {/* <a onClick={reset}>重置</a> */}
      </Row>
    );
  };
  const getContent = () => {
    const sorttableOper = {
      items: sortColumns && sortColumns.filter((item) => !['left', 'right'].includes(item.fixed)),//过滤固定列
      sortEnd: (cols) => sortEnd(cols),
      moveCol:(key:string, pos: string) => moveCol(key,pos)
    };
    return (
      <div className="set_con">
        <div className="top_con">
          {getDom('left')}
        </div>
        <div className="center_con">
          <div className="fix_title">不固定</div>
          <Sorttable {...sorttableOper} />
        </div>
        <div className="top_con">
          {getDom('right')}
        </div>
      </div>
    );
  }

  const getDom = (type = 'left') => {
    const lArr = sortColumns && sortColumns.filter((item) => item.fixed == type)
    return lArr && lArr.length > 0 ? (<> <div className="fix_title">固定在{type == 'left' ? '左' : '右'}侧</div>{lArr.map((_item) => (
      <Row
        key={_item.title}
        type="flex"
        justify="space-between"
        style={{padding: '2px 0 2px 10px'}} 
        className="set_block">
        <Checkbox
          disabled={_item.title == '操作'}
          checked={_item.show}
          onChange={(e) => changeOne(e, _item.dataIndex)}>
          {_item.title}
        </Checkbox>
        {_item.title != '操作' && <Col>
          <Tooltip title="不固定">
            <VerticalAlignMiddleOutlined style={{color: '#1890ff',fontSize:'14px'}} onClick={() => moveCol(_item.dataIndex, '')} />
          </Tooltip>
        </Col>}
      </Row>

    ))}</>) : null;
  };

  return <Popover
    className={styles.commonLineSty}
    placement="bottomRight"
    title={getHeader()}
    content={getContent()}
    trigger="click">
    <Tooltip placement="top" title="列设置">
      <SettingOutlined style={{fontSize: '16px'}}/>
    </Tooltip>
  </Popover>
}

export default SortColumnsTable