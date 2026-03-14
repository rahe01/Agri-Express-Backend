/*
  Warnings:

  - The values [PENDING,DEACTIVATED,BANNED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'VENDOR', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'BLOCKED', 'SUSPENDED', 'DELETED');
ALTER TABLE "public"."user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "UserRole";
