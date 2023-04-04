#!/usr/bin/env sh

set -e

dir="`dirname "$0"`/.."

installDependency() {
    (mkdir -p "$dir/$1" && cd "$dir/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

installDependency flux-eco-node-http-server https://github.com/flux-eco/flux-eco-node-http-server/archive/refs/tags/v2023-03-22-1.tar.gz
installDependency flux-eco https://github.com/flux-eco/flux-eco/archive/refs/tags/v2023-03-06-2.tar.gz