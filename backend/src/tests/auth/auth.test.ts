// import * as bcrypt from "bcrypt";
// import * as jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
// import { v2 as cloudinary } from "cloudinary";
// import { AuthService } from "../../modules/auth/services/auth.service";
// import { UserRepository } from "../../modules/auth/repositories/auth.repositories";
// import { SessionRepository } from "../../modules/auth/repositories/session.repositories";

// // Mock dependencies
// jest.mock("bcrypt");
// jest.mock("jsonwebtoken");
// jest.mock("nodemailer");
// jest.mock("cloudinary");
// jest.mock("../../modules/auth/repositories/auth.repositories");
// jest.mock("../../modules/auth/repositories/session.repositories");

// describe("AuthService", () => {
//   let authService: AuthService;
//   let userRepository: jest.Mocked<UserRepository>;
//   let sessionRepository: jest.Mocked<SessionRepository>;

//   beforeEach(() => {
//     userRepository = new UserRepository() as jest.Mocked<UserRepository>;
//     sessionRepository = new SessionRepository() as jest.Mocked<SessionRepository>;
//     authService = new AuthService();
//     (authService as any).userRepository = userRepository;
//     (authService as any).sessionRepository = sessionRepository;
//     (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({ secure_url: "http://mocked.url" });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe.only("register", () => {
//     it("should register a new user successfully", async () => {
//       const dto = {
//         email: "test@example.com",
//         password: "password123",
//         name: "Test User",
//         phoneNumber: "+84987654321",
//       };
//       const userMock = {
//         id: 1,
//         email: dto.email,
//         password: "hashedPassword",
//         name: dto.name,
//         phoneNumber: dto.phoneNumber,
//         avatarUrl: "http://mocked.url",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByEmail.mockResolvedValue(null);
//       userRepository.findByPhoneNumber.mockResolvedValue(null);
//       (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
//       userRepository.save.mockResolvedValue(userMock);

//       const result = await authService.register(dto);

//       expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
//       expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith(dto.phoneNumber);
//       expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
//       expect(cloudinary.uploader.upload).toHaveBeenCalled();
//       expect(userRepository.save).toHaveBeenCalledWith({
//         email: dto.email,
//         password: "hashedPassword",
//         name: dto.name,
//         phoneNumber: dto.phoneNumber,
//         avatarUrl: "http://mocked.url",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//       });
//       expect(result).toEqual({
//         id: 1,
//         email: dto.email,
//         name: dto.name,
//         phoneNumber: dto.phoneNumber,
//         avatarUrl: "http://mocked.url",
//         role: "member",
//         createdAt: expect.any(Date),
//       });
//     });

//     it("should throw error if email exists", async () => {
//       const dto = { email: "test@example.com", password: "password123", name: "Test User" };
//       const userMock = {
//         id: 1,
//         email: dto.email,
//         password: "hashedPassword",
//         name: dto.name,
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByEmail.mockResolvedValue(userMock);

//       await expect(authService.register(dto)).rejects.toThrow("Email already exists");
//     });

//     it("should throw error if phoneNumber exists", async () => {
//       const dto = { email: "test@example.com", password: "password123", name: "Test User", phoneNumber: "+84987654321" };
//       const userMock = {
//         id: 1,
//         email: "other@example.com",
//         password: "hashedPassword",
//         name: "Other User",
//         phoneNumber: dto.phoneNumber,
//         avatarUrl: "http://mocked.url",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByPhoneNumber.mockResolvedValue(userMock);

//       await expect(authService.register(dto)).rejects.toThrow("Phone number already exists");
//     });
//   });

//   describe("login", () => {
//     it("should login successfully and return tokens", async () => {
//       const dto = { email: "test@example.com", password: "password123" };
//       const userMock = {
//         id: 1,
//         email: dto.email,
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       const sessionMock = {
//         id: 1,
//         userId: 1,
//         refreshToken: "refreshToken",
//         isActive: true,
//         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         deviceInfo: undefined,
//         ipAddress: undefined,
//         user: userMock,
//       };
//       userRepository.findByEmail.mockResolvedValue(userMock);
//       (bcrypt.compare as jest.Mock).mockResolvedValue(true);
//       (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
//         if (secret === process.env.JWT_SECRET) return "accessToken";
//         return "refreshToken";
//       });
//       (uuidv4 as jest.Mock).mockReturnValue("csrfToken");
//       userRepository.update.mockResolvedValue(userMock);
//       sessionRepository.save.mockResolvedValue(sessionMock);

//       const result = await authService.login(dto);

//       expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
//       expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, "hashedPassword");
//       expect(jwt.sign).toHaveBeenCalledTimes(2);
//       expect(userRepository.update).toHaveBeenCalledWith(userMock.id, { lastLogin: expect.any(Date) });
//       expect(sessionRepository.save).toHaveBeenCalledWith({
//         userId: userMock.id,
//         refreshToken: "refreshToken",
//         isActive: true,
//         expiresAt: expect.any(Date),
//       });
//       expect(result).toEqual({
//         accessToken: "accessToken",
//         refreshToken: "refreshToken",
//         csrfToken: "csrfToken",
//         user: { id: 1, email: dto.email, name: "Test User", role: "member" },
//       });
//     });

//     it("should throw error if password is invalid", async () => {
//       const dto = { email: "test@example.com", password: "wrong" };
//       const userMock = {
//         id: 1,
//         email: dto.email,
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByEmail.mockResolvedValue(userMock);
//       (bcrypt.compare as jest.Mock).mockResolvedValue(false);

//       await expect(authService.login(dto)).rejects.toThrow("Invalid email or password");
//     });

//     it("should throw error if user is inactive", async () => {
//       const dto = { email: "test@example.com", password: "password123" };
//       const userMock = {
//         id: 1,
//         email: dto.email,
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: false,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByEmail.mockResolvedValue(userMock);
//       (bcrypt.compare as jest.Mock).mockResolvedValue(true);

//       await expect(authService.login(dto)).rejects.toThrow("User account is inactive");
//     });
//   });

//   describe("refreshToken", () => {
//     it("should refresh token successfully", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword", // Added password
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       const sessionMock = {
//         id: 1,
//         userId: 1,
//         refreshToken: "refreshToken",
//         isActive: true,
//         expiresAt: new Date(Date.now() + 100000),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         deviceInfo: undefined,
//         ipAddress: undefined,
//         user: userMock,
//       };
//       sessionRepository.findByRefreshToken.mockResolvedValue(sessionMock);
//       userRepository.findById.mockResolvedValue(userMock);
//       (jwt.sign as jest.Mock).mockReturnValue("newAccessToken");
//       (uuidv4 as jest.Mock).mockReturnValue("newCsrfToken");

//       const result = await authService.refreshToken("refreshToken", "csrfToken", "csrfToken");

//       expect(sessionRepository.findByRefreshToken).toHaveBeenCalledWith("refreshToken");
//       expect(userRepository.findById).toHaveBeenCalledWith(1);
//       expect(jwt.sign).toHaveBeenCalledWith(
//         { userId: 1, email: userMock.email, role: userMock.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "15m" }
//       );
//       expect(result).toEqual({
//         accessToken: "newAccessToken",
//         csrfToken: "newCsrfToken",
//         user: { id: 1, email: userMock.email, name: userMock.name, role: userMock.role },
//       });
//     });

//     it("should throw error if CSRF token is invalid", async () => {
//       await expect(authService.refreshToken("refreshToken", "csrfToken", "wrongCsrfToken")).rejects.toThrow("Invalid CSRF token");
//     });

//     it("should throw error if user is inactive", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword", // Added password
//         name: "Test User",
//         role: "member",
//         isActive: false,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       const sessionMock = {
//         id: 1,
//         userId: 1,
//         refreshToken: "refreshToken",
//         isActive: true,
//         expiresAt: new Date(Date.now() + 100000),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         deviceInfo: undefined,
//         ipAddress: undefined,
//         user: userMock,
//       };
//       sessionRepository.findByRefreshToken.mockResolvedValue(sessionMock);
//       userRepository.findById.mockResolvedValue(userMock);

//       await expect(authService.refreshToken("refreshToken", "csrfToken", "csrfToken")).rejects.toThrow("User not found or inactive");
//     });
//   });

//   describe("logout", () => {
//     it("should logout successfully", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword", // Added password
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       const sessionMock = {
//         id: 1,
//         userId: 1,
//         refreshToken: "refreshToken",
//         isActive: true,
//         expiresAt: new Date(Date.now() + 100000),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         deviceInfo: undefined,
//         ipAddress: undefined,
//         user: userMock,
//       };
//       sessionRepository.findByRefreshToken.mockResolvedValue(sessionMock);
//       sessionRepository.deactivateSession.mockResolvedValue(true);

//       const result = await authService.logout("refreshToken", "csrfToken", "csrfToken");

//       expect(sessionRepository.findByRefreshToken).toHaveBeenCalledWith("refreshToken");
//       expect(sessionRepository.deactivateSession).toHaveBeenCalledWith(1);
//       expect(result).toEqual({ message: "Logged out successfully" });
//     });

//     it("should throw error if session is invalid", async () => {
//       sessionRepository.findByRefreshToken.mockResolvedValue(null);

//       await expect(authService.logout("refreshToken", "csrfToken", "csrfToken")).rejects.toThrow("Invalid or already logged out session");
//     });
//   });

//   describe("forgotPassword", () => {
//     it("should send password reset email successfully", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByEmail.mockResolvedValue(userMock);
//       userRepository.updateResetToken.mockResolvedValue(userMock);
//       (uuidv4 as jest.Mock).mockReturnValue("resetToken");

//       const result = await authService.forgotPassword({ email: "test@example.com" });

//       expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
//       expect(userRepository.updateResetToken).toHaveBeenCalledWith(1, "resetToken", expect.any(Date));
//       expect(result).toEqual({ message: "Password reset email sent" });
//     });

//     it("should throw error if user not found", async () => {
//       userRepository.findByEmail.mockResolvedValue(null);

//       await expect(authService.forgotPassword({ email: "test@example.com" })).rejects.toThrow("User not found");
//     });
//   });

//   describe("resetPassword", () => {
//     it("should reset password successfully", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: "resetToken",
//         resetTokenExpiresAt: new Date(Date.now() + 100000),
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByResetToken.mockResolvedValue(userMock);
//       (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
//       userRepository.update.mockResolvedValue(userMock);

//       const result = await authService.resetPassword({ token: "resetToken", password: "newPassword" });

//       expect(userRepository.findByResetToken).toHaveBeenCalledWith("resetToken");
//       expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
//       expect(userRepository.update).toHaveBeenCalledWith(1, {
//         password: "newHashedPassword",
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//       });
//       expect(result).toEqual({ message: "Password reset successfully" });
//     });

//     it("should throw error if token is invalid", async () => {
//       userRepository.findByResetToken.mockResolvedValue(null);

//       await expect(authService.resetPassword({ token: "invalidToken", password: "newPassword" })).rejects.toThrow("Invalid or expired token");
//     });

//     it("should throw error if token is expired", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: "resetToken",
//         resetTokenExpiresAt: new Date(Date.now() - 100000),
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findByResetToken.mockResolvedValue(userMock);

//       await expect(authService.resetPassword({ token: "resetToken", password: "newPassword" })).rejects.toThrow("Token expired");
//     });
//   });

//   describe("updateFcmToken", () => {
//     it("should update FCM token successfully", async () => {
//       const userMock = {
//         id: 1,
//         email: "test@example.com",
//         password: "hashedPassword",
//         name: "Test User",
//         role: "member",
//         isActive: true,
//         isDeleted: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         phoneNumber: "+84987654321",
//         avatarUrl: "http://mocked.url",
//         fcmToken: undefined,
//         lastLogin: undefined,
//         resetToken: undefined,
//         resetTokenExpiresAt: undefined,
//         assignedTasks: [],
//         createdTasks: [],
//         userWorkspaces: [],
//         comments: [],
//         notifications: [],
//         sessions: [],
//       };
//       userRepository.findById.mockResolvedValue(userMock);
//       userRepository.updateFcmToken.mockResolvedValue(true);

//       const result = await authService.updateFcmToken(1, { fcmToken: "new-fcm-token" });

//       expect(userRepository.findById).toHaveBeenCalledWith(1);
//       expect(userRepository.updateFcmToken).toHaveBeenCalledWith(1, "new-fcm-token");
//       expect(result).toEqual({ message: "Cập nhật fcmToken thành công" });
//     });

//     it("should throw error if user not found", async () => {
//       userRepository.findById.mockResolvedValue(null);

//       await expect(authService.updateFcmToken(1, { fcmToken: "new-fcm-token" })).rejects.toThrow("Không tìm thấy người dùng");
//     });
//   });
// });