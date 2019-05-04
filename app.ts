const BITCOIN_INFO_URL = "https://xn--eck3a9bu7cul981xhp9b.com/";

function main(): void {
  const html = scrape(BITCOIN_INFO_URL);
  const bitcoins = new BitcoinPriceScraping(html).getBitcoinData();
  new BitcoinChartModel().save(bitcoins);
}
