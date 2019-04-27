const properties = PropertiesService.getScriptProperties()
const BITCOIN_CHART_SHEET_ID = properties.getProperty('BITCOIN_CHART_SHEET_ID')

enum ExchangeName {
    Bitflyer = 'bitflyer',
    Zaif = 'zaif',
    Coincheck = 'coincheck',
}

type Exchange = {
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    buy: string,
    datetime: string,
}

class BitcoinChartModel {
    _id: string;
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _bitflyerSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _coincheckSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor() {
        this._id = BITCOIN_CHART_SHEET_ID;
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._bitflyerSheet = this._spreadsheet.getSheetByName(ExchangeName.Bitflyer)
        this._zaifSheet = this._spreadsheet.getSheetByName(ExchangeName.Zaif)
        this._coincheckSheet = this._spreadsheet.getSheetByName(ExchangeName.Coincheck)
    }

    save({bitflyer, zaif, coincheck}): void {
        zaif.sheet = this._zaifSheet;
        bitflyer.sheet = this._bitflyerSheet;
        coincheck.sheet = this._coincheckSheet;
        [zaif, bitflyer, coincheck].map(n => BitcoinChartModel.addRow(n))
    }

    static addRow(exchange: Exchange): void {
        const lastRow = exchange.sheet.getLastRow();
        const data = [[lastRow, exchange.buy, exchange.datetime]];
        exchange.sheet.getRange(lastRow + 1, 1, 1, 3).setValues(data);
    }

    /**
     * TODO
     * 前日の値を全て取得する
     * （３シート分をまとめる）
     * 最大値と最小値を取得する
     * 最大値と最小値の取引所の名前を取得する
     * （TwitterのBodyの作成はしない）
     */
    getMinAndMaxOfYesterday() {
    }

}
