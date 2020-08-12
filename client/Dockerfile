FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/sharks.conf /etc/nginx/conf.d

# Trying to fix Openshift permission issue
RUN mkdir -p /var/www/sharks

COPY ./src /var/www/sharks