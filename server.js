var sys = require("sys");
var spawn = require("child_process").spawn;
var express = require("express");
var app = express();
var fs = require("fs");

app.use(express.bodyParser());

function puts(error, stdout, stderr) { sys.puts(stdout) }

var cfg = {};

app.post("/push", function (req, res) {
	var info = JSON.parse(req.param("payload"));

	var auto = function () {
		spawn("sh", ["auto.sh"], {
			cwd: "/projects/" + info.repository.name
		});
	}

	if (!fs.existsSync("/projects/" + info.repository.name)) {
		spawn("git", ["clone", info.repository.url + ".git"], {
			cwd: "/projects/"
		}, function () {
			auto();
		});
	} else {
		spawn("git", ["pull"], {
			cwd: "/projects/" + info.repository.name
		}, function () {
			auto();
		});
	}
});

app.listen(5000);