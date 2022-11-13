import { arrayify, isHexString } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { _base16To36, _base36To16 } from "@ethersproject/bignumber";

// a simple GET call
export async function getData(url = "") {
	const response = await fetch(url, {
		method: "GET"
	});
	return response.json();
}

// The following code is taken from ethers.js/packages/address/src.ts

const ibanLookup: { [character: string]: string } = { };

const MAX_SAFE_INTEGER: number = 0x1fffffffffffff;

function log10(x: number): number {
    if (Math.log10) { return Math.log10(x); }
    return Math.log(x) / Math.LN10;
}

const safeDigits = Math.floor(log10(MAX_SAFE_INTEGER));

function ibanChecksum(address: string): string {
    address = address.toUpperCase();
    address = address.substring(4) + address.substring(0, 2) + "00";

    let expanded = address.split("").map((c) => { return ibanLookup[c]; }).join("");

    // Javascript can handle integers safely up to 15 (decimal) digits
    while (expanded.length >= safeDigits){
        let block = expanded.substring(0, safeDigits);
        expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
    }

    let checksum = String(98 - (parseInt(expanded, 10) % 97));
    while (checksum.length < 2) { checksum = "0" + checksum; }

    return checksum;
};

export function getAddress(address: string): string | null {
    let result = null;

    if (typeof(address) !== "string") {
        console.log("invalid address", "address", address);
    }

    if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {

        // Missing the 0x prefix
        if (address.substring(0, 2) !== "0x") { address = "0x" + address; }

        result = getChecksumAddress(address);

        // It is a checksummed address with a bad checksum
        if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
            console.log("bad address checksum", "address", address);
        }

    // Maybe ICAP? (we only support direct mode)
    } else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {

        // It is an ICAP address with a bad checksum
        if (address.substring(2, 4) !== ibanChecksum(address)) {
            console.log("bad icap checksum", "address", address);
        }

        result = _base36To16(address.substring(4));
        while (result.length < 40) { result = "0" + result; }
        result = getChecksumAddress("0x" + result);

    } else {
        console.log("invalid address", "address", address);
    }

    return result;
}

function getChecksumAddress(address: string): string {
    if (!isHexString(address, 20)) {
        console.log("invalid address: " + address);
    }

    address = address.toLowerCase();

    const chars = address.substring(2).split("");

    const expanded = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
        expanded[i] = chars[i].charCodeAt(0);
    }

    const hashed = arrayify(keccak256(expanded));

    for (let i = 0; i < 40; i += 2) {
        if ((hashed[i >> 1] >> 4) >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 0x0f) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }

    return "0x" + chars.join("");
}

export function isAddress(address: string): boolean {
    try {
		if(!getAddress(address)) return false
        return true;
    } catch (error) { }
    return false;
}