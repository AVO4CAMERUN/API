-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Dic 18, 2021 alle 22:40
-- Versione del server: 10.4.21-MariaDB
-- Versione PHP: 8.0.11

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
  `id_class` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `creation_date` date NOT NULL,
  `img_cover` blob NOT NULL,
  `archived` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `courses`
--

CREATE TABLE `courses` (
  `id_course` int(11) NOT NULL,
  `email_creator` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `creation_date` date NOT NULL,
  `subject` enum('Mathematics','Electrical engineering',' Informatics',' English','Statistics','Chemistry') NOT NULL,
  `img_cover` blob NOT NULL
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

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `role` enum('01','02','03') NOT NULL,
  `username` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `registration_date` date NOT NULL,
  `img_profile` blob DEFAULT NULL,
  `id_class` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`email`, `role`, `username`, `first_name`, `last_name`, `password`, `registration_date`, `img_profile`, `id_class`) VALUES
('s5779870b@studenti.itisavogadro.it', '01', 'ssa', NULL, NULL, '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', '2021-12-18', NULL, NULL);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id_class`);

--
-- Indici per le tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id_course`);

--
-- Indici per le tabelle `courses_users`
--
ALTER TABLE `courses_users`
  ADD UNIQUE KEY `email` (`email`,`id_course`);

--
-- Indici per le tabelle `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id_lesson`);

--
-- Indici per le tabelle `prof_classes`
--
ALTER TABLE `prof_classes`
  ADD UNIQUE KEY `email` (`email`,`id_class`),
  ADD KEY `id_class` (`id_class`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `id_class` (`id_class`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `courses`
--
ALTER TABLE `courses`
  MODIFY `id_course` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id_lesson` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `prof_classes`
--
ALTER TABLE `prof_classes`
  ADD CONSTRAINT `prof_classes_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `prof_classes_ibfk_2` FOREIGN KEY (`id_class`) REFERENCES `classes` (`id_class`);

--
-- Limiti per la tabella `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `classes` (`id_class`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
