npm install

Server 

Setup MongoDB

sudo vi /etc/yum.repos.d/mongodb-org-7.0.repo
	
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc

sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod

sudo vi /etc/mongod.conf
bindIp: 0.0.0.0 

sudo service mongod restart

MongoDb with Openssl - 

systemctl stop mongod
rpm -e mongodb-org mongodb-mongosh
rpm -qa | grep mongodb-*
dnf install -y mongodb-org mongodb-mongosh-shared-openssl3
systemctl start mongod


Setup SSL certificates from s3
cd /etc/nginx
sudo mkdir ssl
cd ssl
aws s3 cp s3://elasticbeanstalk-ap-south-1-654654155132/d752825b515df9c8.pem ./certificate.pem

aws s3 cp s3://elasticbeanstalk-ap-south-1-654654155132/generated-private-key.txt ./private.txt



NGINGX CONFIG
sudo vi /etc/nginx/nginx.conf

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

    ssl_certificate /etc/nginx/ssl/certificate.pem;
    ssl_certificate_key /etc/nginx/ssl/private.txt;
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

sudo nginx -s reload 

sudo nginx -s reload 