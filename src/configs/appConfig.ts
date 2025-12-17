export type AppConfig = {
  baseUrlDev: string;
  baseUrlProd: string;
  stage: "Dev" | "Prod";
};
export const appConfig: AppConfig = {
  baseUrlDev: "https://z2gnw9043c.execute-api.us-east-1.amazonaws.com/api/dev",
  baseUrlProd:
    "https://z2gnw9043c.execute-api.us-east-1.amazonaws.com/api/prod",
  stage: "Dev",
};
