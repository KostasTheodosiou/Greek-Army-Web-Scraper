// src/LinkSignalCli.js
import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import "./styles/linksignalCli.css";

const LinkSignalCli = () => {
    const [qrCode, setQrCode] = useState(null);
    const [linking, setLinking] = useState(false);
    const [linked, setLinked] = useState(false);
    const [daemonStarted, setDaemonStarted] = useState(false);
    const [daemonStarting, setDaemonStarting] = useState(false);
    const [daemonStopping, setDaemonStopping] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:5001");

        socketRef.current.onopen = () => {
            console.log("Connected to the server");
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleSocketMessage(message);
        };

        socketRef.current.onclose = () => {
            console.log("Disconnected from the server");
        };

        return () => {
            socketRef.current.close();
        };
    }, []);

    const handleSocketMessage = (message) => {
        switch (message.type) {
            case "qrCode":
                setQrCode(message.data);
                break;
            case "AccountLinked":
                console.log(message.data);
                setLinked(true);
                setQrCode(null);
                break;
            case "StartDaemon":
                console.log("Starting Client");
                setDaemonStarting(true);
                break;
            case "DaemonStarted":
                setDaemonStarting(false);
                setDaemonStarted(true);
                break;
            case "DaemonStopped":
                setDaemonStarted(false);
                setDaemonStopping(false);
                break;
            default:
                console.log("Invalid operation");
        }
    };

    const initiateLinking = async () => {
        setLinking(true);
        try {
            const message = {
                type: "link",
                data: {},
            };
            socketRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error initiating linking:", error);
            setLinking(false);
        }
    };

    const UnlinkSignalCli = async () => {
        setLinked(false);
        try {
            const message = {
                type: "Unlink",
                data: {},
            };
            socketRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error initiating linking:", error);
            setLinking(false);
        }
    };

    const startDaemon = async () => {
        try {
            setDaemonStarting(true);
            const message = {
                type: "startDaemon",
                data: {},
            };
            socketRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error Checking Connection:", error);
            setDaemonStarting(false);
        }
    };

    const stopDaemon = async () => {
        try {
            setDaemonStopping(true);
            const message = {
                type: "stopDaemon",
                data: {},
            };
            socketRef.current.send(JSON.stringify(message));
        } catch (error) {
            console.error("Error Checking Connection:", error);
            setDaemonStopping(false);
        }
    };

    return (
        <div className="link-container">
            <div className="buttons">
                <button onClick={initiateLinking} disabled={linking || linked}>
                    {linking ? "Linking..." : "Link Signal-CLI"}
                </button>
                <button
                    onClick={startDaemon}
                    disabled={daemonStarting || daemonStarted}
                >
                    {daemonStarting || daemonStarted
                        ? "Bot Started"
                        : "Start Bot"}
                </button>
                <button
                    onClick={stopDaemon}
                    // disabled={daemonStopping || !daemonStarted}
                >
                    {daemonStopping || !daemonStarted
                        ? "Bot Stopped"
                        : "Stop Bot"}
                </button>
                <button onClick={UnlinkSignalCli}>Unlink</button>
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
                {linked && <h3> ACCOUNT LINKED </h3>}
                {daemonStarting && <h3> SIGNAL CLIENT STARTING </h3>}
                {daemonStarted && !daemonStarting && !daemonStopping ? (
                    <h3> SIGNAL CLIENT STARTED </h3>
                ) : (
                    <h3> SIGNAL CLIENT STOPPED </h3>
                )}
                {daemonStopping && <h3> SIGNAL CLIENT STOPPING </h3>}
            </div>
        </div>
    );
};

export default LinkSignalCli;
