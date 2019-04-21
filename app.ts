function main(): void {
    const html = scrape(BITCOIN_INFO_URL);
    const exchanges = (new BitcoinPriceScraping(html)).getExchangesData();
    (new BitcoinChartSpreadsheet(BITCOIN_CHART_SHEET_ID)).save(exchanges);
}