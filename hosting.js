var express = require('express');
let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

var app = express();



app.get('/', function(req, res, next){
	axios.get('https://www.hostinger.co.id/web-hosting')
	    .then((response) => {
	        if(response.status === 200) {
	            const html = response.data;
	            const $ = cheerio.load(html); 
	            let devtoList = [];
	            $('.pricing-table-new-holder-tables__holder').each(function(i, elem) {
	                devtoList[i] = {
	                    title: $(this).find('h4').text().trim(),
	                    old_price: $(this).find('.pricing-table-new-holder-tables-holder-table-discount-top__old-price').text().trim(),
	                    top_percentage: $(this).find('.pricing-table-new-holder-tables-holder-table-discount-top__percentage').text().trim(),
	                    actual_price: $(this).find('.price-block__bigno').text().trim(),
	                    Deskripsi: $(this).find('.pricing-table-new-holder-tables-holder-table-bottom__features').text().trim()
	                }      
	            });
	            const devtoListTrimmed = devtoList.filter(n => n != undefined )
	            fs.writeFile('idHostinger.json', 
	                          JSON.stringify(devtoListTrimmed, null, 4), 
	                          (err)=> console.log('File successfully written!'))
	    }
	}, (error) => console.log(err) );
	let rawdata = fs.readFileSync('idHostinger.json');  
	let listHosting = JSON.parse(rawdata);

	res.json(listHosting);
})

app.listen(8080);