const http = require("http");
const url = require("url");

let motivations = [
  {
    id: 1,
    nama: "Ahmad",
    asal: "Indonesia",
    tanggal: "2024-10-17",
    suka: 0,
    text_motivasi: "Tetap semangat!",
  },
  {
    id: 2,
    nama: "Hamid",
    asal: "Indonesia",
    tanggal: "2024-10-17",
    suka: 3,
    text_motivasi: "Jangan pernah menyerah!",
  },
  {
    id: 3,
    nama: "Alex",
    asal: "Inggris",
    tanggal: "2024-10-17",
    suka: 1,
    text_motivasi: "Powerfull!",
  },
];

const respondWithJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  res.end(JSON.stringify(data));
};

// Membuat Server HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // Rute untuk menambah motivasi baru
  if (req.method === "POST" && pathname === "/motivations") {
    createMotivation(req, res);
  }
  // Rute untuk membaca semua motivasi
  else if (req.method === "GET" && pathname === "/motivations") {
    readMotivations(res);
  }
  // Rute untuk melihat detail motivasi berdasarkan ID
  else if (req.method === "GET" && pathname.startsWith("/motivations/")) {
    const id = pathname.split("/")[2];
    readMotivationsById(res, id);
  }
  // Rute untuk menambah like motivasi
  else if (req.method === "PUT" && pathname.startsWith("/motivation/like/")) {
    const id = pathname.split("/")[2];
    addLike(res, id);
  }
  // Rute untuk mengubah motivasi berdasarkan ID
  else if (req.method === "PUT" && pathname.startsWith("/motivations/")) {
    const id = pathname.split("/")[2];
    updateMotivation(req, res, id);
  }
  // Rute untuk menghapus motivasi berdasarkan ID
  else if (req.method === "DELETE" && pathname.startsWith("/motivations/")) {
    const id = pathname.split("/")[2];
    deletMotivations(res, id);
  }
  // Jika tidak ada rute yang cocok
  else {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end(JSON.stringify({ message: "Rute tidak ditemukan!" }));
  }
});

// Fungsi untuk menambah motivasi baru
const createMotivation = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    if (body.trim() === "") {
      // Jika body kosong, kembalikan respon error
      respondWithJSON(res, 400, { message: "Request body kosong!" });
      return;
    }

    try {
      const { nama, asal, tanggal, text_motivasi } = JSON.parse(body);
      if (nama && asal && tanggal && text_motivasi) {
        const newMotivation = {
          id: motivations.length + 1,
          nama,
          asal,
          tanggal,
          suka: 0,
          text_motivasi,
        };
        motivations.push(newMotivation);
        respondWithJSON(res, 201, newMotivation);
      } else {
        respondWithJSON(res, 400, { message: "Data tidak dilengkapi!" });
      }
    } catch (error) {
      // Jika JSON parsing gagal, kembalikan respon error
      respondWithJSON(res, 400, { message: "Format JSON tidak valid!" });
    }
  });
};

// Fungsi untuk membaca seluruh motivasi
const readMotivations = (res) => {
  respondWithJSON(res, 200, motivations);
};

// Fungsi untuk melihat detail motivasi berdasarkan ID
const readMotivationsById = (res, id) => {
  const motivation = motivations.find((m) => m.id === parseInt(id));
  if (motivation) {
    respondWithJSON(res, 200, motivation);
  } else {
    respondWithJSON(res, 404, { message: "Motivasi tidak ditemukan!" });
  }
};

// Fungsi untuk menambah like untuk motivasi
const addLike = (res, id) => {
  const motivation = motivations.find((m) => m.id === parseInt(id));
  if (motivation) {
    motivation.suka += 1;
    respondWithJSON(res, 200, motivation);
  } else {
    respondWithJSON(res, 404, { message: "Motivasi tidak ditemukan!" });
  }
};

// Fungsi untuk mengubah motivasi
const updateMotivation = (req, res, id) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { nama, asal, tanggal, text_motivasi } = JSON.parse(body);
    const motivationIndex = motivations.findIndex((m) => m.id === parseInt(id));
    if (motivationIndex !== -1) {
      motivations[motivationIndex] = {
        id: parseInt(id),
        nama,
        asal,
        tanggal,
        suka: motivations[motivationIndex].suka, // Tetap menyimpan jumlah like
        text_motivasi,
      };
      respondWithJSON(res, 200, motivations[motivationIndex]);
    } else {
      respondWithJSON(res, 404, { message: "Motivasi tidak ditemukan!" });
    }
  });
};

// Fungsi untuk menghapus motivasi
const deletMotivations = (res, id) => {
  const motivationIndex = motivations.findIndex((m) => m.id === parseInt(id));
  if (motivationIndex !== -1) {
    motivations.splice(motivationIndex, 1);
    respondWithJSON(res, 200, { message: "Motivasi Berhasil dihapus!" });
  } else {
    respondWithJSON(res, 404, { message: "Motivasi tidak ditemukan!" });
  }
};

// Menjalankan server
server.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
