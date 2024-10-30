import { glob } from "glob";
import { parse as parseComments } from "comment-parser";
import * as fs from "fs/promises";
import * as path from "path";

interface ExampleMetadata {
    id: string;
    path: string;
    code: string;
    exchange: string;
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
}

async function buildExamplesIndex(): Promise<void> {
    // Scan all TypeScript examples
    const files: string[] = glob.sync("typescript/**/*.ts");

    const examples: ExampleMetadata[] = await Promise.all(
        files.map(async (filePath: string) => {
            const content = await fs.readFile(filePath, "utf-8");
            const comments = parseComments(content);
            const metadata = comments[0]?.tags.reduce(
                (acc: Record<string, string>, tag) => ({
                    ...acc,
                    [tag.tag]: tag.description,
                }),
                {}
            );

            return {
                id: filePath,
                path: filePath,
                code: content,
                exchange: filePath.split("/")[1],
                title: metadata.title,
                description: metadata.description,
                category: metadata.category,
                tags: metadata.tags?.split(",").map((t) => t.trim()),
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
