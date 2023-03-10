module.exports = async (session,message)=>{
    let channel = await session.guild.channels.fetch(session.messageFeed);
    channel.send(message);
}