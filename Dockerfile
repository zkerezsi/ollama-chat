FROM denoland/deno:2.1.3
WORKDIR /app
USER deno
COPY . .
RUN deno cache main.tsx
CMD ["run", "--allow-all", "main.tsx"]
