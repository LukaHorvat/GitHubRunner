var sys = require("sys");
var spawn = require("child_process").spawn;
var express = require("express");
var app = express();
var fs = require("fs");

app.use(express.bodyParser());

var log = function (str) {
	fs.appendFileSync("log", str + "\n");
}

log("New version of GitHubRunner: build 12");

app.post("/push", function (req, res) {
	var info = JSON.parse(req.param("payload"));
	log("Push into " + info.repository.name + "\n");

	var auto = function () {
		var sh = spawn("sh", ["auto.sh"], {
			cwd: "/projects/" + info.repository.name
		});
		sh.stdout.on("data", function (data) {
			log("auto.sh for " + info.repository.name + " output");
			log("\t" + data);
		});
		sh.stderr.on("data", function (data) {
			log("auto.sh for " + info.repository.name + " error");
			log("\t" + data);
		});
		sh.on("close", function (code) {
			log("auto.sh for " + info.repository.name + " exited with " + code);
		});
	}

	if (!fs.existsSync("/projects/" + info.repository.name)) {
		spawn("git", ["clone", info.repository.url + ".git"], {
			cwd: "/projects/"
		}).on("close", function (code) {
			log("git clone exited with " + code);
			auto();
		});
	} else {
		spawn("git", ["pull"], {
			cwd: "/projects/" + info.repository.name
		}).on("close", function (code) {
			log("git pull exited with " + code);
			auto();
		});
	}
});

app.listen(5000);