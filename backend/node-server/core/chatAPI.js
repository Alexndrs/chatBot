const { chatWithPython } = require('../services/python_api');
const db = require('../db/interface');
const uuidv4 = require('uuid').v4;

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} messageContent
 * @returns {Promise<string>}
 */
async function handleMessage(userId, convId, messageContent) {
    // Ajouter le message à la conversation
    db.addMessage(userId, convId, {
        msgId: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
    })
    // Récupérer l'historique de la conversation
    const conv = db.getAllMessages(userId, convId);

    // TODO: Envoyer l'historique à l'API de l'IA (python ou groq)
    const reply = await chatWithPython(conv);
    // Ajouter la réponse de l'IA à la conversation
    const newMsg = {
        msgId: uuidv4(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
    }

    db.addMessage(userId, convId, newMsg)
    return newMsg;
}

/**
 * 
 * @param {string} userId 
 * @param {string} messageContent 
 */
async function createConversation(userId, messageContent) {
    const newConv = {
        convId: uuidv4(),
        convName: '',
        msgList: []
    }
    const convName = await chatWithPython([{ role: 'user', content: 'From the following message, create a short title for this conversation, answer with only the title' + messageContent + '/no_think' }]);
    newConv.convName = convName;
    db.addConversation(userId, newConv);

    await handleMessage(userId, newConv.convId, messageContent);
    return newConv.convId;
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} newName 
 */
function changeConversationName(userId, convId, newName) {
    db.changeConversationName(userId, convId, newName)
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 */
function deleteConversation(userId, convId) {
    try {
        db.deleteConversation(userId, convId);
    }
    catch (err) {
        throw new Error('Conversation not found');
    }
}

function getConversationById(userId, convId) {
    const conv = db.getConversationById(userId, convId);
    if (!conv) {
        throw new Error('Conversation not found');
    }
    return conv;
}

/**
 * 
 * @param {string} userId 
 * @param {string} convId 
 * @param {string} msgId 
 * @param {string} newContent 
 */
async function editMessage(userId, convId, msgId, newContent) {
    try {
        // We need to delete all messages after the message to edit
        const conv = db.getConversationById(userId, convId);
        if (!conv) {
            throw new Error('Conversation not found');
        }
        const msg = conv.msgList.find(m => m.msgId === msgId);

        if (!msg) {
            throw new Error('Message not found');
        }
        const index = conv.msgList.indexOf(msg);
        conv.msgList.slice(index, conv.msgList.length).forEach(m => {
            db.deleteMessage(userId, convId, m.msgId);
        })

        const newMsg = await handleMessage(userId, convId, newContent);
        return newMsg;
    }
    catch (err) {
        throw new Error('Message not found');
    }
}

// createUser("alex@example.com", "Alex", "password123").then((user) => {
//     console.log('Utilisateur créé:', user);
//     createConversation(user.userId, "Hello, how are you?").then((conv) => {
//         console.log('Conversation créée:', conv);
//     });
// });



module.exports = {
    handleMessage,
    getConversationById,
    createConversation,
    changeConversationName,
    deleteConversation,
    editMessage
};
