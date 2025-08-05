import React from "react";
import Spinner from "./spinner";

const SpinnerOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75">
        <Spinner size={14} color='red' />
    </div>
);

export default SpinnerOverlay;