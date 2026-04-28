# Humai Tasks System 🌱

Hệ thống quản lý nhiệm vụ và điểm thưởng cho Humai - Ứng dụng sống biết ơn mỗi ngày.

## 📋 Tổng quan

Humai Tasks System là một ứng dụng full-stack giúp người dùng:
- Quản lý nhiệm vụ hàng ngày theo danh mục (Biết ơn, Tặng quà, Nhật ký, Thiền định, v.v.)
- Tích lũy điểm thưởng khi hoàn thành nhiệm vụ
- Duy trì streak (chuỗi ngày liên tiếp hoàn thành nhiệm vụ)
- Đạt thành tựu và nâng cấp độ
- Xem bảng xếp hạng cộng đồng
- Theo dõi hoạt động của người dùng khác

## 🏗️ Kiến trúc hệ thống

### Backend
- **Framework**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API

### Frontend
- **Technology**: HTML5, CSS3, JavaScript (Vanilla)
- **Design**: DailyBean-inspired UI với màu sắc ấm áp
- **Responsive**: Mobile-first design

### Deployment
- **Containerization**: Docker + Docker Compose
- **Services**: Backend API, Frontend (Nginx), MongoDB

## 🚀 Cài đặt và chạy

### Yêu cầu
- Docker và Docker Compose
- Node.js 18+ (nếu chạy local không dùng Docker)
- MongoDB 7.0+ (nếu chạy local không dùng Docker)

### Chạy với Docker (Khuyến nghị)

1. Clone repository và di chuyển vào thư mục:
```bash
cd humai-tasks-system
```

2. Khởi động tất cả services:
```bash
docker-compose up -d
```

3. Truy cập ứng dụng:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

4. Dừng services:
```bash
docker-compose down
```

### Chạy local (Development)

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với thông tin MongoDB của bạn
npm start
```

#### Frontend
```bash
cd frontend
# Mở index.html trong trình duyệt hoặc dùng live server
```

## 📁 Cấu trúc thư mục

```
humai-tasks-system/
├── backend/
│   ├── config/
│   │   ├── database.js          # Kết nối MongoDB
│   │   └── seedAchievements.js  # Dữ liệu thành tựu mẫu
│   ├── controllers/
│   │   ├── authController.js    # Xác thực người dùng
│   │   ├── taskController.js    # Quản lý nhiệm vụ
│   │   ├── communityController.js # Leaderboard & feed
│   │   └── achievementController.js # Thành tựu
│   ├── models/
│   │   ├── User.js              # Schema người dùng
│   │   ├── Task.js              # Schema nhiệm vụ
│   │   ├── Achievement.js       # Schema thành tựu
│   │   └── Activity.js          # Schema hoạt động
│   ├── routes/
│   │   ├── auth.js              # Routes xác thực
│   │   ├── tasks.js             # Routes nhiệm vụ
│   │   ├── community.js         # Routes cộng đồng
│   │   └── achievements.js      # Routes thành tựu
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── server.js                # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── js/
│   │   └── app.js               # Logic ứng dụng
│   ├── index.html               # Giao diện chính
│   └── Dockerfile
└── docker-compose.yml
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin người dùng (cần token)

### Tasks
- `POST /api/tasks` - Tạo nhiệm vụ mới
- `GET /api/tasks` - Lấy danh sách nhiệm vụ (có thể filter theo category, completed)
- `PATCH /api/tasks/:id/complete` - Hoàn thành nhiệm vụ
- `DELETE /api/tasks/:id` - Xóa nhiệm vụ

### Community
- `GET /api/community/leaderboard` - Bảng xếp hạng (query: type, limit)
- `GET /api/community/feed` - Feed hoạt động cộng đồng

### Achievements
- `GET /api/achievements` - Lấy danh sách thành tựu
- `POST /api/achievements` - Tạo thành tựu mới (admin)

## 🎮 Tính năng chính

### 1. Hệ thống nhiệm vụ
- Tạo nhiệm vụ theo 6 danh mục: Biết ơn, Tặng quà, Nhật ký, Thiền định, Tập thể dục, Khác
- Đánh dấu hoàn thành và nhận điểm thưởng
- Lọc nhiệm vụ theo danh mục
- Xóa nhiệm vụ không cần thiết

### 2. Hệ thống điểm & cấp độ
- Tích lũy điểm khi hoàn thành nhiệm vụ
- Tự động nâng cấp khi đủ điểm (100 điểm/cấp)
- Hiển thị điểm và cấp độ trên giao diện

### 3. Streak (Chuỗi ngày)
- Theo dõi số ngày liên tiếp hoàn thành nhiệm vụ
- Tự động reset nếu bỏ lỡ 1 ngày
- Hiển thị streak với icon 🔥

### 4. Hệ thống thành tựu
- 13 thành tựu được định nghĩa sẵn
- Tự động kiểm tra và trao thành tựu khi đạt điều kiện
- Các loại thành tựu:
  - Dựa trên số nhiệm vụ hoàn thành
  - Dựa trên streak
  - Dựa trên tổng điểm
  - Dựa trên nhiệm vụ theo danh mục

### 5. Leaderboard cộng đồng
- Xếp hạng theo điểm, streak, cấp độ, hoặc số nhiệm vụ
- Hiển thị top 10 người dùng
- Cập nhật real-time

### 6. Feed hoạt động
- Theo dõi hoạt động của người dùng khác
- Hiển thị nhiệm vụ hoàn thành, thành tựu đạt được
- Tạo động lực cộng đồng

## 🎨 Thiết kế UI

Giao diện được thiết kế theo phong cách DailyBean với:
- **Màu chủ đạo**: Cam đất (#FF7043) và vàng ấm (#FF9800)
- **Nền**: Kem trắng (#FAF8F5)
- **Font**: Nunito (800-900 weight cho tiêu đề)
- **Bo góc**: 14-22px (mềm mại)
- **Shadow**: Nhẹ nhàng, tinh tế
- **Layout**: Mobile-first với bottom tab bar

## 🔐 Bảo mật

- Mật khẩu được hash bằng bcrypt (10 rounds)
- JWT tokens với thời hạn 7 ngày
- Middleware xác thực cho các routes protected
- CORS được cấu hình cho phép cross-origin requests

## 🌟 Thành tựu có sẵn

1. **Bước đầu tiên** 🌱 - Hoàn thành nhiệm vụ đầu tiên
2. **Người thực thi** ⭐ - Hoàn thành 10 nhiệm vụ
3. **Chuyên gia nhiệm vụ** 🏆 - Hoàn thành 50 nhiệm vụ
4. **Kiên trì 3 ngày** 🔥 - Streak 3 ngày
5. **Tuần hoàn hảo** 💪 - Streak 7 ngày
6. **Tháng kỷ luật** 👑 - Streak 30 ngày
7. **Người mới** 💎 - Đạt 100 điểm
8. **Người tích cực** 💰 - Đạt 500 điểm
9. **Triệu phú điểm** 🌟 - Đạt 1000 điểm
10. **Trái tim biết ơn** 🙏 - 10 nhiệm vụ biết ơn
11. **Người cho đi** 🎁 - 10 nhiệm vụ tặng quà
12. **Nhà văn** 📖 - 10 nhiệm vụ nhật ký
13. **Tâm an** 🧘 - 10 nhiệm vụ thiền định

## 🔧 Cấu hình

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/humai
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=production
```

### API URL (Frontend)
Chỉnh sửa trong `frontend/js/app.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 📝 Ghi chú phát triển

- Backend sử dụng async/await cho tất cả database operations
- Frontend sử dụng Fetch API cho HTTP requests
- Tất cả dates được lưu dưới dạng ISO 8601
- Streak được tính dựa trên `lastActiveDate` của user
- Achievements được kiểm tra tự động sau mỗi lần hoàn thành nhiệm vụ

## 🚧 Tính năng tương lai

- [ ] Nhiệm vụ lặp lại (recurring tasks)
- [ ] Thông báo push
- [ ] Chia sẻ thành tựu lên mạng xã hội
- [ ] Giao diện Bean Calendar (lịch dạng hạt đậu)
- [ ] Mood tracking (theo dõi cảm xúc)
- [ ] Khu vườn cây ảo (virtual garden)
- [ ] Chat cộng đồng
- [ ] Export dữ liệu

## 📄 License

MIT License

## 👥 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

---

Được phát triển với ❤️ cho cộng đồng Humai
