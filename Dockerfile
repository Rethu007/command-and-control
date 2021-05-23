FROM node:12 as react-build
ARG REACT_APP_VERSION_NAME_SUFFIX
ENV REACT_APP_VERSION_NAME_SUFFIX=$REACT_APP_VERSION_NAME_SUFFIX
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=react-build /usr/src/app/build /usr/share/nginx/html
COPY docker-entrypoint.sh generate-react-runtime-env.sh /
RUN chmod +x /docker-entrypoint.sh /generate-react-runtime-env.sh
EXPOSE 80
ENTRYPOINT [ "/docker-entrypoint.sh" ]