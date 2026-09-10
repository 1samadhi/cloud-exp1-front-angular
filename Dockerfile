# Construccion del bundle. Las variables de entorno no sirven aqui: Angular
# resuelve la configuracion en tiempo de compilacion mediante fileReplacements,
# asi que environment.prod.ts ya trae la URL del stage y los IDs de Entra.
FROM node:22-alpine AS construccion
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# El stage del API Gateway sirve la aplicacion bajo /desarrollo/, asi que el
# base href tiene que reflejarlo: si quedara en "/", el enrutador generaria
# enlaces a /catalogo en vez de /desarrollo/catalogo y la navegacion se romperia.
ARG BASE_HREF=/desarrollo/
RUN npm run build -- --configuration production --base-href ${BASE_HREF}

FROM nginx:alpine
COPY --from=construccion /app/dist/front-angular/browser /usr/share/nginx/html
# La imagen de nginx procesa las plantillas de este directorio al arrancar y
# sustituye las variables de entorno. Asi el secreto del gateway no queda
# incrustado en la imagen.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV SECRETO_GATEWAY=""
EXPOSE 80
