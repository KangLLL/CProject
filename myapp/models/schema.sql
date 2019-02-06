use capstone;
DROP TABLE IF EXISTS `exchagerate`;
CREATE TABLE `exchagerate` (
  `ID` bigint(20) NOT NULL,
  `RATE` decimal(10,6) DEFAULT NULL,
  `DATE` datetime DEFAULT NULL,
  `TYPE` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID`), 
  CONSTRAINT date_unique UNIQUE (`DATE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

