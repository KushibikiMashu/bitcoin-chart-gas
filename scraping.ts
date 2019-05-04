enum ExchangePriceOrder {
    CoincheckBuy = 2,
    // CoincheckSell= 3,
    ZaifBuy = 4,
    // ZaifSell= 5,
    BitflyerBuy = 6,
    // BitflyerSell= 7,
}

export type Bitcoin = {
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

    getBitcoinData(): { [key in 'zaif' | 'bitflyer' | 'coincheck']: Bitcoin } {
        const buyPrices = this.allBuyPrice();
        return {
            zaif: this.exchangeData(buyPrices[ExchangePriceOrder.ZaifBuy]),
            bitflyer: this.exchangeData(buyPrices[ExchangePriceOrder.BitflyerBuy]),
            coincheck: this.exchangeData(buyPrices[ExchangePriceOrder.CoincheckBuy]),
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

    exchangeData(buyPrice: string): Bitcoin {
        return {
            timestamp: this._timestamp,
            buy: buyPrice,
            created_at: this._created_at,
        }
    }
}
