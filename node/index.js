var fs = require("fs");
var config = require("./config.js");
var createList = require("./src/createList.js");
var createFile = require("./src/createFile.js");


// 生成目录
createList.load(config).then((d) =>{

	fs.writeFile('./list/list.json',JSON.stringify(d),function () {
		console.log('目录 更新完成');
		// 文件写入 完成
	});

	// // 根据目录,生成相应的txt
	createFile.load(d).then((d) =>{
		// console.log('更新完成');
	})
})
