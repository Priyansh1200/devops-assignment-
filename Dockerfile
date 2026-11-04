# Use lightweight official Nginx Alpine image
FROM nginx:alpine

# Copy static website files into default Nginx serving directory
COPY project/ /usr/share/nginx/html/

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is responding on port 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
