const puppeteer = require('puppeteer');
const dalang = require('./index');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: 1920,
    height:1080,
  })
  await page.goto('http://vip.bitcoin.co.id');
  let kimantep = new dalang({
    page:page
  })
  kimantep.listenToDalang(function(action){

    if(action == "start"){

        //TODO: Scraper lines code are happy here after manual process
        
    }
    if(action == "close") {
      browser.close();
      process.exit();
    }
  })
})();
