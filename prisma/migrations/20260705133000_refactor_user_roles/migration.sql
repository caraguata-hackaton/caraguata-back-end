-- Keep the old and new values temporarily so existing rows can be migrated safely.
ALTER TABLE `user`
MODIFY `role` ENUM('ADMIN', 'TEACHER', 'MANAGER', 'SCHOOL_USER') NOT NULL DEFAULT 'SCHOOL_USER';

UPDATE `user`
SET `role` = 'MANAGER'
WHERE `role` = 'ADMIN';

UPDATE `user`
SET `role` = 'SCHOOL_USER'
WHERE `role` = 'TEACHER';

ALTER TABLE `user`
MODIFY `role` ENUM('MANAGER', 'SCHOOL_USER') NOT NULL DEFAULT 'SCHOOL_USER';
