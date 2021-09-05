const Owner = require('../../data/mongo/places_owner');
const Message = require('../../data/mongo/message');
const moment = require("moment");

const serverErrMsg = "Terjadi kesalahan, mohon hubungi admin."

const getCeoMessage = async (req, res) => {
    try {
      //Inbox Area
        let inbox = await Message.find({ receiver: "CEO" }).sort({createdAt : 'descending'});
        if(inbox.length > 0 || inbox !== 'undefined'){
          inbox = inbox.map(e => {
              let doc = e._doc
              doc.createdAt = moment(doc.createdAt).format("DD-MM-YYYY")
              return doc;
          })
          for (let i = 0; i < inbox.length; i++) {
              if(inbox[i].sender !== "Admin"){
                  let sender = await Owner.find({_id : inbox[i].sender});
                  inbox[i].receiverName = sender[0].name;
              }else
                  inbox[i].receiverName = "Admin";
          }
        }
        console.log(inbox);
        //Outbox Area
        let outbox = await Message.find({ sender: "CEO" }).sort({createdAt : 'descending'});
        if(outbox.length > 0 || outbox !== 'undefined'){
          outbox = outbox.map(e => {
              let doc = e._doc
              doc.createdAt = moment(doc.createdAt).format("DD-MM-YYYY")
              return doc;
          })
          for (let i = 0; i < outbox.length; i++) {
              if(outbox[i].receiver !== "Admin"){
                  let sender = await Owner.find({_id : outbox[i].receiver});
                  outbox[i].receiverName = sender[0].name;
              }else
                  outbox[i].receiverName = "Admin";
          }
        }
        console.log(outbox)
        return res.json({message: "Success to retrive message!", inbox, outbox})
    } catch (error) {
        console.log(error);
        if (error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: error.message});
    }
}

const sendMessage = async(req,res) => {
    try {
        const message = await Message.create(req.body);
        return res.json({
            message: "Success to send message",
            data: {id: message._id}
        });
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

const getOneMessage = async(req, res) => {
    try {
        let data = await Message.findOne({_id: req.params.id});
        data = data._doc;
        if(data.receiver !== "Admin" && data.receiver !== "CEO"){
          let sender = await Owner.find({_id : data.receiver});
          data.receiverName = sender[0].name;
        } else
          data.receiverName = data.receiver;
        //
        if(data.sender !== "Admin" && data.sender !== "CEO"){
          let sender = await Owner.find({_id : data.sender});
          data.senderName = sender[0].name;
        } else
          data.senderName = data.sender;
        console.log(data);
        return res.json({message: "Success to retrive messages", data})
    } catch (error) {
        console.log(error);
        if(error.code)
            return res.status(error.code).json(error.message);
        return res.status(500).json({message: serverErrMsg});
    }
}

module.exports = {
    getCeoMessage,
    sendMessage,
    getOneMessage
}
