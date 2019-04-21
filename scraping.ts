const BITCOIN_INFO_URL = 'https://xn--eck3a9bu7cul981xhp9b.com/';

enum ExchangePriceOrder {
    CoincheckBuy= 2,
    // CoincheckSell= 3,
    ZaifBuy= 4,
    // ZaifSell= 5,
    BitflyerBuy= 6,
    // BitflyerSell= 7,
}

class BitcoinPriceScraping {
    _html: string;
    _datetime: string;
    _chars: Array<string> = [',', '円']
    _tags: Array<string> = ['<td style="color:black">', '<td style="color:red">', '<td style="color:deepskyblue">', '</td>']
    _regExp : RegExp =  /<td style="color:.*?">.*?円<\/td>/g;

    constructor(html: string) {
        this._html = html;
        this._datetime = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
    }

    getExchangesData() {
        const buyPrices = this.allBuyPrice();
        return {
            coincheck: this.exchangeData(ExchangePriceOrder.CoincheckBuy, buyPrices),
            zaif: this.exchangeData(ExchangePriceOrder.ZaifBuy, buyPrices),
            bitflyer: this.exchangeData(ExchangePriceOrder.BitflyerBuy, buyPrices),
        }
    }

    allBuyPrice(): Array<string> {
        const pricesRegexp = new RegExp(this._regExp);
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
