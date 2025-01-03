<template>
  <div class="pay-card-content">
    <div :class="['pay-card', item.choose ? 'lightBorder' : '']">
      <ul>
        <li>
          <span><d2-icon name="tag" class="tag icontag" /></span>
          <span>{{ $t('workOrderInfo.transactionStatus') }}</span>
          <span :class="[ language === 'cn' ? '' : 'addLeft']">
            
            <div :class="['defaultClass', getStatusClass(item.tradeStatus)]">{{ setStatus(item.tradeStatus, language) }}</div>
          </span>
        </li>
        <li>
          <span><d2-icon name="Balance" class="Balance icontag" /></span>
          <span>{{ $t('workOrderInfo.amountOfMoney') }}</span>
          <span :class="[ language === 'cn' ? '' : 'addLeft']">
            <span>
              <country :show-country-name="false" :country-code="item.country" />
            </span>
            <span class="money-set">{{ $util.string.amountFormat(item.tradeAmount,item.tradeCurrency, true) }}</span>
          </span>
        </li>
        <li>
          <span><d2-icon name="calendar1" class="calendar1" /></span>
          <span>{{ $t('workOrderInfo.creationTime') }}</span>
          <span :class="[ language === 'cn' ? '' : 'addLeft']">{{ item.tradeCreateTime | formateDate }}</span>
        </li>
        <li>
          <span><d2-icon name="iconlocation" class="iconlocation icontag" /></span>
          <span>{{ $t('workOrderInfo.countryRegion') }}</span>
          <span :class="[ language === 'cn' ? '' : 'addLeft']">{{ $util.string.mappingState($t('common.countryList'), item.country) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import datetime from '@/libs/util.datetime';
import { STATUS } from '../const/index';
import { mapState } from 'vuex';
import Country from '@/components/country';
export default {
  name: 'PayCard',
  components: {
    Country
  },
  filters: {
    formateDate(time) {
      return datetime.formatUtcToZoneTime(time);
    }
  },
  props: {
    item: {
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
    setStatus(text, language) {
      const current = STATUS.find(item => item.nameEn === text) || {};
      if (language === 'cn') {
        return current.name;
      } else {
        return current.nameEn;
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'PROCESS':
          return 'PROCESS';
        case 'FINISHED':
          return 'FINISHED';
        case 'FAILED':
          return 'FAILED';
        case 'SUCCESS':
          return 'SUCCESS';
        case 'CLOSE':
          return 'CLOSE';
        case 'REFUND':
          return 'REFUND';
      }
    }
  }
};
</script>

<style scoped lang="scss">
.pay-card-content {
  margin-top: 16px;
  .icontag{
    color: rgba(157, 162, 167, 1);
  }
  .calendar1{
    color: rgba(157, 162, 167, 1);
  }
  .pay-card {
    width: 432px;
    // height: 359px;
    padding: 0px 16px;
    border-radius: 12px;
    border: 2px solid rgba(234, 234, 234, 1);
    box-sizing: border-box;
    cursor: pointer;

    // &:hover{
    //   border: 2px solid rgba(55, 130, 255, 1);
    // }
    ul {
      margin-left: -40px;
      font-family: Poppins;
      box-sizing: border-box;

      li {
        list-style: none;
        margin-bottom: 12px;
        position: relative;
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
        .CLOSE{
          color: #727880;
          background: #EAEAEA;
        }
        .REFUND{
          color: #727880;
          background: #EAEAEA;
        }
        .addLeft{
          margin-left:160px !important;
        }

        &:last-child {
          margin-bottom: 0;
        }

        span {
          &:nth-child(2) {
            margin-left: 3.5px;
            color: rgba(114, 120, 128, 1);
            font-size: 14px;
          }

          &:nth-child(3) {
            position: absolute;
            left: 0;
            margin-left: 136px;
            color: rgba(0, 0, 0, 1);
            font-size: 14px;
          }
        }
        .money-set{
          display: block;
          margin-top: -28px;
          margin-left: 37px !important;
          color: #000 !important;
        }
      }
    }
  }

  .lightBorder {
    border: 2px solid rgba(55, 130, 255, 1);
    background: rgba(236, 243, 255, 1);
  }
}
</style>
