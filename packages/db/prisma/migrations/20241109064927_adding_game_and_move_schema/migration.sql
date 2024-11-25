/*
  Warnings:

  - The values [WHITE_WINS,BLACK_WINS,DRAW] on the enum `GameResult` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('completed', 'in_progress', 'time_up', 'aborted', 'player_exit');

-- AlterEnum
ALTER TYPE "AuthProvider" ADD VALUE 'GUEST';

-- AlterEnum
BEGIN;
CREATE TYPE "GameResult_new" AS ENUM ('white_wins', 'black_wins', 'draw');
ALTER TABLE "Game" ALTER COLUMN "result" TYPE "GameResult_new" USING ("result"::text::"GameResult_new");
ALTER TYPE "GameResult" RENAME TO "GameResult_old";
ALTER TYPE "GameResult_new" RENAME TO "GameResult";
DROP TYPE "GameResult_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "GameStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "gameId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
