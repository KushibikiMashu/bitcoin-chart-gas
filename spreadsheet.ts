class BitcoinChartSpreadsheet {
    _id: string = 'hash';
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(BITCOIN_EXCHANGES: string) {
        this._id = BITCOIN_EXCHANGES
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._zaifSheet = this._spreadsheet.getSheetByName('zaif')
    }

    save({zaif, bitflyer, coincheck}) {
        zaif.sheet = this._zaifSheet;

        this.addRow(zaif)
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

function getTarget(html) {
    var target = '';
    const tags = ['<li class="mleft10">', '</li>'];
    const item = /<li class="mleft10">.*?<\/li>/;
    const regexp = new RegExp(item);
    const length = Object.keys(html).length;

    for (var i = 0; i < length; ++i) {
        var itemWithTag = html[i].match(regexp);
        var title = deleteTags(itemWithTag[0], tags);
        if (title === '乖離率(25日)') {
            target = html[i];
        }
    }
    return target;
}

function getRate() {
    const res = request(BITCOIN_INFO_URL);
    const items = getItems(res);
    const target = getTarget(items);
    return getNumber(target);
}

function getNikkeiKairiritsuSheet() {
    return SpreadsheetApp.openById(BITCOIN_EXCHANGES).getSheetByName('日経乖離率');
}

function getTitles(sheet) {
    return sheet.getRange(1, 1, 1, 4).getValues();
}

function getToday() {
    const now = new Date();
    const year = now.getYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    return [year, month, date];
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

function isWeekend(today) {
    const day = today.getDay();
    return (day === 6) || (day === 0);
}

function isHoliday(today) {
    const calendars = CalendarApp.getCalendarsByName('日本の祝日');
    const count = calendars[0].getEventsForDay(today).length;
    return count !== 0;
}

function getRecentRates(sheet) {
    const lastRow = sheet.getLastRow();
    const values = sheet.getRange(lastRow - 7, 2, 8, 3).getValues();
    return values;
}

function getBody(sheet) {
    var body = '今日の乖離率をお知らせします📈' + "\r\n" + '(日経平均25日移動平均線)' + "\r\n" + "\r\n";
    const rates = getRecentRates(sheet);
    const reversed = rates.reverse();
    for (var row in reversed) {
        var percentage = (rates[row][2] * 100).toString() + '％';
        body += rates[row][0] + '/' + rates[row][1] + ' : ' + percentage + "\r\n";
    }
    return body;
}