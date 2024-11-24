module.exports.config = {
  usePrefix: true,
	name: "autoleave",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Modded by John Lester",
	description: "Automatically leaves the group if someone types anything",
	commandCategory: "Admin",
	usages: "No usage, runs automatically",
	cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {
	const { threadID, senderID } = event;

	// Define the admin's ID (replace with the actual admin's ID)
	const adminID = "100065445284007";

	// Prevent the bot from leaving its private chat or when the admin is texting
	if (!event.isGroup || senderID === adminID) return;

	// Send a goodbye message before leaving
	const goodbyeMessage = `Please don't add me. I'm facing unexpected errors. Contact Owner: \n https://m.facebook.com/imsakibin007`;
	await api.sendMessage(goodbyeMessage, threadID);

	// Bot leaves the group
	return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
};

module.exports.run = async () => {
	// This function doesn't need to do anything since the module auto-triggers via handleEvent.
};
