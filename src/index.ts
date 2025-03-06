import { config } from "dotenv";
config();

import { imagen3, vertexAI } from "@genkit-ai/vertexai";
import { genkit } from "genkit";
import { GoogleAuth } from "google-auth-library";
// Configuration
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION;

// Test image
const BASE64_IMAGE =
  "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAE8UlEQVR4nOza+1NU9RsHcFaPoPhl9DuoiKJcTF28kHdzacPFNRQjkSC3EAsKJHFEHJAQyQwRw4VYQvHSBApKQkEBm0wJJXEdLgoJUhpKBCpewAuEgdhPvd/+B2fOzHl+en0Y3TnPPOfseT7PZ4XuPeYm/8UG/THYTFUNG+tmwe1rM+Dh8ERY+8wNzr1QCS/Vd8PBtbbwUecIOKl6A9xkfQh2urwZHuuZBw/6L4NHmEg85ATEDqGlvwaLd3MfwpqAVjja5Qg8z2ULbF38JdwcNR+e5JwCpwXtgNXVn8MPdH/xIgZK4AkZd+E++3/g0otdcPbuCbDkKyAnIHYIA8d+wsIY8y28NrAT9tedgccm+MBuP96Hg38LgU07/wd737oNuzjyWQozozNted8bT22HrW1T4Y6zvOhFVsthyVdATkDsUDReZc+j9lTCbksD4aS5v9PmDnCbeyO88zTv43xXG9iYxb/ffD0Bfmv2eNh2IZ+l87o78NSt7KlibyyAncdZwpKvgJyA2KE4crMFi/V5prAydSH8ceYz2KnrEpxVvgKeF6OBfQtOwiXr+B7oOHwPTpidA6c4RsGaXX5wscVze4xDb8M/zymAJV8BOQGxQ8jdxT3xqBB+Zzvr+AzsX8C/D6W8DOc8qocTlRXw1PGZ8IzeXvibhYvhSie+Q0IXcy9h8pjXsy/vMJwszIDDNr0AS74CcgJihxCY8ASLoNK1sOZsMtz4InsYdeersEHN90De5tnwItUJWF/JmU/klePw4DhH2M+G17BpVAb/7zzuB4SMmXBAIfsxyVdATkDsUPjY8V7ctqYHtul5DNc6DcIeq9i77/hMBU9bPQbOD2uHr28bgmPrJ8JFlrFwdJw7PHbWDdhtchWsfMjPH+zZB0u+AnICYofCy4UzlmmuHnCNaRA8ouND2LL8NVgbydm/6us/4NZLc+Dvr3H22pzTAFtE8v52+KoM9q1iv9Q4wPnpuueux2DkPkHyFZATEDuE6w+ysQiYxLlnTkUpPNOf3/chyexbHGx5npAwGA/rbh+FV5xXwN2pA3DfD16wwYdnZxNz2Tu5ZbMfW3aS19CWxGdJ8hWQExA7BKVnOhYRoZznnLtTCysvB8Bf1HFuMz/0FOy4nL1+uynnPNqqW7BpFD/HMIaz0b9Xcj5r+R6fBzsd99mZ3jFwmZbnGJKvgJyA2CG0reZ58CMXfjd3FPIeLYnKgtPadsMXWnmO5qW2g78zFMHb06bAG6My4OHJ3H+/NPIDWGXgrNa4RYDzE0fDc9P2w5KvgJyA2CFMeYf36/1ZZrCF36fwuf+/D1e8Eg2bj1wPu7r/ArfYBMP2aiv4zBS+K6458RlLr94LNzdwL6Ed7Q17eEbCT4q3wpKvgJyA2KHovsfepqlRC3tM5+98VjbnwkPBnFGmHue5lXn3G3C1SRMcH8HzLPsu/iYv5XQ5XHGA74Fwaz08ceZTOLN3D2xW7gpLvgJyAmKHoiviIyxSlnA+czFvGN6bzj4+bilnnYlWhbDZavY2dxu4HyhawfOyAyWr4P419vDTcfw3GtUVuC2cfVRN/zR4idIIS74CcgJih1B+YiMW0+u51wyz4u929Ac5h+kb4wv/+gnv11V6a9gYXwcvaWePFLTTAnb40w4uGLgKx5XxO95V/SY/R8Pfbx8M5f5E8hWQExA7/g0AAP//vmh5PGvgHZQAAAAASUVORK5CYII=";

if (!PROJECT_ID || !LOCATION) {
  throw new Error(
    "For this repro to work, you need to set PROJECT_ID and LOCATION environment variables"
  );
}
/**
 * Upscales an image using Genkit
 * This approach is failing according to your description
 */
async function upscaleWithGenkit(
  projectId: string,
  location: string,
  base64Image: string,
  prompt: string = "",
  factor: number = 2
): Promise<any> {
  try {
    console.log("Starting upscale with Genkit...");

    // Initialize Genkit with Vertex AI plugin
    const ai = genkit({
      plugins: [
        vertexAI({
          location: location,
          projectId: projectId,
        }),
      ],
    });

    console.log("Genkit initialized");

    // Convert factor to string format (x2 or x4)
    const upscaleFactor = `x${factor}`;

    // Create data URL from base64 image
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Attempt upscaling with Genkit
    const result = await ai.generate({
      messages: [
        {
          role: "user",
          content: [
            {
              media: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      config: {
        mode: "upscale",
        upscaleFactor: upscaleFactor,
      },
      model: imagen3,
    });

    console.log("Genkit upscale successful");
    return result;
  } catch (error) {
    console.error("Error in Genkit upscale:", error);
    throw error;
  }
}

/**
 * Upscales an image using direct fetch approach to the Imagen API
 * This approach is working according to your description
 */
async function upscaleWithoutGenkit(
  projectId: string,
  location: string,
  base64Image: string,
  prompt: string = "",
  factor: number = 2
): Promise<any> {
  try {
    console.log("Starting upscale with fetch...");

    // Create a new GoogleAuth instance for authentication
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    // Get the access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // API endpoint
    const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-002:predict`;
    console.log("API URL:", apiUrl);

    // Request payload
    const requestBody = {
      instances: [
        {
          prompt: prompt,
          image: {
            bytesBase64Encoded: base64Image,
          },
        },
      ],
      parameters: {
        sampleCount: 1,
        mode: "upscale",
        upscaleConfig: {
          upscaleFactor: `x${factor}`,
        },
      },
    };

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    console.log("Fetch upscale successful");
    return result;
  } catch (error) {
    console.error("Error in fetch upscale:", error);
    throw error;
  }
}

/**
 * Run both approaches and compare results
 */
async function main() {
  console.log("=== UPSCALE COMPARISON TEST ===");

  // First try with Genkit (expected to fail)
  console.log("\n=== TESTING GENKIT APPROACH ===");
  try {
    const genkitResult = await upscaleWithGenkit(
      PROJECT_ID!,
      LOCATION!,
      BASE64_IMAGE,
      "",
      2
    );
    console.log("Genkit Result:", genkitResult ? "Success" : "No result");
  } catch (error) {
    console.error("Genkit approach failed:", error.message);
  }

  // Then try with fetch (expected to work)
  console.log("\n=== TESTING FETCH APPROACH ===");
  try {
    const fetchResult = await upscaleWithoutGenkit(
      PROJECT_ID!,
      LOCATION!,
      BASE64_IMAGE,
      "",
      2
    );
    console.log("Fetch Result:", fetchResult ? "Success" : "No result");
  } catch (error) {
    console.error("Fetch approach failed:", error.message);
  }
}

// Run test
main().catch((error) => {
  console.error("Fatal error:", error);
});
