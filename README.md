# Genkit Upscale Reproduction

This repository contains a reproduction of an issue with the Genkit library's image upscaling functionality. The reproduction demonstrates that while the direct fetch approach works correctly, the Genkit approach fails.

## Problem

When using the Genkit library to upscale images with Vertex AI's Imagen service, the request fails. However, using a direct fetch approach to the same API works correctly:

![Screenshot of example repro output](/repro-screenshot.png)

```bash
=== TESTING GENKIT APPROACH ===
Starting upscale with Genkit...
Genkit initialized
Error in Genkit upscale: Error: Error from Vertex AI predict: HTTP 400: {
  "error": {
    "code": 400,
    "message": "Image editing failed with the following error: Image size 'IMAGE_SIZE_DEFAULT' is not supported.",
    "status": "INVALID_ARGUMENT"
  }
}

    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/vertexai/src/predict.ts:77:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/vertexai/src/imagen.ts:274:24)
    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/action.ts:426:14)
    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/action.ts:322:26)
    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/tracing/instrumentation.ts:73:16)
    at <anonymous> (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/tracing/instrumentation.ts:115:24)
    at runInNewSpan (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/tracing/instrumentation.ts:103:10)
    at newTrace (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/tracing/instrumentation.ts:62:10)
    at AsyncFunction.actionFn.run (/Users/jacob/genkit-upscale-repro/node_modules/@genkit-ai/core/src/action.ts:289:18) {
  traceId: '2239357ffbce36cab70ab0dd20392ad9'
}
Genkit approach failed: Error from Vertex AI predict: HTTP 400: {
  "error": {
    "code": 400,
    "message": "Image editing failed with the following error: Image size 'IMAGE_SIZE_DEFAULT' is not supported.",
    "status": "INVALID_ARGUMENT"
  }
}


=== TESTING FETCH APPROACH ===
Starting upscale with fetch...
API URL: https://us-central1-aiplatform.googleapis.com/v1/projects/dev-extensions-testing/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict
Fetch upscale successful
Fetch Result: Success
```

## Setup

1. Ensure Vertex AI (and Imagen) are available in a GCP project
2. Ensure appropriate application default credentials are set in your environment
3. Clone this repository
4. Install dependencies:
   ```
   npm install
   ```

5. Create a `.env` file with the following variables:
   ```
   PROJECT_ID=your-google-cloud-project-id
   LOCATION=us-central1
   ```

## Running the Reproduction

To run;

```
npx tsx src/index.ts
```

## Expected Results

The test will attempt to upscale an image using both methods:

1. **Genkit approach** - This is expected to fail with an error
2. **Direct fetch approach** - This is expected to succeed

You'll see the detailed logs in the console showing which approach works and which doesn't.

## Dependencies

This project requires:

- `@genkit-ai/vertexai`
- `genkit`
- `google-auth-library`
- `dotenv`

## Authentication

This reproduction uses Application Default Credentials. Make sure you're authenticated with Google Cloud:

```
gcloud auth application-default login
```

Or set up a service account key and point to it:

```
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```
