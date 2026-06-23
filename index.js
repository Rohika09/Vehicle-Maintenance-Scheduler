const fs = require("fs");
const {
    getDepots,
    getVehicles
} = require("./services/apiService");

async function main() {
    try {
        const depots = await getDepots();

        const Log = require("./middleware/logger");

await Log(
    "backend",
    "info",
    "service",
    "Fetched depots successfully"
);

        const vehicles = await getVehicles();

        const knapsack = require("./utils/knapsack");

        const results = [];

        for(const depot of depots) {

    const result =
        knapsack(
            vehicles,
            depot.MechanicHours
        );

    const totalDuration =
        result.selectedTasks.reduce(
            (sum, task) =>
                sum + task.Duration,
            0
        );

        results.push({
    DepotID: depot.ID,
    MechanicHours: depot.MechanicHours,
    TotalDuration: totalDuration,
    TotalImpact: result.totalImpact,
    SelectedTasks: result.selectedTasks.map(
        task => task.TaskID
    )
});

    console.log({
        DepotID: depot.ID,
        MechanicHours:
            depot.MechanicHours,

        TotalDuration:
            totalDuration,

        TotalImpact:
            result.totalImpact,

        SelectedTasks:
            result.selectedTasks.map(
                task => task.TaskID
            )
    });
}
fs.writeFileSync(
    "output.json",
    JSON.stringify(results, null, 2)
);

console.log("output.json generated");
    }
    catch(error) {
        console.error("Error occurred:", error.message);
    }
}
 main();

