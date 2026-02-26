export type AppConfig = {
  baseUrlDev: string;
  baseUrlProd: string;
  stage: "Dev" | "Prod";
};
export const appConfig: AppConfig = {
  baseUrlDev: "https://ivyo0jfb98.execute-api.us-east-1.amazonaws.com/api/dev",
  baseUrlProd: "https://ivyo0jfb98.execute-api.us-east-1.amazonaws.com/api/dev",
  stage: "Dev",
};
