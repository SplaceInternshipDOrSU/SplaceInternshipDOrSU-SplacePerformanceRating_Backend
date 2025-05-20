const { responseReturn } = require("../../utils/response")
const userModel = require('../../models/userModel') 
const teamModel  = require('../../models/teamModel') 
const mongoose = require('mongoose');
const formidable = require("formidable");
// const traderModel = require("../../models/traderModel")
// const sellerModel = require('../../models/sellerModel') 
// const traderModel = require("../../models/traderModel")

class TeamController { 
    
    // SPLACE BS
    get_active_supervisor = async (req, res) => {
        console.log("get_active_supervisor");
    
        const { page, searchValue, parPage, role, category } = req.query;
        console.log("req.query supervisor", req.query);
    
        try {
            // Parse and sanitize pagination parameters
            const pageNum = Math.max(1, parseInt(page) || 1); // Ensure page is at least 1
            const perPage = parseInt(parPage) || 10;          // Default to 10 per page
            const skip = perPage * (pageNum - 1);             // Calculate skip for pagination
    
            // Build query
            const query = { status: 'active' };
    
            // Search filter
            if (searchValue && searchValue.trim() !== '') {
                const searchRegex = new RegExp(searchValue, 'i');
                query.$or = [
                    { firstName: searchRegex },
                    { middleName: searchRegex },
                    { lastName: searchRegex },
                ];
            }
    
            // Role filter (must be valid ObjectId)
            if (role && mongoose.Types.ObjectId.isValid(role)) {
                query.role = new mongoose.Types.ObjectId(role);
            }
    
            // Category filter (must be valid ObjectId)
            if (category && mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            }
    
            // Fetch users with populated role and category
            let users = await userModel.find(query)
                .skip(skip)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            // Count total number of matching users
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / perPage);  // Calculate total pages
    
            // Map users and add numbering
            users = users.map((user, index) => {
                return {
                    no: skip + index + 1, // numbering starts at 1 across pages
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name : "Deleted Category"
                };
            });
    
            console.log("Users fetched successfully");
    
            // Send back users and pagination info
            return responseReturn(res, 200, {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                perPage,  // still returning as perPage for frontend to handle
                users,
            });
        } catch (error) {
            console.error("Error fetching active Users:", error.stack);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
    get_active_managers = async (req, res) => {
        console.log("get_active_supervisor");
    
        const { page, searchValue, parPage, role, category } = req.query;
        console.log("req.query supervisor", req.query);
    
        try {
            // Parse and sanitize pagination parameters
            const pageNum = Math.max(1, parseInt(page) || 1); // Ensure page is at least 1
            const perPage = parseInt(parPage) || 10;          // Default to 10 per page
            const skip = perPage * (pageNum - 1);             // Calculate skip for pagination
    
            // Build query
            const query = { status: 'active' };
    
            // Search filter
            if (searchValue && searchValue.trim() !== '') {
                const searchRegex = new RegExp(searchValue, 'i');
                query.$or = [
                    { firstName: searchRegex },
                    { middleName: searchRegex },
                    { lastName: searchRegex },
                ];
            }
    
            // Role filter (must be valid ObjectId)
            if (role && mongoose.Types.ObjectId.isValid(role)) {
                query.role = new mongoose.Types.ObjectId(role);
            }
    
            // Category filter (must be valid ObjectId)
            if (category && mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            }
    
            // Fetch users with populated role and category
            let users = await userModel.find(query)
                .skip(skip)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            // Count total number of matching users
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / perPage);  // Calculate total pages
    
            // Map users and add numbering
            users = users.map((user, index) => {
                return {
                    no: skip + index + 1, // numbering starts at 1 across pages
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name : "Deleted Category"
                };
            });
    
            console.log("Users fetched successfully");
    
            // Send back users and pagination info
            return responseReturn(res, 200, {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                perPage,  // still returning as perPage for frontend to handle
                users,
            });
        } catch (error) {
            console.error("Error fetching active Users:", error.stack);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
    get_active_rf_emp = async (req, res) => {
        console.log("get_active_supervisor");
    
        const { page, searchValue, parPage, role, category } = req.query;
        console.log("req.query supervisor", req.query);
    
        try {
            // Parse and sanitize pagination parameters
            const pageNum = Math.max(1, parseInt(page) || 1); // Ensure page is at least 1
            const perPage = parseInt(parPage) || 10;          // Default to 10 per page
            const skip = perPage * (pageNum - 1);             // Calculate skip for pagination
    
            // Build query
            const query = { status: 'active' };
    
            // Search filter
            if (searchValue && searchValue.trim() !== '') {
                const searchRegex = new RegExp(searchValue, 'i');
                query.$or = [
                    { firstName: searchRegex },
                    { middleName: searchRegex },
                    { lastName: searchRegex },
                ];
            }
    
            // Role filter (must be valid ObjectId)
            if (role && mongoose.Types.ObjectId.isValid(role)) {
                query.role = new mongoose.Types.ObjectId(role);
            }
    
            // Category filter (must be valid ObjectId)
            if (category && mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            }
    
            // Fetch users with populated role and category
            let users = await userModel.find(query)
                .skip(skip)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            // Count total number of matching users
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / perPage);  // Calculate total pages
    
            // Map users and add numbering
            users = users.map((user, index) => {
                return {
                    no: skip + index + 1, // numbering starts at 1 across pages
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name : "Deleted Category"
                };
            });
    
            console.log("Users fetched successfully");
    
            // Send back users and pagination info
            return responseReturn(res, 200, {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                perPage,  // still returning as perPage for frontend to handle
                users,
            });
        } catch (error) {
            console.error("Error fetching active Users:", error.stack);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
    create_team = async (req, res) => {
        console.log("TEAM CREATION INITIALIZED");
        try {
          const form = new formidable.IncomingForm({ multiples: true });
      
          const fields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              else resolve(fields);
            });
          });
      
          console.log("Form parsed successfully");
          console.log(fields);
      
          let { name, ceoId, cooId, supervisorId, managerId } = fields;
          let rankandfileIds = fields['rankandfileIds[]'] || fields['rankandfileIds'] || [];
      
          name = Array.isArray(name) ? name[0] : name;
          ceoId = Array.isArray(ceoId) ? ceoId[0] : ceoId;
          cooId = Array.isArray(cooId) ? cooId[0] : cooId;
          supervisorId = Array.isArray(supervisorId) ? supervisorId[0] : supervisorId;
          managerId = Array.isArray(managerId) ? managerId[0] : managerId;
      
          rankandfileIds = Array.isArray(rankandfileIds) ? rankandfileIds : [rankandfileIds];
      
          if (!name) {
            return responseReturn(res, 400, { error: "Name is required" });
          }
      
          const existingTeam = await teamModel.findOne({ name });
          if (existingTeam) {
            return responseReturn(res, 400, { error: "A team with this name already exists" });
          }
      
          // Simple text check version
          const validateUser = async (id, expectedCategoryName) => {
            if (!id) return null;
            const user = await userModel.findById(id);
            if (!user || user.categoryName.toLowerCase() !== expectedCategoryName.toLowerCase()) {
              throw new Error(`Invalid ${expectedCategoryName.toUpperCase()} user`);
            }
            return user;
          };
      
          const [ceoUser, cooUser] = await Promise.all([
            validateUser(ceoId, 'CEO'),
            validateUser(cooId, 'COO'),
          ]);
      
          let supervisorUser = await validateUser(supervisorId, 'Supervisor').catch(() => null);
          let managerUser = await validateUser(managerId, 'Manager').catch(() => null);
      
          let rankandfileUsers = [];
          if (rankandfileIds.length > 0) {
            rankandfileUsers = await userModel.find({
              _id: { $in: rankandfileIds },
              categoryName: { $regex: new RegExp('^Rank and File$', 'i') },
            });
      
            if (rankandfileUsers.length !== rankandfileIds.length) {
              return responseReturn(res, 400, { error: "Some Rank-and-File users are invalid" });
            }
          }
      
          const team = await teamModel.create({
            name,
            ceo: ceoUser._id,
            coo: cooUser._id,
            supervisor: supervisorUser ? supervisorUser._id : null,
            manager: managerUser ? managerUser._id : null,
            rankandfile: rankandfileUsers.map((user) => user._id),
          });
      
          return responseReturn(res, 201, { message: "Team created successfully", team });
      
        } catch (error) {
          console.error("Error creating team:", error);
          return responseReturn(res, 500, { error: error.message || "Server error" });
        }
    };
    teams_get = async (req, res) => {
        console.log("teams_get");
      
        const { page, searchValue, parPage } = req.query;
        console.log("req.query", req.query);
      
        try {
          const pageNum = Math.max(1, parseInt(page) || 1);
          const parPageNum = Math.max(1, parseInt(parPage) || 10);
          const skip = parPageNum * (pageNum - 1);
      
          // Build search match
          let matchStage = {};
          if (searchValue && searchValue.trim() !== '') {
            const searchRegex = new RegExp(searchValue, 'i');
            matchStage = {
              $or: [
                { name: searchRegex },
                { 'ceoUser.name': searchRegex },
                { 'ceoUser.email': searchRegex },
                { 'cooUser.name': searchRegex },
                { 'cooUser.email': searchRegex },
                { 'supervisorUser.name': searchRegex },
                { 'supervisorUser.email': searchRegex },
                { 'managerUser.name': searchRegex },
                { 'managerUser.email': searchRegex },
                { 'rankandfileUsers.name': searchRegex },
                { 'rankandfileUsers.email': searchRegex },
              ]
            };
          }
      
          // Aggregate query
          const teams = await teamModel.aggregate([
            { $lookup: { from: 'users', localField: 'ceo', foreignField: '_id', as: 'ceoUser' } },
            { $unwind: { path: '$ceoUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'coo', foreignField: '_id', as: 'cooUser' } },
            { $unwind: { path: '$cooUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'supervisor', foreignField: '_id', as: 'supervisorUser' } },
            { $unwind: { path: '$supervisorUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'manager', foreignField: '_id', as: 'managerUser' } },
            { $unwind: { path: '$managerUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'rankandfile', foreignField: '_id', as: 'rankandfileUsers' } },
            { $match: matchStage },
            {
              $project: {
                name: 1,
                createdAt: 1,
                ceo: { _id: '$ceoUser._id', name: '$ceoUser.name', email: '$ceoUser.email' },
                coo: { _id: '$cooUser._id', name: '$cooUser.name', email: '$cooUser.email' },
                supervisor: { _id: '$supervisorUser._id', name: '$supervisorUser.name', email: '$supervisorUser.email' },
                manager: { _id: '$managerUser._id', name: '$managerUser.name', email: '$managerUser.email' },
                rankandfile: {
                  $map: {
                    input: '$rankandfileUsers',
                    as: 'user',
                    in: {
                      _id: '$$user._id',
                      name: '$$user.name',
                      email: '$$user.email'
                    }
                  }
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parPageNum },
          ]);
      
          // Count total matching teams
          const countResult = await teamModel.aggregate([
            { $lookup: { from: 'users', localField: 'ceo', foreignField: '_id', as: 'ceoUser' } },
            { $unwind: { path: '$ceoUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'coo', foreignField: '_id', as: 'cooUser' } },
            { $unwind: { path: '$cooUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'supervisor', foreignField: '_id', as: 'supervisorUser' } },
            { $unwind: { path: '$supervisorUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'manager', foreignField: '_id', as: 'managerUser' } },
            { $unwind: { path: '$managerUser', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'rankandfile', foreignField: '_id', as: 'rankandfileUsers' } },
            { $match: matchStage },
            { $count: "total" }
          ]);
      
          const totalTeams = countResult[0]?.total || 0;
          const totalPages = Math.ceil(totalTeams / parPageNum);
      
          // Add numbering
          const numberedTeams = teams.map((team, index) => ({
            ...team,
            no: skip + index + 1
          }));
      
          console.log("Teams fetched successfully");
      
          return responseReturn(res, 200, {
            totalTeams,
            totalPages,
            currentPage: pageNum,
            perPage: parPageNum, // 👈 returns as perPage
            teams: numberedTeams,
          });
      
        } catch (error) {
          console.log(error.stack || error.message);
          return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
   
    get_active_ceo_coo = async (req, res) => {
        console.log("get_active_ceo_coo");
    
        const { category } = req.query;
        console.log("req.query ceo_coo", req.query);
    
        try {
            // Validate category
            if (!category || !mongoose.Types.ObjectId.isValid(category)) {
                return responseReturn(res, 400, { error: "Invalid or missing category" });
            }
    
            // Build query
            const query = {
                status: 'active',
                category: new mongoose.Types.ObjectId(category)
            };
    
            // Fetch the most recent user (if multiple, only get the latest one)
            let user = await userModel.findOne(query)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            if (!user) {
                return responseReturn(res, 404, { error: "No active user found for this category" });
            }
    
            // Map user with numbering and populated names
            const mappedUser = {
                no: 1,
                ...user.toObject(),
                role: user.role ? user.role.name : "Deleted Role",
                category: user.category ? user.category.name : "Deleted Category"
            };
    
            console.log("User fetched successfully");
    
            // Send back single user object (not array)
            return responseReturn(res, 200, {
                user: mappedUser,
            });
        } catch (error) {
            console.error("Error fetching active User:", error.stack);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
    // SPLACE BS
    get_user_requests = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const parPage = parseInt(req.query.parPage) || 10;
        const searchValue = req.query.searchValue || '';
        const skipPage = parPage * (page - 1);
    
        try {
            if (searchValue) {
                // Implement search logic here if needed
                // Example:
                // const users = await userModel.find({ name: { $regex: searchValue, $options: 'i' }, status: 'pending' })
            } else {
                let users = await userModel.find({ status: 'pending' })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 })
                    .populate('role', 'name')
                    .populate('category', 'name');
    
                users = users.map(user => ({
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name : "Deleted Category"
                }));
    
                const totalUsers = await userModel.countDocuments({ status: 'pending' });
    
                responseReturn(res, 200, { totalUsers, users });
            }
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: error.message });
        }
    };
    get_user = async (req, res) => {
        const { userId } = req.params

        try {
            const user = await userModel.findById(userId)
            responseReturn(res, 200, { user })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
    user_status_update = async (req, res) => {
        const { userId, status } = req.body;
    
        try {
            // Check if the seller exists
            const seller = await userModel.findById(userId);
            if (!seller) {
                return responseReturn(res, 404, { message: "User not found" });
            }
    
            // Update the seller's status
            seller.status = status;
            await seller.save();
    
            // // Update listings based on the seller's new status
            // if (status !== "active") {
            //     await Listing.updateMany({ userId }, { isAvailable: false });
            // } else {
            //     await Listing.updateMany({ userId }, { isAvailable: true });
            // }
    
            // Return the updated seller
            const updatedUser = await userModel.findById(userId);
            responseReturn(res, 200, { user: updatedUser, message: "User status updated successfully" });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
    get_active_users = async (req, res) => {
            let { page, searchValue, perPage, role, category } = req.query;

            page = parseInt(page) || 1;
            perPage = parseInt(perPage) || 10;
            const skipPage = perPage * (page - 1);

            try {
                const query = { status: 'active' };

                if (searchValue && searchValue.trim() !== '') {
                const searchRegex = new RegExp(searchValue, 'i');
                query.$or = [
                    { firstName: searchRegex },
                    { middleName: searchRegex },
                    { lastName: searchRegex },
                ];
                }

                if (role && role.trim() !== '') {
                query.role = role;
                }

                if (category && category.trim() !== '') {
                query.category = category;
                }

                // Fetch users with populated role and category
                let users = await userModel.find(query)
                .skip(skipPage)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');

                // Safely map users and handle deleted role/category
                users = users.map(user => {
                return {
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name  : "Deleted Category"
                };
                });

                const totalUsers = await userModel.countDocuments(query);

                responseReturn(res, 200, { totalUsers, users });
            } catch (error) {
                console.error("Error fetching active Users:", error.stack);
                responseReturn(res, 500, { message: "Server Error" });
            }
    };

}

module.exports = new TeamController()