const BITCOIN_CHART = ''
const BITFLYER= 'bitflyer'
const ZAIF = 'zaif'
const COINCHECK = 'coincheck'

function sheet() {
    const bitcoinChartSpreadsheet = new BitcoinChartSpreadsheet();
    //  {bitflyer={datetime=2019-04-21 19:26:17, buy=591489}, coincheck={datetime=2019-04-21 19:26:17, buy=591785}, zaif={datetime=2019-04-21 19:26:17, buy=591760}}
    const exchanges = {zaif: [], bitflyer: [], coincheck: []}
    bitcoinChartSpreadsheet.save(exchanges);
}

type Exchange = {
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    buy: string,
    datetime: string,
}

class BitcoinChartSpreadsheet {
    _id: string = BITCOIN_CHART;
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _bitflyerSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _coincheckSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor() {
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._bitflyerSheet = this._spreadsheet.getSheetByName(BITFLYER)
        this._zaifSheet = this._spreadsheet.getSheetByName(ZAIF)
        this._coincheckSheet = this._spreadsheet.getSheetByName(COINCHECK)
    }

    save({bitflyer, zaif, coincheck}): void {
        zaif.sheet = this._zaifSheet;
        bitflyer.sheet = this._bitflyerSheet;
        coincheck.sheet = this._coincheckSheet;
        [zaif, bitflyer, coincheck].map(n => BitcoinChartSpreadsheet.addRow(n))
    }

    static addRow(exchange: Exchange): void {
        // 最終行を取得
        const lastRow = exchange.sheet.getLastRow();
        // データを書き込み
        const data = [[lastRow, exchange.buy, exchange.datetime]];
        // 最終行を取得(関数で外出し)
        exchange.sheet.getRange(1, 1).setValues(data)
    }

    getMinAndMaxOfYesterday(){
        // 前日の値を全て取得する
        // （３シート分をまとめる）
        // 最大値と最小値を取得する
        // 最大値と最小値の取引所の名前を取得する
        // return
        // （TwitterのBodyの作成はしない）
    }
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
