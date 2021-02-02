FROM node:14-stretch

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qq \
 && apt-get install -y \
      build-essential \
      xorg \
      libssl-dev \
      libxrender-dev \
      wget \
      unzip \
      gdebi \
 && apt-get autoremove \
 && apt-get clean

RUN wget -q https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.deb \
     && apt-get install ./wkhtmltox_0.12.5-1.stretch_amd64.deb

# Noto Fonts for CJK
RUN wget -q https://noto-website.storage.googleapis.com/pkgs/Noto-unhinted.zip \
 && unzip -d NotoSans Noto-unhinted.zip \
 && mkdir -p /usr/share/fonts/opentype \
 && mv -fv ./NotoSans /usr/share/fonts/opentype/NotoSans \
 && rm -rfv Noto-unhinted.zip \
 && fc-cache -fv

WORKDIR /usr/src

COPY package.json ./
COPY tsconfig.json ./
COPY . .

RUN npm install --no-optional \
 && node_modules/.bin/tsc --build tsconfig.json

EXPOSE 5001

CMD ["node", "dist/index.js"]
