const APIURL = global.config.ApiUrl;
const APIKEY = "SAKIBIN-FREE-SY6B4X";
module.exports.config = {
    name: "wasted",
    version: "2.0.0",
    hasPermsion: 0,
    credits: "Deku",
    description: "Get info using uid/mention/reply to a message",
    usages: "[reply/uid/@mention]",
    commandCategory: "info",
    usePrefix: true,
    cooldowns: 0
};
module.exports.run = async function({ api, event, args, users }) {
  let { senderID, threadID, messageID } = event;
const request = require("request");
const axios = require("axios");
const fs = require("fs");
let pathImg = __dirname + `/cache/info5_${event.senderID}.png`
  if (args.join().indexOf('@') !== -1){ var url = `https://graph.facebook.com/${Object.keys(event.mentions)}/picture?width=720&height=720&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`; }
      else var url = args[0] || `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;
      if(event.type == "message_reply") { var url = event.messageReply.attachments[0].url || args.join(" "); }
  /*const url = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;*/
 
//callback
let canVAS = (
  await axios.get(APIURL + `/api/maker/wasted?url=${encodeURIComponent(url)}&apikey=${APIKEY}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(canVAS, "utf-8"));
  return api.sendMessage(
    { body:"",
      attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
