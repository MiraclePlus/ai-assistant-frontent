set dotenv-load

# list all recipes
default:
  just --list

dev:
  pnpm run dev

build:
  pnpm run build

export:
  pnpm run export

deploy:
  pnpm run build && pnpm run export && aws s3 cp out/ s3://ai-assistant/ --recursive
