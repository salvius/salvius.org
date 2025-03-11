FROM ruby:3.3-slim-bookworm

# speeds up installation of html-proofer
ENV NOKOGIRI_USE_SYSTEM_LIBRARIES=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    # for html-proofer
    libcurl4 \
    # For jekyll_picture_tag gem
    libvips-dev libpng-dev libjpeg-dev imagemagick \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

RUN gem update --system && gem install jekyll && gem cleanup

COPY Gemfile Gemfile.lock ./

# Run `bundle update` to update gems
RUN bundle install --no-cache

ENTRYPOINT ["sleep", "infinity"]
