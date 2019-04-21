const BITCOIN_CHART = ''

function sheet() {
    const bitcoinChartSpreadsheet = new BitcoinChartSpreadsheet(BITCOIN_CHART);
    //  {bitflyer={datetime=2019-04-21 19:26:17, buy=591489}, coincheck={datetime=2019-04-21 19:26:17, buy=591785}, zaif={datetime=2019-04-21 19:26:17, buy=591760}}
    bitcoinChartSpreadsheet.save();

}

class BitcoinChartSpreadsheet {
    _id: string = 'hash';
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _bitflyerSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _coincheckSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(BITCOIN_CHART: string) {
        this._id = BITCOIN_CHART
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._zaifSheet = this._spreadsheet.getSheetByName('zaif')
    }

    save({bitflyer, zaif, coincheck}) {
        zaif.sheet = this._zaifSheet;
        bitflyer.sheet = this._bitflyerSheet;
        coincheck.sheet = this._coincheckSheet;

        [zaif,bitflyer, coincheck].map(n => this.addRow(n))
    }

    addRow(zaif) {
        // 最終行を取得
        // idを取得
        const id = 'newID';
        // データを書き込み
        // 最終行を取得(関数で外出し)
        zaif.sheet.spreadsheetAPI.write(id, price, datetime)
    }

    // 取引所ごとの最大値と最小値を取得する
    // 取引所ごとのシートに行を追加する
    // 「取引所ごと」にループを回す
    // 一取引所だけで考える

}

function getNikkeiKairiritsuSheet() {
    return SpreadsheetApp.openById(BITCOIN_CHART).getSheetByName('日経乖離率');
}

function getTitles(sheet) {
    return sheet.getRange(1, 1, 1, 4).getValues();
}

function setDate(sheet) {
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    const today = getToday();
    sheet.getRange(lastRow + 1, 1, 1, 3).setValues(today);
}

function setRaw(sheet) {
    const today = getToday();
    const rate = getRate();
    const values = [];
    values.push(today);
    values[0].push(rate);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, 4).setValues(values);
}

function getRecentRates(sheet) {
    const lastRow = sheet.getLastRow();
    const values = sheet.getRange(lastRow - 7, 2, 8, 3).getValues();
    return values;
}
