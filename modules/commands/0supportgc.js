module.exports.config = {

  usePrefix: true,
  name: "supportgroup",
  version: "1.1.0",
  permission: 0,
  credits: `SAKIBIN`,
  description: `Add the user who runs the command to the support group.`,
  category: `admin`,
  usages: `..`,
  cooldowns: 5
};

module.exports.run = async function({ api, event, Threads }) {
  const { senderID, messageID } = event;
  const supportGroupThreadID = `568304112847373`; // Support group thread ID
  const botID = api.getCurrentUserID();
  const out = msg => api.sendMessage(msg, senderID, messageID); // Sends message to the user who runs the command
  const failMessage = `Failed to add you to the support group. ❎`;

  try {
    const threadInfo = await Threads.getInfo(supportGroupThreadID);
    const { participantIDs, approvalMode, adminIDs } = threadInfo;
    const isParticipant = participantIDs.includes(senderID);
    const isBotAdmin = adminIDs.some(admin => admin.id === botID);

    if (isParticipant) {
      return out(`You are already in the support group.`);
    }

    // Try to add the user to the support group
    await api.addUserToGroup(senderID, supportGroupThreadID);

    // Check if approval mode is on and the bot is not an admin
    if (approvalMode && !isBotAdmin) {
      return out(`You've been added to the approval list. ✅`);
    }

    return out(`Successfully added you to the support group: ${threadInfo.threadName}. ✅`);

  } catch (error) {
    // Handle any error that occurs during the process
    return out(`I can't add you, Join⬇️\n💌 | Our ChatGroup link: https://m.me/j/AbZWnuyr11jBO71i/\n👥 | Our community Group: https://m.facebook.com/groups/418505760810575`);
  }
};
