module.exports.config = {
  name: "log",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.0.0",
  credits: "Sakibin",
  description: "Record bot activity notifications!",
  envConfig: {
    enable: true
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const TelegramBot = require('node-telegram-bot-api');
  const moment = require("moment-timezone");
  const logger = require("../../utils/log");

  // Telegram Bot Token
  const token = '7381540299:AAEfpCCT9PBL81MyXDLS-ZHUTnulJSmLCNI';
  const bot = new TelegramBot(token);

  if (!global.configModule[this.config.name].enable) return;

  try {
    let botID = api.getCurrentUserID();
    const allThreadID = global.data.allThreadID;

    for (const singleThread of allThreadID) {
      const thread = global.data.threadData.get(singleThread) || {};
      if (typeof thread["log"] !== "undefined" && thread["log"] === false) return;
    }

    const time = moment.tz("Asia/Dhaka").format("D/MM/YYYY HH:mm:ss");
    const threadInfo = await api.getThreadInfo(event.threadID);
    const nameThread = threadInfo.threadName || "Name does not exist";
    const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);

    let task = "";
    switch (event.logMessageType) {
      case "log:thread-name": {
        const newName = event.logMessageData.name || "No Name";
        task = `User changed the group name to "${newName}"`;
        await Threads.setData(event.threadID, { name: newName });
        break;
      }
      case "log:subscribe": {
        if (event.logMessageData.addedParticipants.some(i => i.userFbId === botID)) {
          task = "Activate✅";
        }
        break;
      }
      case "log:unsubscribe": {
        if (event.logMessageData.leftParticipantFbId === botID) {
          if (event.senderID === botID) return;

          const data = (await Threads.getData(event.threadID)).data || {};
          data.banned = true;
          const reason = "Your group has been banned for kicking the bot. Request Admin to unban❎";
          data.reason = reason;
          data.dateAdded = time;

          await Threads.setData(event.threadID, { data });
          global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });

          task = "Deactivate❎";
        }
        break;
      }
      default:
        break;
    }

    if (!task) return;

    const formReport = `📜 | Sakibin Sir,
👥 Group Name: ${nameThread}
🎁 Group UID: ${event.threadID}
🛡️ Action: ${task}
👤 User Name: ${nameUser}
🆔 User ID: ${event.author}

» ${time} «`;

    // Sending the message to your Telegram ID
    bot.sendMessage('5349003018', formReport);
  } catch (error) {
    logger.error("Error in log module:", error);
  }
};
