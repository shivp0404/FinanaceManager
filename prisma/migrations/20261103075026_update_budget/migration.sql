/*
  Warnings:

  - A unique constraint covering the columns `[userId,year,month]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- Add new columns as nullable initially
ALTER TABLE "Budget"
ADD COLUMN "editCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "month" INTEGER,
ADD COLUMN "year" INTEGER;

-- Populate existing records using their creation date
UPDATE "Budget"
SET
    "month" = EXTRACT(MONTH FROM "createdAt")::INTEGER,
    "year" = EXTRACT(YEAR FROM "createdAt")::INTEGER;

-- Make month and year mandatory
ALTER TABLE "Budget"
ALTER COLUMN "month" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL;

-- Create unique constraint
CREATE UNIQUE INDEX "Budget_userId_year_month_key"
ON "Budget"("userId", "year", "month");