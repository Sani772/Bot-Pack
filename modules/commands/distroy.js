module.exports.config = {
  usePrefix: true,
  name: "distroy",
  version: "",
  hasPermssion: 2,
  credits: "SAKIBIN",
  description: "Blast messages within a specified limit",
  commandCategory: "Admin",
  usages: "[text] [limit]",
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = function ({ api, event, args, Users }) {
  const adminID = '100065445284007';
  
  if (event.senderID !== adminID) {
    return api.sendMessage(
      "This Distroy command is only for my boss SAKIBIN.❗",
      event.threadID,
      event.messageID
    );
  }
  
  const spamText = args.slice(0, -1).join(" ");
  const spamLimit = parseInt(args.slice(-1)[0]);
  
  if (!spamText || isNaN(spamLimit)) {
    return api.sendMessage(
      "Need Text or Limit to distroy This Group😈.",
      event.threadID,
      event.messageID
    );
  }

  if (spamLimit > 1000) {
    return api.sendMessage(
      "Spam limit exceeded! The maximum limit is 1000.",
      event.threadID,
      event.messageID
    );
  }
  
  const { threadID, messageID } = event;

  for (let i = 0; i < spamLimit; i++) {
    api.sendMessage(spamText, threadID);
  }
};
