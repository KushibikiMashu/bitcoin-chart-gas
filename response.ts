// controllerの責務がある
function doGet() {
    const data = (new BitcoinChartModel()).getAllSheetData();
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
