FROM nginxinc/nginx-unprivileged

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/sharks.conf /etc/nginx/conf.d

COPY ./src /var/www/sharks