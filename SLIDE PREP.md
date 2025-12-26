1.  ## **slide 1**

        content

    system overall  
    technology and system architecture  
    analyze and design  
    setup and result

2.  ## **slide 2**

reason for the project  
Larana, Inc.  
LÝ DO CHỌN  
ĐỀ TÀI  
Hỗ trợ chuyển đổi số trong giáo dục,  
giúp các trường học thích ứng với yêu  
cầu công nghệ trong môi trường học tập  
hiện đại.

Tạo điều kiện cho việc kiểm tra từ xa,  
giúp học sinh và sinh viên không bị giới  
hạn về địa lý.

Tận dụng công nghệ AI và nhận diện  
khuôn mặt để đảm bảo tính xác thực và  
an toàn cho quá trình thi.

Giảm chi phí giám sát thi, giúp các cơ sở  
giáo dục tiết kiệm tài nguyên cho việc tổ  
chức kỳ thi.

3. ## **s3**

Mục tiêu  
Tạo ra một nền tảng người dùng  
thân thiện, dễ sử dụng cho cả  
thí sinh và giám thị.

Xây dựng hệ thống có khả năng  
mở rộng để đáp ứng nhu cầu sử  
dụng của nhiều trường học và tổ  
chức giáo dục.

Phát triển một hệ thống thi  
trực tuyến với công cụ giám  
sát AI tích hợp giúp đảm bảo  
sự công bằng và bảo mật.

4. ## **s3**

Vấn đề cần giải quyết  
Đảm bảo tính toàn vẹn và  
công bằng của kỳ thi  
Đảm bảo khả năng mở  
rộng và hiệu suất trong  
thời gian cao điểm  
Giám sát thời gian thực  
và phát hiện gian lận

5. ## **s3**

chức năng hệ thống  
sinh viên

- Làm bài thi trực tuyến \- Xem danh sách bài thi, làm bài  
  với giao diện thân thiện, tự động lưu đáp án, tự động  
  nộp khi hết giờ.
- Xác thực danh tính bằng AI \- Đăng ký khuôn mặt, xác  
  thực trước khi thi, giám sát liên tục trong suốt quá  
  trình làm bài
- Xem kết quả & phân tích \- Xem điểm, đáp án đúng, giải  
  thích, phân tích theo loại câu hỏi và tóm tắt vi phạm  
  (nếu có)
- Quản lý nhóm & thông báo \- Tham gia nhóm học qua mã  
  mời, nhận thông báo lịch thi/kết quả qua  
  Email/Push/SSE

6. ## **s3**

chức năng hệ thống  
giáo viên

- Quản lý bài thi & ngân hàng câu hỏi \- Tạo bài thi với nhiều  
  cấu hình, quản lý ngân hàng câu hỏi theo danh mục/độ  
  khó, import từ Excel/CSV
- Giám sát thi trực tiếp (Live Proctoring) \- Xem sinh viên  
  đang thi real-time, nhận cảnh báo vi phạm, gửi tin  
  nhắn/cảnh cáo tới sinh viên
- Chấm điểm & xử lý vi phạm \- Chấm câu tự luận, xem xét vi  
  phạm với bằng chứng (ảnh chụp), quyết định xử lý (bỏ  
  qua/cảnh cáo/trừ điểm/hủy bài)
- Dashboard phân tích \- Thống kê điểm, tỷ lệ hoàn thành,  
  phân tích độ khó câu hỏi, xuất báo cáo PDF/Excel

7. ## **s3**

chức năng hệ thống  
admin

- Quản lý người dùng toàn hệ thống \- CRUD tài khoản,  
  phân quyền RBAC (Student/Teacher/Admin), kích  
  hoạt/vô hiệu hóa, reset mật khẩu
- Quyền override toàn hệ thống \- Truy cập/chỉnh sửa mọi  
  bài thi, chấm điểm lại, override quyết định của giáo viên  
  với lý do
- Cấu hình & giám sát hệ thống \- Cài đặt bảo mật, ngưỡng  
  proctoring, email SMTP, theo dõi sức khỏe hệ thống  
  (CPU/RAM/Disk)
- Audit logs & thông báo hàng loạt \- Xem lịch sử hoạt  
  động chi tiết, gửi thông báo bulk theo nhóm/vai trò,  
  giám sát trạng thái gửi

8. ## **s3**

chức năng hệ thống  
HỆ THỐNG

- Casdoor xử lý xác thực và phân quyền người dùng qua  
  OAuth2, SSO, MFA, và RBAC.
- AI Proctoring (MediaPipe) \- Phát hiện khuôn mặt, đếm số  
  người, theo dõi hướng nhìn, nhận dạng hành vi bất  
  thường \- xử lý local bảo vệ quyền riêng tư
- Anti-Cheating Frontend \- Chặn DevTools/copy-  
  paste/right-click, bắt buộc fullscreen, phát hiện  
  chuyển tab, phát hiện extension gian lận
- Dịch vụ chấm điểm tự động giúp tự động chấm các câu  
  hỏi trắc nghiệm.
- Hệ thống gửi thông báo qua real-time notifications và  
  email cho quản trị viên, giáo viên và sinh viên.

9. ## **s3**

messege queue:  
Redis stream  
authentication:  
casdoor  
identity: mediapipe  
\+ python  
database: postgres  
\+ timescale db  
backend:  
golang \+ java  
frontend:  
react+vite \+  
typescript  
infra:  
2\. Công nghệ và kiến  
trúc hệ thống

10. ## **s**

mediapipe

11. ## **s3**

devops ?

12. ## **s3**

3\. phân  
tích và  
thiết  
kế  
sơ đồ thành  
phần hệ thống  
\<an image for app architect\>

13. ## **s3**

sơ đồ  
usecase  
tổng  
quan  
\<image for usecases\>

14. ## **s3**

luồng face registration  
\<image for face regis flow\>

15. ## **s3**

luồng teacher monitor exam  
\<image for flow\>

16. ## **s3**

4\. DEMO

17. ## **s3**

18. ## **s3**

19. ## **s3**

20. ## **s3**

21. ## **s3**

22. ## **s3**

23. ## **s3**

24. ## **s3**

25. ## **s3**

26. ## **s3**

27. ## **s3**

28. ## **s3**

29. ## **s3**

30. ## **s3**

31. ## **s3**

32. ## **s3**

33. ## **s3**

34. ## **s3**

35. ## **s3**

36. ## **s3**

37. ## **s3**

38. ## **s3**

39. ## **s3**

40. ## **s3**

41. ## **s3**
