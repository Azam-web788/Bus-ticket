import { configure } from '@codegenie/serverless-express';
import app from './src/index.js';

export const handler = configure({ app });
