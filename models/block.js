const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HASH_TYPE = 'sha256';

class Block {

    constructor(holderId, validatorId, type, timeframeStart, timeframeEnd, body, attachmentPath, submissionTime) { 
        this._holderId = holderId;
        this._validatorId = validatorId;
        this._type = type;
        this._timeframeStart = timeframeStart;
        this._timeframeEnd = timeframeEnd;
        this._body = body;
        this._attachmentPath = attachmentPath;
        this._attachmentHash = Block.hashFile(this._attachmentPath);
        this._hash = null;

        // We need to keep the original submission time.
        if(submissionTime == -1 ){
            this._submissionTime = new Date(Date.now()).toLocaleString().replace(",", " at");
        }else{
            this._submissionTime = submissionTime;
        }
        this._validated = false;
        this._processed = false;
    }

    // Validate the block and return its hash
    process(validated) {
        this._processed = true;
        this._validationTime = new Date(Date.now()).toLocaleString().replace(",", " at");

        if (validated) {
            // Set as validated
            this._validated = true;

            // Add transaction ID
            this._txnId = "0x" + Date.now().toString(16);

            return this._hash = this.hash;
        } else {
            return false;
        }
    }

    // Return block hash
    get hash() {
        var hash = crypto.createHash(HASH_TYPE);

        // Hash using relevant fields
        hash.update(this._holderId);
        hash.update(this._validatorId);
        hash.update(this._type);
        hash.update(this._timeframeStart);
        hash.update(this._timeframeEnd);
        hash.update(this._body);
        hash.update(this._attachmentHash);

        return hash.digest('hex');
    }

    get json() {
        return {
            'holderId': this._holderId,
            'validatorId': this._validatorId,
            'type': this._type,
            'timeframeStart': this._timeframeStart,
            'timeframeEnd': this._timeframeEnd,
            'body': this._body,
            'attachmentPath': this._attachmentPath,
            'attachmentHash': this._attachmentHash,
            'validated': this._validated,
            'processed': this._processed,
            'submissionTime': this._submissionTime,
            'validationTime': this._validationTime,
            'hash': this._hash
        }
    }

    // True if block has been validated
    get validated() {
        return this._validated;
    }

    // Class setters
    set type(newType) {
        this.assertNotValidated();
        this._type = newType;
    }

    set timeframeStart(newTimeframeStart) {
        this.assertNotValidated();
        this._timeframeStart = to2Digits(newTimeframeStart);
    }
    
    set timeframeEnd(newTimeframeEnd) {
        this.assertNotValidated();
        this._timeframeEnd = to2Digits(newTimeframeEnd);
    }    

    set body(newBody) {
        this.assertNotValidated();
        this._body = newBody;
    }

    set attachmentPath(newPath) {
        this.assertNotValidated();
        this._attachmentPath = newPath;
    }

    assertNotValidated() {
        if (this._validated) {
            throw new Error('Can\'t change a validated block.');
        }
    }

    static hashFile(filePath) {
        if (!filePath) {
            return "";
        }

        var content = fs.readFileSync(path.join(__dirname, '../public/' + filePath));
        var hash = crypto.createHash(HASH_TYPE);
        hash.update(content);
        return hash.digest('hex');
    }

    static fromJSON(json){
        return new Block(
            json.holderId,
            json.validatorId,
            json.type,
            json.timeframeStart,
            json.timeframeEnd,
            json.body,
            json.attachmentPath,
            json.submissionTime);
    }
}

module.exports = {Block: Block}