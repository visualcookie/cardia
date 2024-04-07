CREATE SCHEMA IF NOT EXISTS "auth";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "cardia";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cardia"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"profile_picture" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cardia"."record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"systolic" integer NOT NULL,
	"diastolic" integer NOT NULL,
	"pulse" integer NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cardia"."users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cardia"."record" ADD CONSTRAINT "record_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "cardia"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
