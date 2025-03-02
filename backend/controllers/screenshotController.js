const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const captureYouTubeScreenshot = async (req, res) => {
  try {
    const { videoId, timestamp } = req.body;

    if (!videoId) {
      return res.status(400).json({ success: false, error: "Video ID is required" });
    }

    console.log(`🎬 Processing Video ID: ${videoId} at Timestamp: ${timestamp}`);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${Math.floor(timestamp)}`;
    console.log(`🔗 Navigating to: ${embedUrl}`);

    await page.goto(embedUrl, { waitUntil: "networkidle2" });

    console.log("⏳ Waiting for video element...");
    await page.waitForSelector("video", { timeout: 15000 });

    // Ensure video is playing
    await page.evaluate(() => {
      const video = document.querySelector("video");
      if (video) {
        video.muted = true;
        video.play();
      }
    });

    console.log("🎥 Video loaded. Waiting for rendering...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("📸 Taking screenshot...");
    const videoElement = await page.$("video");

    let screenshot;
    if (videoElement) {
      screenshot = await videoElement.screenshot({ type: "png" });
    } else {
      console.log("⚠️ Video element not found. Capturing full page...");
      screenshot = await page.screenshot({ type: "png", fullPage: false });
    }

    // Define save path
    const savePath = `C:\\Users\\admin\\Desktop\\Synergy\\LinearDepression_PriyanshShah\\frontend\\temp`;

    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }

    // Save screenshot
    const fileName = `screenshot_${videoId}_${Date.now()}.png`;
    const filePath = path.join(savePath, fileName);
    fs.writeFileSync(filePath, screenshot);
    console.log(`✅ Screenshot saved at: ${filePath}`);

    await browser.close();

    // 🔥 Call Gemini API to describe the image
    const description = await getGeminiDescription(screenshot);

    res.json({
      success: true,
      message: "Screenshot saved successfully",
      filePath,
      description,
    });

  } catch (error) {
    console.error("❌ Screenshot error:", error);
    res.status(500).json({ success: false, error: "Failed to capture screenshot", details: error.message });
  }
};

// 🎯 Function to Get Image Description from Gemini
const getGeminiDescription = async (imageBuffer) => {
    try {
      const base64Image = imageBuffer.toString("base64");
  
      console.log("🖼️ Base64 Image Data:", base64Image.substring(0, 100) + "..."); // Log first 100 chars
  
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }
      );
  
      console.log("📡 Gemini API Response:", JSON.stringify(response.data, null, 2));
  
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No description available";
    } catch (error) {
      console.error("🔥 Gemini API Error:", error?.response?.data || error.message);
      return "Failed to generate description.";
    }
  };
  

module.exports = { captureYouTubeScreenshot };
