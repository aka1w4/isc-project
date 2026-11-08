import express from "express"
import dotenv from "dotenv"
import path from "path";
import { createClient } from "@supabase/supabase-js"


function main() {
  dotenv.config();
  const app = express();
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);
  const port = process.env.PORT || 5050;

  app.use(express.json());

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get("/api/mahasiswa", async function (req, res) {
    const { data } = await supabase.from('mahasiswa_now').select('id, nim, nama');

    res.json(data);
  });

  app.post("/api/absen", async function (req, res) {
    const { status, error } = await supabase.from("absen_now").insert({ data: req.body });
    if (error) {
      res.json({ info: "gagal" });
    } else {
      res.json({ info: "berhasil" });
    }
  })

  app.get("/api/absen", async function (req, res) {
    const { data } = await supabase.from("absen_now").select("id, tanggal");
    res.json(data);
  })

  app.get("/api/absen/:id_absen", async function (req, res) {
    const { data, error } = await supabase.from("absen_now").select("data").eq("id", req.params.id_absen);

    if (data?.length == 0 || error) {
      res.json({});
    } else {
      res.json(data);
    }
  })

  app.delete("/api/absen/:id_absen", async function (req, res) {
    const { error } = await supabase.from("absen_now").delete().eq("id", req.params.id_absen);

    if (error) {
      res.json({ info: "gagal" });
    } else {
      res.json({ info: "berhasil" });
    }
  });

  app.listen(port);
  console.log("server listen in http://localhost:" + port);
}

main()
