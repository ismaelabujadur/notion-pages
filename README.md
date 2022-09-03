# Personal project trying to use Notion as CMS for a React App

Process followed:

1. Create react app with: `npx create-react-app@latest frontend --template typescript`.
2. Create backend folder, add `src/server.ts` file and initialize the project with `npm install` -D typescript @types/node`.
3. Initialize typescript with `npx tsc --init` and change the `outDir` to `./dist` on `tsconfig.json`.
4. Use `npx tsc` to compile the typescript into the necessary JS files into the previously established folder dist.
5. 