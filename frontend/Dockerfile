FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
# Instalar siempre antes de arrancar
CMD sh -c "pnpm install && pnpm run dev --host"