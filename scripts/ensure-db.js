import { copyFileSync, existsSync } from "node:fs";

if (!existsSync("db.json")) {
  copyFileSync("db.example.json", "db.json");
}
