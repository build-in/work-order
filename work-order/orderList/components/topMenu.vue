<template>
  <div class="top-menu">
    <!-- Swiper -->
    <div v-if="headerMenuList.length > 9" class="swiper-button-prev" @click="goPre" />
    <div :class="['swiper-container', (headerMenuList.length < 10 ? 'swiper-no-swiping':'')]">
      <div class="swiper-wrapper">
        <div v-for="(item,index) in headerMenuList" :class="['swiper-slide', (currentIndex === index ? 'activeBtn':''),((headerMenuList && headerMenuList.length) > 9 ? '':'defaultWidth')]" :key="index" @click="clickMenuItem(item,index)">
          <div class="swiper-slide-container">
            <div class="swiper-slide-title">{{ item.name }}</div>
            <div class="swiper-slide-content">
              <div>{{ item.status }}</div>
              <div v-if="item.des">{{ item.des || '' }} {{ item.time || '' }} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="headerMenuList.length > 9" class="swiper-button-next" @click="goNextPage" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Swiper from 'swiper';
import '@/assets/style/swiper.min.css';

export default {
  name: 'TopMenu',
  filters: {
    beyondHiding(value) {
      const regex = /[\u4e00-\u9fa5]/g;
      if (!value) return '';
      if (regex.test(value)) {
        if (value.length > 7) {
          return value.substring(0, 5) + '...';
        } else {
          return value;
        }
      } else {
        if (value.length > 10) {
          return value.substring(0, 8) + '...';
        } else {
          return value;
        }
      }
    }
  },
  props: {
    handleSelectMenu: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      swiper: null,
      currentIndex: 0,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapGetters([
      'language',
    ]),
    headerMenuList() {
      return [{
        name: '孙悟空',
        status: 1,
      }, {
        name: '孙悟空2',
        status: 2,
        des: '较上个月',
        time: 50
      }, {
        name: '孙悟空3',
        status: 1,
      }, {
        name: '孙悟空4',
        status: 3,
        des: '大家可能就'
      }, {
        name: '孙悟空5',
        status: 1,
      }, {
        name: '孙悟空6',
        status: 1,
      }, {
        name: '孙悟空7',
        status: 11,
      }, {
        name: '孙悟空8',
        status: 1,
        des: '平均响应时常',
        time: 80
      }, {
        name: '孙悟空9',
        status: 1,
      }, {
        name: '孙悟空10',
        status: 12,
      }, {
        name: '孙悟空11',
        status: 1,
        des: '大家可能得我就测九年级可男可女缴纳哦就弄v额靓女呢哦法令纹'
      }, {
        name: '孙悟空12',
        status: 14,
      }];
    },
  },
  mounted() {
    this.initSwiper();
  },
  methods: {
    initSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        // 在这里配置Swiper选项，例如自动播放、分页器、导航等
        loop: false,
        speed: 50,
        noSwiping: true,
        mousewheel: true,
        slidesPerView: 6,
        spaceBetween: 16,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'my-button-disabled',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        }
      });
    },
    goPre() {
      // 每次跳转10条
      // console.log(this.currentIndex, "前进");
      if (this.currentIndex < 10) {
        this.swiper.slideTo(1);
      } else if (this.currentIndex > 10 <= 20) {
        this.swiper.slideTo(1);
      } else if (this.currentIndex > 20 <= 30) {
        this.swiper.slideTo(10);
      } else {
        return;
      }
      // this.swiper.slidePrev()
    },
    goNextPage() {
      // if(this.currentIndex < 10){
      //    this.swiper.slideTo(10)
      // }else if( 10 < this.currentIndex <= 20){
      //     this.swiper.slideTo(20)
      // }else if( 20 < this.currentIndex <= 30){
      //     this.swiper.slideTo(30)
      // }else{
      //   return;
      // }
      this.swiper.slideNext();
    },
    getQueryVariable() {
      const url = window.location.href;
      if (url.includes('#')) {
        return url.split('#')[0].split('/')[5];
      } else {
        return '';
      }
    },
    clickMenuItem(val, index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top-menu {
    width: 100%;
    height: 85px;
    position: relative;
    // border: 1px solid red;
}

.swiper-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;

}
.swiper-slide {
    text-align: center;
    font-size: 14px;
    height: 85px;
    width: 180px !important;
    cursor: pointer;
    border-radius: 12px;
    background: rgba(245, 237, 253, 1);

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    transition-property: all;
    flex-direction:column;
}
.defaultWidth{
    width:180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.defaultWidthMax{
    width:180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.swiper-slide-container {
    width:100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 24px;
    .swiper-slide-title{
        color: rgba(27, 29, 31, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 12px;
    }
    .swiper-slide-content{
        display: flex;
        color: rgba(27, 29, 31, 1);
        font-family: Poppins-SemiBold;
        font-size: 18px;
        margin-top: 8px;
        :nth-child(2){
            margin-left: 16px;
            padding: 0px 4px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 1);
            max-width: 129px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: rgba(27, 29, 31, 1);
            font-family: Poppins;
            font-weight: 500;
            font-size: 12px;
            transform: scale(0.9);
        }
    }
}

.swiper-button-next:after, .swiper-button-prev:after {
      font-family: swiper-icons;
      font-size: 12px;
      text-transform: none;
      letter-spacing: 0;
      text-transform: none;
      font-variant: initial;
      line-height: 1;
      color: rgb(114, 120, 128);
      font-weight: 500;
      margin-top: 4px;
}
.swiper-button-next, .swiper-button-prev{
    width: 32px;
    height: 32px;
    border-radius: 32px;
    border: 0.5px solid rgba(234, 234, 234, 1);
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    // background-color: red;
}
.my-button-disabled{
    opacity: 0.3;
}
.swiper-button-prev {
    left: -13px;
    right: auto;
}
.swiper-button-next{
    right: -13px;
    left: auto;
}
</style>