// import { betterDisplay } from '@/libs/util.string';
import datetime from '@/libs/util.datetime';
// import Country from '@/components/country';
// import TableAmount from './components/tableAmount';
// import StatusTag from './components/status-tag';
import { TYPE, PROBLEM_TYPE, STATUS } from '../const/index';
// import HoverTip from '../common/hoverTip.vue';
// import HoverTip from '@/components/mmc-text-hover';

function getAcronym(word) {
  if (!word) return '';
  return word[0].toUpperCase();
}

// 设置问题类型
const setRoleWights = (text, language) => {
  const current = PROBLEM_TYPE.find(item => item.nameEn === text) || {};
  if (language === 'cn') {
    return current.name;
  } else {
    return current.nameEnNew;
  }
};

// 工单类型
const setWorkType = (text, language) => {
  const current = TYPE.find(item => item.nameEn === text) || {};
  if (language === 'cn') {
    return current.name;
  } else {
    return current.nameEnNew;
  }
};

// 工单状态
const setStatus = (text, language) => {
  const current = STATUS.find(item => item.nameEn === text) || {};
  if (language === 'cn') {
    return current.name;
  } else {
    return current.nameEnNew;
  }
};

export const paymentSearchColumns = [
  {
    props: 'merchant',
    labelKey: 'workOrderInfo.workOrder',
    minWidth: 400,
    render(h, row) {
      let type = '';
      if (row.type == 'TRADE') {
        type = setWorkType(row.type, this.language) || '';
      } else {
        type = setRoleWights(row.problemType, this.language) || '';
      }
      return <div>
        {row.description && <el-tooltip class='item' effect='dark' content= {row.description} placement='top-start'>
          <div style='font-size: 14px;color: #1a1c21;'>
            <span>{ row.description.substring(0, 40)}</span>
            { row.description.length > 40 && <span>...</span>}
          </div>
        </el-tooltip>}
        <div style='font-size: 12px; font-weight: 400;color: #727880'>
          {/* {row.inputOrderNo && <span>
            <span>{type}</span>
            <span>-</span>
          </span>} */}
          <span>{row.inputOrderNo}</span>
        </div>
      </div>;
    }
  },
  // {
  //   // 工单类型
  //   prop: 'type',
  //   labelKey: 'workOrderInfo.workOrderType',
  //   minWidth: 130,
  //   render(h, row) {
  //     const type = setWorkType(row.type, this.language) || '';
  //     return <div>
  //       <div>{type || '-'}</div>
  //     </div>;
  //   }
  // },
  // // 问题类型
  // {
  //   prop: 'problemType',
  //   labelKey: 'workOrderInfo.problemType',
  //   minWidth: 130,
  //   render(h, row) {
  //     const type = setRoleWights(row.problemType, this.language) || '';
  //     return <div>
  //       <div>{type || '-'}</div>
  //     </div>;
  //   }
  // },
  {
    // 工单状态
    prop: 'status',
    labelKey: 'workOrderInfo.workOrderStatus',
    minWidth: 180,
    render(h, row) {
      const type = setStatus(row.status, this.language) || '';
      return <div>
        {row.status == 'PROCESS' && <div style='color: rgba(251, 151, 1, 1);padding: 4px 12px;border-radius: 14px;background: rgba(255, 241, 215, 1);'>{type || '-'}</div>}
        {row.status == 'FINISHED' && <div style='color: rgba(0, 195, 82, 1);padding: 4px 12px;border-radius: 14px;background: rgba(230, 249, 239, 1);'>{type || '-'}</div>}
      </div>;
    }
  },
  {
    // 创建时间
    prop: 'createTime',
    labelKey: 'workOrderInfo.creationTime',
    formatType: 'time',
    formatConfig: {
      formatter: datetime.formatUtcToZoneTime
    },
    minWidth: 180,
  },
  // 完成时间
  {
    prop: 'finishTime',
    labelKey: 'workOrderInfo.completionTime',
    formatType: 'time',
    formatConfig: {
      formatter: datetime.formatUtcToZoneTime
    },
    minWidth: 180,
  },
  {
    // 创建人
    prop: 'creator',
    labelKey: 'workOrderInfo.creator',
    minWidth: 270,
    render(h, row) {
      return <div style='display:flex;justify-content: space-between;align-items: center;'>
        <el-avatar size='small'>{ getAcronym(row.creator) }</el-avatar>
        <div style='marginLeft: 5px;'>{ row.creator }</div>
      </div>;
    }
  },
  {
    // 操作
    prop: 'action',
    labelKey: 'common.action',
    minWidth: 100,
    fixed: 'right',
    render(h, row) {
      return (
        row.status != 'FINISHED' &&
          <el-dropdown onCommand={(command) => this.onCommand(command, row)} >
            <el-button type='text' icon='el-icon-more'/>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='CUI' icon='iconfont iconflash'>
                { this.$t('workOrderInfo.hurryUpPlease') }
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      );
    },
  },
];

