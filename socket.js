let io;
let allCustomer = [];
let allSeller = [];
let admin = {};
let userSockets = {}; // Stores { userId: socketId } for notification delivery

const init = (server, options = {}) => {
  io = require("socket.io")(server, options);

  io.on("connection", (socket) => {
    console.log(`✅ New socket connected: ${socket.id}`);

    // Register customer
    socket.on("add_user", (customerId, userInfo) => {
      remove(socket.id);
      addUser(customerId, socket.id, userInfo);
      userSockets[customerId] = socket.id; // Store for messaging
      console.log(`🔗 Customer ${customerId} added (socket: ${socket.id})`);
      io.emit("activeSeller", allSeller);
      io.emit("activeCustomer", allCustomer);
    });

    // Register seller
    socket.on("add_seller", (sellerId, userInfo) => {
      remove(socket.id);
      addSeller(sellerId, socket.id, userInfo);
      userSockets[sellerId] = socket.id; // Store for messaging
      console.log(`🔗 Seller ${sellerId} added (socket: ${socket.id})`);
      io.emit("activeSeller", allSeller);
      io.emit("activeCustomer", allCustomer);
      io.emit("activeAdmin", { status: true });
    });

    // Register admin
    socket.on("add_admin", (adminInfo) => {
      delete adminInfo.email;
      admin = { ...adminInfo, socketId: socket.id };
      io.emit("activeSeller", allSeller);
      io.emit("activeAdmin", { status: true });
    });

    // Customer-to-Seller chat
    socket.on('send_customer_message', (msg) => {
      console.log("----------------------------??")
      console.log(msg)
      const seller = findSeller(msg.receiverId)
      if (seller !== undefined) {
          socket.to(seller.socketId).emit('customer_message', msg)
      }
  })

    // Seller-to-Customer chat (Fixed)
    socket.on('send_seller_message', (msg) => {
      const { receiverId } = msg; // The customerId
      if (receiverId) {
        // Send message to the specific room
        io.to(receiverId).emit('seller_message', msg);
        io.emit('seller_message_', msg)
        console.log(`Message sent to customer ${receiverId}:`, msg);
      }
    });

    // Admin-to-Seller message
    socket.on("send_message_admin_to_seller", (msg) => {
      const sellerSocketId = userSockets[msg.receiverId];
      if (sellerSocketId) {
        io.to(sellerSocketId).emit("received_admin_message", msg);
      }
    });

    // Seller-to-Admin message
    socket.on("send_message_seller_to_admin", (msg) => {
      if (admin.socketId) {
        io.to(admin.socketId).emit("received_seller_message", msg);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
      remove(socket.id);
      removeAdmin(socket.id);
      io.emit("activeAdmin", { status: false });
      io.emit("activeSeller", allSeller);
      io.emit("activeCustomer", allCustomer);

      // Remove from userSockets
      Object.keys(userSockets).forEach((userId) => {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          console.log(`🚫 Removed ${userId} from active sockets.`);
        }
      });
    });
  });

  return io;
};

// Add customer and store socket ID
const addUser = (customerId, socketId, userInfo) => {
  remove(socketId);
  if (!allCustomer.some((u) => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
  userSockets[customerId] = socketId; // Store socket ID for messaging
};

// Add seller and store socket ID
const addSeller = (sellerId, socketId, userInfo) => {
  remove(socketId);
  if (!allSeller.some((u) => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
  userSockets[sellerId] = socketId; // Store socket ID for messaging
};

// Find seller by ID
const findSeller = (sellerId) => allSeller.find((s) => s.sellerId === sellerId);

// Find customer by ID
const findCustomer = (customerId) => allCustomer.find((c) => c.customerId === customerId);

// Remove user by socket ID
const remove = (socketId) => {
  allCustomer = allCustomer.filter((c) => c.socketId !== socketId);
  allSeller = allSeller.filter((s) => s.socketId !== socketId);
};

// Remove admin
const removeAdmin = (socketId) => {
  if (admin.socketId === socketId) {
    admin = {};
  }
};

// Get Socket.io instance
const getIO = () => io;

// Get user socket by userId
const getUserSocket = (userId) => userSockets[userId];

module.exports = { init, getIO, getUserSocket, findSeller, findCustomer };
