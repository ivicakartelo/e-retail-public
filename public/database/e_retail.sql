-- phpMyAdmin SQL Dump
-- Version: 5.2.1
-- https://www.phpmyadmin.net/
-- Host: 127.0.0.1
-- Generated: Dec 19, 2024 at 05:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Set character set and collation
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `e_retail`
CREATE DATABASE IF NOT EXISTS `e_retail` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `e_retail`;

-- Table: `article`
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `article_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `image_1` VARCHAR(50) DEFAULT NULL,
  `image_2` VARCHAR(50) DEFAULT NULL,
  `promotion_at_homepage_level` VARCHAR(1) NOT NULL,
  `promotion_at_department_level` VARCHAR(1) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article` (`article_id`, `name`, `description`, `price`, `image_1`, `image_2`, `promotion_at_homepage_level`, `promotion_at_department_level`) VALUES
(56, 'Top 10 Smartphones of 2024: Features and Reviews', 'mauris sollicitudin, faucibus nisi vel...', 19.28, '1732807137337-964721728-1.png', '1732807137337-345654659-2.png', '1', '0'),
(57, 'Best Laptops for Students: Affordable and Powerful', 'tempor, sed AUTO fringilla REACT TUTORIALS...', 0.00, '1732807686614-470342021-3.png', '1732807686614-487583442-4.png', '0', '1'),
(58, 'The Top 5 Electric Cars', 'vitae libero tempor, ut pellentesque dui...', 23.00, '1732812274112-465665101-4.png', '1732812274113-582937207-1.png', '0', '1'),
(59, 'How to Choose the Perfect Tires and Wheels for You', 'vitae lacus. Etiam ut nunc sed erat dictum...', 12.44, '1732812438698-993007923-4.png', '1732812438699-560100139-2.png', '1', '0'),
(60, 'Exploring the Best Contemporary Fiction Authors of', 'Pellentesque ornare risus purus...', 16.40, '1732813307830-311826258-3.png', '1732813307832-615631743-1.png', '0', '0'),
(61, '10 Must-Read Classics That Shaped Modern Literatur', 'ignissim risus AUTOBIOGRAPHY...', 7.25, '1734384110407-985289640-logo.png', '1734384110408-500992828-1.png', '1', '0');

-- Table: `category`
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `department_id` INT(11) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
  PRIMARY KEY (`category_id`),
  KEY `department_id` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `category` (`category_id`, `department_id`, `name`, `description`) VALUES
(12, 1, 'Mobile Phones', 'fermentum vehicula, ante tellus ultricies...'),
(13, 5, 'Laptops & Computers', 'nec quam consequat faucibus vel quis ipsum...'),
(14, 8, 'Car Parts & Accessories', 'dignissim. Nullam faucibus AUTO pulvinar...'),
(15, 8, 'Tires & Wheels', 'dignissim risus sit amet, viverra sapien...'),
(16, 5, 'Fiction & Literature', 'Nullam faucibus pulvinar finibus...');

-- Table: `category_article`
DROP TABLE IF EXISTS `category_article`;
CREATE TABLE `category_article` (
  `category_id` INT(10) UNSIGNED NOT NULL,
  `article_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`category_id`, `article_id`),
  KEY `article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `category_article` (`category_id`, `article_id`) VALUES
(12, 56),
(12, 57),
(13, 56),
(13, 57),
(14, 58),
(15, 59),
(16, 60),
(16, 61);

-- Table: `department`
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `department_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL DEFAULT '',
  `description` TEXT DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `department` (`department_id`, `name`, `description`) VALUES
(1, 'Electronics', 'Electronic gadgets and devices'),
(2, 'Clothing & Apparel', 'Fashion and accessories for men and women'),
(3, 'Home & Kitchen', 'Appliances and kitchenware for home use'),
(4, 'Sports & Outdoors', 'Gear for sports and outdoor activities'),
(5, 'Books', 'Books, magazines, and reading materials'),
(6, 'Toys & Games', 'Toys for children and gaming consoles'),
(7, 'Health & Beauty', 'Healthcare products and beauty essentials'),
(8, 'Automotive', 'Car accessories and tools for vehicles'),
(9, 'Groceries', 'Daily essentials and groceries'),
(10, 'Furniture', 'Furniture for home and office use');

-- Foreign Keys
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE;

ALTER TABLE `category_article`
  ADD CONSTRAINT `category_article_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `category_article_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE `users` (
  `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',

  -- Delivery Address fields
  `delivery_name` VARCHAR(100) DEFAULT NULL,  -- Name of the recipient
  `delivery_street` VARCHAR(255) DEFAULT NULL,
  `delivery_city` VARCHAR(100) DEFAULT NULL,
  `delivery_state` VARCHAR(100) DEFAULT NULL,  -- State is optional
  `delivery_country` VARCHAR(100) DEFAULT NULL,
  `delivery_zip_code` VARCHAR(20) DEFAULT NULL, -- Added zip code field

  -- Billing Address fields
  `billing_name` VARCHAR(100) DEFAULT NULL,  -- Name for the bill
  `billing_street` VARCHAR(255) DEFAULT NULL,
  `billing_city` VARCHAR(100) DEFAULT NULL,
  `billing_state` VARCHAR(100) DEFAULT NULL,  -- State is optional
  `billing_country` VARCHAR(100) DEFAULT NULL,
  `billing_zip_code` VARCHAR(20) DEFAULT NULL, -- Added zip code field

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,

  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` 
(`name`, `email`, `password`, `role`, 
 `delivery_name`, `delivery_street`, `delivery_city`, `delivery_state`, `delivery_country`, `delivery_zip_code`, 
 `billing_name`, `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_zip_code`) 
VALUES
('Alice Johnson', 'alice@example.com', 'hashed_password_1', 'customer', 
 'Alice Johnson', '123 Main St', 'New York', 'NY', 'USA', '10001', 
 'Alice Johnson', '123 Main St', 'New York', 'NY', 'USA', '10001'),

('Bob Smith', 'bob@example.com', 'hashed_password_2', 'customer', 
 'Bob Smith', '456 Elm St', 'Los Angeles', 'CA', 'USA', '90001', 
 'Bob Smith', '456 Elm St', 'Los Angeles', 'CA', 'USA', '90001'),

('Charlie Brown', 'charlie@example.com', 'hashed_password_3', 'customer', 
 'Charlie Brown', '789 Pine St', 'Chicago', 'IL', 'USA', '60601', 
 'Charlie Brown', '789 Pine St', 'Chicago', 'IL', 'USA', '60601'),

('Diana Prince', 'diana@example.com', 'hashed_password_4', 'admin', 
 'Diana Prince', '321 Oak St', 'Miami', 'FL', 'USA', '33101', 
 'Diana Prince', '321 Oak St', 'Miami', 'FL', 'USA', '33101'),

('Edward Wilson', 'edward@example.com', 'hashed_password_5', 'customer', 
 'Edward Wilson', '555 Cedar St', 'Seattle', 'WA', 'USA', '98101', 
 'Edward Wilson', '555 Cedar St', 'Seattle', 'WA', 'USA', '98101'),

('Fiona Davis', 'fiona@example.com', 'hashed_password_6', 'customer', 
 'Fiona Davis', '777 Birch St', 'Austin', 'TX', 'USA', '73301', 
 'Fiona Davis', '777 Birch St', 'Austin', 'TX', 'USA', '73301'),

('George Harris', 'george@example.com', 'hashed_password_7', 'admin', 
 'George Harris', '888 Maple St', 'Denver', 'CO', 'USA', '80201', 
 'George Harris', '888 Maple St', 'Denver', 'CO', 'USA', '80201'),

('Hannah Lee', 'hannah@example.com', 'hashed_password_8', 'customer', 
 'Hannah Lee', '999 Walnut St', 'Boston', 'MA', 'USA', '02108', 
 'Hannah Lee', '999 Walnut St', 'Boston', 'MA', 'USA', '02108'),

('Isaac Turner', 'isaac@example.com', 'hashed_password_9', 'customer', 
 'Isaac Turner', '222 Spruce St', 'San Francisco', 'CA', 'USA', '94101', 
 'Isaac Turner', '222 Spruce St', 'San Francisco', 'CA', 'USA', '94101'),

('Julia Roberts', 'julia@example.com', 'hashed_password_10', 'customer', 
 'Julia Roberts', '333 Willow St', 'Houston', 'TX', 'USA', '77001', 
 'Julia Roberts', '333 Willow St', 'Houston', 'TX', 'USA', '77001');

CREATE TABLE `orders` (
  `order_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `total_amount` DECIMAL(10,2) NOT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL, -- Soft delete column
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orders` (`user_id`, `order_date`, `status`, `total_amount`)
VALUES
(1, NOW(), 'pending', 59.99), 
(2, NOW(), 'processing', 120.50),
(3, NOW(), 'shipped', 89.25),
(4, NOW(), 'delivered', 45.00),
(5, NOW(), 'cancelled', 200.00);

CREATE TABLE `order_items` (
  `order_item_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT(10) UNSIGNED NOT NULL,
  `article_id` INT(10) UNSIGNED NOT NULL,
  `quantity` INT(10) UNSIGNED NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `article_comments` (
  `comment_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT(10) UNSIGNED NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `parent_comment_id` INT(10) UNSIGNED DEFAULT NULL COMMENT 'For reply comments, NULL if top-level',
  `comment_text` TEXT NOT NULL,
  `rating` TINYINT(1) UNSIGNED DEFAULT NULL COMMENT 'Rating 1-5 stars (NULL if no rating)',
  `is_approved` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=pending, 1=approved, 2=rejected',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete',
  
  PRIMARY KEY (`comment_id`),
  KEY `article_id` (`article_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  
  CONSTRAINT `fk_comment_article` 
    FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) 
    ON DELETE CASCADE,
    
  CONSTRAINT `fk_comment_user` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE,
    
  CONSTRAINT `fk_comment_parent` 
    FOREIGN KEY (`parent_comment_id`) REFERENCES `article_comments` (`comment_id`) 
    ON DELETE SET NULL
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User comments and ratings for articles';

-- Top-level comment with rating
INSERT INTO `article_comments` 
(`article_id`, `user_id`, `comment_text`, `rating`, `is_approved`)
VALUES
(56, 1, 'Great smartphone! The camera quality is amazing.', 5, 1);

-- Reply to a comment
INSERT INTO `article_comments` 
(`article_id`, `user_id`, `parent_comment_id`, `comment_text`, `is_approved`)
VALUES
(56, 2, 1, 'I agree! The battery life is excellent too.', 1);

-- Unapproved comment
INSERT INTO `article_comments` 
(`article_id`, `user_id`, `comment_text`, `rating`)
VALUES
(56, 3, 'Had some issues with the touchscreen.', 2);

