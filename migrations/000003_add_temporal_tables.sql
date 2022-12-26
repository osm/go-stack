ALTER TABLE mailgun
  ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE mailgun_history (LIKE mailgun);
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON mailgun
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'mailgun_history', true
);

ALTER TABLE todo
  ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE todo_history (LIKE todo);
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON todo
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'todo_history', true
);

ALTER TABLE todo_file
  ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE todo_file_history (LIKE todo_file);
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON todo_file
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'todo_file_history', true
);

ALTER TABLE "user"
  ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE user_history (LIKE "user");
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON "user"
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'user_history', true
);

ALTER TABLE "user_password_reset"
  ADD COLUMN sys_period tstzrange NOT NULL DEFAULT tstzrange(current_timestamp, null);
CREATE TABLE user_password_reset_history (LIKE "user_password_reset");
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON user_password_reset
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'user_password_reset_history', true
);
