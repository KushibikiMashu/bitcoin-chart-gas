function scrape(url: string): string {
  return UrlFetchApp.fetch(url)
    .getContentText("UTF-8")
    .replace(/\r?\n/g, "");
}
