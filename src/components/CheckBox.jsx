import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const CheckBox = ({ SwitchState, checked }) => {

    return (
        <div onClick={() => SwitchState()} style={{ cursor: "pointer" }}>
            {checked ? (
                <FaCheckCircle className="ciclecheck" />
            ) : (
                <FaRegCircle className="ciclecheck" />
            )}
        </div>
    );
};

export default CheckBox;
