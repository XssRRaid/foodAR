npm install

Server 

setup mongoDB

nginx.conf:
<!-- edit nginx.conf -->
#Elastic Beanstalk Nginx Configuration File

user                    nginx;
error_log               /var/log/nginx/error.log warn;
pid                     /var/run/nginx.pid;
worker_processes        auto;
worker_rlimit_nofile    200000;

events {
    worker_connections  1024;
}

http {
    types_hash_max_size 4096;
    server_tokens off;

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    include       conf.d/*.conf;

    map $http_upgrade $connection_upgrade {
        default     "upgrade";
    }

    server {
        listen        80 default_server;
        listen 443 ssl;
        
        access_log    /var/log/nginx/access.log main;

        client_max_body_size 100M;
        client_header_timeout 60;
        client_body_timeout   60;
        keepalive_timeout     60;
        gzip                  off;
        gzip_comp_level       4;
        gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

        # Include the Elastic Beanstalk generated locations
        include conf.d/elasticbeanstalk/*.conf;
    }
}

<!-- end of nginx.conf -->

Environment variable
DB_URI = "mongoDB connection string"