FROM node:22-bookworm-slim AS assets
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build \
    && for file in public/videos/*.mp4; do \
        [ -f "$file" ] || continue; \
        if head -c 100 "$file" | grep -Fqx 'version https://git-lfs.github.com/spec/v1'; then \
            echo "Skipping unresolved Git LFS pointer: $file"; \
            rm "$file"; \
        fi; \
    done

FROM dunglas/frankenphp:1-php8.4-bookworm AS runtime
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && install-php-extensions curl mbstring opcache apcu \
    && printf 'apc.enable_cli=1\n' > "$PHP_INI_DIR/conf.d/zz-apcu.ini"
WORKDIR /app
COPY --chown=www-data:www-data includes ./includes
COPY --chown=www-data:www-data data ./data
COPY --from=assets --chown=www-data:www-data /src/public ./public
COPY --chown=www-data:www-data Caddyfile /etc/frankenphp/Caddyfile
RUN setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp \
    && chown -R www-data:www-data /config/caddy /data/caddy
ENV PORT=80 APP_ENV=production
USER www-data
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
