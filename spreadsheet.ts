const BITCOIN_CHART_SHEET_ID = PropertiesService.getScriptProperties().getProperty('BITCOIN_CHART_SHEET_ID_SHEET_ID');

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

class BitcoinChartSpreadsheet {
    _id: string = BITCOIN_CHART_SHEET_ID;
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _bitflyerSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;
    _coincheckSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor() {
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._bitflyerSheet = this._spreadsheet.getSheetByName(ExchangeName.Bitflyer)
        this._zaifSheet = this._spreadsheet.getSheetByName(ExchangeName.Zaif)
        this._coincheckSheet = this._spreadsheet.getSheetByName(ExchangeName.Coincheck)
    }

    save({bitflyer, zaif, coincheck}): void {
        zaif.sheet = this._zaifSheet;
        bitflyer.sheet = this._bitflyerSheet;
        coincheck.sheet = this._coincheckSheet;
        [zaif, bitflyer, coincheck].map(n => BitcoinChartSpreadsheet.addRow(n))
    }

    static addRow(exchange: Exchange): void {
        const lastRow = exchange.sheet.getLastRow();
        const data = [[lastRow, exchange.buy, exchange.datetime]];
        Logger.log(data);
        // 最終行を取得(関数で外出し)
        // exchange.sheet.getRange(1, 1).setValues(data)
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
