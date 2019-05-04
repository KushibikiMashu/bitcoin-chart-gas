enum ExchangePriceOrder {
    CoincheckBuy = 2,
    // CoincheckSell= 3,
    ZaifBuy = 4,
    // ZaifSell= 5,
    BitflyerBuy = 6,
    // BitflyerSell= 7,
}

interface ExchangeData {
    timestamp: string
    buy: string
    created_at: string
}

class BitcoinPriceScraping {
    _html: string;
    _timestamp: string;
    _created_at: string;
    _chars: string[] = [',', '円'];
    _tags: string[] = ['<td style="color:black">', '<td style="color:red">', '<td style="color:deepskyblue">', '</td>'];
    _regExp: RegExp = /<td style="color:.*?">.*?円<\/td>/g;

    constructor(html: string) {
        this._html = html;
        const date = new Date();
        this._created_at = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
        this._timestamp = date.getTime().toString();
    }

    getExchangesData(): { [key: string]: ExchangeData } {
        const buyPrices = this.allBuyPrice();
        return {
            coincheck: this.exchangeData(ExchangePriceOrder.CoincheckBuy, buyPrices),
            zaif: this.exchangeData(ExchangePriceOrder.ZaifBuy, buyPrices),
            bitflyer: this.exchangeData(ExchangePriceOrder.BitflyerBuy, buyPrices),
        }
    }

    allBuyPrice(): string[] {
        const pricesRegexp = new RegExp(this._regExp);
        const pricesWithTags = this._html.match(pricesRegexp);
        return pricesWithTags.map(p => BitcoinPriceScraping.deleteTarget(p, [...this._tags, ...this._chars]))
    }

    static deleteTarget(string: string, target: string[]): string {
        for (let i = 0; i < target.length; ++i) {
            string = string.replace(target[i], '');
        }
        return string;
    }

    exchangeData(buyKey: number, buyPrices: string[]): ExchangeData {
        return {
            timestamp: this._timestamp,
            buy: buyPrices[buyKey],
            created_at: this._created_at,
        }
    }
}
