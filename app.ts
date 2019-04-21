function main() :void{
    const html = request(BITCOIN_INFO_URL);
    const exchanges = (new BitcoinPriceScraping(html)).getExchangesData();
    (new BitcoinChartSpreadsheet()).save(exchanges);

    //  {bitflyer={datetime=2019-04-21 19:26:17, buy=591489}, coincheck={datetime=2019-04-21 19:26:17, buy=591785}, zaif={datetime=2019-04-21 19:26:17, buy=591760}}
}