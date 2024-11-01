# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.2.2
ARG NODE_VERSION=14

# Stage 1: Build Vite app
FROM node:${NODE_VERSION}-slim AS client
WORKDIR /client
ENV NODE_ENV=production

# Install node modules
COPY client/package.json client/package-lock.json ./
RUN npm install

# Build client application
COPY client ./
RUN npm run build

# Stage 2: Build Rails app
FROM ruby:$RUBY_VERSION-slim AS base
LABEL fly_launch_runtime="rails"
WORKDIR /app
ENV BUNDLE_DEPLOYMENT="1" BUNDLE_PATH="/usr/local/bundle" BUNDLE_WITHOUT="development:test" RAILS_ENV="production"
RUN gem update --system --no-document && gem install -N bundler

FROM base AS build
RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential libpq-dev
COPY Gemfile Gemfile.lock ./
RUN bundle install && bundle exec bootsnap precompile --gemfile && rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git
COPY . .
RUN bundle exec bootsnap precompile app/ lib/

FROM base
RUN apt-get update -qq && apt-get install --no-install-recommends -y curl postgresql-client && rm -rf /var/lib/apt/lists /var/cache/apt/archives
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /app /app
COPY --from=client /client/dist /app/public
RUN groupadd --system --gid 1000 rails && useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && chown -R 1000:1000 db log storage tmp
USER 1000:1000
ENTRYPOINT ["/app/bin/docker-entrypoint"]
EXPOSE 3000
CMD ["./bin/rails", "server"]
