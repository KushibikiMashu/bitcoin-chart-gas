// controllerの責務がある
function doGet() {
    const data = (new BitcoinChartModel()).getAllSheetData();
    return ContentService.createTextOutput(JSON.stringify(data, null, 2))
        .setMimeType(ContentService.MimeType.JSON);
}
