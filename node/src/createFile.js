var fs = require("fs");
var request = require('request');
var iconv = require('iconv-lite');
var createFile = {
	load: function(d) {

		for (let f1 in d) {
			this.readList(d[f1]['list'],d[f1]['name']);
		}

		var ss = new Promise((resolve, reject) => {
			resolve(d)
		});
		return ss;
	},
	readList(list,name){
		let queue = [];
		for (var i = 0, len = list.length; i < len; i++) {
			let url = list[i].url
			let name = list[i].name
			let ss = new Promise((resolve, reject) => {
				request(list[i].url).on('data', function(d) {
					resolve({
						data :d,
						name:name
					});
				});
			})
			queue.push(ss)
		}
		Promise.all(queue).then((results) => {
			let text = [];
			for (let i = 0, len = results.length; i < len; i++) {
				let ss = iconv.decode(results[i].data, 'gbk');
				text.push(this.getTag(ss, results[i].name));
			}
			fs.writeFile(`./file/${name}.txt`, text.join('--------------------\r\n'),function (d) {
					console.log(`${name} 完成!\r\n`);
			});
		});
	},
	getTag(d, title) {
		var reg = /\<div id\=\"content\"\>[\w\W]+?\<\/div\>/;
		d = d.match(reg);
		if (!d) {
			return '';
		}
		d = d[0];
		d = d.replace(/<div id="content">/g, '');
		d = d.replace(/<\/div>/g, '');
		d = d.replace(/&nbsp;/g, '');
		d = d.replace(/<br \/>/g, '\r\n');
		d = title + '\r\n\r\n' + d;
		return d;
	}

}
module.exports = createFile;
