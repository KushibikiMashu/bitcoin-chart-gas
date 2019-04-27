// controllerの責務がある
function doGet() {
    const body = JSON.stringify((new BitcoinChartService).getContent());
    return ContentService.createTextOutput(body);
}
