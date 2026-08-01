CREATE TABLE "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_id" text NOT NULL,
	"lead_id" text,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_id" text NOT NULL,
	"first_name" text NOT NULL,
	"email" text NOT NULL,
	"business_name" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"email_delivery_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_contacted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" text PRIMARY KEY NOT NULL,
	"input_url" text NOT NULL,
	"normalized_url" text NOT NULL,
	"hostname" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"scanner_version" text,
	"overall_score" integer,
	"performance_score" integer,
	"seo_score" integer,
	"accessibility_score" integer,
	"best_practices_security_score" integer,
	"mobile_readiness_score" integer,
	"conversion_readiness_score" integer,
	"coverage" integer,
	"report_data" jsonb,
	"cache_hit" boolean DEFAULT false NOT NULL,
	"ip_hash" text,
	"utm_data" jsonb,
	"error_code" text,
	"safe_error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rate_limits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_lead_id_audit_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."audit_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_leads" ADD CONSTRAINT "audit_leads_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_events_audit_id" ON "audit_events" USING btree ("audit_id");--> statement-breakpoint
CREATE INDEX "idx_audit_events_event_type" ON "audit_events" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_audit_leads_audit_email" ON "audit_leads" USING btree ("audit_id","email");--> statement-breakpoint
CREATE INDEX "idx_audits_hostname" ON "audits" USING btree ("hostname");--> statement-breakpoint
CREATE INDEX "idx_audits_status" ON "audits" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_audits_created_at" ON "audits" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_audits_cache_lookup" ON "audits" USING btree ("normalized_url","scanner_version","status","completed_at");--> statement-breakpoint
CREATE INDEX "idx_rate_limits_key_created" ON "rate_limits" USING btree ("key","created_at");