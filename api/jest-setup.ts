// Ensure that process.env values are defined when jest runs code, to match serverless's behaviour.

import * as dotenv from 'dotenv';

dotenv.config();
