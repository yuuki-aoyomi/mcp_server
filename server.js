import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "http://localhost:3000";

const server = new McpServer({
    name: "todo-mcp",
    version: "1.0.0",
    capabilities: {
        tools: {}
    }
});

//add
server.registerTool(
    "add_todo",
    {
        description: "Add a todo",
        inputSchema: z.object({
            title: z.string(),
        }),
    },
    async ({ title }) => {
        const res = await fetch(`${API_BASE}/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });
        return { content: [{ type: "text", text: JSON.stringify(await res.json()) }] };
    }
);

//list
server.registerTool(
    "list_todos",
    {
        description: "List todos",
        inputSchema: z.object({})
    },
    async () => {
        const res = await fetch(`${API_BASE}/todos`);
        return { content: [{ type: "text", text: JSON.stringify(await res.json()) }] };
    }
);

//delete
server.registerTool(
    "delete_todo",
    {
        description: "Delete a todo",
        inputSchema: z.object({
            id: z.number()
        })
    },
    async ({ id }) => {
        if (id === 0) {
            return { content: [{ type: "text", text: "Invalid ID" }] };
        }

        const res = await fetch(`${API_BASE}/todos/${id}`, {
            method: "DELETE"
        });
        return { content: [{ type: "text", text: JSON.stringify(await res.json()) }] };
    }
);

//done
server.registerTool(
    "done_todo",
    {
        description: "done a todo",
        inputSchema: z.object({
            id: z.number(),
            done: z.boolean()
        })
    },
    async ({ id, done }) => {
        const res = await fetch(`${API_BASE}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done })
        });
        return { content: [{ type: "text", text: JSON.stringify(await res.json()) }] };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);