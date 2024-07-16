import { useEffect } from 'react';
// import smoothscroll from 'smoothscroll-polyfill';
// smoothscroll.polyfill();
// import Mytable from '../Table/Table';
import './style.less';
export default function Index(props: any) {
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
    const sub: HTMLAllCollection = dom.target.parentNode.children;
    for (let i = 0; i < sub.length; i++) {
      sub[i].classList.remove('active');
    }
    dom.target.classList.add('active');
    const eleTop: any = document.querySelector(`#${e}`); //? 获取到元素距离顶部的距离
    const distance: number = eleTop.offsetTop;
    const content: any = document.querySelector('#scroll-content');
    content.scrollTo(0, distance); //? 让父元素滚动到对应的距离
    // content.scroll({
    //   top: distance,
    //   left: 0,
    //   behavior: 'smooth',
    // });
  };
  const scroll = () => {
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
    // console.log(content.scrollTop, '我在这里',distance); //?通过打印卷曲度，然后判断下面的高度区间，实现卷曲的同时，左侧的tab栏高亮
    if (content.scrollTop <= distance) {
      addActive(0);
    } else if (content.scrollTop > distance && content.scrollTop < distance2) {
      addActive(1);
    } else if (content.scrollTop > distance2 && content.scrollTop < distance3) {
      addActive(2);
    } else if (content.scrollTop > distance3 && content.scrollTop < distance4) {
      addActive(3);
    } else if (content.scrollTop > distance4 && content.scrollTop < distance5) {
      addActive(4);
    } else if (content.scrollTop > distance5 && content.scrollTop < distance6) {
      addActive(5);
    } else if (content.scrollTop > distance6 && content.scrollTop < distance7) {
      addActive(6);
    } else if (content.scrollTop > distance7) {
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
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'one')}>
          基本信息
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'two')}>
          收货信息
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'three')}>
          配送及支付
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'four')}>
          开票信息
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'five')}>
          发票寄送
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'six')}>
          商品明细
        </a>
        <a style={{ paddingRight: '20px' }} onClick={(e) => scrollIntoView(e, 'seven')}>
          附件
        </a>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
