# bitcoin-chart-gas

This script fetches bitcoin buy prices in main crypt currency exchanges in Japan every 15 minutes.

1. The Trigger fires every 15 minutes.
2. Fetch bitcoin buy prices by scraping.
3. Save data in Google Spreadsheet.

# Spreadsheet as an API server

1. Send HTTP Request with GET method
2. GAS returns JSON optimized for describing stock chart with Highcharts.

# installation

```terminal
$ npm install -g clasp
$ clasp clone [Script ID]
$ yarn install
```

# Push your code to Google Apps Script

```terminal
$ clasp push
```

Then open the browser and check your code deployed.

```terminal
$ clasp open
```

g
