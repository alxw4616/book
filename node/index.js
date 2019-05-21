var fs = require("fs");
var config = require("./config.js");
var createList = require("./src/createList.js");
// var createText = require("./lib/createText.js");


// 生成目录
createList.load(config).then((d) =>{

	fs.writeFile('./list/list.json',JSON.stringify(d),function () {
		// 文件写入 完成
	});
	// console.log(d);
	// // 根据目录,生成相应的txt
	// createText.createFile().then((d) =>{
	// 	console.log('更新完成');
	// })
})
