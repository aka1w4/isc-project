import express from "express"
import dotenv from "dotenv"
import path from "path";
import { createClient } from "@supabase/supabase-js"

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);

async function absen() {
  // const { data } = await supabase.from('mahasiswa_now').select('id, nim, nama');

  //const { status, error } = await supabase.from("absen_now").insert({ data });
  const { data } = await supabase.from("absen_now").select("id, tanggal");

  //data.forEach((d) => {
  //  console.log(d.data);
  //});

  console.log(data[0].id)
}

function main() {
  const app = express();
  const port = process.env.PORT || 5050;

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(port);
  console.log("server listen in http://localhost:" + port);

  absen()
}

main()
