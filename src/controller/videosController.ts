import { MultipartValue } from "@fastify/multipart";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ReadStream } from "fs";
import { bunny } from "../bunny";

const secret = "123";

export default async function videoController(fastify: FastifyInstance) {
  fastify.post("/upload", async function (
    req: FastifyRequest,
    res: FastifyReply
  ) {
      const data = await req.file()
      const password = ((data?.fields.password as MultipartValue<string>))
      const title = ((data?.fields.title as MultipartValue<string>));
      const file = data?.file

      if (!password || !title || !file) {
        return res.status(400).send("Malformed request");
      }

      if (password.value !== secret) {
        return res.status(403).send("Incorrect password");
      }

      const vid = await bunny.createAndUploadVideo(file as unknown as ReadStream, { title: title.value })
          
      return res.send(JSON.stringify(vid))
  });

  fastify.delete("/delete/:id", async (req, res) => {
    const data = await bunny.deleteVideo((req.params as { id: string }).id)
    return res.send(data.message)
  })

  fastify.get("/list", async (_req, res) => {
    res.send(JSON.stringify(await bunny.listAllVideos()))
  })
}
