# GCP Deployment Setup Guide

This guide details the steps to configure Google Cloud Platform (GCP) for your Cineior backend deployment using the existing GitHub Actions workflow.

## Prerequisites

1.  **GCP Account**: Ensure you have an active Google Cloud Platform account.
2.  **GCloud CLI**: Install the Google Cloud SDK locally (optional, for verification).
3.  **GitHub Repository Admin Access**: To add secrets.

## Step 1: Create a GCP Project

1.  Go to the [GCP Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top bar and select **New Project**.
3.  Name it (e.g., `cineior-backend`) and note the **Project ID** (e.g., `cineior-backend-12345`). You will need this later.

## Step 2: Enable Required APIs

1.  In the GCP Console sidebar, go to **APIs & Services** -> **Enabled APIs & services**.
2.  Click **+ Enable APIs and Services**.
3.  Search for and enable the following APIs:
    *   **Cloud Run Admin API** (`run.googleapis.com`)
    *   **Artifact Registry API** (`artifactregistry.googleapis.com`)
    *   **IAM Service Account Credentials API** (often required for GitHub Actions authentication)

## Step 3: Create Artifact Registry Repository

1.  Go to **Artifact Registry** in the console.
2.  Click **+ Create Repository**.
3.  **Name**: `cineior-repo` (Must match the `REPOSITORY` value in `deploy-gcp.yml`).
4.  **Format**: Docker.
5.  **Mode**: Standard.
6.  **Location Type**: Region.
7.  **Region**: `us-central1` (Must match `REGION` in `deploy-gcp.yml`).
8.  Click **Create**.

## Step 4: Create Service Account for GitHub Actions

1.  Go to **IAM & Admin** -> **Service Accounts**.
2.  Click **+ Create Service Account**.
3.  **Name**: `github-action-sa`.
4.  **Description**: Service Account for GitHub Actions Deployment.
5.  Click **Create and Continue**.
6.  **Grant Access**: Add the following roles:
    *   **Artifact Registry Writer** (to push images)
    *   **Cloud Run Developer** (to deploy services)
    *   **Service Account User** (to run the service as this account)
7.  Click **Done**.

## Step 5: Generate Key and Configure GitHub Secrets

1.  In the Service Accounts list, click the email of the newly created account (`github-action-sa@...`).
2.  Go to the **Keys** tab.
3.  Click **Add Key** -> **Create new key**.
4.  Select **JSON** and click **Create**.
5.  A JSON file will download. **Securely store this file; it is your credential.**

6.  **Configure GitHub Secrets**:
    *   Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
    *   Click **New repository secret**.
    *   **Name**: `GCP_PROJECT_ID`
        *   **Value**: Your Project ID from Step 1.
    *   **Name**: `GCP_SA_KEY`
        *   **Value**: Paste the *entire* contents of the downloaded JSON key file.

## Step 6: Deploy

1.  Push your code to the `main` branch.
2.  Go to the **Actions** tab in GitHub to watch the `Deploy to GCP Cloud Run` workflow.
3.  Once successful, the Cloud Run URLs for each service will be printed in the logs or visible in the GCP Cloud Run console.

## Step 7: Update Frontend

1.  Get the URL of the `api-gateway` service from Cloud Run.
2.  Update your frontend environment variable (`NEXT_PUBLIC_API_URL` or similar) to point to this URL.
