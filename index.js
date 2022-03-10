/*jslint node: true*/
const app = require('express')();
const path = require('path');
const unirest = require('unirest');
const moment = require('moment');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

app.get('/', (req, res) => {
	console.log('1. Creating Payment Object');
	unirest
		.post('https://SERVER_ADDR/transaction/addExtension')
		.headers({
			Authorization: 'AUTH_KEY',
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'cache-control': 'no-cache'
		}).
		send({
			'o_key': 'O_KEY',
			'trx_timestamp': moment().unix(),
			'trx_currency': 'IDR',
			'trx_amount': 10000,
			'trx_description': 'a charge description'
		})
		.end(function (response) {
			console.log('2. Waiting Payment Token');
			var data;
			console.log('3. Rendering Card Information Page');
			data = {
				url: 'https://SERVER_ADDR/checkout/extension/'+response.body.token
			};
			res.render('index',data);
		});
	
});
  
app.listen(5000);