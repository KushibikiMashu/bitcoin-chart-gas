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

    save({bitflyer, zaif, coincheck}: { [key: string]: ExchangeData }): void {
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

    getAllSheetData(): { [key: string]: Array<Array<number>> } {
        const lastRow = this._zaifSheet.getLastRow();
        const zaifValues = this._zaifSheet.getSheetValues(2, 1, lastRow - 1, 3);
        const bitflyerValues = this._bitflyerSheet.getSheetValues(2, 1, lastRow - 1, 3);
        const coincheckValues = this._coincheckSheet.getSheetValues(2, 1, lastRow - 1, 3);

        return {
            zaif: BitcoinChartModel.getDateAndBuyPrice(zaifValues),
            bitflyer: BitcoinChartModel.getDateAndBuyPrice(bitflyerValues),
            coincheck: BitcoinChartModel.getDateAndBuyPrice(coincheckValues),
        };
    }

    static getDateAndBuyPrice(data): Array<Array<number>> {
        return data.map(n => [(new Date(n[2])).getTime(), n[1]]);
    }

    // TODO
    getMinOfYesterday(sheetName) {
    }

    getMaxOfYesterday(sheetName) {
    }
}