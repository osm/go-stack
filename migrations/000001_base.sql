CREATE TABLE "user" (
  "id" uuid NOT NULL PRIMARY KEY,
  "username" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "first_name" text,
  "last_name" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz,
  "deleted_at" timestamptz
);

CREATE UNIQUE INDEX "user_username" ON "user"("username");

CREATE TABLE "user_password_reset" (
  "id" uuid NOT NULL PRIMARY KEY,
  "user_id" uuid NOT NULL REFERENCES "user"("id"),
  "token" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz,
  "deleted_at" timestamptz
);

CREATE UNIQUE INDEX "user_password_reset_token" ON "user_password_reset"("token");

CREATE TABLE "todo" (
  "id" uuid NOT NULL PRIMARY KEY,
  "user_id" uuid NOT NULL REFERENCES "user"("id"),
  "title" text NOT NULL,
  "content" text,
  "is_done" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz,
  "deleted_at" timestamptz
);

CREATE INDEX todo_pagination ON "todo"("created_at" DESC, "id" DESC);

CREATE TABLE "todo_file" (
  "id" uuid NOT NULL PRIMARY KEY,
  "todo_id" uuid NOT NULL REFERENCES "todo"("id"),
  "file_system_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz,
  "deleted_at" timestamptz
);

CREATE TABLE "mailgun" (
  "id" uuid NOT NULL PRIMARY KEY,
  "external_id" text,
  "sender" text NOT NULL,
  "subject" text NOT NULL,
  "body" text NOT NULL,
  "recipient" text NOT NULL,
  "error" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
