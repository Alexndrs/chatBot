const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

function readDB() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// === INTERFACE PUBLIQUE ===

/**
 * @typedef {Object} userObject
 * @property {string} userId 
 * @property {Object} userInfo
 * @property {string} userInfo.name
 * @property {string} userInfo.email
 * @property {string} userInfo.password
 * @property {Object} userInfo.preferences
 * @property {Array<conversationObject>} conversations
 */

/**
 * @typedef {Object} conversationObject
 * @property {string} convId
 * @property {string} convName
 * @property {Array<messageObject>} msgList
 */

/**
 * @typedef {Object} messageObject
 * @property {string} msgId
 * @property {string} role
 * @property {string} content
 * @property {string} timestamp
 */



/**
 * 
 * @param {string} userId 
 * @returns {userObject | undefined}
 */
function getUserById(userId) {
    const db = readDB();
    return db.users.find(u => u.userId === userId);
}

/**
 * 
 * @param {string} email 
 * @returns {userObject | undefined}
 */
function getUserByMail(email) {
    const db = readDB();
    return db.users.find(u => u.userInfo.email === email);
}


/**
 * 
 * @param {userObject} user
 */
function addUser(user) {
    const db = readDB();
    db.users.push(user);
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @param {Object} updatedInfo (.e.g. { name: "New Name", email: ")
 */
function updateUser(userId, updatedInfo) {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.userId === userId);
    if (userIndex === -1) throw new Error("Utilisateur non trouvé");

    db.users[userIndex] = { ...db.users[userIndex], ...updatedInfo };
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @returns 
 */
function getUserConversations(userId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    return user.conversations;
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @returns 
 */
function getConversationById(userId, convId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conversation = user.conversations.find(c => c.convId === convId);
    if (!conversation) throw new Error("Conversation non trouvée");

    return conversation;
}

/**
 * 
 * @param {string} userId 
 * @param {conversationObject} conversation 
 */
function addConversation(userId, conversation) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    user.conversations.push(conversation);
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 */
function deleteConversation(userId, convId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const convIndex = user.conversations.findIndex(c => c.convId === convId);
    if (convIndex === -1) throw new Error("Conversation non trouvée");

    user.conversations.splice(convIndex, 1);
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} newName 
 */
function changeConversationName(userId, convId, newName) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);
    if (!conv) throw new Error("Conversation non trouvée");

    conv.convName = newName;
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} msgId 
 * @returns {messageObject | undefined}
 */

function getMessageById(userId, convId, msgId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);
    if (!conv) throw new Error("Conversation non trouvée");

    const message = conv.msgList.find(m => m.msgId === msgId);
    if (!message) throw new Error("Message non trouvé");

    return message;
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @returns {Array<messageObject>}
 */
function getAllMessages(userId, convId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);
    if (!conv) throw new Error("Conversation non trouvée");

    return conv.msgList;
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {messageObject} message 
 * @returns {string} msgId
 */
function addMessage(userId, convId, message) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);

    if (!conv) throw new Error("Conversation non trouvée");

    conv.msgList.push({
        msgId: message.msgId,
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString(),
    });

    writeDB(db);
    return message.msgId
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} msgId 
 * @param {string} newContent 
 */
function editMessage(userId, convId, msgId, newContent) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);
    if (!conv) throw new Error("Conversation non trouvée");

    const message = conv.msgList.find(m => m.msgId === msgId);
    if (!message) throw new Error("Message non trouvé");

    message.content = newContent;
    writeDB(db);
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} msgId 
 */
function deleteMessage(userId, convId, msgId) {
    const db = readDB();
    const user = db.users.find(u => u.userId === userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    const conv = user.conversations.find(c => c.convId === convId);
    if (!conv) throw new Error("Conversation non trouvée");

    const messageIndex = conv.msgList.findIndex(m => m.msgId === msgId);
    if (messageIndex === -1) throw new Error("Message non trouvé");

    conv.msgList.splice(messageIndex, 1);
    writeDB(db);
}




module.exports = {
    getUserById,
    getUserByMail,
    addUser,
    updateUser,
    getUserConversations,
    getConversationById,
    addConversation,
    deleteConversation,
    changeConversationName,
    getAllMessages,
    getMessageById,
    addMessage,
    editMessage,
    deleteMessage
};
