/**
 * Scrape watchlist from Google
 * Secondarily, sync into Letterboxd
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

// downloading the target web page
async function scrapeIt() {
	let document = {};
	let items = [];
	let prevFirstItem = null;

	for (let i = 0; i <= 5; i++) {
		const axiosResponse = await axios.request({
			method: 'GET',
			url: 'https://www.google.com/collections/s/list/qJMxPOnLzoE4SU1ChkOhP3ZBC0hQdw/U8F-lG_6BmM?pageNumber=' + (i + 1),
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
			}
		});

		document = new JSDOM(axiosResponse.data).window.document;
		items.push([]);

		// Find and collect items
		document.querySelectorAll('[data-hveid] a[aria-label]').forEach((el) => {
			if (items[i][0] === prevFirstItem) {
				return;
			}

			items[i].push(el.getAttribute('aria-label'));
		});

		if (items[i][0] === prevFirstItem) {
			return;
		}

		//console.log(items[i]);

		// Set first item for next iteration
		prevFirstItem = items[i][0];
		console.log((i + 1) + ': ' + prevFirstItem);
	}

	//console.log(items);

	return await items;
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