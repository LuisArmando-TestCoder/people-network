// const axios = require('axios'); 
// const cheerio = require('cheerio'); 
 
// axios.get('https://www.instagram.com/latestcoder/').then(({ data }) => { 
// 	// const $ = cheerio.load(data); // Initialize cheerio 
// 	// const [h2] = $("#main > ul > li.post-730.product.type-product.status-publish.has-post-thumbnail.product_cat-pokemon.product_cat-seed.product_tag-overgrow.product_tag-seed.product_tag-venusaur.instock.taxable.shipping-taxable.purchasable.product-type-simple > a.woocommerce-LoopProduct-link.woocommerce-loop-product__link > h2"); 
 
// 	// console.log(h2.children[0].data); 
//     console.log(data)
// 	// ['https://scrapeme.live/shop/page/2/', 'https://scrapeme.live/shop/page/3/', ... ] 
// });

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/latestcoder', {
    waitUntil: 'networkidle2',
  });
//   console.log(page)
  await page.pdf({ path: 'screenshot.pdf', format: 'a4' });

  await browser.close();
})();