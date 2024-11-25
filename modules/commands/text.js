const APIURL = "https://gpt-19zs.onrender.com";
//const APIKEY = "SAKI-BIN-SWT56X";
module.exports.config = { 
usePrefix: true,
  name: "text",
  version: "1.0.0",
  permission: 0,
  credits: "Sakibin",
  description: "Sakibin Design",
  commandCategory: "edit",
  usages: "/cover",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const qs = require("querystring");
  const moment = require("moment");
	var time= moment.tz("Asia/Dhaka").format("LLLL");
  
  const number = args[0];
  const text = args.slice(1).join("");

  if (!number || isNaN(number)) {
    return api.sendMessage("❗Use /text [no.] [text]\n❗Example:\n  /text 5 Sakibin\nTotal Text limit 10", event.threadID, event.messageID);
  }

  const apiEndpoint = `/ephoto?number=${number}&text=${text}`;
  const pathSave = __dirname + `/cache/server2.png`;

  api.sendMessage("", event.threadID, event.messageID);

  axios
    .get(APIURL + apiEndpoint, { responseType: "arraybuffer" })
    .then((data) => {
      const imageBuffer = data.data;
      fs.writeFileSync(pathSave, Buffer.from(imageBuffer));
      api.sendMessage(
        {
    body: `✅ | Here is your editz from Sakibin Server✨`,
          attachment: fs.createReadStream(pathSave),
        },
        event.threadID,
        () => fs.unlinkSync(pathSave)
      );
    })
    .catch((error) => {
      let err;
      if (error.response) {
        err = JSON.parse(error.response.data.toString());
      } else {
        err = error;
      }
      return api.sendMessage("ERROR ❌\nSAKIBIN Server Busy...", event.threadID, event.messageID);
    });
};
