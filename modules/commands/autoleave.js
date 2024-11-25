module.exports.config = {
  usePrefix: true,
  name: "autoleave",
  version: "1.0.0",
  hasPermssion: 0,
  credits: " Sakibin",
  description: "Automatically leaves the group if someone types anything",
  commandCategory: "Admin",
  usages: "No usage, runs automatically",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID } = event;

  // Define threadIDs of groups where the bot should not leave
  const allowedThread = ["9346480742035558", "7614851571878801", "7618067124959832", "8097146760370486", "6367848320005728", "8921909907869778"];

  // Prevent the bot from leaving allowed groups
  if (allowedThread.includes(threadID)) return;

  // Bot leaves the group immediately
  return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
};

module.exports.run = async () => {
  // This function doesn't need to do anything since the module auto-triggers via handleEvent.
};
