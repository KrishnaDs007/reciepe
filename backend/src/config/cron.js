import cron from "cron";
import https from "https";

export const cronJob = new cron.CronJob(
    "*/14 * * * * *",
    function () {
        https.get(process.env.API_URL + "/api/health", (res) => {
            if (res.statusCode === 200) {
                console.log(`Get request sent successfully`);
            } else {
                console.log(`Error while sending get request`);
            }
        }).on("error", (error) => {
            console.error(error);
        });
    },
    // null,
    // true,
    // "Asia/Kolkata"
);

export default cronJob;