-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Feb 03, 2022 alle 23:19
-- Versione del server: 10.4.21-MariaDB
-- Versione PHP: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `avo4cum`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `creation_date` date NOT NULL,
  `img_cover` blob DEFAULT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `classes`
--

INSERT INTO `classes` (`id`, `name`, `creation_date`, `img_cover`, `archived`) VALUES
(3, '3bi', '0000-00-00', NULL, 0),
(4, '2bi', '2022-01-05', NULL, 0),
(5, '3bi', '0000-00-00', NULL, 0),
(6, '2wv', '2022-01-05', NULL, 0),
(7, 'www', '2022-01-05', NULL, 0),
(8, '', '0000-00-00', NULL, 0),
(9, 'ssssd', '2022-01-05', NULL, 0),
(10, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(11, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(12, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(13, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(14, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(15, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(16, 'provaIOOOOO', '0000-00-00', 0x2e2e2e2e, 0),
(17, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(18, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(19, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(20, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(21, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(22, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(23, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(24, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(25, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(26, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(27, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(28, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(29, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(30, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(31, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(32, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(33, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(34, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0),
(35, 'classeDiMich', '0000-00-00', 0x2e2e2e2e, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `courses`
--

CREATE TABLE `courses` (
  `id_course` int(11) NOT NULL,
  `email_creator` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(156) DEFAULT NULL,
  `creation_date` date NOT NULL,
  `subject` enum('Mathematics','Electrical engineering',' Informatics',' English','Statistics','Chemistry') NOT NULL,
  `img_cover` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `courses_users`
--

CREATE TABLE `courses_users` (
  `email` varchar(255) NOT NULL,
  `id_course` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `exercise`
--

CREATE TABLE `exercise` (
  `id_exercise` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `id_unit` int(11) NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `id_class` int(11) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `invitations`
--

INSERT INTO `invitations` (`id`, `id_class`, `email`) VALUES
(1, 20, 's5779870b@studenti.itisavogadro.it'),
(5, 21, 's5779870b@studenti.itisavogadro.it');

-- --------------------------------------------------------

--
-- Struttura della tabella `lessons`
--

CREATE TABLE `lessons` (
  `id_lesson` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `creation_date` datetime NOT NULL,
  `link_video` varchar(255) NOT NULL,
  `quiz` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `prof_classes`
--

CREATE TABLE `prof_classes` (
  `email` varchar(255) NOT NULL,
  `id_class` int(11) NOT NULL,
  `role` enum('tutor','normal') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `prof_classes`
--

INSERT INTO `prof_classes` (`email`, `id_class`, `role`) VALUES
('asasd@aasd.com', 20, 'tutor'),
('asasd@aasd.com', 21, 'tutor'),
('asasd@aasd.com', 24, 'tutor'),
('asasd@aasd.com', 25, 'tutor'),
('asasd@aasd.com', 26, 'tutor'),
('asasd@aasd.com', 27, 'tutor'),
('asasd@aasd.com', 28, 'tutor'),
('asasd@aasd.com', 29, 'tutor'),
('asasd@aasd.com', 30, 'tutor'),
('asasd@aasd.com', 31, 'tutor'),
('asasd@aasd.com', 32, 'tutor'),
('asasd@aasd.com', 33, 'tutor'),
('asasd@aasd.com', 34, 'tutor'),
('asasd@aasd.com', 35, 'tutor');

-- --------------------------------------------------------

--
-- Struttura della tabella `units`
--

CREATE TABLE `units` (
  `id_unit` int(11) NOT NULL,
  `id_course` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `role` enum('01','02','03') NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `registration_date` date NOT NULL,
  `img_profile` blob DEFAULT NULL,
  `id_class` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`email`, `role`, `username`, `firstname`, `lastname`, `password`, `registration_date`, `img_profile`, `id_class`) VALUES
('asasd@aasd.com', '02', 'addadsa', 'adad', 'adadsa', '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd', '2022-01-28', NULL, NULL),
('s5779870b@studenti.itisavogadro.it', '01', 'username', 'nomegenerico', 'cognomegenerico', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2022-01-27', NULL, NULL);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id_course`),
  ADD KEY `email_creator` (`email_creator`);

--
-- Indici per le tabelle `courses_users`
--
ALTER TABLE `courses_users`
  ADD UNIQUE KEY `email` (`email`,`id_course`),
  ADD KEY `courses_users_ibfk_2` (`id_course`);

--
-- Indici per le tabelle `exercise`
--
ALTER TABLE `exercise`
  ADD PRIMARY KEY (`id_exercise`);

--
-- Indici per le tabelle `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_class` (`id_class`,`email`),
  ADD KEY `email` (`email`);

--
-- Indici per le tabelle `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id_lesson`);

--
-- Indici per le tabelle `prof_classes`
--
ALTER TABLE `prof_classes`
  ADD PRIMARY KEY (`email`,`id_class`),
  ADD KEY `id_class` (`id_class`);

--
-- Indici per le tabelle `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id_unit`),
  ADD UNIQUE KEY `id_course` (`id_course`,`name`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT per la tabella `courses`
--
ALTER TABLE `courses`
  MODIFY `id_course` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `exercise`
--
ALTER TABLE `exercise`
  MODIFY `id_exercise` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id_lesson` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `units`
--
ALTER TABLE `units`
  MODIFY `id_unit` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`email_creator`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Limiti per la tabella `courses_users`
--
ALTER TABLE `courses_users`
  ADD CONSTRAINT `courses_users_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `courses_users_ibfk_2` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`) ON DELETE CASCADE;

--
-- Limiti per la tabella `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `prof_classes`
--
ALTER TABLE `prof_classes`
  ADD CONSTRAINT `prof_classes_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `prof_classes_ibfk_2` FOREIGN KEY (`id_class`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_ibfk_1` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
