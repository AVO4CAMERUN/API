// Static class for auth
class BlobConvert {
    // Methods for encode Blob to Base64 
    static blobToBase64(buffer) {
        if(Buffer.isBuffer(buffer)) return buffer.toString('base64')  // Type check
        return null;
    }

    // Methods for decode Base64 to Blob 
    static base64ToBlob(base64) {
        if(typeof base64 === 'string' && base64 !== '') return Buffer.from(base64, 'base64'); // Type check
        return null;
    }
    
    // Methods for decode Base64 to Blob 
    /*static base64ToHex(base64) {
        if(typeof base64 === 'string') return this.base64ToBlob(base64).toString('hex');// Type check
        return null;
    }*/
}

export default BlobConvert;
