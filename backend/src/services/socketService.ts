import { Server, Socket } from "socket.io";
import { IRecipe } from "../models/Recipe";

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected");

      // Sadece gerekli olaylara abone olun
      socket.on("newRecipe", this.handleNewRecipe.bind(this));
      socket.on("disconnect", this.handleDisconnect.bind(this));
    });
  }

  private handleNewRecipe(recipe: IRecipe) {
    // Yeni tarif eklendiğinde tüm kullanıcılara değil, sadece ilgili kullanıcılara bildirim gönderin
    this.io.to("recipes").emit("recipeAdded", recipe);
  }

  private handleDisconnect() {
    console.log("User disconnected");
  }

  public joinRecipeRoom(socket: Socket) {
    socket.join("recipes");
  }

  public leaveRecipeRoom(socket: Socket) {
    socket.leave("recipes");
  }
}
