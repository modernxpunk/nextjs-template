group "validate" {
  targets = ["api", "web", "migrate"]
}

target "_common" {
  context    = "."
  dockerfile = "Dockerfile"
  output     = ["type=cacheonly"]
}

target "api" {
  inherits   = ["_common"]
  target     = "api"
  cache-from = ["type=gha,scope=docker-api"]
  cache-to   = ["type=gha,mode=max,scope=docker-api"]
}

target "web" {
  inherits   = ["_common"]
  target     = "web"
  cache-from = ["type=gha,scope=docker-web"]
  cache-to   = ["type=gha,mode=max,scope=docker-web"]
}

target "migrate" {
  inherits   = ["_common"]
  target     = "migrate"
  cache-from = ["type=gha,scope=docker-migrate"]
  cache-to   = ["type=gha,mode=max,scope=docker-migrate"]
}
