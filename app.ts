function main(): void {
    const html = scrape(BITCOIN_INFO_URL);
    const exchanges = (new BitcoinPriceScraping(html)).getExchangesData();
    (new BitcoinChartModel()).save(exchanges);
}