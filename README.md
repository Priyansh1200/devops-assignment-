# DevOps CI/CD Automation Project

This repository implements the continuous integration and continuous deployment (CI/CD) workflow required for the DevOps assignment:
1. **GitHub SCM Checkout:** Automated code pull via Jenkins on push / SCM polling.
2. **Docker Build & Push:** Builds container image and pushes it to Docker Hub.
3. **Local Deployment:** Automatically deploys container locally and serves the web application at `http://localhost:8081`.

---

## 📁 Repository Structure

```text
devops-assignment/
├── Jenkinsfile         # Jenkins declarative pipeline script
├── JenkinsFile         # Case-alias matching assignment prompt
├── Dockerfile          # Multi-stage / Nginx Alpine container definition
├── project/            # Web application source files
│   ├── index.html      # Modern DevOps monitoring web portal
│   ├── style.css       # Responsive styling with glassmorphism UI
│   └── script.js       # Live clock, terminal logs, and health checks
├── Project/            # Symlink alias for case compatibility
└── README.md           # Instructions and documentation
```

---

## 🚀 Quick Local Test (Manual)

To test the application build and run locally without Jenkins:

```bash
cd ~/devops-assignment

# 1. Build the Docker image
docker build -t devops-web-app:latest .

# 2. Run the container locally on port 8081
docker run -d --name devops-local-app -p 8081:80 devops-web-app:latest

# 3. Test HTTP connectivity
curl -I http://localhost:8081

# 4. Cleanup when finished
docker stop devops-local-app && docker rm devops-local-app
```

---

## ⚙️ Jenkins Job Configuration

1. Open Jenkins at: `http://localhost:8080`
2. Click **New Item** ➔ Enter name `devops-assignment` ➔ Select **Pipeline** ➔ Click **OK**.
3. Under **Build Triggers**:
   - Check **Poll SCM** and set `H/2 * * * *` (polls every 2 minutes).
4. Under **Pipeline**:
   - **Definition:** `Pipeline script from SCM`
   - **SCM:** `Git`
   - **Repository URL:** Your GitHub repository URL (e.g. `https://github.com/<username>/devops-assignment.git`)
   - **Branch:** `*/main`
   - **Script Path:** `Jenkinsfile`
5. Click **Save** and click **Build Now**.

---

## 🐳 Docker Hub Setup (Optional / Step 2 Push)

To enable pushing to Docker Hub:
1. Go to Jenkins ➔ **Manage Jenkins** ➔ **Credentials** ➔ **System** ➔ **Global credentials (unrestricted)**.
2. Click **Add Credentials**:
   - **Kind:** `Username with password`
   - **Username:** Your Docker Hub username
   - **Password:** Your Docker Hub password or Personal Access Token
   - **ID:** `dockerhub-creds` *(must match this exact ID)*
3. Re-run the pipeline build.
