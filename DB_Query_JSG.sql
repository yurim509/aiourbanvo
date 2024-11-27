create database projadb;
use projadb;
SET SQL_SAFE_UPDATES = 0;

create user`projauser`@`%` identified by '1234'; 
grant all privileges on projadb.* to `projauser`@`%`;

-- -------------------------------------------------------------
show tables;
drop table tbl_user;
drop table tbl_regular_parking;
drop table tbl_visit_parking;
drop table tbl_household;
-- -------------------------------------------------------------
select * from tbl_user order by uno desc;
SELECT u.*, r.* FROM tbl_user u LEFT JOIN user_user_role_list r ON u.uno = r.user_uno ORDER BY u.uno DESC;
select * from user_user_role_list order by user_uno desc;
select * from tbl_user where uno = 66;
select * from tbl_household;
select * from tbl_regular_parking order by rpno desc;
select * from tbl_visit_parking order by vpno desc;
select * from tbl_entry_car order by eeno desc;
select * from tbl_gym;
select * from mileage;
select * from mileage_history;
select * from payment_history;
select * from card_info;
-- 0=P,1=U,2=A 권한 별 유저 조회
SELECT u.user_uno, u.user_role_list, t.user_name FROM user_user_role_list u JOIN tbl_user t ON u.user_uno = t.uno 
WHERE u.user_role_list = 0 ORDER BY u.user_uno DESC;
-- 권한 별 유저 수량
select count(*) as count from user_user_role_list where user_role_list = 0;
-- soft delete user 검색
select * from tbl_user where del_flag= 1;
show tables;

-- 
delete from tbl_user where user_name = 'user';
delete from user_user_role_list where user_uno = 64;
drop table tbl_gym;