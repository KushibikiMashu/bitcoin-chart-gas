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

function main() {
    const html = request(BITCOIN_INFO_URL);
    const bitcoinPriceScraping = new BitcoinPriceScraping(html);
    const exchanges = bitcoinPriceScraping.getExchangesData();
    //  {bitflyer={datetime=2019-04-21 19:26:17, buy=591489}, coincheck={datetime=2019-04-21 19:26:17, buy=591785}, zaif={datetime=2019-04-21 19:26:17, buy=591760}}

    const bitcoinChartSpreadsheet = new BitcoinChartSpreadsheet(BITCOIN_EXCHANGES);
    // bitcoinChartSpreadsheet.save(...exchanges);
}

class BitcoinPriceScraping {
    _html: string;
    _datetime: string;
    _chars: Array<string> = [',', '円']
    _tags: Array<string> = ['<td style="color:black">', '<td style="color:red">', '<td style="color:deepskyblue">', '</td>']

    constructor(html: string) {
        this._html = html;
        this._datetime = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
    }

    getExchangesData() {
        const buyPrices = this.allBuyPrice();
        return {
            coincheck: this.exchangeData(2, buyPrices),
            zaif: this.exchangeData(4, buyPrices),
            bitflyer: this.exchangeData(6, buyPrices),
        }
    }

    allBuyPrice(): Array<string> {
        const pricesRegexp = new RegExp(/<td style="color:.*?">.*?円<\/td>/g);
        const pricesWithTags = this._html.match(pricesRegexp);
        return pricesWithTags.map(p => BitcoinPriceScraping.deleteTarget(p, [...this._tags, ...this._chars]))
    }

    static deleteTarget(string: string, target: Array<string>):string {
        for (let i = 0; i < target.length; ++i) {
            string = string.replace(target[i], '');
        }
        return string;
    }

    exchangeData(buyKey:number, buyPrices:Array<string>): {[key :string]:string } {
        return {
            buy: buyPrices[buyKey],
            datetime: this._datetime,
        }
    }
}
