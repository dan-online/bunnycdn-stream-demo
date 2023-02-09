import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart"
import indexController from "./controller/indexController";
import videoController from "./controller/videosController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart)
  fastify.register(indexController, { prefix: "/" });
  fastify.register(videoController, { prefix: "/videos" })
}
