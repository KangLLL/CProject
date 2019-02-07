use capstone;
DROP TABLE IF EXISTS `exchangerate`;
CREATE TABLE `exchangerate` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `RATE` decimal(10,6) DEFAULT NULL,
  `DATE` datetime DEFAULT NULL,
  `TYPE` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID`), 
  CONSTRAINT date_unique UNIQUE (`DATE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

