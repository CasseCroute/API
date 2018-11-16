-- ----------------------------
-- Records of cuisine
-- ----------------------------
BEGIN;
INSERT INTO "public"."cuisine" VALUES (1, 'd3cc5353-2fc5-4a27-853a-61ea4212e5da', 'Tex Mex', NULL, 'tex-mex');
INSERT INTO "public"."cuisine" VALUES (2, '0d4b91bf-e108-461f-b62c-146cf4029049', 'Chicken', NULL, 'chicken');
INSERT INTO "public"."cuisine" VALUES (3, 'add6dfd0-b82f-40ea-b677-c6abd003abc7', 'Vegan', NULL, 'vegan');
INSERT INTO "public"."cuisine" VALUES (4, 'd932c4ba-e4d7-4433-a924-e52d7eb87c89', 'Wings', NULL, 'wings');
COMMIT;

ALTER TABLE "public"."cuisine" ADD CONSTRAINT "PK_d4c1e9427b94335350fecaf238e" PRIMARY KEY ("id");


-- ----------------------------
-- Records of order_status
-- ----------------------------
BEGIN;
INSERT INTO "public"."order_status" VALUES (1, 'f77ee6a1-7498-4a64-860c-a6f5d2d26514', 'Paid');
INSERT INTO "public"."order_status" VALUES (2, '7a9d7b7a-4fa0-4ce1-99b4-12ccdc0c2988', 'Accepted');
INSERT INTO "public"."order_status" VALUES (3, 'd7df7b49-7cf2-4abe-9980-b56d14b63d72', 'Rejected');
INSERT INTO "public"."order_status" VALUES (4, '8a9dc336-9e25-4a11-b0ed-c237dda7de9c', 'Cancelled');
INSERT INTO "public"."order_status" VALUES (5, 'a9586754-4f12-43f7-ad44-c27b47f36e68', 'Ready');
INSERT INTO "public"."order_status" VALUES (6, '6a72390f-2542-42fd-9e5f-4b25a46dcd1c', 'In preparation');
INSERT INTO "public"."order_status" VALUES (7, '063433e7-8f13-4a20-92f5-362a1489855d', 'Picked Up');
INSERT INTO "public"."order_status" VALUES (8, 'adf030a4-7f94-4e1e-920b-44f33fddbe13', 'Delivery In Progress');
INSERT INTO "public"."order_status" VALUES (9, 'd5d2221d-e2ec-4ac1-8e33-f41d196bfa03', 'Delivered');
INSERT INTO "public"."order_status" VALUES (10, '0fd6369e-1982-4cfd-b002-85cf014615c6', 'Refunded');
COMMIT;

-- ----------------------------
-- Primary Key structure for table order_status
-- ----------------------------
ALTER TABLE "public"."order_status" ADD CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id");
