/**
 * Scrape watchlist from Google
 * Secondarily, sync into Letterboxd
 */

const cheerio = require('cheerio');
const axios = require('axios');

// downloading the target web page
async function scrapeIt() {
	var items = [];

	const axiosResponse = await axios.request({
		method: 'GET',
		url: 'https://www.google.com/collections/s/list/qJMxPOnLzoE4SU1ChkOhP3ZBC0hQdw/U8F-lG_6BmM?pageNumber=1',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
		}
	});

	const $ = cheerio.load(axiosResponse.data);
	const pagesEl = $('[data-clamped-page-number]');
	const els = $('[data-hveid]').find('a[aria-label]');

	els.each((i, el) => {
		items.push( $(el).attr('aria-label') );
	});

	console.log(items);
}


// It's working. It pulls the first page of results
// need to scrape individual pages and group them together
// 
// Can change page with `?pageNumber` URL param
// no discernable way to see which page is the last page
// could check the first item on each page to compare
//
// Then send it all to Letterboxd and add to watchlist
// Run a cron often

scrapeIt();