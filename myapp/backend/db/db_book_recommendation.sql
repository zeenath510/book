-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2025 at 11:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_book_recommendation`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `aid` int(11) NOT NULL,
  `aname` varchar(150) NOT NULL,
  `apass` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`aid`, `aname`, `apass`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_books`
--

CREATE TABLE `tbl_books` (
  `bid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `published_year` year(4) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `page_count` int(11) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_books`
--

INSERT INTO `tbl_books` (`bid`, `title`, `author`, `genre`, `description`, `publisher`, `published_year`, `language`, `isbn`, `page_count`, `cover_image`, `tags`) VALUES
(2, 'rdsaasd', 'werwer', 'Animi', 'Sample Description', 'werwqqq', '1950', 'English', 'ISEW7878545', 600, '/uploads/1755525649464-13.png', 'trending'),
(3, 'Kambaramayanam', 'Kambar', 'Devotional', 'Testing ', 'Ashok', '0000', 'Tamil', 'INE@47884455', 450, '/uploads/1755150423980-674057be7e939c43a4992c27_model.webp', 'History, God'),
(4, 'Men from Mars Women from Venus', 'John Gray', 'Romantic', 'You can\'t live with them - and you can\'t live without them! This is a lively book on successful communication between the sexes, allowing people all over the world to work out what makes members of the opposite sex tick and learn to understand their verbal and non-verbal language, ultimately reaching a point of harmony where it becomes possible to live, work and love together. The advice teaches you to: motivate the opposite sex and get what you want; avoid arguments and promote fruitful communication; learn what will really impress your mate and score points with the opposite sex; learn about the real emotional needs of the opposite sex and the behaviours associated with these needs; and discover the keys to keeping love alive - and staying together long term.', 'Paperback', '1993', 'English', 'INE33700086', 146, '/uploads/1755151378500-9780722528402.jpg', 'love,romantic');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `uid` int(11) NOT NULL,
  `uname` varchar(150) NOT NULL,
  `uemail` varchar(150) NOT NULL,
  `umobile` varchar(150) NOT NULL,
  `upass` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`uid`, `uname`, `uemail`, `umobile`, `upass`) VALUES
(1, 'Alice Johnson', 'alice.johnson@gmail.com', '9876543210', 'passAlice@123'),
(2, 'Bob Smith', 'bob.smith@gmail.com', '9123456780', 'passBob@123'),
(3, 'Charlie Brown', 'charlie.brown@gmail.com', '9988776655', 'passCharlie@123'),
(4, 'Diana Prince', 'diana.prince@gmail.com', '9098765432', 'passDiana@123'),
(5, 'Ethan Hunt', 'ethan.hunt@gmail.com', '9345678901', 'passEthan@123'),
(6, 'Ram Kumar', 'ram123@gmail.com', '7896543210', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`aid`);

--
-- Indexes for table `tbl_books`
--
ALTER TABLE `tbl_books`
  ADD PRIMARY KEY (`bid`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_books`
--
ALTER TABLE `tbl_books`
  MODIFY `bid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
