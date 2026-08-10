-- Phoenixi Studios Database Schema
-- Compatible with MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS `phoenixi_studios` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `phoenixi_studios`;

-- Table: worlds
CREATE TABLE IF NOT EXISTS `worlds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `destination_url` VARCHAR(255) DEFAULT '#',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial worlds catalogue
INSERT INTO `worlds` (`slug`, `name`, `destination_url`) VALUES
('ixi-house', 'IXI House', '#'),
('phoenixi', 'Phoenixi', '#'),
('ixi-family', 'IXI Family', '#')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
