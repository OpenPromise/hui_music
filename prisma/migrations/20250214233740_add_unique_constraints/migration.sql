/*
  Warnings:

  - A unique constraint covering the columns `[artistId,name]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artistId,albumId,title]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Album_artistId_name_key" ON "Album"("artistId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Track_artistId_albumId_title_key" ON "Track"("artistId", "albumId", "title");
