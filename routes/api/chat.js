module.exports = function(app){
    const db = require("../../models");
    const passport = require("passport");

    // Test Routes
  app.get("/chatTest", (req, res) => {
    res.json({
      msg: "Chat route works",
    });
  });

  app.post("/chat",  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newChat = {
      users: req.body.users,
      messages: req.body.messages,
    };
    console.log(newChat);

    db.Chat.create(newChat)
      .then((chat) => {
        res.status(200).json({
          message: "Chat created successfully.",
          chatCreated: true,
          chat: newChat,
        });
      })
      .catch((err) => console.error(err));
  }
);
}