require("dotenv").config();
const socketio = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = require("./app");

const server = app.listen(3000, () => {
  // console.log(`Listening on port 3000...`);
});

const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("user_joined", async (user) => {
    const updatedUserData = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        socketId: socket.id,
      },
    });
    // console.log("updateduserData:", updatedUserData);
    io.to(socket.id).emit("update_socket", updatedUserData);
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  socket.on("get_messages", async ({ fromUser }) => {
    try {
      const allMessages = await prisma.message.findMany({
        where: {
          OR: [{ fromUser: fromUser }, { toUser: fromUser }],
        },
      });

      io.to(socket.id).emit("receive_message", allMessages);
    } catch (error) {
      // console.log(error);
    }
  });

  let emits = 0;
  socket.on("myId", async () => {
    emits++;
    // console.log(emits);
    // console.log(socket.id, "socketId");
  });

  socket.on(
    "send_message",
    async ({
      fromUser,
      toUser,
      toFirstName,
      toLastName,
      toSocketId,
      message,
    }) => {
      try {
        const newMessage = await prisma.message.create({
          data: {
            message,
            fromUser,
            toUser,
            toFirstName,
            toLastName,
          },
        });

        const allMessages = await prisma.message.findMany({
          where: {
            OR: [{ fromUser: fromUser }, { toUser: fromUser }],
          },
        });
        // console.log(toSocketId, "receiver");
        // console.log(socket.id, "sender");
        // console.log(allMessages)
        io.to(toSocketId).emit("receive_message", allMessages);

        io.to(socket.id).emit("receive_message", allMessages);
      } catch (error) {
        // console.log(error);
      }
    }
  );
});

module.exports = app;
