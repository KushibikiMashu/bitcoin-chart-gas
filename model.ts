const properties = PropertiesService.getScriptProperties()
const BITCOIN_CHART_SHEET_ID = properties.getProperty('BITCOIN_CHART_SHEET_ID')

enum ExchangeName {
    Bitflyer = 'bitflyer',
    Zaif = 'zaif',
    Coincheck = 'coincheck',
}

export type Exchange = {
    sheet?: GoogleAppsScript.Spreadsheet.Sheet
    timestamp: string
    buy: string
    created_at: string
}

// (注)Active Recordならテーブル（＝シート）ごとにModelがあるのが理想
// ただ、今回はテーブルのデータが同じであるため、Active Recordパターンでクラスを作っていない
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

    save({bitflyer, zaif, coincheck}: { [key in 'zaif' | 'bitflyer' | 'coincheck']: Exchange }): void {
        zaif.sheet = this._zaifSheet;
        bitflyer.sheet = this._bitflyerSheet;
        coincheck.sheet = this._coincheckSheet;
        [zaif, bitflyer, coincheck].map(n => BitcoinChartModel.addRow(n))
    }

    static addRow(exchange: Exchange): void {
        const lastRow = exchange.sheet.getLastRow();
        const data = [[lastRow, exchange.timestamp, exchange.buy, exchange.created_at]];
        exchange.sheet.getRange(lastRow + 1, 1, 1, 4).setValues(data);
    }

    getAllSheetData(): { [key in 'zaif' | 'bitflyer' | 'coincheck']: Object[][] } {
        const lastRow = this._zaifSheet.getLastRow();

        return {
            zaif: this._zaifSheet.getSheetValues(2, 2, lastRow - 1, 2),
            bitflyer: this._bitflyerSheet.getSheetValues(2, 2, lastRow - 1, 2),
            coincheck: this._coincheckSheet.getSheetValues(2, 2, lastRow - 1, 2),
        };
    }

    static getColumValues(sheet: GoogleAppsScript.Spreadsheet.Sheet, column: number): Object[][] {
        const lastRow = sheet.getLastRow();
        return sheet.getSheetValues(2, column, lastRow - 1, 1);
    }

    static setColumValues(sheet: GoogleAppsScript.Spreadsheet.Sheet, column: number, data: string[][]): void {
        const lastRow = sheet.getLastRow();
        sheet.getRange(2, column, lastRow - 1, 1).setValues(data);
    }

    // TODO
    getMinOfYesterday(sheetName) {
    }

    getMaxOfYesterday(sheetName) {
    }
}