import * as process from "node:process";

export const config = {
    port: process.env.PORT || 3100,
    supportedPostCount: 15,
    databaseUrl: process.env.MONGODB_URL || 'mongodb+srv://37685_db_user:HrXqsrjPGQLFiI7g@cluster0.inw1xa4.mongodb.net/?appName=Cluster0'
};

