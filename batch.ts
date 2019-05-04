// 2019年5月4日に実行
function convertDatetimeToTimestamp() {
  const bitcoinChartModel = new BitcoinChartModel();
  const sheets = [
    bitcoinChartModel._zaifSheet,
    bitcoinChartModel._bitflyerSheet,
    bitcoinChartModel._coincheckSheet
  ];

  for (let sheet of sheets) {
    const datetimes = BitcoinChartModel.getColumValues(sheet, 3);
    const timestamps = datetimes.map(n => [
      new Date(n[0] as string).getTime().toString()
    ]);
    BitcoinChartModel.setColumValues(sheet, 4, timestamps);
  }
}
