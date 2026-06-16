const cloudinary = require("cloudinary").v2;

// STEP 3.1 — Configure Cloudinary with inline credentials
cloudinary.config({
  cloud_name: "dfk0102dn",
  api_key: "262322534953897",
  api_secret: "zdnCsNiZz31qW3Ffn6YMXNXdP44",
  secure: true
});

console.log("🔄 Starting Cloudinary test script...");

// STEP 3.2 — Upload an image from Cloudinary's demo domain
const sampleImageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

cloudinary.uploader.upload(sampleImageUrl, { folder: "paw_memories_test" })
  .then((result) => {
    console.log("✅ Image Uploaded successfully!");
    console.log("----------------------------------------");
    console.log("Secure URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
    console.log("----------------------------------------");

    // STEP 3.3 — Get and print image details
    console.log("📊 Image Metadata:");
    console.log(`- Dimensions: ${result.width}x${result.height}px`);
    console.log(`- Format: ${result.format}`);
    console.log(`- File Size: ${result.bytes} bytes`);
    console.log("----------------------------------------");

    // STEP 3.4 — Transform the image (f_auto: auto format, q_auto: auto quality)
    const transformedUrl = cloudinary.url(result.public_id, {
      fetch_format: "auto", // Automatically chooses best format (WebP/AVIF depending on browser)
      quality: "auto",      // Automatically compresses without losing visible quality
      secure: true
    });

    console.log("✨ Done! Click the link below to see the optimized version of the image:");
    console.log(transformedUrl);
    console.log("Check the size and the format in your browser developer tools.");
  })
  .catch((error) => {
    console.error("❌ Cloudinary Upload failed:", error);
    process.exit(1);
  });
