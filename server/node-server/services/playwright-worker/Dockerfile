# Official Playwright image (Chromium preinstalled)
FROM mcr.microsoft.com/playwright:v1.58.0-jammy



# Create non-root user (security best practice)
RUN groupadd -r airlock && useradd -r -g airlock airlock

WORKDIR /app

# Copy package files first (faster builds)
COPY package*.json ./

# Install deps as root
RUN npm ci --omit=dev

# Copy code
COPY . .

# Give folder ownership to airlock user
RUN chown -R airlock:airlock /app

# Switch to non-root AFTER everything is ready
USER airlock

# Entry point
ENTRYPOINT ["node", "analyze.js"]
