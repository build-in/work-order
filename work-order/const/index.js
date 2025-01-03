export const TYPE = [
  {
    name: '交易问题',
    nameEn: 'TRADE',
    nameEnNew: 'Transaction question'
  },
  {
    name: '咨询问题',
    nameEn: 'CONSULT',
    nameEnNew: 'Consulting question'
  }
];

export const PROBLEM_TYPE = [
  {
    name: '收单',
    nameEn: 'PAYIN',
    nameEnNew: 'Collection',
  },
  {
    name: '出款',
    nameEn: 'PAYOUT',
    nameEnNew: 'Disbursement',
  },
  {
    name: '本地收款',
    nameEn: 'VA',
    nameEnNew: 'Local Receiving Account',
  },
  {
    name: '财务问题咨询',
    nameEn: 'FINANCE',
    nameEnNew: 'Finance related question',
  },
  {
    name: '产线问题咨询',
    nameEn: 'PRODUCTION',
    nameEnNew: 'Production line related question',
  },
  {
    name: '投诉与建议',
    nameEn: 'COMPLAIN',
    nameEnNew: 'Complaints and suggestions',
  },
  {
    name: '商户平台操作问题',
    nameEn: 'MMC',
    nameEnNew: 'Merchant platform question',
  },
  {
    name: '技术对接问题',
    nameEn: 'API',
    nameEnNew: 'Technical integration question',
  },
  {
    name: '其他',
    nameEn: 'OTHER',
    nameEnNew: 'Others',
  },

];

export const STATUS = [
  {
    name: '处理中',
    nameEn: 'PROCESS',
    nameEnNew: 'In progress',
  },
  {
    name: '已完成',
    nameEn: 'FINISHED',
    nameEnNew: 'Completed',
  },
  {
    name: '交易失败',
    nameEn: 'FAILED',
    nameEnNew: 'Deal failed',
  },
  {
    name: '交易成功',
    nameEn: 'SUCCESS',
    nameEnNew: 'Successful transaction',
  },
  {
    name: '支付关闭',
    nameEn: 'CLOSED',
    nameEnNew: 'Pay off',
  },
  {
    name: '退票',
    nameEn: 'REFUND',
    nameEnNew: 'To refund a ticket',
  },
];

export const SCORE = [
  {
    name: '不满意',
    nameEn: '0',
  },
  {
    name: '满意',
    nameEn: '1',
  },
  {
    name: '太赞了',
    nameEn: '2',
  }
];

export const UPLOAD_TYPE = '.png,.jpeg,.gif,.pdf,.jpg,.JPG,.xls,.xlsx,.csv,.doc,.docx,.txt,.mp4,.avi,.mkv,.wmv,.zip,.rar';
export const IMAGE_UPLOAD_TYPE = ['.png', '.jpeg', '.gif', '.gif', '.jpg', '.JPG', '.JPEG'];
export const DEFAULT_UPLOAD_IMAGE = 'https://sg-pay-private-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/src/mmc/test/upload/workOrder/20240530/07ba4e3ca69e4d75928dac6fddd3229a/file2.png';

export const Technology = 'T';
export const Commercial = 'M';