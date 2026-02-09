# Deployment Prerequisites Guide

Before your Continuous Deployment pipeline can run successfully, you must complete the following manual setup steps on your VPS and GitHub repository.

## 1. Prepare Your VPS

Log in to your VPS and ensure the following:

### Install Docker & Docker Compose

The deployment script relies on `docker` and `docker compose`.

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and Docker Compose
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Verify Installation

Run `docker compose version` to ensure it is installed correctly.

### Check Port Availability

Ensure ports **80** (HTTP) and **443** (HTTPS) are **NOT** being used by another service (like a pre-installed Apache or Nginx).

```bash
sudo netstat -tulpn | grep :80
```

If something is running, stop and disable it:

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
```

## 2. Configure GitHub Secrets

Go to your repository on GitHub: **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following secrets:

### VPS Connection Secrets

| Secret Name    | Description              | Example                                   |
| :------------- | :----------------------- | :---------------------------------------- |
| `VPS_HOST`     | IP Address of your VPS   | `103.1.2.3`                               |
| `VPS_USERNAME` | Username to SSH into VPS | `root` or `ubuntu`                        |
| `VPS_SSH_KEY`  | Private SSH Key content  | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |

### Application Environment Secrets

These will be injected into your application and database containers.

| Secret Name         | Description               | Example              |
| :------------------ | :------------------------ | :------------------- |
| `PGUSER`            | Database Username         | `developer`          |
| `PGPASSWORD`        | Database Password         | `s3cr3tp4ssw0rd`     |
| `PGDATABASE`        | Database Name             | `forumapi`           |
| `ACCESS_TOKEN_KEY`  | JWT Access Token Secret   | `access-secret-key`  |
| `REFRESH_TOKEN_KEY` | JWT Refresh Token Secret  | `refresh-secret-key` |
| `ACCESS_TOKEN_AGE`  | Token validity in seconds | `3000`               |

> **Note**: `PGHOST` is set to `postgres` in `docker-compose.yml`, so you don't need to add it as a secret unless you change the architecture. `PORT` defaults to 5000.

## 3. Initial Deployment Trigger

Once the above steps are done:

1.  Commit and push your changes (including the new workflow files) to the `main` branch.
2.  Go to the **Actions** tab in GitHub.
3.  Watch the `Continuous Integration` workflow running.
4.  Once CI succeeds, the `Continuous Deployment` workflow will automatically start.

## 4. HTTPS Setup (One-Time Only)

After the first deployment, the application will be accessible via HTTP, but HTTPS will not work yet because certificates are missing. You need to generate them manually once.

1.  **SSH into your VPS**.
2.  Navigate to the project directory:
    ```bash
    cd ~/forum-api
    ```
3.  Make the initialization script executable:
    ```bash
    chmod +x init-letsencrypt.sh
    ```
4.  Run the script:
    ```bash
    sudo ./init-letsencrypt.sh
    ```
    This script will:
    - Download recommended TLS parameters.
    - Create dummy certificates to allow Nginx to start.
    - Start Nginx.
    - Request real certificates from Let's Encrypt using Certbot.
    - Reload Nginx to apply the new certificates.

After this, your site `https://api.forum.taqiyyaghazi.com` should be secure! The `certbot` container in `docker-compose.yml` will handle automatic renewals.
