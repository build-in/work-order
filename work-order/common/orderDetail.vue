<template>
  <div class="order-detail-content">
    <ul>
      <li>
        <span><d2-icon name="tag" class="tag icontag" /></span>
        <span class="title">{{ $t('workOrderInfo.transactionStatus') }}</span>
        <span v-if="info && info.tradeStatus" :class="['content', language === 'cn' ? '' : 'addLeft']">
          <div :class="['defaultClass', getStatusClass(info.tradeStatus)]">{{ setStatus(info.tradeStatus, language) }}</div>
        </span>
        <span v-else :class="['content', language === 'cn' ? '' : 'addLeft']"> - </span>
      </li>
      <li class="money-set">
        <div><d2-icon name="Balance" class="Balance icontag" /></div>
        <div class="title">{{ $t('workOrderInfo.amountOfMoney') }}</div>
        <div :class="['content','county-only',language === 'cn' ? '' : 'addLeft']">
          <div v-if="info && info.country" class="county-only-content">
            <country :show-country-name="false" :country-code="info.country" />
          </div>
          <div v-if="info && info.tradeAmount && info.tradeCurrency">{{ $util.string.amountFormat(info.tradeAmount, info.tradeCurrency, true) }}</div>
        </div>
      </li>
      <li>
        <span><d2-icon name="calendar1" class="calendar1" /></span>
        <span class="title">{{ $t('workOrderInfo.creationTime') }}</span>
        <span v-if="info && info.tradeCreateTime" :class="['content', language === 'cn' ? '' : 'addLeft']">{{ info.tradeCreateTime | formateDate }}</span>
        <span v-else :class="['content', language === 'cn' ? '' : 'addLeft']"> - </span>
      </li>
      <li>
        <span><d2-icon name="iconlocation" class="iconlocation icontag" /></span>
        <span class="title">{{ $t('workOrderInfo.countryRegion') }}</span>
        <span v-if="info && info.country" :class="['content', language === 'cn' ? '' : 'addLeft']">{{ $util.string.mappingState($t('common.countryList'), info.country) }}</span>
        <span v-else :class="['content', language === 'cn' ? '' : 'addLeft']"> - </span>
      </li>
      <!-- <li>
        <span class="order-detail" @click="goOrder">订单详情</span>
      </li> -->
    </ul>
  </div>
</template>

<script>
import datetime from '@/libs/util.datetime';
import { STATUS } from '../const/index';
import { mapState } from 'vuex';
import Country from '@/components/country';
export default {
  name: 'OrderDetail',
  components: {
    Country
  },
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    info: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('d2admin/profile', [
      'language',
    ]),
  },
  watch: {
  },
  created() {
  },
  methods: {
    goOrder() {
      console.log('3456');
    },
    setStatus(text, language) {
      const current = STATUS.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEnNew;
      }
    },
    getStatusClass(status = '') {
      switch (status) {
        case 'PROCESS':
          return 'PROCESS';
        case 'FINISHED':
          return 'FINISHED';
        case 'FAILED':
          return 'FAILED';
        case 'SUCCESS':
          return 'SUCCESS';
        case 'CLOSED':
          return 'CLOSED';
        case 'REFUND':
          return 'REFUND';
        default:
          return;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.order-detail-content {
  .icontag{
    color: rgba(157, 162, 167, 1);
  }
  .calendar1{
    color: rgba(157, 162, 167, 1);
  }
  ul {
    margin-left: -40px;
    margin-bottom: 28px;
    font-family: Poppins;

    li {
      list-style: none;
      margin-bottom: 12px;
      position: relative;

      .country-side {
        .country-side-tradeAmount {
          color: rgba(0, 0, 0, 1);
          font-size: 14px;
          margin-top: -12px;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      .title {
        margin-left: 3.5px;
        color: rgba(114, 120, 128, 1);
        font-size: 14px;
      }

      .content {
        position: absolute;
        left: 0;
        margin-left: 136px;
        color: rgba(0, 0, 0, 1);
        font-size: 14px;
        .defaultClass{
          padding: 2px 8px;
          border-radius: 14px;
          // margin-top: -1px;
        }
        .PROCESS{
          color: #FB9701;
          background: #FFF1D7;
        }
        .FINISHED{
          color: rgba(0, 195, 82, 1);
          background: rgba(230, 249, 239, 1);
        }
        .FAILED{
          color: #F44444;
          background: #FAEBEC;
        }
        .SUCCESS{
          color: #00C352;
          background: #E6F9EF;
        }
        .CLOSED{
          color: #727880;
          background: #EAEAEA;
        }
        .REFUND{
          color: #727880;
          background: #EAEAEA;
        }
        .country-side-tradeAmount{
          margin-left: 5px;
          margin-right: 5px;
          margin-top: -6px;
        }
        .tradeCurrency{
          margin-top: -6px;
        }
      }
      .addLeft{
        margin-left: 160px;
      }
      .county-only{
        display: flex;
      }
      .county-only-content{
        display: flex;
        align-items: center;
      }

      .order-detail {
        color: rgba(55, 130, 255, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .money-set{
      display: flex;
      align-items: center;
    }
  }
}
</style>
