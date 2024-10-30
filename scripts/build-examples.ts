import { glob } from "glob";
import { parse as parseComments } from "comment-parser";
import * as fs from "fs/promises";
import * as path from "path";

async function buildExamplesIndex() {
    // Scan all TypeScript examples
    const files = await glob("typescript/**/*.ts");

    const examples = await Promise.all(
        files.map(async (filePath) => {
            const content = await fs.readFile(filePath, "utf-8");
            const comments = parseComments(content);
            const metadata = comments[0]?.tags.reduce(
                (acc, tag) => ({
                    ...acc,
                    [tag.tag]: tag.text.trim(),
                }),
                {}
            );

            return {
                id: filePath,
                path: filePath,
                code: content,
                exchange: filePath.split("/")[1],
                ...metadata,
            };
        })
    );

    // Create public directory if it doesn't exist
    await fs.mkdir("public", { recursive: true });
    await fs.mkdir("public/js", { recursive: true });

    // Write the index file
    await fs.writeFile("public/examples-index.json", JSON.stringify(examples, null, 2));

    // Copy HTML and JS files to public
    await fs.copyFile("index.html", "public/index.html");
    await fs.copyFile("js/main.js", "public/js/main.js");
}

buildExamplesIndex().catch(console.error);
