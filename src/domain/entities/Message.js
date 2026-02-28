export class Message {
    constructor(data) {
        this.id = data.id;
        this.roomId = data.room_id;
        this.senderId = data.sender_id;
        this.content = data.content;
        this.createdAt = data.created_at;
    }
}
