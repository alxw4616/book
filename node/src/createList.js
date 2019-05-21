var request = require('sync-request');
var iconv = require('iconv-lite');
var createList = {
	load: function(d) {
		this.config = d;

		for (let f1 in d) {
			let res = request('GET', d[f1].url);
			let ss = res.getBody();
			ss = iconv.decode(ss, 'gbk');
			ss = this.formatList(ss);
			d[f1].list = ss;
		}

		var ss = new Promise((resolve, reject) => {
			resolve(d)
		});
		return ss;
	},
	formatList(d) {
		var reg = /\<div id\=\"list\"\>[\w\W]+?\<\/div\>/
		d = d.toString();
		d = d.match(reg);
		d = d[0];
		reg = /\<a href="\/files[\w\W]+?\<\/a>/g;
		d = d.match(reg);
		for (let i = 0, len = d.length; i < len; i++) {
			d[i] = d[i].replace('<a href="', '');
			d[i] = d[i].replace('">', ',');
			d[i] = d[i].replace('</a>', '');
			d[i] = d[i].replace('" class="empty', '');
			d[i] = d[i].split(',');
			d[i] = {
				'url': 'https://www.23txt.com' + d[i][0],
				'name': d[i][1]
			}
		}
		// console.log(d);
		// d = JSON.stringify(d);
		return d;
	}
}
module.exports = createList;
