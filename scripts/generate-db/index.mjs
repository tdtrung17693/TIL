#!/bin/env node

import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import shortUUID from "short-uuid";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const workingDir = path.resolve(path.join(__dirname, "..", ".."));
const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};

/**
 * @type any[]
 */
const postDirs = (
  await asyncFilter(
    await fs.readdir(workingDir),
    async (a) =>
      !a.startsWith(".") &&
      !a.startsWith("scripts") &&
      (await fs.lstat(path.join(workingDir, a))).isDirectory()
  )
).map((e) => path.join(workingDir, e));

const dbPath = path.join(workingDir, "db.json");
let currentDb;
try {
  await fs.access(dbPath);
  currentDb = JSON.parse(await fs.readFile(dbPath));
} catch {
  currentDb = {
    posts: {},
    tags: {},
  };
}

async function getFileList(dir) {
  let entries = await fs.readdir(dir);

  await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dir, entry);
      const stat = await fs.lstat(absolutePath);
      const isDir = stat.isDirectory();
      if (isDir) {
        await getFileList(absolutePath);
      }

      const frontMatter = matter(await fs.readFile(absolutePath));

      let postId = "";
      if (frontMatter.data["id"]) {
        postId = frontMatter.data["id"];
      } else {
        postId = shortUUID.generate();
        const frontMatterStr = generateFrontMatter({
          ...frontMatter.data,
          id: postId,
        });
        await fs.writeFile(
          absolutePath,
          [frontMatterStr, "\n", frontMatter.content].join("\n")
        );
      }

      let dbEntry;
      if (!currentDb.posts) {
        currentDb["posts"] = {};
      }
      const createdDate = stat.ctime;
      if (currentDb.posts[postId]) {
        dbEntry = currentDb.posts[postId];
        const modifiedDate = stat.mtime;
        if (createdDate.getTime() != modifiedDate.getTime()) {
          dbEntry.modifiedAt = modifiedDate;
        }
      } else {
        dbEntry = {
          path: path.join(dir, entry).replace(workingDir, ""),
          createdAt: stat.ctime,
          modifiedAt: null,
          id: postId,
          title: frontMatter.data.title || "no title",
        };
      }
      /**
       * @type string[]
       */
      const entryTags = (frontMatter.data.tags || "")
        .split(",")
        .filter((t) => t.length > 0)
        .map((t) => t.trim());

      dbEntry.tags = entryTags;
      currentDb.posts[postId] = dbEntry;
      entryTags.forEach((tag) => {
        if (!currentDb.tags[tag]) {
          currentDb.tags[tag] = [];
        }

        currentDb.tags[tag] = Array.from(
          new Set([...currentDb.tags[tag], dbEntry.id])
        );
      });
    })
  );
}

function generateFrontMatter(data) {
  const str = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join("\n");

  return ["---", str, "---"].join("\n");
}
(await Promise.all(postDirs.map((dir) => getFileList(dir)))).flatMap((e) => e);

await fs.writeFile(dbPath, JSON.stringify(currentDb));
console.log("db.json generated");
