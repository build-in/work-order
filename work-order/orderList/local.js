export default {
  cn: {
    singleDisbursementManager: {
      keyWordsQuery: '搜索商户订单号、批次号、平台订单号、收款账号',
      signalQuery: '单笔查询',
      batchNo: '批次号',
      status: '订单状态',
      nationAndPaymethod: '支付方式',
      uploadMaterial: '提交材料',
      createdTime: '创建时间',
      completeTime: '完成时间',
      orderId: '订单号',
      platformOrderNumber: '平台付款订单号',
      distributeCountry: '付款国家',
      payMethod: '支付方式',
      txnAmount: '交易金额',
      reason: '失败原因',
      remark: '附言',
      distributeDetail: '付款详情',
      tradingInformation: '交易信息',
      withdrawalCode: '取款码',
      expiredTime: '过期时间',
      channelOrderId: '渠道订单号',
      reminder: '操作提醒',
      deleteTips: '您确定取消该笔出款吗？',
      exchangeRate: '汇率',
      payer: '付款方',
      payerRemit: '付款方汇出',
      payerFee: '付款方手续费',
      payerTax: '付款方税费',
      beneficiaryReceived: '收款方收到',
      payee: '收款方',
      payeeFee: '收款方手续费',
      payeeTax: '收款方税费',
      IFSCode: '银行编码',
      statusReason: '状态描述',
      subMerchantNo: '二级商户标识',
      purpose: '付款目的',
      payeeAccountNo: '收款账号',

      detailTitle: '出款订单详情',
      payoutAmount: '出款金额',
      paymentMethodType: '支付方式类型',
      merchantNo: '商户号',
      targetOrg: '目标机构/卡组',
      timeline: '时间线',
      payoutInfo: '出款信息',

      actions: {
        cancel: '撤销',
        submitMaterial: '提交材料',
        credentialDownload: '凭证下载',
        timeline: '全部时间线',
      },
      statusOption: [
        {
          label: '处理中',
          value: 'PENDING',
          type: 'pending',
          iconName: 'iconclock-linear',
          iconColor: '#FB9701'
        },
        {
          label: '成功',
          value: 'SUCCESS',
          type: 'success',
          iconName: 'icontick-circle-linear',
          iconColor: '#3DBE11'
        },
        {
          label: '失败',
          value: 'FAILED',
          type: 'error',
          iconName: 'iconclose-circle2',
          iconColor: '#F44444'
        },
        {
          label: '退票',
          value: 'REFUND',
          type: 'error',
          iconName: 'iconclose-circle2',
          iconColor: '#F44444',
        }
      ],
      materialOptions: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        },
      ],
      dateOptions: [
        { label: '创建时间', value: 'START' },
        { label: '完成时间', value: 'COMPLETE' }
      ],
      statusMap: {
        PENDING: '处理中',
        SUCCESS: '成功',
        FAILED: '失败',
        REFUND: '退票'
      }
    }
  },
  en: {
    singleDisbursementManager: {
      keyWordsQuery: 'Search for Order ID、Batch Reference、Trade Order ID、Destination Account',
      signalQuery: 'Single Disbursement',
      batchNo: 'Batch Reference',
      status: 'Status',
      nationAndPaymethod: 'Region/Method',
      uploadMaterial: 'Add Documents',
      createdTime: 'Created Time',
      completeTime: 'Completed Time',
      orderId: 'Order ID',
      platformOrderNumber: 'Trade Order ID',
      distributeCountry: 'Country/Region',
      payMethod: 'Method',
      txnAmount: 'Trade Amount',
      reason: 'Failure Reason',
      remark: 'Remark',
      distributeDetail: 'Details',
      tradingInformation: 'Transaction Details',
      withdrawalCode: 'Redeem Code',
      expiredTime: 'Expiration Time',
      channelOrderId: 'Channel Order ID',
      reminder: 'Reminder',
      deleteTips: 'Confirm to cancel this order?',
      exchangeRate: 'Exchange Rate',
      payer: 'Payer',
      payerRemit: 'Source Amount',
      payerFee: 'Source Txn Fee',
      payerTax: 'Source tax',
      beneficiaryReceived: 'Destination Amount',
      payee: 'Recipient',
      payeeFee: 'Destination Txn Fee',
      payeeTax: 'Destination tax',
      statusReason: 'Status Description',
      subMerchantNo: 'Sub Merchant No',
      purpose: 'Purpose',
      IFSCode: 'Bankcode',
      payeeAccountNo: 'Destination Account',

      detailTitle: 'Disbursement Detail',
      payoutAmount: 'Trade Amount',
      paymentMethodType: 'Payment Method',
      merchantNo: 'Merchant',
      targetOrg: 'Target Org/Card Org',
      timeline: 'Timeline',
      payoutInfo: 'Disbursement Info',

      actions: {
        cancel: 'Cancel',
        submitMaterial: 'Add Documents',
        credentialDownload: 'Download proof',
        timeline: 'Timeline',
      },
      statusOption: [
        {
          label: 'Pending',
          value: 'PENDING',
          type: 'pending',
          iconName: 'iconclock-linear',
          iconColor: '#FB9701',
        },
        {
          label: 'Success',
          value: 'SUCCESS',
          type: 'success',
          iconName: 'icontick-circle-linear',
          iconColor: '#3DBE11'
        },
        {
          label: 'Failure',
          value: 'FAILED',
          type: 'error',
          iconName: 'iconclose-circle2',
          iconColor: '#F44444'
        },
        {
          label: 'Bounce Back',
          value: 'REFUND',
          type: 'error',
          iconName: 'iconclose-circle2',
          iconColor: '#F44444',
        }
      ],
      materialOptions: [
        {
          label: 'Yes',
          value: true
        },
        {
          label: 'No',
          value: false
        },
      ],
      dateOptions: [
        { label: 'Created Time', value: 'START' },
        { label: 'Completed Time', value: 'COMPLETE' }
      ],
      statusMap: {
        PENDING: 'Pending',
        SUCCESS: 'Success',
        FAILED: 'Failure',
        REFUND: 'Bounce Back'
      }

    }
  }
};
