const { getNotifications } =
    require("./services/apiService");

function getPriorityScore(notification) {

    const weights = {
        Placement: 3,
        Result: 2,
        Event: 1
    };

    const typeWeight =
        weights[notification.Type] || 0;

    const ageHours =
        (Date.now() -
        new Date(notification.Timestamp))
        / (1000 * 60 * 60);

    return (
        typeWeight * 100 -
        ageHours
    );
}

async function main() {

    try {

        const notifications =
            await getNotifications();

        const ranked =
            notifications.map(n => ({
                ...n,
                Score:
                    getPriorityScore(n)
            }));

        ranked.sort(
            (a, b) =>
                b.Score - a.Score
        );

        const top10 =
            ranked.slice(0, 10);

        console.log(
            "\nTOP 10 PRIORITY NOTIFICATIONS\n"
        );

        console.table(
            top10.map(n => ({
                Type: n.Type,
                Message: n.Message,
                Timestamp: n.Timestamp,
                Score:
                    n.Score.toFixed(2)
            }))
        );

    }
    catch(error) {

        console.error(
            error.response?.data ||
            error.message
        );

    }
}

main();