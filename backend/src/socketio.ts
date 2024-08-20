import { Server } from "socket.io";

export const setupSocketIO = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("newRecipe", (recipe) => {
      console.log("New recipe received:", recipe);
      io.emit("recipeAdded", recipe);
    });

    socket.on("commentAdded", (data) => {
      console.log("New comment added:", data);
      io.emit("commentAdded", data);
    });

    socket.on("commentDeleted", (data) => {
      console.log("Comment deleted:", data);
      io.emit("commentDeleted", data);
    });

    socket.on("commentEdited", (data) => {
      console.log("Comment edited:", data);
      io.emit("commentEdited", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
