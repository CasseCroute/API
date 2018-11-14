CREATE EXTENSION dblink;

-- ----------------------------
-- Check if databases already exists
-- ----------------------------
DO
$do$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'dev_letseat') THEN
      RAISE NOTICE 'Database already exists';
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE dev_letseat');
   END IF;
END
$do$;
GRANT ALL PRIVILEGES ON DATABASE dev_letseat TO postgres;

DO
$do$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_database WHERE datname = 'test_letseat') THEN
      RAISE NOTICE 'Database already exists';
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE test_letseat');
   END IF;
END
$do$;
GRANT ALL PRIVILEGES ON DATABASE test_letseat TO postgres;

-- ----------------------------
-- Table structure for cuisine
-- ----------------------------
DROP TABLE IF EXISTS "public"."cuisine";
CREATE TABLE "public"."cuisine" (
  "id" int4 NOT NULL DEFAULT nextval('cuisine_id_seq'::regclass),
  "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar(128) COLLATE "pg_catalog"."default" NOT NULL,
  "image_url" varchar(256) COLLATE "pg_catalog"."default",
  "slug" varchar(128) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."cuisine" OWNER TO "postgres";

-- ----------------------------
-- Records of cuisine
-- ----------------------------
BEGIN;
INSERT INTO "public"."cuisine" VALUES (1, 'd3cc5353-2fc5-4a27-853a-61ea4212e5da', 'Tex Mex', NULL, 'tex-mex');
INSERT INTO "public"."cuisine" VALUES (2, '0d4b91bf-e108-461f-b62c-146cf4029049', 'Chicken', NULL, 'chicken');
INSERT INTO "public"."cuisine" VALUES (3, 'add6dfd0-b82f-40ea-b677-c6abd003abc7', 'Vegan', NULL, 'vegan');
INSERT INTO "public"."cuisine" VALUES (4, 'd932c4ba-e4d7-4433-a924-e52d7eb87c89', 'Wings', NULL, 'wings');
INSERT INTO "public"."cuisine" VALUES (5, '30cb8000-a1aa-4f4a-bab2-574a6d6c308e', 'Fast Food', NULL, 'fast-food');
INSERT INTO "public"."cuisine" VALUES (6, '6993f815-0b86-488a-a657-00c369aa4b0a', 'Pizza', NULL, 'pizza');
INSERT INTO "public"."cuisine" VALUES (7, '95604082-8c9c-4a9a-b640-02d445749f29', 'Halal', NULL, 'halal');
INSERT INTO "public"."cuisine" VALUES (8, '8866c10c-1f77-434b-8a89-925e6d5fe3ea', 'Desserts', NULL, 'desserts');
INSERT INTO "public"."cuisine" VALUES (9, 'cce837b6-ffdb-48be-8edd-ac64a1b34002', 'Sushi', NULL, 'sushi');
INSERT INTO "public"."cuisine" VALUES (10, '039561cd-c151-4a4f-98b3-359286f831f6', 'Street Food', NULL, 'street-food');
INSERT INTO "public"."cuisine" VALUES (11, '325dc20f-4baf-43c3-8b70-9369df454919', 'Cafe', NULL, 'cafe');
INSERT INTO "public"."cuisine" VALUES (12, '2adab818-d35c-489f-9fef-00e60131fe8e', 'Indian', NULL, 'indian');
INSERT INTO "public"."cuisine" VALUES (13, '2303ca16-6f31-4650-b3eb-ba8851869636', 'Ramen', NULL, 'ramen');
INSERT INTO "public"."cuisine" VALUES (14, '1e894d3f-7d51-4636-b804-52d856cc08b8', 'Bubble Tea', NULL, 'bubble-tea');
INSERT INTO "public"."cuisine" VALUES (15, '518de131-8fc1-45b8-8954-6572b734dd63', 'Healthy', NULL, 'healthy');
INSERT INTO "public"."cuisine" VALUES (16, '442c6c40-9acc-49e8-b50a-ca98c5a11fa7', 'Thai', NULL, 'thai');
INSERT INTO "public"."cuisine" VALUES (17, 'd181360f-56f9-4e66-8a06-11216d2e25b6', 'Asian', NULL, 'asian');
INSERT INTO "public"."cuisine" VALUES (18, 'd6303c34-c251-4c5a-8e81-6ff23f8abb18', 'American', NULL, 'american');
INSERT INTO "public"."cuisine" VALUES (19, '3e1997b2-3c99-4bd6-9b8c-66b70c610200', 'Friterie', NULL, 'friterie');
INSERT INTO "public"."cuisine" VALUES (20, '49cb61c7-545c-48d5-8130-a252c71ce088', 'Burgers', NULL, 'burgers');
INSERT INTO "public"."cuisine" VALUES (21, 'f9a56f55-ee01-499d-9fff-075c41190908', 'French', NULL, 'french');
INSERT INTO "public"."cuisine" VALUES (22, '91e0dc46-f8a9-44cf-9be9-d100127ff095', 'Breakfast and Brunch', NULL, 'breakfast');
INSERT INTO "public"."cuisine" VALUES (23, 'cb38cdfd-1ced-44d1-86a9-41891c15aded', 'Italian', NULL, 'italian');
INSERT INTO "public"."cuisine" VALUES (24, '0922e5b0-67da-4206-949b-797d229416bb', 'BBQ', NULL, 'bbq');
INSERT INTO "public"."cuisine" VALUES (25, '38da2797-94f2-458c-bbf1-18bb4a536a96', 'Mexican', NULL, 'mexican');
INSERT INTO "public"."cuisine" VALUES (26, 'a5352ac0-9bd1-43fe-aaea-2ca6d206635b', 'Cajun', NULL, 'cajun');
INSERT INTO "public"."cuisine" VALUES (27, '45ad8376-d671-46a8-a6d3-e9cfa14c2d42', 'Sandwiches', NULL, 'sandwiches');
INSERT INTO "public"."cuisine" VALUES (28, 'dcabdcb3-829d-4c9c-882b-6c3b2c7cfdf2', 'Ice Cream and Frozen Yogurt', NULL, 'ice-cream-and-frozen-yogurt');
INSERT INTO "public"."cuisine" VALUES (29, '3dac67d1-abfe-4342-803f-3b8224506375', 'Bar Food', NULL, 'bar-food');
INSERT INTO "public"."cuisine" VALUES (30, 'c404216b-16cb-4a45-8b4e-73b39b35afdb', 'Mediterranean', NULL, 'mediterranean');
INSERT INTO "public"."cuisine" VALUES (31, 'b565befd-7c12-4d82-abd0-ee005386e66d', 'Gluten Free', NULL, 'gulten-free');
INSERT INTO "public"."cuisine" VALUES (32, 'c6f64437-dedc-4600-86a6-a4d9a147093e', 'Salads', NULL, 'salads');
INSERT INTO "public"."cuisine" VALUES (33, 'a54eeede-f37a-4a2d-9768-845d26589cd7', 'Hawaiian', NULL, 'hawaiian');
INSERT INTO "public"."cuisine" VALUES (34, '97cbdb23-1cde-4329-aade-73079264f393', 'Chinese', NULL, 'chinese');
INSERT INTO "public"."cuisine" VALUES (35, 'a6f44fc0-d0bf-478d-bf5b-fd6e3702a59a', 'Portuguese', NULL, 'portuguese');
INSERT INTO "public"."cuisine" VALUES (36, 'b3d677df-e97e-4880-bd2e-bae233dde39d', 'Pastry', NULL, 'pastry');
INSERT INTO "public"."cuisine" VALUES (37, '284dc73c-2310-474c-b4f0-caba9f9430b9', 'German', NULL, 'german');
INSERT INTO "public"."cuisine" VALUES (38, '5c28ceb5-1ac4-4578-bbfb-dbc1758c4c08', 'European', NULL, 'european');
INSERT INTO "public"."cuisine" VALUES (39, '0528754a-9048-4aef-8cce-d012bce6ae5e', 'Japanese', NULL, 'japanese');
INSERT INTO "public"."cuisine" VALUES (40, '06111fea-d59f-43fb-8d71-95b1f29c7aee', 'South American', NULL, 'south-american');
INSERT INTO "public"."cuisine" VALUES (41, '77e92bfc-1946-42fd-9d8f-7768c8e792e7', 'Peruvian', NULL, 'peruvian');
INSERT INTO "public"."cuisine" VALUES (42, '1e5877b3-c97b-49e7-9195-50d412368ae5', 'Indonesian', NULL, 'indonesian');
INSERT INTO "public"."cuisine" VALUES (43, '6f7e90cd-e00b-4cf6-808c-a491c8ebc921', 'Kosher', NULL, 'kosher');
INSERT INTO "public"."cuisine" VALUES (44, '69071ecd-8d26-446a-8f61-6b75e53aa2a9', 'Turkish', NULL, 'turkish');
INSERT INTO "public"."cuisine" VALUES (45, '28bba2bf-a624-4187-a254-dca00c649aad', 'Bakery', NULL, 'bakery');
INSERT INTO "public"."cuisine" VALUES (46, 'c0745396-4f71-4e97-8ef3-5f52d6ead613', 'Lebanese', NULL, 'lebanese');
INSERT INTO "public"."cuisine" VALUES (47, 'e628bb01-7576-49fc-bb51-a964cfc9170a', 'Vegetarian', NULL, 'vegetarian');
INSERT INTO "public"."cuisine" VALUES (48, 'f212903e-caa0-4113-833d-ca0c7ad92117', 'Juice and Smoothies', NULL, 'juice-and-smoothies');
INSERT INTO "public"."cuisine" VALUES (49, '81d1673e-70b0-4ea2-9c1e-e32d32c77475', 'Seafood', NULL, 'seafood');
INSERT INTO "public"."cuisine" VALUES (50, 'f02be6cc-d6d1-4bae-bdf1-cc0a125c478e', 'Jewish', NULL, 'jewish');
INSERT INTO "public"."cuisine" VALUES (51, 'd53c7a25-067a-4bbb-a651-5cd061e9d1a3', 'Asian Fusion', NULL, 'asian-fusion');
INSERT INTO "public"."cuisine" VALUES (52, 'f23183b0-e7d6-4e40-b5d2-9d261d000159', 'Dumplings', NULL, 'dumplings');
INSERT INTO "public"."cuisine" VALUES (53, 'c443c256-7281-4fa7-a231-6e29b72c13be', 'Caribbean', NULL, 'caribbean');
INSERT INTO "public"."cuisine" VALUES (54, '6762958e-eee4-4e44-a8a2-6642b8aadfbf', 'Moroccan', NULL, 'moroccan');
INSERT INTO "public"."cuisine" VALUES (55, 'ab2b02d0-e20a-4fa3-82f5-f7e34b446ac2', 'Cambodian', NULL, 'cambodian');
INSERT INTO "public"."cuisine" VALUES (56, '78f0e167-cf2a-45a2-be27-ad2bf41ef237', 'Tibetan', NULL, 'tibetian');
INSERT INTO "public"."cuisine" VALUES (57, '141e0dce-9982-4b49-9bdd-746871a29d26', 'Middle Eastern', NULL, 'middle-eastern');
INSERT INTO "public"."cuisine" VALUES (58, 'f933f723-400e-4c14-993e-d8b47d60a651', 'African', NULL, 'african');
INSERT INTO "public"."cuisine" VALUES (59, '35b9f8fe-cb7c-4884-b163-963133de470e', 'Eastern European', NULL, 'eastern-european');
INSERT INTO "public"."cuisine" VALUES (60, '7746e05c-fb63-4408-b142-4d058f21f994', 'Vietnamese', NULL, 'vietnamese');
INSERT INTO "public"."cuisine" VALUES (61, '75d40a0b-db37-4a75-886c-4f411dcbe764', 'Rice-Bowls', NULL, 'rice-bowls');
INSERT INTO "public"."cuisine" VALUES (62, 'cab09fdc-1888-42b4-b28d-63e107ba72fa', 'Argentinian', NULL, 'argentinian');
INSERT INTO "public"."cuisine" VALUES (63, '468152cc-2e54-4110-ae89-9b1fac51a0f4', 'Belgian', NULL, 'belgian');
INSERT INTO "public"."cuisine" VALUES (64, 'ad40d766-1967-46fe-8978-02b6e1aafbd1', 'Colombian', NULL, 'colombian');
INSERT INTO "public"."cuisine" VALUES (65, 'e6355eb0-bb16-40c3-b32f-7c8897b960ed', 'Alcohol', NULL, 'alcohol');
INSERT INTO "public"."cuisine" VALUES (66, '2ed8d895-fe01-40a6-a613-a56b621d4dbd', 'Greek', NULL, 'greek');
INSERT INTO "public"."cuisine" VALUES (67, '45cc4c42-d3f0-4234-bfa7-09b83bb5507e', 'Sri Lankan', NULL, 'sri-lankan');
INSERT INTO "public"."cuisine" VALUES (68, '8ce762f9-f0e9-492d-9219-ecb925914110', 'Latin American', NULL, 'latin-american');
INSERT INTO "public"."cuisine" VALUES (69, 'b527c15e-721d-48d5-bf38-08ab5dbee2c1', 'Korean', NULL, 'korean');
INSERT INTO "public"."cuisine" VALUES (70, 'd1b44974-2ce6-4673-a090-fa72789ad2b3', 'Coffee and Tea', NULL, 'coffee-and-tea');
INSERT INTO "public"."cuisine" VALUES (71, 'f40c5bc1-45a5-4eea-b65b-ad7d7e156ec2', 'Spanish', NULL, 'spanish');
INSERT INTO "public"."cuisine" VALUES (72, '2efad853-b565-465e-bbf4-0e13187ed710', 'Venezuelan', NULL, 'venezuelan');
INSERT INTO "public"."cuisine" VALUES (73, '31342f2e-c5d4-473b-84a4-b423220687b1', 'French', NULL, 'french');
INSERT INTO "public"."cuisine" VALUES (74, '58b2cfa0-746d-4013-91a7-f75ce81f21aa', 'Cuban', NULL, 'cuban');
INSERT INTO "public"."cuisine" VALUES (75, 'd075abb7-c3cd-4032-a644-755c3c005931', 'Brazilian', NULL, 'brazilian');
INSERT INTO "public"."cuisine" VALUES (76, '2c7fae86-f032-4435-b00f-1e1794c69687', 'Fish and Chips', NULL, 'fish-and-chips');
INSERT INTO "public"."cuisine" VALUES (77, 'd2b43155-599b-41b2-ba82-63ece4de41b1', 'Gourmet', NULL, 'gourmet');
INSERT INTO "public"."cuisine" VALUES (78, 'c7cd7e4f-b2af-446b-8c4c-529a8cf642bf', 'Taiwanese', NULL, 'taiwanese');
INSERT INTO "public"."cuisine" VALUES (79, '73d051c1-1ef3-42c6-9305-0fd5c418a6d9', 'Russian', NULL, 'russian');
COMMIT;

-- ----------------------------
-- Primary Key structure for table cuisine
-- ----------------------------
ALTER TABLE "public"."cuisine" ADD CONSTRAINT "PK_d4c1e9427b94335350fecaf238e" PRIMARY KEY ("id");


-- ----------------------------
-- Table structure for order_status
-- ----------------------------
DROP TABLE IF EXISTS "public"."order_status";
CREATE TABLE "public"."order_status" (
  "id" int4 NOT NULL DEFAULT nextval('order_status_id_seq'::regclass),
  "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."order_status" OWNER TO "postgres";

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
