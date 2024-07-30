const { spawn } = require("child_process");
const { group } = require("console");
const axios = require("axios");


async function sendAutoSignalMessage(message) {
    const url = "http://127.0.0.1:7000/api/v1/rpc";
    const headers = {
        "Content-Type": "application/json",
    };

    // Payload construction
    const payload = {
        jsonrpc: "2.0",
        method: "send",
        id: "1",
        params: {
            groupId: "FNMQpWnKwigc2z8ILYht7S+TeC2zl+6gQSPGuA2clJg=",
            message: message,
        },
    };

    await axios
        .post(url, payload, { headers: headers })
        .then((response) => {
            if (response.status === 200) {
                console.log("Response:", response.data);
            } else {
                console.error("Error:", response.status, response.statusText);
            }
        })
        .catch((error) => {
            console.error(
                "Error:",
                error.response ? error.response.status : "No response",
                error.message
            );
        });
}

function handleSignalOps(socket, message) {
    try {
        let parsedMessage = JSON.parse(message);

        switch (parsedMessage.type) {
            case "link":
                linkSignalCli(socket);
                break;
            case "startDaemon":
                startDaemon(socket);
                break;
            case "CheckConnection":
                CheckConnection(socket);
                break;
            case "SendSignalMessage":
                sendSignalMessage(socket);
                break;
            default:
                throw new Error("Unknown operation");
        }
    } catch (error) {
        socket.send(JSON.stringify({ error: error.message }));
    }
}

async function sendSignalMessage(message) {
    const url = "http://127.0.0.1:7000/api/v1/rpc";
    const headers = {
        "Content-Type": "application/json",
    };

    // Payload construction
    const payload = {
        jsonrpc: "2.0",
        method: "send",
        id: "1",
        params: {
            groupId: "sn57HlI2WphS3pkh8utmt4KC/OCqtXOBX9oVrqWkhkU=",
            message: message.title + "\n\n" + encodeURI(message.link),
        },
    };

    await axios
        .post(url, payload, { headers: headers })
        .then((response) => {
            if (response.status === 200) {
                console.log("Response:", response.data);
            } else {
                console.error("Error:", response.status, response.statusText);
            }
        })
        .catch((error) => {
            console.error(
                "Error:",
                error.response ? error.response.status : "No response",
                error.message
            );
        });
}

function startDaemon(socket) {
    const command =
        ".\\backend\\signalBot\\signal-cli-0.13.5-SNAPSHOT\\bin\\signal-cli";

    try {
        const child = spawn(command, ["daemon", "--http localhost:7000"], {
            shell: true,
        });

        if (!child) {
            console.error("Failed to spawn child process");
            process.exit(1);
        }

        // Capture standard output
        child.stdout.on("data", (data) => {
            console.log(data.toString("utf8"));
            if (data.toString("utf8").length > 5) {
                socket.send(
                    JSON.stringify({
                        type: "StartDaemon",
                        data: { Started: true },
                    })
                );
            } else {
            }
        });

        // Capture standard error
        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle the close event when the process finishes
        child.on("close", (code) => {
            console.log(`Script exited with code ${code}`);
        });

        // Handle errors from spawning the process
        child.on("error", (err) => {
            console.error(`Failed to start child process: ${err.message}`);
        });
    } catch (err) {
        console.error(`Exception caught: ${err.message}`);
    }
}

function CheckConnection(socket) {
    const command =
        ".\\backend\\signalBot\\signal-cli-0.13.5-SNAPSHOT\\bin\\signal-cli";

    try {
        const child = spawn(command, ["listAccounts"], { shell: true });

        if (!child) {
            console.error("Failed to spawn child process");
            process.exit(1);
        }

        // Capture standard output
        child.stdout.on("data", (data) => {
            console.log(data.toString("utf8"));
            if (data.toString("utf8").length > 5) {
                socket.send(
                    JSON.stringify({
                        type: "CheckConnection",
                        data: { isLinked: true },
                    })
                );
            } else {
                socket.send(
                    JSON.stringify({
                        type: "CheckConnection",
                        data: { isLinked: false },
                    })
                );
            }
        });

        // Capture standard error
        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle the close event when the process finishes
        child.on("close", (code) => {
            console.log(`Script exited with code ${code}`);
        });

        // Handle errors from spawning the process
        child.on("error", (err) => {
            console.error(`Failed to start child process: ${err.message}`);
        });
    } catch (err) {
        console.error(`Exception caught: ${err.message}`);
    }
}

function linkSignalCli(socket) {
    const command =
        ".\\backend\\signalBot\\signal-cli-0.13.5-SNAPSHOT\\bin\\signal-cli";

    try {
        const child = spawn(command, ["link"], { shell: true });

        if (!child) {
            console.error("Failed to spawn child process");
            process.exit(1);
        }

        let firstResponse = false;
        // Capture standard output
        child.stdout.on("data", (data) => {
            console.log(data.toString("utf8"));
            if (!firstResponse) {
                socket.send(
                    JSON.stringify({
                        type: "qrCode",
                        data: data.toString("utf8"),
                    })
                );
                firstResponse = true;
            } else {
                socket.send(
                    JSON.stringify({
                        type: "response",
                        data: data.toString("utf8"),
                    })
                );
            }
        });

        // Capture standard error
        child.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle the close event when the process finishes
        child.on("close", (code) => {
            console.log(`Script exited with code ${code}`);
        });

        // Handle errors from spawning the process
        child.on("error", (err) => {
            console.error(`Failed to start child process: ${err.message}`);
        });
    } catch (err) {
        console.error(`Exception caught: ${err.message}`);
    }
}

module.exports = {
    handleSignalOps,
    sendAutoSignalMessage,
    sendSignalMessage,
};
