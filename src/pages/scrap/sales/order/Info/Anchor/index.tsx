import { useEffect } from 'react';
// import smoothscroll from 'smoothscroll-polyfill';
// smoothscroll.polyfill();
// import Mytable from '../Table/Table';
import './style.less';

export default function Index(props: any) {
  // const [isClick, setIsClick] = useState(false); //? 是否点击了左侧，从而禁止滚动事件的触发
  const { children } = props;
  const addActive = (e: number) => {
    //? 调用之后控制高亮
    const detail: any = document.querySelector('.Anchorbox');
    for (let i = 0; i < detail.children.length; i++) {
      detail.children[i].classList.remove('active');
    }
    detail.children[e].classList.add('active');
  };
  const scrollIntoView = (dom: any, e: any) => {
    // setIsClick(true);
    const sub: HTMLAllCollection = dom.target.parentNode.children;
    for (let i = 0; i < sub.length; i++) {
      sub[i].classList.remove('active');
    }
    dom.target.classList.add('active');
    const eleTop: any = document.querySelector(`#${e}`); //? 获取到元素距离顶部的距离
    const distance: number = eleTop.offsetTop;
    const content: any = document.querySelector('#scroll-content');
    content.scrollTo({ top: distance }); //? 让父元素滚动到对应的距离
    // setIsClick(false);
    // switch (e) {
    //   case 'one':
    //     slide(0, 0);
    //     break;
    //   case 'two':
    //     slide(50, 1);
    //     break;
    //   case 'three':
    //     slide(100, 2);
    //     break;
    //   case 'four':
    //     slide(150, 3);
    //     break;
    //   case 'five':
    //     slide(200, 4);
    //     break;
    //   case 'six':
    //     slide(250, 5);
    //     break;
    //   case 'seven':
    //     slide(300, 6);
    //     break;
    //   default:
    //     break;
    // }
    // content.scroll({
    //   top: distance,
    //   left: 0,
    //   behavior: 'smooth',
    // });
  };
  // ? 动画函数（e：dom对象，y：需要移动到的位置，t移动的步数

  // let move: any = null;
  // function slide(y: any, num: number, t = 10) {
  //   const detail: any = document.querySelector('.Anchorbox');
  //   for (let i = 0; i < detail.children.length; i++) {
  //     detail.children[i].classList.remove('active');
  //   }
  //   console.log(2, '为什么不执行2');
  //   const dom: any = document.querySelector('.activeLine');
  //   let top = dom.style.top.replace('px', ''); //当前元素的绝对定位坐标值
  //   // console.log(top, 'top', y - top, 'y - top',(y - Number(top)) / t,'(y - Number(top)) / t');
  //   let step = Number((y - Number(top)) / t);
  //   // console.log(step, 'step', y, 'y');
  //   if (step == 0) return;
  //   //计算x轴每次移动的步长，由于像素点不可用小数，所以会存在一定的误差
  //   clearInterval(move);
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   move = setInterval(function () {
  //     step = Number((y - Number(top)) / t);
  //     // console.log(count, '延时器跑了几次');
  //     //设计定时器
  //     top = dom.style.top.replace('px', ''); //获取每次移动后的绝对定位坐标值
  //     // console.log(top, 'topp', typeof top);
  //     // console.log(Number(top) + step, 'top + step');
  //     dom.style.top = Number(top) + step + 'px';
  //     //如果距离终点距离小于步长，则停止循环并校正最终坐标位置
  //     if (Math.abs(Number(y) - Number(top)) <= Math.abs(step)) {
  //       dom.style.top = y + 'px'; //定位每次移动的位置
  //       addActive(num);
  //       clearInterval(move);
  //       move = null;
  //       setIsClick(false);
  //     }
  //   }, 1);
  // }
  const scroll = () => {
    // if (isClick) return;
    //? 监听滚动位置给予高亮
    const content: any = document.querySelector('#scroll-content');
    const eleTop: any = document.querySelector(`#one`); //? 获取到元素距离顶部的距离
    const distance: number = eleTop.offsetTop;
    const eleTop2: any = document.querySelector(`#two`); //? 获取到元素距离顶部的距离
    const distance2: number = eleTop2.offsetTop;
    const eleTop3: any = document.querySelector(`#three`); //? 获取到元素距离顶部的距离
    const distance3: number = eleTop3.offsetTop;
    const eleTop4: any = document.querySelector(`#four`); //? 获取到元素距离顶部的距离
    const distance4: number = eleTop4.offsetTop;
    const eleTop5: any = document.querySelector(`#five`); //? 获取到元素距离顶部的距离
    const distance5: number = eleTop5.offsetTop;
    const eleTop6: any = document.querySelector(`#six`); //? 获取到元素距离顶部的距离
    const distance6: number = eleTop6.offsetTop;
    const eleTop7: any = document.querySelector(`#seven`); //? 获取到元素距离顶部的距离
    const distance7: number = eleTop7.offsetTop;
    // console.log(content.scrollTop, '我在这里', distance); //?通过打印卷曲度，然后判断下面的高度区间，实现卷曲的同时，左侧的tab栏高亮
    if (content.scrollTop <= distance) {
      addActive(0);
      // slide(0, 0);
    } else if (content.scrollTop > distance && content.scrollTop <= distance2) {
      // console.log(distance2, 'distance');
      // slide(50, 1);
      addActive(1);
    } else if (content.scrollTop > distance2 && content.scrollTop <= distance3) {
      // slide(100, 2);
      addActive(2);
    } else if (content.scrollTop > distance3 && content.scrollTop <= distance4) {
      addActive(3);
      // slide(150, 3);
    } else if (content.scrollTop > distance4 && content.scrollTop <= distance5) {
      // slide(200, 4);
      addActive(4);
    } else if (content.scrollTop > distance5 && content.scrollTop <= distance6) {
      // slide(250, 5);
      addActive(5);
    } else if (content.scrollTop > distance6 && content.scrollTop <= distance7) {
      // slide(300, 6);
      addActive(6);
    } else if (content.scrollTop > distance7) {
      // slide(350, 7);
      addActive(7);
    }
  };
  useEffect(() => {
    const content: any = document.querySelector('#scroll-content');
    if (content) {
      //? 当抽屉组件销毁的时候，防止addEventListener报错
      content.addEventListener('scroll', scroll);
      const detail: any = document.querySelector('.Anchorbox');
      detail.children[0].classList.add('active');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Anchor" id="Anchor">
      <div className="Anchorbox">
        <a onClick={(e) => scrollIntoView(e, 'one')}>基本信息</a>
        <a onClick={(e) => scrollIntoView(e, 'two')}>收货信息</a>
        <a onClick={(e) => scrollIntoView(e, 'three')}>配送及支付</a>
        <a onClick={(e) => scrollIntoView(e, 'four')}>开票信息</a>
        <a onClick={(e) => scrollIntoView(e, 'five')}>发票寄送</a>
        <a onClick={(e) => scrollIntoView(e, 'six')}>商品明细</a>
        <a onClick={(e) => scrollIntoView(e, 'seven')}>附件</a>
        {/* <div className="activeLine" style={{ top: '0' }} /> */}
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
