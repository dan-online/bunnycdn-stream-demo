import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { promises } from "fs";
import { resolve } from "path";
import { env } from "../env";

const { readFile } = promises;

export default async function indexController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      const indexHtmlPath = resolve(__dirname, "../../static/index.html");
      const indexHtmlContent = await readFile(indexHtmlPath);
      reply.header("Content-Type", "text/html; charset=utf-8").send(
        indexHtmlContent
          .toString()
          .split("PULL_URL")
          .join(env.BUNNY_PULL_URL || ""),
      );
    },
  );
}
