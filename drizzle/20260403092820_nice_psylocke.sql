CREATE TYPE "public"."audit_action" AS ENUM('user.login', 'user.logout', 'user.register', 'user.password_change', 'user.email_change', 'user.profile_update', 'organization.create', 'organization.update', 'organization.delete', 'organization.member_add', 'organization.member_remove', 'organization.member_role_change', 'product.create', 'product.update', 'product.delete', 'product.publish', 'product.unpublish', 'order.create', 'order.update', 'order.cancel', 'order.status_change', 'order.payment_received', 'order.shipped', 'order.delivered', 'order.refunded', 'design.create', 'design.update', 'design.delete', 'design.publish', 'design.export', 'invoice.create', 'invoice.update', 'invoice.send', 'invoice.pay', 'payment.create', 'payment.process', 'payment.fail', 'subscription.create', 'subscription.update', 'subscription.cancel', 'admin.user_ban', 'admin.user_unban', 'admin.organization_suspend', 'admin.settings_change', 'feature_flag.enable', 'feature_flag.disable', 'feature_flag.update');--> statement-breakpoint
CREATE TYPE "public"."billing_payment_status" AS ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."subscription_interval" AS ENUM('month', 'year');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'cancelled', 'expired', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."design_layer_type" AS ENUM('text', 'image', 'shape', 'background');--> statement-breakpoint
CREATE TYPE "public"."design_status" AS ENUM('draft', 'published', 'archived', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'push', 'sms');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'delivered', 'failed', 'read');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('order.created', 'order.confirmed', 'order.processing', 'order.shipped', 'order.delivered', 'order.cancelled', 'order.refunded', 'payment.received', 'payment.failed', 'payment.refunded', 'invoice.sent', 'invoice.overdue', 'product.out_of_stock', 'product.low_stock', 'system.maintenance', 'system.announcement', 'user.welcome', 'user.email_verified', 'user.password_changed', 'user.account_suspended', 'user.account_reactivated', 'organization.invitation', 'organization.member_added', 'organization.member_removed', 'organization.role_changed', 'design.shared', 'design.commented', 'marketing.promotion', 'marketing.newsletter');--> statement-breakpoint
CREATE TYPE "public"."order_item_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'paid', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."product_category_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'archived', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('physical', 'digital', 'service');--> statement-breakpoint
CREATE TABLE "audit_log_exports" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"organization_id" text,
	"user_id" text,
	"actions" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"record_count" text,
	"file_url" text,
	"file_size" text,
	"error_message" text,
	"requested_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"organization_id" text,
	"action" "audit_action" NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"old_value" jsonb,
	"new_value" jsonb,
	"ip_address" text,
	"user_agent" text,
	"session_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" integer NOT NULL,
	"tax_rate" integer,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_number" text,
	"organization_id" text NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"description" text,
	"subtotal_amount" integer NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"issued_at" timestamp with time zone,
	"due_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"billing_address" jsonb,
	"payment_method" text,
	"payment_id" text,
	"notes" text,
	"terms" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text,
	"organization_id" text NOT NULL,
	"user_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"payment_method" text NOT NULL,
	"payment_provider" text,
	"payment_id" text,
	"status" "billing_payment_status" DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"reference_number" text,
	"processed_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"failure_reason" text,
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_items" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"name" text NOT NULL,
	"value" integer NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"interval" "subscription_interval" DEFAULT 'month' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"trial_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp with time zone,
	"payment_method" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "design_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"design_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"x" integer,
	"y" integer,
	"parent_id" text,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_layers" (
	"id" text PRIMARY KEY NOT NULL,
	"design_id" text NOT NULL,
	"layer_id" text NOT NULL,
	"name" text,
	"type" "design_layer_type" NOT NULL,
	"properties" jsonb NOT NULL,
	"z_index" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"design_id" text NOT NULL,
	"version" integer NOT NULL,
	"name" text,
	"canvas_state" jsonb NOT NULL,
	"preview_image" text,
	"change_description" text,
	"is_auto_save" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "designs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"canvas_width" integer NOT NULL,
	"canvas_height" integer NOT NULL,
	"canvas_background" text,
	"canvas_state" jsonb NOT NULL,
	"preview_image" text,
	"thumbnail_image" text,
	"template_id" text,
	"is_template" boolean DEFAULT false NOT NULL,
	"status" "design_status" DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"tags" jsonb,
	"export_format" text DEFAULT 'png' NOT NULL,
	"export_quality" integer DEFAULT 300 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"use_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"name" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"description" text,
	"title_template" text NOT NULL,
	"message_template" text NOT NULL,
	"default_channels" jsonb,
	"default_priority" text DEFAULT 'normal',
	"variables" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"channels" jsonb,
	"status" jsonb,
	"reference_type" text,
	"reference_id" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"priority" text DEFAULT 'normal' NOT NULL,
	"is_silent" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"browser_name" text,
	"platform" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"topics" jsonb,
	"last_success_at" timestamp with time zone,
	"last_failure_at" timestamp with time zone,
	"failure_count" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text,
	"product_name" text NOT NULL,
	"product_sku" text,
	"variant_id" text,
	"variant_name" text,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" integer NOT NULL,
	"status" "order_item_status" DEFAULT 'pending' NOT NULL,
	"design_id" text,
	"fulfilled_at" timestamp with time zone,
	"shipped_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"old_status" "order_status",
	"new_status" "order_status" NOT NULL,
	"changed_by" text,
	"reason" text,
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text,
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"subtotal_amount" integer NOT NULL,
	"shipping_amount" integer DEFAULT 0 NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"payment_method" text,
	"payment_id" text,
	"paid_at" timestamp with time zone,
	"shipping_method" text,
	"shipping_tracking_number" text,
	"shipping_carrier" text,
	"shipping_service" text,
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"customer_notes" text,
	"internal_notes" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"parent_id" text,
	"status" "product_category_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"config" jsonb,
	"preview_image" text,
	"thumbnail" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"barcode" text,
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"inventory_quantity" integer DEFAULT 0 NOT NULL,
	"inventory_policy" text DEFAULT 'deny' NOT NULL,
	"options" jsonb,
	"image" text,
	"position" integer DEFAULT 0 NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"category_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"short_description" text,
	"type" "product_type" DEFAULT 'physical' NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"base_price" integer NOT NULL,
	"compare_at_price" integer,
	"cost_price" integer,
	"sku" text,
	"barcode" text,
	"track_inventory" boolean DEFAULT true NOT NULL,
	"inventory_quantity" integer DEFAULT 0 NOT NULL,
	"inventory_low_stock_threshold" integer DEFAULT 10,
	"images" jsonb,
	"featured_image" text,
	"weight" integer,
	"dimensions" jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_keywords" jsonb,
	"tags" jsonb,
	"attributes" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "audit_log_exports" ADD CONSTRAINT "audit_log_exports_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log_exports" ADD CONSTRAINT "audit_log_exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log_exports" ADD CONSTRAINT "audit_log_exports_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_items" ADD CONSTRAINT "subscription_items_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_comments" ADD CONSTRAINT "design_comments_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_comments" ADD CONSTRAINT "design_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_comments" ADD CONSTRAINT "design_comments_parent_id_design_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."design_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_layers" ADD CONSTRAINT "design_layers_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_versions" ADD CONSTRAINT "design_versions_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "designs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designs" ADD CONSTRAINT "designs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_templates" ADD CONSTRAINT "product_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_exports_org_id_idx" ON "audit_log_exports" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_log_exports_user_id_idx" ON "audit_log_exports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_exports_requested_by_idx" ON "audit_log_exports" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "audit_log_exports_status_idx" ON "audit_log_exports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_log_exports_created_at_idx" ON "audit_log_exports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_org_id_idx" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "invoice_items_reference_idx" ON "invoice_items" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "invoices_org_id_idx" ON "invoices" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoices_due_at_idx" ON "invoices" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "payments_org_id_idx" ON "payments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_payment_id_idx" ON "payments" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "subscription_items_subscription_id_idx" ON "subscription_items" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "subscriptions_org_id_idx" ON "subscriptions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions" USING btree ("current_period_end");--> statement-breakpoint
CREATE INDEX "design_comments_design_id_idx" ON "design_comments" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "design_comments_user_id_idx" ON "design_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "design_comments_parent_id_idx" ON "design_comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "design_layers_design_id_idx" ON "design_layers" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "design_layers_layer_id_idx" ON "design_layers" USING btree ("layer_id");--> statement-breakpoint
CREATE INDEX "design_layers_type_idx" ON "design_layers" USING btree ("type");--> statement-breakpoint
CREATE INDEX "design_versions_design_id_idx" ON "design_versions" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "design_versions_version_idx" ON "design_versions" USING btree ("version");--> statement-breakpoint
CREATE INDEX "designs_org_id_idx" ON "designs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "designs_user_id_idx" ON "designs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "designs_status_idx" ON "designs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "designs_template_id_idx" ON "designs" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "designs_public_idx" ON "designs" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "designs_created_at_idx" ON "designs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notification_templates_org_id_idx" ON "notification_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notification_templates_type_idx" ON "notification_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_templates_is_active_idx" ON "notification_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_org_id_idx" ON "notifications" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notifications_reference_idx" ON "notifications" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_scheduled_at_idx" ON "notifications" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_is_active_idx" ON "push_subscriptions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_status_idx" ON "order_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_status_history_order_id_idx" ON "order_status_history" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_history_changed_by_idx" ON "order_status_history" USING btree ("changed_by");--> statement-breakpoint
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_org_id_idx" ON "orders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "product_categories_org_id_idx" ON "product_categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "product_categories_parent_id_idx" ON "product_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_categories_status_idx" ON "product_categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_templates_org_id_idx" ON "product_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "product_templates_category_idx" ON "product_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "product_templates_public_idx" ON "product_templates" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "product_templates_active_idx" ON "product_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_org_id_idx" ON "products" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_type_idx" ON "products" USING btree ("type");--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");