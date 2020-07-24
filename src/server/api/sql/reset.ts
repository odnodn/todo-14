export const resetSql = `
-- -------------------------------------------------------------
-- TablePlus 3.6.2(322)
--
-- https://tableplus.com/
--
-- Database: todo
-- Generation Time: 2020-07-24 13:18:16.2090
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS \`activity\`;
CREATE TABLE \`activity\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`type\` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`boardId\` int NOT NULL,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=588 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`card\`;
CREATE TABLE \`card\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`columnId\` int NOT NULL,
  \`userId\` int NOT NULL,
  \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`icon\` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`previousCardId\` int DEFAULT NULL,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`editedAt\` datetime DEFAULT NULL,
  \`isDeleted\` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (\`id\`),
  KEY \`fkIdx_49\` (\`columnId\`),
  CONSTRAINT \`FK_49\` FOREIGN KEY (\`columnId\`) REFERENCES \`column\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`column\`;
CREATE TABLE \`column\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`boardId\` int NOT NULL,
  \`name\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  \`previousColumnId\` int DEFAULT NULL,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`isDeleted\` tinyint(1) DEFAULT '0',
  PRIMARY KEY (\`id\`),
  KEY \`fkIdx_46\` (\`boardId\`),
  CONSTRAINT \`FK_46\` FOREIGN KEY (\`boardId\`) REFERENCES \`board\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=564 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`activity\` (\`id\`, \`type\`, \`content\`, \`boardId\`, \`createdAt\`) VALUES
('487', 'add', '<<Dark Mode 🌙>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('488', 'modify', '카드 내용이 <<Ease on our eyes\nPress left top button to switch between light mode and dark mode>>에서 <<- Ease on our eyes\n- Press left top button to switch between light mode and dark mode>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('489', 'modify', '카드 제목이 <<[API] Card>>에서 <<[ API ] Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('490', 'modify', '카드 제목이 <<[API] Column>>에서 <<[ API ] Column>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('491', 'modify', '카드 내용이 <<This is the hardest part\nNever give up\n\nw/ ANIMATION 🌈>>에서 <<This is the hardest part\nNever give up\n\nw/ ANIMATION ✨>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('492', 'modify', '카드 내용이 <<- Ease on our eyes\n- Press left top button to switch between light mode and dark mode>>에서 <<- Ease on our eyes 👀\n- Press left top button to switch between light mode and dark mode>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('493', 'modify', '카드 제목이 <<[ API ] Card>>에서 <<[ 📦 API ] Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('494', 'modify', '카드 제목이 <<[ 📦 API ] Card>>에서 <<📦 API: Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('495', 'modify', '카드 제목이 <<📦 API: Card>>에서 <<API 📦: Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('496', 'modify', '카드 제목이 <<API 📦: Card>>에서 <<[ API ] Card 📦>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('497', 'modify', '카드 제목이 <<[ API ] Column>>에서 <<[ API ] Column 📦>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('498', 'modify', '카드 제목이 <<[ API ] Card 📦>>에서 <<[ API ] Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('499', 'modify', '카드 제목이 <<[ API ] Column 📦>>에서 <<[ API ] Column>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('500', 'add', '<<Create a card 💳>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('501', 'modify', '카드 내용이 <<* Append a card form when press the plus button on the top right corner of the column>>에서 <<* Append a card form when press the plus button on the top right corner of a column>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('502', 'modify', '카드 내용이 <<* Append a card form when press the plus button on the top right corner of a column>>에서 <<* Append a card form when press the plus button on the top right corner of a column\n* Validate string on content changes>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('503', 'add', '<<Demo preparation>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('504', 'modify', '카드 제목이 <<[ API ] Card>>에서 <<[ 📚 API ] Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('505', 'modify', '카드 제목이 <<[ API ] Column>>에서 <<[ 📚 API ] Column>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('506', 'modify', '카드 제목이 <<Demo preparation>>에서 <<Demo preparation 🎬>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('507', 'modify', '카드 제목이 <<Demo preparation 🎬>>에서 <<Demo preparation 🎞>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('508', 'modify', '컬럼의 이름이 [[🏃🏻‍♂️ In Progress]]에서 [[🏃🏻‍♂️ In Progressasdmiawdoqwdqwd]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('509', 'modify', '컬럼의 이름이 [[🏃🏻‍♂️ In Progressasdmiawdoqwdqwd]]에서 [[🏃🏻‍♂️ In Progressasdmiawdoqwdqwd1222]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('510', 'modify', '컬럼의 이름이 [[🏃🏻‍♂️ In Progressasdmiawdoqwdqwd1222]]에서 [[🏃🏻‍♂️ In Progressasdmadsknadnwq]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('511', 'modify', '컬럼의 이름이 [[🏃🏻‍♂️ In Progressasdmadsknadnwq]]에서 [[asdoajdowqmd]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('512', 'modify', '카드 제목이 <<[ 📚 API ] Card>>에서 <<[ API ] Card>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('513', 'modify', '카드 제목이 <<[ 📚 API ] Column>>에서 <<[ API ] Column>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('516', 'modify', '카드 내용이 <<* Append a card form when press the plus button on the top right corner of a column\n* Validate string on content changes>>에서 <<- Append a card form when press the plus button on the top right corner of a column\n- Validate string on content changes>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('517', 'modify', '카드 내용이 <<>>에서 <<- Example To Do list\n- Demo screen to preview and display tutorials>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('518', 'modify', '컬럼의 이름이 [[asdoajdowqmd]]에서 [[In Progress]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('519', 'modify', '컬럼의 이름이 [[In Progress]]에서 [[🏃‍♂️ In Progress]]로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('522', 'modify', '카드 내용이 <<- Example To Do list\n- Demo screen to preview and display tutorials>>에서 <<- Example To Do list\n- 🖥 Demo screen to preview and display tutorials>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('523', 'add', '<<Design (Figma)>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('524', 'modify', '카드 내용이 <<- Color palette\n- Icons (Framework 7 icons)>>에서 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('525', 'modify', '카드 제목이 <<Drag and Drop ✋>>에서 <<Drag and Drop 👆>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('526', 'add', '<<Mobile Support (WIP)>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('530', 'add', '<<Allow vertical scroll inside column when drag and drop a card>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('531', 'modify', '카드 제목이 <<Mobile Support (WIP)>>에서 <<Mobile Support (WIP) 📱>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('532', 'add', '<<Change column name 🏷>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('533', 'modify', '카드 제목이 <<Change column name 🏷>>에서 <<Edit column name 🏷>>로, 카드 내용이 <<>>에서 <<- Double click to edit\n- \`contenteditable\`>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('534', 'modify', '카드 내용이 <<- Double click to edit\n- \`contenteditable\`>>에서 <<- Double click to edit\n- Use \`contenteditable\`>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('536', 'modify', '카드 내용이 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)>>에서 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('537', 'modify', '카드 내용이 <<>>에서 <<- Better UX>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('538', 'modify', '카드 내용이 <<- Better UX>>에서 <<>>로 수정되었습니다.', '1', '2020-06-24 03:44:24'),
('539', 'add', '<<Column drag and drop with scrolling>>가 [[🔥 To Do]]에 추가되었습니다.', '1', '2020-06-24 03:44:24'),
('540', 'modify', '카드 내용이 <<>>에서 <<- Use scroll snap(?)>>로 수정되었습니다.', '1', '2020-07-20 02:44:24'),
('541', 'modify', '카드 내용이 <<- Use scroll snap(?)>>에서 <<Use scroll snap(?)>>로 수정되었습니다.', '1', '2020-07-21 03:04:24'),
('542', 'modify', '카드 내용이 <<Use scroll snap(?)>>에서 <<scroll snap(?)>>로 수정되었습니다.', '1', '2020-07-21 03:44:24'),
('544', 'add', '<<Fonts 🚀>>가 [[🏃‍♂️ In Progress]]에 추가되었습니다.', '1', '2020-07-22 03:44:24'),
('545', 'modify', '카드 내용이 <<>>에서 <<Beautiful sans-serif **PAYW Pro**>>로 수정되었습니다.', '1', '2020-07-23 01:44:24'),
('546', 'modify', '카드 내용이 <<Beautiful sans-serif **PAYW Pro**>>에서 <<Beautiful sans-serif PAYW Pro>>로 수정되었습니다.', '1', '2020-07-23 03:40:24'),
('547', 'modify', '카드 제목이 <<Fonts 🚀>>에서 <<Documentation 📚>>로, 카드 내용이 <<Beautiful sans-serif PAYW Pro>>에서 <<- Stack\n- API\n- Database\n- Drag and drop\n- RFC>>로 수정되었습니다.', '1', '2020-07-23 03:44:24'),
('548', 'modify', '카드 내용이 <<- Stack\n- API\n- Database\n- Drag and drop\n- RFC>>에서 <<- Stack\n- API\n- Database\n- Drag and drop\n- RFC 💬>>로 수정되었습니다.', '1', '2020-07-24 00:44:24'),
('549', 'modify', '카드 제목이 <<Design (Figma)>>에서 <<Design (Figma 💅)>>로 수정되었습니다.', '1', '2020-07-24 01:04:24'),
('580', 'modify', '카드 내용이 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design>>에서 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design\n\n[🔗](https://www.figma.com/file/MXVVUZmgoY4NPO2BO0nfLq/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84?node-id=60%3A0)>>로 수정되었습니다.', '1', '2020-07-24 03:53:36'),
('581', 'modify', '카드 내용이 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design\n\n[🔗](https://www.figma.com/file/MXVVUZmgoY4NPO2BO0nfLq/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84?node-id=60%3A0)>>에서 <<- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design\n\n🔗[Link](https://www.figma.com/file/MXVVUZmgoY4NPO2BO0nfLq/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84?node-id=60%3A0)>>로 수정되었습니다.', '1', '2020-07-24 03:54:03'),
('584', 'add', '컬럼이 추가되었습니다.', '1', '2020-07-24 04:15:52'),
('585', 'modify', '컬럼의 이름이 [[untitled column]]에서 [[링크 테스트]]로 수정되었습니다.', '1', '2020-07-24 04:15:57'),
('586', 'add', '<<[google](www.google.com)>>가 [[링크 테스트]]에 추가되었습니다.', '1', '2020-07-24 04:16:10'),
('587', 'modify', '카드 내용이 <<- Stack\n- API\n- Database\n- Drag and drop\n- RFC 💬>>에서 <<- Stack\n- [API](https://github.com/woowa-techcamp-2020/todo-14/issues/13)\n- Database\n- [Drag and drop](https://github.com/woowa-techcamp-2020/todo-14/blob/main/doc/Drag-and-Drop-with-Animation.md)\n- RFC 💬>>로 수정되었습니다.', '1', '2020-07-24 04:17:48');

INSERT INTO \`card\` (\`id\`, \`columnId\`, \`userId\`, \`content\`, \`icon\`, \`previousCardId\`, \`createdAt\`, \`editedAt\`, \`isDeleted\`) VALUES
('273', '551', '1', '[ API ] Card\nCreate, Read, Update, Delete', NULL, '297', '2020-07-23 09:23:20', NULL, '0'),
('293', '541', '1', '[ API ] Column\nCreate, Read, Update, Delete', NULL, '305', '2020-07-24 00:15:42', NULL, '0'),
('294', '551', '1', 'Drag and Drop 👆\nThis is the hardest part\nNever give up\n\nw/ ANIMATION ✨', NULL, '273', '2020-07-24 00:20:39', NULL, '0'),
('297', '551', '1', 'Dark Mode 🌙\n- Ease on our eyes 👀\n- Press left top button to switch between light mode and dark mode', NULL, '303', '2020-07-24 00:34:09', NULL, '0'),
('298', '550', '1', 'Create a card 💳\n- Append a card form when press the plus button on the top right corner of a column\n- Validate string on content changes', NULL, '300', '2020-07-24 00:40:09', NULL, '0'),
('299', '541', '1', 'Demo preparation 🎞\n- Example To Do list\n- 🖥 Demo screen to preview and display tutorials', NULL, NULL, '2020-07-24 00:42:23', NULL, '0'),
('300', '550', '1', 'Design (Figma 💅)\n- Color palette (hand-picked 🤏)\n- Icons (Framework 7 icons)\n\n# Production version may look different to the prototypal design\n\n🔗[Link](https://www.figma.com/file/MXVVUZmgoY4NPO2BO0nfLq/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84?node-id=60%3A0)', NULL, '302', '2020-07-24 01:32:42', NULL, '0'),
('301', '541', '1', 'Mobile Support (WIP) 📱\nhorizontal vs vertical', NULL, '293', '2020-07-24 01:33:38', NULL, '0'),
('302', '550', '1', 'Allow vertical scroll inside column when drag and drop a card', NULL, '304', '2020-07-24 01:36:33', NULL, '0'),
('303', '551', '1', 'Edit column name 🏷\n- Double click to edit\n- Use \`contenteditable\`', NULL, NULL, '2020-07-24 01:40:01', NULL, '0'),
('304', '550', '1', 'Column drag and drop with scrolling\nscroll snap(?)', NULL, NULL, '2020-07-24 01:42:49', NULL, '0'),
('305', '541', '1', 'Documentation 📚\n- Stack\n- [API](https://github.com/woowa-techcamp-2020/todo-14/issues/13)\n- Database\n- [Drag and drop](https://github.com/woowa-techcamp-2020/todo-14/blob/main/doc/Drag-and-Drop-with-Animation.md)\n- RFC 💬', NULL, '299', '2020-07-24 01:44:21', NULL, '0'),
('306', '561', '1', '[범수](https://github.com/choibumsu)', NULL, '307', '2020-07-24 03:27:46', NULL, '1'),
('307', '561', '1', '[google](www.google.com)\n[google](www.google.com)', NULL, '308', '2020-07-24 03:34:33', NULL, '1'),
('308', '561', '1', '[google](www.google.com) .', NULL, '309', '2020-07-24 03:49:59', NULL, '1'),
('309', '561', '1', '[google](www.google.com)', NULL, NULL, '2020-07-24 03:52:00', NULL, '1'),
('310', '563', '1', '[google](www.google.com)', NULL, NULL, '2020-07-24 04:16:10', NULL, '0');

INSERT INTO \`column\` (\`id\`, \`boardId\`, \`name\`, \`previousColumnId\`, \`createdAt\`, \`isDeleted\`) VALUES
('541', '1', '🏃‍♂️ In Progress', '550', '2020-07-23 08:35:12', '0'),
('550', '1', '🔥 To Do', NULL, '2020-07-23 10:15:40', '0'),
('551', '1', '✅ Done', '541', '2020-07-23 11:12:08', '0'),
('561', '1', 'link test', NULL, '2020-07-24 03:27:17', '1'),
('562', '1', 'untitled column', NULL, '2020-07-24 03:49:18', '1'),
('563', '1', '링크 테스트', '551', '2020-07-24 04:15:52', '0');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
`
