export class MediaTooLargeError extends Error {
    maxBytes;
    constructor(maxBytes) {
        super(`Attachment is larger than ${maxBytes} bytes`);
        this.maxBytes = maxBytes;
    }
}
export class MessagingGateway {
}
//# sourceMappingURL=messaging.types.js.map