BEGIN;
INSERT INTO "public"."cuisine" VALUES (1, 'd3cc5353-2fc5-4a27-853a-61ea4212e5da', 'Tex Mex', NULL, 'tex-mex');
INSERT INTO "public"."cuisine" VALUES (2, '0d4b91bf-e108-461f-b62c-146cf4029049', 'Chicken', NULL, 'chicken');
INSERT INTO "public"."cuisine" VALUES (3, 'add6dfd0-b82f-40ea-b677-c6abd003abc7', 'Vegan', NULL, 'vegan');
INSERT INTO "public"."cuisine" VALUES (4, 'd932c4ba-e4d7-4433-a924-e52d7eb87c89', 'Wings', NULL, 'wings');
COMMIT;

ALTER TABLE "public"."cuisine" ADD CONSTRAINT "PK_d4c1e9427b94335350fecaf238e" PRIMARY KEY ("id");
