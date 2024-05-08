import { MultipartValue } from "@fastify/multipart";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ReadStream } from "fs";
import { bunny } from "../bunny";
import { env } from "../env";

const secret = env.SECRET || "123";

export default async function videoController(fastify: FastifyInstance) {
  fastify.post(
    "/upload",
    async function (req: FastifyRequest, res: FastifyReply) {
      const data = await req.file();
      const password = data?.fields.password as MultipartValue<string>;
      const title = data?.fields.title as MultipartValue<string>;
      const file = data?.file;

      if (!password || !title || !file) {
        return res.status(400).send("Malformed request");
      }

      if (password.value !== secret) {
        return res.status(403).send("Incorrect password");
      }

      const vid = await bunny.createAndUploadVideo(
        file as unknown as ReadStream,
        { title: title.value },
      );

      return res.send(JSON.stringify(vid));
    },
  );

  fastify.delete("/delete/:id", async (req, res) => {
    const { password } = req.query as { password: string };
    const { id } = req.params as { id: string };

    if (password !== secret) {
      return res.status(403).send("Incorrect password");
    }

    if (!id) {
      return res.status(400).send("Malformed request");
    }

    const data = await bunny.deleteVideo(id);
    return res.send(data.message);
  });

  fastify.get("/list", async (_req, res) => {
    res.send(JSON.stringify(await bunny.listAllVideos()));
  });

  fastify.post("/tus", async (req, res) => {
    const { password, title } = req.body as { password: string; title: string };

    if (password !== secret) {
      return res.status(403).send("Incorrect password");
    }

    if (!title) {
      return res.status(400).send("Malformed request");
    }

    const data = await bunny.createDirectUpload(
      { title },
      new Date(Date.now() + 60000),
    );
    return res.send(data);
  });
}
