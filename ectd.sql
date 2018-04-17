CREATE DATABASE ectd2;
use ectd2;

CREATE TABLE templates(
  template_id int(2) NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  description VARCHAR(255),
  version VARCHAR(60),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (template_id)
);

CREATE  TABLE users (
  uid VARCHAR(60) NOT NULL,
  user_name VARCHAR(32) NOT NULL ,
  password VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT current_timestamp,
  updated_at DATETIME ON UPDATE current_timestamp,
  deleted BIT(1),
  PRIMARY KEY (uid)
);

CREATE TABLE app_tokens(
  token VARCHAR(255) NOT NULL ,
  uid VARCHAR(60) NOT NULL ,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  logout_at DATETIME,

  PRIMARY KEY (token),
  FOREIGN KEY (uid) REFERENCES users(uid) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE applications(
  app_uid VARCHAR(60) NOT NULL ,
  template_id int(2) NOT NULL ,
  description VARCHAR(255) NOT NULL ,
  folder VARCHAR(15) NOT NULL ,
  version VARCHAR(15) NOT NULL ,
  sequence VARCHAR(15),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  submited_at DATETIME DEFAULT NULL ,

  PRIMARY KEY (app_uid),
  FOREIGN KEY (template_id) REFERENCES templates(template_id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT
);

CREATE TABLE user_apps(
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  uid VARCHAR(60) NOT NULL ,
  app_uid VARCHAR(60) NOT NULL ,
  PRIMARY KEY (id),
  /*CONSTRAINT FK_user*/
  FOREIGN KEY (uid) REFERENCES users(uid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  /*CONSTRAINT FK_app*/
  FOREIGN KEY (app_uid) REFERENCES applications(app_uid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE contactInfos(
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  app_uid VARCHAR(60) NOT NULL ,
  contact_type VARCHAR(60) NOT NULL,
  contact_name VARCHAR(60) NOT NULL ,
  phone VARCHAR(15) NOT NULL ,
  email VARCHAR(60) NOT NULL ,
  created_at DATETIME DEFAULT current_timestamp,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  /*CONSTRAINT FK_app_contactInfo*/
  FOREIGN KEY (app_uid) REFERENCES applications(app_uid)
);

CREATE TABLE applicationInfos(
  app_uid VARCHAR(60) NOT NULL ,
  duns_number VARCHAR(15) NOT NULL ,
  company_name VARCHAR(60) NOT NULL ,
  description VARCHAR(128) ,
  app_number VARCHAR(60) NOT NULL,
  app_type VARCHAR(60) NOT NULL ,
  sub_id VARCHAR(60) NOT NULL ,
  sub_type VARCHAR(60) NOT NULL ,
  eff_type VARCHAR(60),
  sub_sub_type VARCHAR(60) NOT NULL ,
  sub_number VARCHAR(60) NOT NULL ,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (app_uid),
  FOREIGN KEY (app_uid) REFERENCES applications(app_uid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE files(
  fid VARCHAR(60) NOT NULL,
  name VARCHAR(60) NOT NULL ,
  app_uid VARCHAR(60) NOT NULL ,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fid),
  FOREIGN KEY (app_uid) REFERENCES applications(app_uid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE fileStates(
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  action MEDIUMTEXT,
  fid VARCHAR(60) NOT NULL ,
  path VARCHAR(60) NOT NULL,
  created_at DATETIME DEFAULT current_timestamp,

  PRIMARY KEY (id),
  FOREIGN KEY (fid) REFERENCES files(fid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE nodes(
  nid BIGINT(20) NOT NULL AUTO_INCREMENT,
  id VARCHAR(60) NOT NULL ,
  name VARCHAR(60) NOT NULL ,
  text VARCHAR(60) NOT NULL ,
  type VARCHAR(10) NULL,
  s_number VARCHAR(20),
  parent VARCHAR(60) NOT NULL ,
  fid VARCHAR(60) NULL ,
  app_uid VARCHAR(60) NOT NULL ,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE current_timestamp,

  PRIMARY KEY (nid),
  FOREIGN KEY (fid) REFERENCES files(fid),
  FOREIGN KEY (app_uid) REFERENCES applications(app_uid)
    ON UPDATE CASCADE
    ON DELETE RESTRICT

);

CREATE TABLE templateNodes(
  nid INT(6) NOT NULL AUTO_INCREMENT,
  id VARCHAR(60) NOT NULL ,
  name VARCHAR(60) NOT NULL ,
  text VARCHAR(60) NOT NULL ,
  s_number VARCHAR(20),
  type VARCHAR(10) NULL ,
  parent VARCHAR(60) NOT NULL ,
  template_id INT(2) NOT NULL ,

  PRIMARY KEY (nid) ,
  FOREIGN KEY (template_id) REFERENCES templates(template_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE tags(
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  nid BIGINT(20) NOT NULL ,
  s_number VARCHAR(20),
  title VARCHAR(255) NOT NULL ,
  e_code VARCHAR(255) NOT NULL ,
  study_number VARCHAR(60),
  sft_type VARCHAR(60),
  species VARCHAR(60),
  root VARCHAR(60),
  duration VARCHAR(60),
  control VARCHAR(60),
  tag VARCHAR(60) NOT NULL,
  manufacturer VARCHAR(60),
  substance VARCHAR(60),
  prod_name VARCHAR(60),
  dosage VARCHAR(60),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (nid) REFERENCES nodes(id)
  ON UPDATE CASCADE
  ON DELETE RESTRICT
  );
