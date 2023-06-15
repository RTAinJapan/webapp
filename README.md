# webapp

Event management system for RTA in Japan.

## Requirement

- Node.js
- npm 9
- Docker and Docker Compose

## Develop

- Start Storybook

  ```
  npm run storybook
  ```

- Start integrated development

  ```
  npm run dev
  ```

- Migrate database
  ```
  npx prisma migrate dev
  ```

## Local HTTPS certificate

HTTPS is required to develop both frontend and backend.

### Using mkcert

https://github.com/FiloSottile/mkcert

1. Install mkcert

   ```sh
   # Windows
   choco install mkcert

   # macOS
   brew install mkcert
   ```

1. Create certificate

   ```
   mkcert -install
   mkcert localhost
   ```

1. localhost-key.pem and localhost.pem are created at project root.
