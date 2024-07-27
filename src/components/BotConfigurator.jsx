import React, { useState } from "react";
import "./styles/botConfigurator.css";
import LinkSignalCli from "./LinkSignalCli";

const BotConfigurator = () => {
    const [config, setConfig] = useState({
        groupID: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig({
            ...config,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(config);
    };

    return (
        <div className="botConfig">
            <LinkSignalCli />
            <form onSubmit={handleSubmit} className="settings-form">
                <div>
                    <label> groupID:</label>
                    <input
                        type="text"
                        name="groupID"
                        value={config.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
            </form>
        </div>
    );
};

export default BotConfigurator;
