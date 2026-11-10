import express from "express"
import dotenv from "dotenv"
import path from "path";
import { createClient } from "@supabase/supabase-js"
import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)

const __dirnameNew = path.dirname(__filenameNew)


function main() {
  dotenv.config();
  const app = express();
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);
  const port = process.env.PORT || 5050;

  app.use(express.json());

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirnameNew, "index.html"));
  });

  app.get("/create_absen", function (req, res) {
    res.sendFile(path.join(__dirnameNew, "create_absen.html"));
  });

  app.get("/list_absen", function (req, res) {
    res.sendFile(path.join(__dirnameNew, "list_absen.html"));
  });

  app.get("/list_absen", function (req, res) {
    res.sendFile(path.join(__dirnameNew, "list_absen.html"));
  });

  app.get("/absen", function (req, res) {
    res.sendFile(path.join(__dirnameNew, "absen.html"));
  });

  app.get("/api/mahasiswa", async function (req, res) {
    const { data } = await supabase.from("mahasiswa_now").select("nim, nama");

    res.json(data);
  });

  app.post("/api/absen", async function (req, res) {
    const { error } = await supabase.from("absen").insert({ tanggal_absen: req.body.tanggal, data: req.body.absen });
    if (error) {
      res.json({ info: "gagal" });
    } else {
      res.json({ info: "berhasil" });
    }
  });

  app.get("/api/absen", async function (req, res) {
    const { data } = await supabase.from("absen").select("id, tanggal_absen");
    res.json(data);
  });

  app.get("/api/absen/:id_absen", async function (req, res) {
    const { data: absen } = await supabase.from("absen").select("id, data, tanggal_absen").eq("id", req.params.id_absen);
    const semuaNim = [...new Set(absen.flatMap(item =>
      item.data.map(m => m.nim))
    )];

    const { data: mahasiswa } = await supabase.from("mahasiswa_now").select("nim, nama").in("nim", semuaNim);
    const mapMahasiswa = new Map(
      mahasiswa.map(m => [m.nim, m.nama])
    );

    const dataAbsen = absen.map(item => ({
      id: item.id,
      data: item.data.map(m => ({
        nim: m.nim,
        nama: mapMahasiswa.get(m.nim) || "",
        status: m.status
      })),
      tanggal_absen: item.tanggal_absen
    }));

    res.json(dataAbsen)
  });

  app.delete("/api/absen/:id_absen", async function (req, res) {
    const { error } = await supabase.from("absen").delete().eq("id", req.params.id_absen);

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
