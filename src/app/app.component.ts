import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class AppComponent {
  title = 'yoko\'s crypto price tracker app';
}

/* get prices from Coinbase through web socket */
window.onload = function() {
	"use strict";
	var connection=new WebSocket("wss://ws-feed.pro.coinbase.com");
	var currencyOptions = { style: 'currency', currency: 'USD' };
	var changeToDollar = new Intl.NumberFormat('en-US', currencyOptions);
	var thisDate;
	var thisTime;
	var lastPriceBTC = 0;
	var lastPriceETH = 0;
	var lastPriceLTC = 0;
	
	connection.onopen = function () {
	  connection.send(JSON.stringify({	
		"type": "subscribe",
		"channels": [{ "name": "ticker", "product_ids": [
			"BTC-USD",
			"ETH-USD",
			"LTC-USD"
		] }]

	})); //send a message to server once connection is opened.
	};
	connection.onerror = function (error) {
	  console.log('Error Logged: ' + error); //log errors
	};
	connection.onmessage = function (e) {
	  console.log('Received From Server: ' + e.data); //log the received message
		if (e.data !== "") {
			var data = JSON.parse(e.data);
			var thisCrypto = data.product_id.toString();
			var thisPrice = data.price;
			thisDate = new Date().toLocaleDateString("en-US");
			thisTime = new Date().toLocaleTimeString("en-US");

			var writeCryptoPrice = function(lastPrice) {
				var priceDifference = thisPrice - lastPrice;
				if (lastPrice < thisPrice)  {
					document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML = "<p>" + thisDate + " " + thisTime + " - <span style='color:cadetblue'>" + changeToDollar.format(thisPrice) + " ▲" + changeToDollar.format(priceDifference) + "</span></p>" + document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML;
				}
				else {
					document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML = "<p>" + thisDate + " " + thisTime + " - <span  style='color:indianred'>" + changeToDollar.format(thisPrice) + " ▼" + changeToDollar.format(priceDifference) + "</span></p>" + document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML;
				}	

			};
			if (thisCrypto === "BTC-USD" && lastPriceBTC !== thisPrice) {			
				writeCryptoPrice(lastPriceBTC);
				lastPriceBTC = thisPrice;
				
			}
			else if (thisCrypto === "ETH-USD" && lastPriceETH !== thisPrice) {	
				writeCryptoPrice(lastPriceETH);
				lastPriceETH = thisPrice;
				
			}
			else if (thisCrypto === "LTC-USD" && lastPriceLTC !== thisPrice) {			
				writeCryptoPrice(lastPriceLTC);
				lastPriceLTC = thisPrice;
			}
		}
	};



};
