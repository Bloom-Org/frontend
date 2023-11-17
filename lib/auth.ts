import cookie from "react-cookies";

const addressKey = "WALLET_ADDRESS";
const profileKey = "PROFILE_HANDLE";

function parseJwt(token : string) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    let jsonPayload = decodeURIComponent(window.atob(base64).split("").map(function (c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2) }).join(""));
    return JSON.parse(jsonPayload);
}

export function saveLoginData(accessToken : string, refreshToken : string, address: string, profileHandle: string) {
    const ls = localStorage || window.localStorage;

    if (!ls) {
        throw new Error("Local storage not available");
    }

    const { exp : accessExp } = parseJwt(accessToken);
    const { exp: refreshExp } = parseJwt(refreshToken);

    cookie.save("lensToken", JSON.stringify({token: accessToken}), {path: "/", expires: new Date(accessExp * 1000)});
    cookie.save("lensRefreshToken", JSON.stringify({token: refreshToken}), {path: "/", expires: new Date(refreshExp * 1000)});

    ls.setItem(addressKey, address);
    ls.setItem(profileKey, profileHandle);
}

export function getLoggedInAddress() {
    if (typeof window === "undefined") return null;

    const ls = localStorage || window.localStorage;

    if (!ls) {
        throw new Error("Local storage not available");
    }

    const data = ls.getItem(addressKey);

    if (!data) return null;

    return data;
}

export function getLoggedInHandle() {
    if (typeof window === "undefined") return null;

    const ls = localStorage || window.localStorage;

    if (!ls) {
        throw new Error("Local storage not available");
    }

    const data = ls.getItem(profileKey);

    if (!data) return null;

    return data;
}

export function logout() {
    cookie.save("lensToken", "", {path: "/", expires: new Date(0)});
    cookie.save("lensRefreshToken", "", {path: "/", expires: new Date(0)});

    const ls = localStorage || window.localStorage;
    if (!ls) {
        throw new Error("Local storage not available");
    }
    ls.removeItem(addressKey);
    ls.removeItem(profileKey);
}
