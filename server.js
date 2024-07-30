import express from "express";
import { createServer } from "node:http";
// import { Vonage } from "@vonage/server-sdk";

const app = express();
const server = createServer(app);

// const vonage = new Vonage({})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/healthcheck", (_, res) => {
    return res.send("ok");
});

app.post("/voice/answer", (req, res) => {
    console.log(req.body)
    
    const ncco = [
        {
            action: "talk",
            text: "Hello, I'm anwana, how can I help you today?",
        },
        {
            action: "input",
            eventUrl: [`${req.protocol}://${req.get("host")}/voice/ivr`],
            type: ["speech"],
            speech: {
                endOnSilence: 2 /* 2 seconds pause to capture end of user query */,
                context: [],
                startTimeout: 10 /* ends call if user doesn't speak for 10s */,
                maxDuration: 30 /* user can only talk for 30s */,
                saveAudio: true /* we should see this as an event */,
                sensitivity: 90,
            },
        },
    ];

    return res.json(ncco);
});

app.post("/voice/events", (req, res) => {
    /* live events on call */
    console.log(req.body);

    return res.sendStatus(200);
});

/* interactive voice response */
app.post("/voice/ivr", async (request, response) => {
    console.log(request.body);

    /* simulate 1 sec delay */
    await new Promise((res) => {
        setTimeout(res, 1_000);
    });

    const ncco = [
        {
            action: "talk",
            text: "Thank you, I understand",
        },
    ];

    return res.json(JSON.stringify(ncco));
});

const port = 5516;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
