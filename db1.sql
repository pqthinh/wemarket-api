SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `comment`;
DROP TABLE IF EXISTS `boolmark`;
DROP TABLE IF EXISTS `image`;
DROP TABLE IF EXISTS `notify`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `user`;


CREATE TABLE IF NOT EXIST `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `avatar` varchar(45) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `birthday` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `detetedAt` datetime DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `address`, `phone`, `email`, `avatar`, `password`, `displayName`, `sexId`, `birthday`, `createdAt`, `updatedAt`, `detetedAt`, `rowId`) VALUES
(1, 'Nguyễn Văn Huyên', 'Hải Phòng', '0954654432', 'huyennv@gmail.com', NULL, '123!@#', 'nguyenhuyen', 1, '1995-01-01 00:00:00', '2021-10-01 00:00:00', '2021-11-06 00:00:00', NULL, 1),
(3, 'Lê Thị Nga', 'Thạch Thành, Thanh Hóa', '0945675544', 'ngalt@gmail.com', NULL, '1234!@#$', 'lenga', 2, '2000-01-01 00:00:00', '2021-10-01 00:00:00', '2021-11-06 00:00:00', NULL, 2),
(4, 'Phạm Ngọc Oanh', 'Hoàng Diệu, Thái Bình', '0949875324', 'oanhpn@gmail.com', NULL, '12345!@#$%', 'phamoanh', 2, '1998-06-01 00:00:00', '2021-09-01 00:00:00', '2021-11-02 00:00:00', NULL, 3),
(5, 'Đào Minh Thu', 'Thành phố Thái Nguyên, Thái Nguyên', '0930946672', 'thudm@gmail.com', NULL, '123123qQ@', 'thudm', 2, '1992-06-04 00:00:00', '2021-09-01 00:00:00', '2021-11-02 00:00:00', NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXIST  `category` (
  `id` int(11) NOT NULL,
  `code` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `statusId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `rowId` int(11) NOT NULL,
  `image` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `code`, `name`, `description`, `statusId`, `createdAt`, `updatedAt`, `deletedAt`, `rowId`, `image`) VALUES
(1, '', 'SamSung ', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL),
(2, '', 'Realme', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL),
(3, '', 'Noteme', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL),
(4, '', 'Iphone', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL),
(5, '', 'Oppo', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL),
(6, '', 'Vinsmart', ' ', 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE IF NOT EXIST `comment` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `content` varchar(45) NOT NULL,
  `userId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `productId` int(11) NOT NULL,
  `star` int(11) DEFAULT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image`)),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXIST `boolmark` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE IF NOT EXIST `image` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `productId` int(11) NOT NULL,
  `url` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `rowId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notify`
--

CREATE TABLE IF NOT EXIST `notify` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `adminId` int(11) NOT NULL,
  `content` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL,
  `isRead` int(11) NOT NULL,
  `code` varchar(45) NOT NULL,
  `title` varchar(3000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE IF NOT EXIST `order` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quality` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXIST `product` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `price` bigint(15) DEFAULT NULL,
  `productStatusId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  `deletedAt` date DEFAULT NULL,
  `lng` varchar(20) DEFAULT '105.7823',
  `lat` varchar(20) DEFAULT '21.0369',
  `address` varchar(255) NOT NULL,
  `adminId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `images` varchar(2000) NOT NULL DEFAULT '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]',
  `status` varchar(100) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `code`, `name`, `description`, `categoryId`, `price`, `productStatusId`, `userId`, `createdAt`, `updatedAt`, `deletedAt`, `lng`, `lat`, `address`, `adminId`, `quantity`, `images`, `status`) VALUES
(1, '1', 'Samsung Galaxy Note 10 Plus 5G 256GB Korea | Ship', 'Samsung Galaxy Note 10 Plus 5G Korea 256Gb', 1, 9490000, 1, 0, '2021-06-06', '2021-07-11', NULL, NULL, NULL, 'Phạm Văn Đồng, Cầu Giấy, Hà Nội', NULL, 3, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(6, '2', ' Apple iPhone 8 plus lock', 'Iphone 8pl lock, dùng như quốc tế, hiện em đang sử dụng do như cầu lên đời, em muốn nhượng lại hoặc giao lưu lên iphone đời cao hơn. Pin 100% mới, nguyên main . Chưa thay hay sửa chữa gì.', 2, 4500000, 1, 2, '2021-02-06', '2021-06-11', NULL, NULL, NULL, '50 Trần Bình, Hồ Tùng Mậu, Cầu Giấy, Hà Nội', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(7, '3', 'Xiaomi Mi 9T ram 6g 64 GB chính hãng New 98%', 'rin nguyên bản, full chức năng có sạc cáp , nhận giao hàng ship cod . Máy giống hình chụp trên chotot, máy nghiêm chỉnh ram 6g', 3, 3000000, 1, 3, '2021-06-06', '2021-03-11', NULL, NULL, NULL, 'Số 9, Quan Nhân, Thanh Xuân, Hà Nội', NULL, 2, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(8, '4', 'Xiaomi Mi 5X Đen 64 GB Máy full - giá rẽ', 'Xiaomi Mi 5x full chức năng', 4, 5000000, 1, 4, '2021-06-06', '2021-06-11', NULL, NULL, NULL, 'Nguyễn Văn Huyên, Cầu Giấy', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(9, '5', 'Oppo f5 4/32 ko lỗi lầm .mở khóa bằng vân tay nhận', 'Oppo f5 4/32 ko lỗi lầm .mở khóa bằng vân tay nhận diện Lỗi đến chỗ làm nhận máy hoàn tiền 1tr8 q2 ( liện hệ để ép giá yêu thương)', 5, 3200000, 1, 5, '2021-05-05', '2021-04-03', NULL, NULL, NULL, 'Hoàng Quốc Việt, Bắc Từ Liêm', NULL, 2, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(10, '6', 'Samsung Galaxy J 6 cần bán', 'Bán em ss J6 máy xai ok chưa sửa chữa lần nào. Bán 900k cho anh em về xai.', 6, 3500000, 0, 6, '2021-02-02', '2021-03-14', NULL, NULL, NULL, 'Thanh Xuân, Hà Nội', NULL, 2, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(11, '7', 'Điện thoại oppo 2 sim 2 sóng', 'bán điện thoại oppo r831 hai sim hai sóng , nghe gọi bình thường , cảm ứng mượt , zalo , yutobe .....full chức năng', 7, 5000000, 1, 7, '2021-03-11', '2021-05-05', NULL, NULL, NULL, 'Long Biên, Hà Nội', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(12, '8', 'Asus Zenfone Selfie Hồng 32 GB', 'Mọi chức năng hoạt động tốt. Máy có thêm 1 cục pin để thay thế. Ram 3, rom 32gh. Pin sạc vô chậm. Dùng sạc dự phòng hay sạc zin sẽ sạc nhanh hơn.', 8, 1000000, 0, 8, '2021-01-01', '2021-04-09', NULL, NULL, NULL, 'Thạch Thành, Thanh Hóa', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(13, '9', 'Samsung Note 10 Plus màu đa sắc SSVN Ram 12/256 GB', 'Cần Bán Samsung Note 10 plus màu Bạc đa sắc màn đẹp keng trong veo không ám ố. chỉ có lưng bị nứt không ảnh hưởng gì đến chức năng của máy. giá trên bao gồm máy + phụ kiện sạc cáp 25w sạc siêu nhanh và ốp. giá có fix nhẹ', 9, 3990000, 1, 9, '2021-05-23', '2021-04-07', NULL, NULL, NULL, 'Hoàng Diệu, Thái Bình', NULL, 2, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(14, '10', 'S20 Plus 5G⛔256gb✅Hiếm Lưng Gốm Zin Áp Bán GL', 'S20 plus 5G__bộ nhớ 256gb nha ae... máy xài chip Snapdragon 865 hiệu năng cực kỳ mạnh mẽ màn hình 120 HZ trải nghiệm lướt web tác vụ rất phê ae ak màn hình đẹp sắc xảo', 10, 4490000, 1, 10, '2020-01-05', '2021-07-23', NULL, NULL, NULL, 'Tân Bình, Thành phố Hồ Chí Minh', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(15, '11', 'Samsung Galaxy A71 Ram 8 Snapdragon', 'Samsung Galaxy A71 Snapdragon chiến game tốt Màn hình đẹp. Thiết kế đẹp.Pin xài trâu', 11, 3000000, 0, 11, '2021-05-23', '2021-09-07', NULL, NULL, NULL, 'Nam Đàn, Nghệ An', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(16, '12', 'Samsung Galaxy J510 máy cỏ 97/98% bh 3 tháng', 'Máy cỏ full chức năng, bảo hành 3 tháng đủ phụ kiện.', 12, 2000000, 1, 12, '2020-01-05', '2021-07-23', NULL, NULL, NULL, 'Quốc Oai, Hà Nội', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(17, '13', 'Chợ TốtĐiện thoạiSamsung Galaxy J6 plusSamsung Galaxy J6 plus Tp Hồ Chí MinhSamsung Galaxy J6 plus Quận 7Galaxy A6 Plus 3gb/32gb full phụ kiện bh 6th', 'Máy full 99% , full phụ kiện bảo hành 6tháng.Màu sắc: Đỏ', 13, 1500000, 0, 13, '2021-03-11', '2021-05-05', NULL, NULL, NULL, '146, Huỳnh Tấn Phát,  Tân Thuận Tây, Quận 7 tp hcm', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(18, '14', 'Apple iPhone 6S plus Đủ màu Full Phụ kiện bh 9th', 'Máy shop về đủ màu, full phụ kiện, bảo hành 9th', 14, 2000000, 1, 14, '2021-02-02', '2021-03-14', NULL, NULL, NULL, '112 Hoàng Diệu, Ninh Bình', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(30, '15', 'Oppo F5 4gb/32gb full ken 99% bảo hành 9th', 'Máy full ken 98-99% bảo hành 9 tháng, full phụ kiện', 15, 2990000, 1, 15, '2021-01-01', '2021-04-09', NULL, NULL, NULL, '1 Phạm Văn Đồng, Cầu Giấy, Hà Nội', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(31, '16', 'Xiaomi Rdmi 9S 6gb/128gb Full ken 99% bảo hành 9t', 'Máy full ken 99% , bảo hành 9 tháng kèm phụ kiện sạc không hộp,màu sắc: Trắng, bảo hành 6 tháng. ', 16, 1990000, 1, 16, '2021-06-06', '2021-06-07', NULL, NULL, NULL, 'Vĩnh Phú, Vĩnh Phúc', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(32, '17', ' Note 10 plus bản 5G 12/256gb zin đẹp net căng', 'máy zin đẹp 99%, chuẩn zin nguyên áp suất không ám ẩn, không lỗi, máy zin nguyên bản', 17, 5990000, 1, 17, '2021-02-13', '2021-09-02', NULL, NULL, NULL, 'TP Việt Trì, Phú Thọ', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(33, '18', 'Mi 8 LiTe new 100% 4/64 2 sim, snap 660 chiến game', 'Shop về được số lượng Mi8 lite, bản 2 sim 4/64gb, snap 660 khỏe chiến mọi game hot hiện nay, pin trâu bò. Mọi thứ hoàn hảo. Máy new mới nguyên 100%.', 18, 2490000, 1, 18, '2021-06-06', '2021-09-02', NULL, NULL, NULL, 'Phù Ninh, TP  Phú Thọ', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(34, '19', 'Google pixel 3aXL thuần gg siêu mượt, zin đẹp', 'Shop về được ít máy Google pixel 3aXL. bản không tai thỏ, nguyên khối, thiết kế đẹp mắt. Chip snap mạnh mẽ, màn hình 2k, pin trâu. Hệ điều hàng siêu siêu mượt. Camera đỉnh cao', 19, 3490000, 1, 19, '2021-03-21', '2021-11-01', NULL, NULL, NULL, 'TT Nghèn, Can Lộc, Hà Tĩnh', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active'),
(35, '20', 'S10 plus mỹ snap 855 zin áp 98 99% có bán trả góp', 'Bên mình mời về được số lượng S10 plus bản Mỹ chip snap 855 dành cho ae chiến game vô tư ko lo nghĩ.', 20, 2390000, 1, 20, '2021-02-02', '2021-06-07', NULL, NULL, NULL, 'Nghi Lộc, Nghệ An', NULL, 1, '[https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc-sau.jpg,https://cdn.mobilecity.vn/mobilecity-vn/images/2021/07/iphone-11-pro-max-mat-truoc.jpg]', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXIST  `user` (
  `id` int(11) NOT NULL,
  `uid` varchar(20) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'InActive',
  `gender` varchar(4) NOT NULL DEFAULT 'NaN',
  `birthday` varchar(45) NOT NULL,
  `avatar` varchar(200) DEFAULT 'https://firebasestorage.googleapis.com/v0/b/wemarket-a8540.appspot.com/o/avatar.jpg?alt=media&token=5adcd27c-dc51-4361-8cde-558e54a5b3e6',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uid`, `username`, `address`,  `email`, `phone`, `status`, `gender`, `birthday`, `avatar`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ZVWjy74rfrUYvWMpH2Ai', 'vo thi van', 'ha tinh', 'meo@gmail', '123', '0', '2', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'MF2Tt0kqz5PbwEbfOGUY', 'dao minh hoan', 'hai duong', 'meo@gmail.com', '123', '0', '2', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'v7Sbxgu4J5UlJd3ic2jR', 'vu quynh trang', 'thai binh', 'meo@', '123', '0', '2', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Pi4vXXUZLjT4py1X2mKM', 'nguyen hoai thu', 'thai binh', 'meo@', '123', '0', '2', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tendanhmuc` (`name`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `notify`
--
ALTER TABLE `notify`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
