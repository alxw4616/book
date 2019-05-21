var fs = require("fs");
var path = require("path");
// var request = require("request-promise");
var request = require("request");
var encoding = require('encoding');
var iconv = require('iconv-lite');
let readFile = path => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, {
			encoding: 'binary'
		}, (err, data) => {
			if (err) {
				reject(err);
			}
			// console.log(data);
			var str = iconv.decode(data, 'gbk');
			getList(str);
		});
	});
};
// readFile("./file/52931");
// readFile("./1.txt");
var getList = (d) => {
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
	d = JSON.stringify(d);
	fs.writeFile('./1.txt', d);
}
var getFile = function() {
	var dirPath = path.join(__dirname, "file");
	//创建文件夹目录
	var dirPath = path.join(__dirname, "file");
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
		console.log("文件夹创建成功");
	} else {
		console.log("文件夹已存在");
	}
	let stream = fs.createWriteStream(path.join(dirPath, '52931'));
	var url = 'https://www.23txt.com/files/article/html/52/52931/';
	request(url).pipe(stream).on("close", function(err) {
		console.log("文件[" + '52931' + "]下载完毕");
	});
}
// getFile();
var createText = (d) => {
	fs.readFile('./1.txt', 'utf8', function(err, data) {
		let d = JSON.parse(data);
		let queue = [];
		var text = {};
		for (var i = 0, len = d.length; i < len; i++) {
			let url = d[i].url
			let name = d[i].name
			let ss = new Promise((resolve, reject) => {
				request(d[i].url).on('data', function(d) {
					resolve({
						data :d,
						name:name
					});
				});
			})
			queue.push(ss)
		}
		Promise.all(queue).then(function(results) {
			console.log(typeof results[12]);
			let text = [];
			for (let i = 0, len = results.length; i < len; i++) {
				// console.log(ss);
				let ss = iconv.decode(results[i].data, 'gbk');
				text.push(getTag(ss, results[i].name));
			}
			fs.writeFile('./2.txt', text.join('--------------------\r\n'));
		});
	});
}
createText();
var getTag = (d, title) => {
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
