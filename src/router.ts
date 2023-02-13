import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyStatic } from "@fastify/static"
import indexController from "./controller/indexController";
import videoController from "./controller/videosController";
import { resolve } from "path";

export default async function router(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart);
  fastify.register(indexController, { prefix: "/" });
  fastify.register(fastifyStatic, {
    root: resolve(__dirname, '..', 'static')
  })
  fastify.register(videoController, { prefix: "/videos" });
}
