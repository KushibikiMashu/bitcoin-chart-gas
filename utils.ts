export function scrape(url) {
    return UrlFetchApp.fetch(url).getContentText('UTF-8').replace(/\r?\n/g, '');
}
