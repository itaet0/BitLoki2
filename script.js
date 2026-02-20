const MARKER = "BITLOKI2_V1";

function strToBytes(str){ return new TextEncoder().encode(str); }
function bytesToStr(bytes){ return new TextDecoder().decode(bytes); }

function numberToBytes(num, byteLength){
    const buffer = new ArrayBuffer(byteLength);
    const view = new DataView(buffer);
    if(byteLength === 4) view.setUint32(0, num);
    if(byteLength === 2) view.setUint16(0, num);
    return new Uint8Array(buffer);
}

function bytesToNumber(bytes){
    const view = new DataView(bytes.buffer);
    if(bytes.length === 4) return view.getUint32(0);
    if(bytes.length === 2) return view.getUint16(0);
}

function formatSize(bytes){
    if(bytes < 1024) return bytes + " B";
    if(bytes < 1024*1024) return (bytes/1024).toFixed(2) + " KB";
    return (bytes/(1024*1024)).toFixed(2) + " MB";
}

function handlePreview(input, previewEl, infoEl){
    const file = input.files[0];
    if(!file) return;

    infoEl.textContent = `${file.name} • ${formatSize(file.size)}`;

    if(file.type.startsWith("image/")){
        const reader = new FileReader();
        reader.onload = e=>{
            previewEl.src = e.target.result;
            previewEl.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        previewEl.classList.add("hidden");
    }
}

function checkCapacity(){
    const carrier = carrierInput.files[0];
    const secret = secretInput.files[0];
    if(!carrier || !secret) return;

    if(secret.size > carrier.size * 0.9){
        capacityWarning.textContent =
            "Secret file is too large for this carrier. Choose a larger PNG.";
        capacityWarning.classList.remove("hidden");
    } else {
        capacityWarning.classList.add("hidden");
    }
}

carrierInput.onchange = ()=>{
    handlePreview(carrierInput, carrierPreview, carrierInfo);
    checkCapacity();
};

secretInput.onchange = ()=>{
    handlePreview(secretInput, secretPreview, secretInfo);
    checkCapacity();
};

async function encode(){
    const carrierFile = carrierInput.files[0];
    const secretFile = secretInput.files[0];

    if(!carrierFile || !secretFile){
        alert("Select both files.");
        return;
    }

    const carrierBuffer = new Uint8Array(await carrierFile.arrayBuffer());
    const secretBuffer = new Uint8Array(await secretFile.arrayBuffer());

    const markerBytes = strToBytes(MARKER);
    const sizeBytes = numberToBytes(secretBuffer.length,4);
    const nameBytes = strToBytes(secretFile.name);
    const nameLengthBytes = numberToBytes(nameBytes.length,2);

    const finalBuffer = new Uint8Array(
        carrierBuffer.length +
        markerBytes.length +
        sizeBytes.length +
        nameLengthBytes.length +
        nameBytes.length +
        secretBuffer.length
    );

    let offset = 0;
    finalBuffer.set(carrierBuffer, offset); offset += carrierBuffer.length;
    finalBuffer.set(markerBytes, offset); offset += markerBytes.length;
    finalBuffer.set(sizeBytes, offset); offset += sizeBytes.length;
    finalBuffer.set(nameLengthBytes, offset); offset += nameLengthBytes.length;
    finalBuffer.set(nameBytes, offset); offset += nameBytes.length;
    finalBuffer.set(secretBuffer, offset);

    const blob = new Blob([finalBuffer], {type:"image/png"});
    const url = URL.createObjectURL(blob);

    // Keep original name, add subtle "e" before extension
    const originalName = carrierFile.name;
    const dotIndex = originalName.lastIndexOf(".");
    let newName;

    if(dotIndex !== -1){
        newName =
            originalName.slice(0, dotIndex) +
            "e" +
            originalName.slice(dotIndex);
    } else {
        newName = originalName + "e.png";
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = newName;
    a.click();
}

async function decode(){
    const file = decodeInput.files[0];
    if(!file){ alert("Select a file."); return; }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const markerBytes = strToBytes(MARKER);

    let markerIndex = -1;
    for(let i=buffer.length-markerBytes.length;i>=0;i--){
        let found=true;
        for(let j=0;j<markerBytes.length;j++){
            if(buffer[i+j]!==markerBytes[j]){ found=false; break; }
        }
        if(found){ markerIndex=i; break; }
    }

    if(markerIndex===-1){ alert("No hidden file found."); return; }

    let offset = markerIndex + markerBytes.length;

    const size = bytesToNumber(buffer.slice(offset,offset+4)); offset+=4;
    const nameLength = bytesToNumber(buffer.slice(offset,offset+2)); offset+=2;
    const name = bytesToStr(buffer.slice(offset,offset+nameLength)); offset+=nameLength;

    const secretData = buffer.slice(offset,offset+size);

    const blob = new Blob([secretData]);
    const url = URL.createObjectURL(blob);

    if(name.match(/\.(jpg|jpeg|png|gif|webp)$/i)){
        decodedPreview.src = url;
        decodePreviewContainer.classList.remove("hidden");
    }

    downloadDecoded.href = url;
    downloadDecoded.download = name;
}

// Fullscreen on click
decodedPreview.onclick = ()=>{
    if(decodedPreview.requestFullscreen){
        decodedPreview.requestFullscreen();
    }
};

encodeBtn.onclick = encode;
decodeBtn.onclick = decode;
