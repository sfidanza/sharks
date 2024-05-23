FROM bitnami/nginx:1.26.0

#RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/sharks.conf /opt/bitnami/nginx/conf/server_blocks/

COPY ./src /var/www/sharks