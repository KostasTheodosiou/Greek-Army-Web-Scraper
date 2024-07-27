// src/LinkSignalCli.js
import React, { useState } from "react";
import QRCode from "qrcode.react";
import "./styles/linksignalCli.css";

const LinkSignalCli = () => {
    const [qrCode, setQrCode] = useState(null);
    const [linking, setLinking] = useState(false);
    const [linked, setLinked] = useState(false);
    const [started, setStarted] = useState(false);
    const [DaemonStarted, setDaemonStarted] = useState(false);

    const initiateStart = async () => {
        setStarted(true);
        try {
            const response = await fetch("/api/start-signal-cli", {
                method: "POST",
            });
            const data = await response.json();
            console.log(data);
            // if (data.hasStarted) {
            //     setStarted(true);
            // } else {
            //     setStarted(false);
            // }
        } catch (error) {
            console.error("Error initiating linking:", error);
            setLinking(false);
        }
    };

    const socket = new WebSocket("ws://192.168.1.12:5001");

    socket.onopen = () => {
        console.log("Connected to the server");
    };

    socket.onmessage = (event) => {
        const message = event.data;
        console.log(message);

        let parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "qrCode") {
            setQrCode(parsedMessage.data);
        } else if (parsedMessage.type === "CheckConnection") {
            setLinked(true);
        } else if (parsedMessage.type === "StartDaemon") {
            setDaemonStarted(true);
        } else if (parsedMessage.type === "response") {
            if (parsedMessage.data.startsWith("Associated with:")) {
            }
        } else {
            console.log("invalid operation");
        }
    };

    socket.onclose = () => {
        console.log("Disconnected from the server");
    };

    const initiateLinking = async () => {
        setLinking(true);
        try {
            const message = {
                type: "link",
                data: {},
            };
            socket.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error initiating linking:", error);
            setLinking(false);
        }
    };

    const CheckConnection = async () => {
        try {
            const message = {
                type: "CheckConnection",
                data: {},
            };
            socket.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error Checking Connection:", error);
        }
    };

    const startDaemon = async () => {
        try {
            const message = {
                type: "startDaemon",
                data: {},
            };
            socket.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error Checking Connection:", error);
        }
    };

    const sendSignalMessage = async () => {
        try {
            const message = {
                type: "SendSignalMessage",
                data: {},
            };
            socket.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error Checking Connection:", error);
        }
    };

    return (
        <div className="link-container">
            <div className="buttons">
                <button onClick={initiateStart} disabled={linking}>
                    {linking ? "Starting..." : "Start Signal-Bot"}
                </button>
                <button onClick={initiateLinking} disabled={linking}>
                    {linking ? "Linking..." : "Link Signal-CLI"}
                </button>
                <button onClick={CheckConnection} disabled={linking}>
                    {linked ? "Checking" : "Check"}
                </button>
                <button onClick={startDaemon} disabled={DaemonStarted}>
                    {DaemonStarted ? "Bot Started" : "Start Bot"}
                </button>
                <button onClick={sendSignalMessage}>Send Signal Message</button>
            </div>
            <div className="qr-code-container">
                {qrCode && (
                    <div>
                        <h3>Scan this QR Code with your Signal app:</h3>
                        <QRCode
                            className="QRCode"
                            value={qrCode}
                            size={512}
                            level={"H"}
                            includeMargin={true}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                        />
                    </div>
                )}
            </div>
            <div>
                {linked && <h3> LINKED </h3>}
                {started && <h3> STARTED </h3>}
            </div>
        </div>
    );
};

export default LinkSignalCli;
