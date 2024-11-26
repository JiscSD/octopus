// Ensure that process.env values are defined when jest runs code, to match the
// way serverless interprets env files.

import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config());
