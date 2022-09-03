require("dotenv").config();
import http from "http";
import { Client } from "@notionhq/client";
import { link } from "fs";

interface mediaObject {
    name: string;
    status: string;
    link: string;
}

const notionDbId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

if (!notionDbId || !notionSecret) {
    throw Error("Environment variables should be defined (NOTION_SECRET & NOTION_DATABASE_ID)")
}

const notion = new Client({ auth: notionSecret, });

// Function needs to be async to be able to use await while requesting the data
const server = http.createServer(async (req, res) => {
    // Set headers to avoid CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        // Respond to queries done to the root domaon
        case "/":
            const query = await notion.databases.query({
                database_id: notionDbId,
                filter: {
                    or: [{
                        property: "Type",
                        select: {
                            equals: "Course",
                        }
                    }]
                }
            });
            const list: mediaObject[] = query.results.map((row) => {
                const nameCell = row.properties.Name;
                const linkCell = row.properties.Link;
                const statusCell = row.properties.Status;

                const isName = nameCell.type === "title";
                const isLink = linkCell.type === "url";
                const isStatus = statusCell.type === "select";

                if (isName && isLink && isStatus) {
                    const name = nameCell.title?.[0].plain_text;
                    const link = linkCell.url ?? "";
                    const status = statusCell.select?.name ?? "";

                    return { name, status, link };
                }
                return { name: "NOT_FOUND", status: "", link: "" }
            });

            res.writeHead(200);
            res.end(JSON.stringify(list));
            break;
        // If other page is requested then 404
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
            break;
    }
});

const host = "localhost";
const port = 8000;

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});

