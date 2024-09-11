const { spawn } = require("child_process");
const axios = require("axios");

let childProcess = null;

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
            case "stopDaemon":
                stopDaemon(socket);
                break;
            case "SendSignalMessage":
                sendSignalMessage(socket);
                break;
            case "Unlink":
                DeleteAccountData(socket);
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
            groupId: "FNMQpWnKwigc2z8ILYht7S+TeC2zl+6gQSPGuA2clJg=",
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
        ".\\backend\\signal-cli-0.13.5\\bin\\signal-cli";
    console.log("Starting Client");
    try {
        childProcess = spawn(command, ["daemon", "--http", "localhost:7000"], {
            shell: true,
        });

        if (!childProcess) {
            console.error("Failed to spawn child process");
            process.exit(1);
        }
        childProcess.stdout.on("data", (data) => {
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
        childProcess.stderr.on("data", (data) => {
            if (
                data
                    .toString("utf-8")
                    .startsWith(
                        "INFO  HttpServerHandler - Started HTTP server on"
                    )
            ) {
                socket.send(
                    JSON.stringify({
                        type: "DaemonStarted",
                        data: {},
                    })
                );
            }
            console.error(`stderr: ${data}`);
        });

        // Handle the close event when the process finishes
        childProcess.on("close", (code) => {
            console.log(`Script exited with code ${code}`);
        });

        // Handle errors from spawning the process
        childProcess.on("error", (err) => {
            console.error(`Failed to start child process: ${err.message}`);
        });
    } catch (err) {
        console.error(`Exception caught: ${err.message}`);
    }
}

function stopDaemon(socket) {
    if (childProcess) {
        try {
            process.kill(childProcess.pid, "SIGKILL"); // Sends the SIGTERM signal to the process
            console.log(`Child process exited with code ${code}`);
            socket.send(
                JSON.stringify({
                    type: "DaemonStopped",
                    data: { Stopped: true },
                })
            );
            childProcess = null;
        } catch (err) {
            console.error(`Exception caught: ${err.message}`);
        }
    } else {
        console.log("No child process is running");
        socket.send(
            JSON.stringify({
                type: "StopDaemon",
                data: { Stopped: false, reason: "No child process is running" },
            })
        );
    }
}

function DeleteAccountData(socket) {
    const command =
        ".\\backend\\signal-cli-0.13.5\\bin\\signal-cli";

    try {
        const child = spawn(
            command,
            ["deleteLocalAccountData --ignore-registered"],
            {
                shell: true,
            }
        );

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

function linkSignalCli(socket) {
    const command =
        ".\\backend\\signal-cli-0.13.5\\bin\\signal-cli";

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
                if (data.toString("utf8").startsWith("Associated with:"))
                    socket.send(
                        JSON.stringify({
                            type: "AccountLinked",
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
    sendSignalMessage,
};
