const puppeteer = require('puppeteer');
const CREDS = require('creds');
const express = require('express');

var app = express();

var server_port = process.env.PORT || 1214;

app.get('/', function(req, res, next){

	let scrape = async () => {

	  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
	  const page = await browser.newPage();
	  await page.goto('https://www.hostinger.co.id/domain-murah');
	  const SEARCH_SELECTOR = '#cart_domain_search_domain';
	   
	  const domain = req.query.domain;//this will be parsing parameter from get method express

	  await page.type(SEARCH_SELECTOR, domain);

	  const result = await page.evaluate(async () => {
	  		//in here is all activity u did on the site page when it still open
	  		document.querySelector('.search-form > input:nth-child(2)').click();

			let data = []; // Create an empty array that will store our data
			await new Promise(function(resolve) { 
	           setTimeout(resolve, 10000) // this wait for domain respon in idhostinger
	    	});
	    	//tr.pt-10:nth-child(1) > td:nth-child(2)   tr.pt-10:nth-child(2) > td:nth-child(2)
	    	//tr.pt-10:nth-child(1) > td:nth-child(3)   tr.pt-10:nth-child(2) > td:nth-child(3)

	    	//tr.pt-10:nth-child(8) > td:nth-child(3) > div:nth-child(2) > div:nth-child(1)
	    	//tr.pt-10:nth-child(7) > td:nth-child(3) > div:nth-child(2) > div:nth-child(4)
	        let elements = document.querySelectorAll('tr.pt-10'); // Select all domain

	        //this path is a bit tricky u need u check the element selector first
	        for (var i = 1; i <= elements.length; i++) {
	        	let domain = document.querySelector('tr.pt-10:nth-child('+i+') > td:nth-child(1)').innerText;
	        	let price = document.querySelector('tr.pt-10:nth-child('+i+') > td:nth-child(2)').innerText;
	        	let status = document.querySelector('tr.pt-10:nth-child('+i+') > td:nth-child(3) > div:nth-child(2)').innerText;
	        	data.push({domain, price, status});
			}
			return data; // Return our data array
		});


	  browser.close();
	  return result;
	};

	scrape().then((value) => {
	    console.log(value); // Success!
	    res.json(value);
	});

	
});
//test
app.listen(server_port);