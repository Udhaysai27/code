const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API to download video
app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "URL is required" });

  const outputFileName = `video_${Date.now()}.mp4`;
  const outputPath = `downloads/${outputFileName}`;

  // Download video using yt-dlp
  exec(`yt-dlp -f best -o ${outputPath} ${videoUrl}`, (error) => {
    if (error) return res.status(500).json({ error: "Download failed" });

    res.download(outputPath, (err) => {
      if (err) console.error("Download Error:", err);
      fs.unlinkSync(outputPath); // Delete file after download
    });
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
