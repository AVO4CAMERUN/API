
// Static class for auth
class BlobConvert {

    // Methods for encode Blob to Base64 
    static blobToBase64(buffer) {
        
        // Type check
        if(Buffer.isBuffer(buffer)){
            return buffer.toString('base64');
        }
        return null;
    }

    // Methods for decode Base64 to Blob 
    static base64ToBlob(base64) {

        // Type check
        if(typeof base64 === 'string'){
            return Buffer.from(base64, 'base64');
        }
        return null;
    }
    
    // Methods for decode Base64 to Blob 
    static base64ToHex(base64) {

        // Type check
        if(typeof base64 === 'string'){
            return this.base64ToBlob(base64).toString('hex');
        }
        return null;
    }

}

module.exports = BlobConvert;
