// var BITCOIN_EXCHANGES = PropertiesService.getScriptProperties().getProperty("BITCOIN_EXCHANGES");
const BITCOIN_EXCHANGES = '';
const BITCOIN_INFO_URL = 'https://xn--eck3a9bu7cul981xhp9b.com/';
const SHEET = getSheet('sheet_id');

// スクレイピングパート
// URLにリクエストを送る
// レスポンスでHTMLを取得する
// 取引所の金額を取得する
// 変数でzaif, bitflyer, coincheckが選べるようにする
// （おそらく数字になるはず {zaif: 1, bitfyer: 4}のように）

class Scraping {
    _html: string;

    constructor(html) {
        this._html = html;
    }

    allBuyPrice(): Array<string> {
        const regexp = /<td style="color:.*?">.*?円<\/td>/g;
        const pricesRegexp = new RegExp(regexp);
        return this._html.match(pricesRegexp);
    }

    getExchanges() {

    }

    zaif() {
        return {}
    }

    bitflyer() {
        return {}
    }

    coincheck() {
        return {}
    }


}

const exchanges = {
    zaif: {
        buy: 100,
        datetime: 2019,
    },
    coincheck: {
        buy: 200,
    },
}

class BitcoinChartSpreadsheet {
    _id: string = 'hash';
    _spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    _zaifSheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(BITCOIN_EXCHANGES:string) {
        this._id = BITCOIN_EXCHANGES
        this._spreadsheet = SpreadsheetApp.openById(this._id);
        this._zaifSheet = this._spreadsheet.getSheetByName('zaif')
    }

    addBuyPrices(buyPrices) {
        const {zaif} = buyPrices
        const sheets = {
            zaif: this._zaifSheet,
        }

        for (var key in Object.keys(exchanges) ){
            this.addRow(sheets[key], exchanges.price,exchanges.datetime)
        }

        this.addRow(this._zaifSheet, zaif.price,zaif.datetime)

    }

    addBuyPrice({price, datetime}){
        this.addRow(price,datetime)
    }

    addRow(sheet, price,datetime) {
        // 最終行を取得
        // idを取得
        const id = 'newID';
        // データを書き込み
        sheet.spreadsheetAPI.write(id, price, datetime)
    }

    // 取引所ごとの最大値と最小値を取得する
    // 取引所ごとのシートに行を追加する
    // 「取引所ごと」にループを回す
    // 一取引所だけで考える

    //


}

function main() {
    const html = request(BITCOIN_INFO_URL);
    const scraping = new Scraping(html);
    const buyPrices = scraping.getBuyPrices();
    const bitcoinChartSpreadsheet =  new BitcoinChartSpreadsheet(BITCOIN_EXCHANGES);

    BitcoinChartSpreadsheet.addBuyPrices(buyPrices)
}


function nikkeiHeikinMain() {
    const today = new Date();
    if (isWeekend(today) || isHoliday(today)) {
        return;
    }

    const sheet = getNikkeiKairiritsuSheet();
    setRaw(sheet);
}

function postNikkeiHeikinTweet() {
    const today = new Date();
    if (isWeekend(today) || isHoliday(today)) {
        return;
    }

    const sheet = getNikkeiKairiritsuSheet();
    const body = getBody(sheet);
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

function deleteTags(string, tags) {
    const length = tags.length;
    for (var i = 0; i < length; ++i) {
        string = string.replace(tags[i], '');
    }
    return string;
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