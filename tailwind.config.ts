import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{html,ts}", // Escanea todos los archivos HTML y TypeScript en el proyecto
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
