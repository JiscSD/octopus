// Ensure that process.env values are defined when jest runs code, to match the behaviour
// configured by serverless's "useDotenv" option (which also uses dotenv-expand).

import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config());
